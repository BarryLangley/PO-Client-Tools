# To indicate the script was successfully reloaded, print a simple message.
# This is false when the script loads for the first time, which is why you don't see this message if you just log in.
if confetti.initialized and not confetti.silentReload
    print "Script Check: OK"
    script.clientStartUp() if script?.clientStartUp?

# Initializes the script by calling clientStartUp.
# confettiScript is undefined when the client starts up, so simply detecting that should do the trick.
unless confetti.initialized and confettiScript?
    # Use a short timer to wait for the script to be defined
    sys.setTimer ->
        # If this is in the client's startup cycle, this shouldn't be called.
        # However if there wasn't a script previously this will run, which is what we want.
        return if confetti.initialized

        # Create player objects for any known players.
        chans = confetti.channel.channelIds()
        # Trick to get the full list of players
        players = (confetti.channel.players(id).join ',' for id in chans).join(',').split(',')

        for player of players
            unless player and confetti.players.hasOwnProperty(player)
                confetti.players[player] = confetti.player.create(player)

        # Call clientStartUp where most of the magic happens.
        script.clientStartUp()
    , 1, no

confetti.silentReload = off
confettiScript =
    # Initialize variables
    clientStartUp: ->
        if confetti.cache.initialized is no
            confetti.initCache()

        confetti.initPlugins()

        # If confetti (PO) hasn't been used in the last 5 days (or at all - the initial value is 0),
        # display a friendly how-to-use message.

        # The reason why we don't do this only once is because people tend to forget. Yeah.
        unless confetti.initialized
            if (confetti.cache.get('lastuse') + (5 * 24 * 60 * 60)) < sys.time()
                confetti.msg.bot "Type <a href='po:send/-commands' style='text-decoration:none;color:green'><b>#{confetti.cache.get('commandindicator')}commands</b></a> for a list of client commands.", -1

            confetti.cache.store('lastuse', sys.time()).save()

        if sys.isSafeScripts()
            confetti.msg.bot "<b style='color: red;'>Safe Scripts is enabled</b>. This will disable persistent data storage and limit other features.", -1
            confetti.msg.bot "Disable it by unticking the \"<b>Safe Scripts</b>\" box in the <i>Script Window</i> [<i>Plugins->Script Window</i>].", -1
            confetti.msg.bot "Afterwards, re-login to see the effects.", -1

        # Mark confetti as initialized, see the blocks above the 'confettiScript' definition.
        confetti.initialized = yes

    # Called every second. Unused.
    # stepEvent: ->

    # When the client is notified about a player.
    onPlayerReceived: (id) ->
        confetti.players[id] = confetti.player.create(id)
        confetti.callHooks 'onPlayerReceived', id

    # When the client thinks that player no longer exists.
    onPlayerRemoved: (id) ->
        confetti.callHooks 'onPlayerRemoved', id
        delete confetti.players[id]

    beforePMSent: (tar, message) ->
        # Message manipulation
        dirty = no
        [tar, message, dirty] = confetti.callHooks 'manipulateOwnPM', tar, message, dirty

        # If the message has changed
        if dirty
            sys.stopEvent()
            Network.sendPM tar, message

    afterPMReceived: (src, message) ->
        confetti.callHooks 'pmReceived', src, message

    # Messages sent by the player
    beforeSendMessage: (message, chan) ->
        # Private commands
        # Forbid -- etc from triggering commands
        if message[0] in [confetti.cache.get('commandindicator'), '-'] and message.length > 1 and confetti.util.isAlpha(message[1])
            space   = message.indexOf ' '
            command = ""
            data    = ""

            if space isnt -1
                command = message.substr(1, space - 1)
                data = message.substr(space + 1)
            else
                command = message.substr(1)

            sys.stopEvent()
            confetti.execCommand command, data, message, chan
            return

        # Message manipulation
        dirty = no
        [message, chan, dirty] = confetti.callHooks 'manipulateOwnMessage', message, chan, dirty

        # If the message has changed
        if dirty
            sys.stopEvent()
            Network.sendChanMessage chan, message

    # Messages from others.
    beforeChannelMessage: (message, chan, html) ->
        if confetti.ignoreNextChanMessage
            confetti.ignoreNextChanMessage = no
            return

        ownId = Client.ownId()
        if ownId is -1
            return

        originalMessage = message
        if html
            message = confetti.util.stripHtml(message).trim()

        from = fromSrc = message.substring(0, message.indexOf(":")).trim()
        fromId = Client.id(from)

        # Try to remove ~ and + from the name if it's html
        if html and from.charAt(0) in ['~', '+']
            from = from.substr(1).trim()
            fromId = Client.id from
        # Try to remove /me ***'s
        else if html and message.substr(0, 3).trim() is '***'
            line = message.substr(3).trim()
            # Should be improved
            for id of confetti.players
                name = Client.name(id)
                if line.substring(0, name.length) is name
                    from = name
                    fromId = id
                    break

        playerMessage = originalMessage.substring(originalMessage.indexOf(":") + 1).trim()

        # If it's HTML, remove the first </b>, </i>, and </font>
        if html
            playerMessage = playerMessage
                                .replace '</b>', ''
                                .replace '</i>', ''
                                .replace '</font>', ''

        # Message manipulation part, pretty messy.
        if fromId is -1
            dirty = no
            [fromSrc, message, playerMessage, chan, html, dirty] = confetti.callHooks 'manipulateChanBotMessage', fromSrc, message, playerMessage, chan, html, dirty
            if dirty
                Client.printChannelMessage(message, chan, html) if message
                sys.stopEvent()
            return
        else if ownId isnt fromId
            # Blocking for /me & servers which use html messages.
            if Client.isIgnored(fromId)
                sys.stopEvent()
                return

        channel = Client.channel(chan)
        ownName = Client.ownName()
        willFlash = confetti.util.willFlash(playerMessage, ownName)
        flashes = confetti.cache.get('flashes') is on

        dirty = !flashes and willFlash
        color = Client.color(fromId)
        auth  = Client.auth(fromId)
        authSymbol = []

        if auth > 4
            auth = 4

        # Servers with custom HTML will have escaped themselves.
        # And of course the HTML wouldn't render if we wouldn't do this
        unless html
            playerMessage = sys.htmlEscape(playerMessage)
            playerMessage = Client.channel(chan).addChannelLinks(playerMessage)

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty] =
            confetti.callHooks('manipulateChanPlayerMessage', from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty)

        if dirty
            if authSymbol.length isnt 2
                if 4 > auth > 0
                    authSymbol = ['+<i>', '</i>']
                else
                    authSymbol = ['', '']

            if flashes
                playerMessage = confetti.util.addNameHighlights(playerMessage, ownName)

            finishedMessage = "<font color='#{color}'><timestamp/>#{authSymbol[0]}<b>#{from}:</b>#{authSymbol[1]}</font> #{playerMessage}"

            sys.stopEvent()
            confetti.ignoreNextChanMessage = yes

            Client.printChannelMessage finishedMessage, chan, yes
            if flashes and playerMessage.indexOf('<ping/>') isnt -1
                confetti.msg.notification confetti.util.stripHtml("#{from}: #{playerMessage}"), "Ping in ##{Client.channelName(chan)}", no
