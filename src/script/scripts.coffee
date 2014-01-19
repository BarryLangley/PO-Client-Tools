# To indicate the script was successfully reloaded, print a simple message.
# This is false when the script loads for the first time, so that's why you don't see this message if you just log in.
if confetti.initialized
    print "Script Check: OK"

# Initializes the script by calling clientStartUp.
# When the user changes the script, this condition will be true (script already exists, which means something was loaded previously,
# but confetti was not, so we can initialize it here)

# Script is undefined when the client starts up, so simply detecting that should do the trick.
if not confetti.initialized and script?
    # Use a one ms timer to wait for the script to be defined
    sys.setTimer ->
        script.clientStartUp()
    , 1, no

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

        # If confetti (PO) hasn't been used in the last 5 days (or at all - the initial value is 0),
        # display a friendly how-to-use message.

        # The reason why we don't do this only once is because people tend to forget. Yeah.
        # 432000 is 5 days in seconds.
        if (confetti.cache.get('lastuse') + 345600) < (+sys.time())
            confetti.msg.bot "Type #{confetti.cache.get('commandindicator')}commands for a list of client commands.", -1

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
        oldMess = message
        [message, chan] = confetti.callHooks 'manipulateOwnMessage', message, chan

        # If the message has changed
        if message isnt oldMess
            sys.stopEvent()
            Network.sendChanMessage chan, message

    # Messages from others. Unused.
    # beforeChannelMessage: (message, chan, html) ->
