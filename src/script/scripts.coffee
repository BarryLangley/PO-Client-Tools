# To indicate the script was successfully reloaded, print a simple message.
# This is false when the script loads for the first time, so that's why you don't see this message if you just log in.
if confetti.initialized and not confetti.silentReload
    print "Script Check: OK"
    script.clientStartUp() if script?.clientStartUp?

# Initializes the script by calling clientStartUp.
# When the user changes the script, this condition will be true (script already exists, which means something was loaded previously,
# but confetti was not, so we can initialize it here)

# Script is undefined when the client starts up, so simply detecting that should do the trick.
else if not confetti.initialized and script?
    # Use a one ms timer to wait for the script to be defined
    sys.setTimer ->
        script.clientStartUp()
    , 1, no

confetti.silentReload = off
poScript =
    # Initialize variables
    clientStartUp: ->
        unless confetti.initialized
            chans = confetti.channel.channelIds()
            # Trick to get the full list of players
            players = (confetti.channel.players(id).join ',' for id in chans).join(',').split(',')

            for player of players
                unless confetti.players.hasOwnProperty(player) and player
                    confetti.players[player] = confetti.player.create(player)

        if confetti.cache.initialized is no
            confetti.initCache()

        confetti.initPlugins()

        # If confetti (PO) hasn't been used in the last 5 days (or at all - the initial value is 0),
        # display a friendly how-to-use message.

        # The reason why we don't do this only once is because people tend to forget. Yeah.
        # 432000 is 5 days in seconds.
        unless confetti.initialized
            if (confetti.cache.get('lastuse') + 345600) < (+sys.time())
                commandindicator = confetti.cache.get 'commandindicator'
                confetti.msg.bot "Type <a href='po:send/#{commandindicator}commands' style='text-decoration: none; color: green;'><b>#{commandindicator}commands</b></a> for a list of client commands.", -1

            confetti.cache.store('lastuse', +sys.time()).save()

        if sys.isSafeScripts()
            confetti.msg.bot "<b style='color: red;'>Safe Scripts is enabled</b>. This will disable persistent data storage and limit other features.", -1
            confetti.msg.bot "Disable it by unticking the \"<b>Safe Scripts</b>\" box in the <i>Script Window</i> [<i>Plugins->Script Window</i>].", -1

        # Mark confetti as initialized, see the blocks above the 'poScript' definition.
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

    # PMs. Unused.
    # beforePMReceived: (src, message) ->

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
        ownId = Client.ownId()
        if ownId is -1
            return

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

        playerMessage = sys.htmlEscape(message.substring(message.indexOf(":") + 2))

        # Message manipulation part, pretty messy.
        if fromId is -1
            dirty = no
            [fromSrc, message, playerMessage, chan, html] = confetti.callHooks 'manipulateChanBotMessage', fromSrc, message, playerMessage, chan, html
            if dirty
                Client.printChannelMessage(message, chan, html)
                sys.stopEvent()
            return
        else if ownId isnt fromId
            # Blocking for /me & servers which use html messages.
            if Client.isIgnored(fromId)
                sys.stopEvent()
                return

        dirty = no
        color = Client.color(fromId)
        auth  = Client.auth(fromId)
        authSymbol = ['', '']

        if auth > 4
            auth = 4
        else if auth < 0
            auth = 0

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty] =
            confetti.callHooks('manipulateChanPlayerMessage', from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty)

        if dirty
            color = Client.color(fromId) unless color
            auth  = Client.auth(fromId) unless auth?

            unless authSymbol[0] and authSymbol[1]
                if auth > 0 && auth < 4
                    authSymbol = ['+<i>', '</i>']
                else
                    authSymbol = ['', '']

            playerMessage = Client.channel(chan).addChannelLinks(playerMessage)
            finishedMessage = "<font color='#{color}'><timestamp/>#{authSymbol[0]}<b>#{from}:#{authSymbol[1]}</b></font> #{playerMessage}"

            Client.printChannelMessage finishedMessage, chan, html
            sys.stopEvent()
