do ->
    # Automatic reconnect
    autoReconnectTimer = -1
    attempts = 0
    forceIgnore = no
    failed = no

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
            failed = no

    Network.disconnected.connect ->
        if confetti.cache.get('autoreconnect') is on and autoReconnectTimer is -1 and !forceIgnore and !failed
            confetti.msg.bot "Attempting to reconnect..."
            confetti.msg.notification "Disconnection detected, attempting to reconnect."

            autoReconnectTimer = sys.setTimer ->
                if attemptToReconnect() is no
                    confetti.msg.bot "Three attempts at reconnecting have failed, stopping."
                    confetti.msg.notification "Failed to reconnect."

                    sys.unsetTimer autoReconnectTimer
                    autoReconnectTimer = -1
                    failed = yes
            , 5000, yes

        forceIgnore = no

    confetti.command 'reconnect', "Forces a reconnect to the server.", ->
        confetti.msg.bot "Reconnecting to the server..."

        attempts = 0
        forceIgnore = yes
        failed = no
        Client.reconnect()

    confetti.command 'autoreconnect', "Toggles whether if you should automatically reconnect to the server when detected you've disconnected.", ->
        confetti.cache.store('autoreconnect', !confetti.cache.read('autoreconnect')).save()
        confetti.msg.bot "Auto reconnect is now #{if confetti.cache.read('autoreconnect') then 'on' else 'off'}."

    confetti.initFields {autoreconnect: yes}
