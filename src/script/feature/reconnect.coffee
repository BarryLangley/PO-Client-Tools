do ->
    # Automatic reconnect
    autoReconnectTimer = -1
    attempts = 0
    stopReconnecting = no
    forced = no

    attemptToReconnect = ->
        if attempts >= 3
            return no
        attempts += 1
        Client.reconnect()

    Network.playerLogin.connect ->
        if autoReconnectTimer isnt -1
            confetti.msg.notification "Reconnected to server!"

            sys.unsetTimer autoReconnectTimer
            autoReconnectTimer = -1
            attempts = 0
            stopReconnecting = no

    Network.disconnected.connect ->
        if confetti.cache.get('autoreconnect') is on and autoReconnectTimer is -1 and forced isnt yes
            confetti.msg.bot "Attempting to reconnect..."
            confetti.msg.notification "Disconnection detected, attempting to reconnect."

            autoReconnectTimer = sys.setTimer ->
                return if autoReconnectTimer is -1

                if attemptToReconnect() is no
                    confetti.msg.bot "Three attempts at reconnecting have failed, stopping."
                    confetti.msg.notification "Failed to reconnect."

                    sys.unsetTimer autoReconnectTimer
                    autoReconnectTimer = -1
                    stopReconnecting = yes
            , 5000, yes

        forced = no

    confetti.hook 'initCache', ->
        confetti.cache.store('autoreconnect', yes, confetti.cache.once)

    confetti.command 'reconnect', ['Forces a reconnect to the server.', 'send@reconnect'], ->
        confetti.msg.bot "Reconnecting to the server..."

        attempts = 0
        forced = yes
        stopReconnecting = no
        Client.reconnect()

    confetti.command 'autoreconnect', ["Toggles whether if you should automatically reconnect to the server when detected you've disconnected.", 'send@autoreconnect'], ->
        confetti.cache.store('autoreconnect', !confetti.cache.read('autoreconnect')).save()
        confetti.msg.bot "Auto reconnect is now #{if confetti.cache.read('autoreconnect') then 'on' else 'off'}."
