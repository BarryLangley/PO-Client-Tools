do ->
    notify = (msg) ->
        if typeof chan isnt 'number' or not Client.hasChannel chan
            return

        Network.sendChanMessage chan, msg
    pm = (id, msg, encoolType) ->
        unless confetti.players.hasOwnProperty id
            return

        Network.sendPM id, msg
    printm = (msg) ->
        print msg
    html = (msg) ->
        Client.printHtml msg
    bold = (title, msg = '') ->
        html "<timestamp/><b>#{title}:</b> #{msg}"
    notification = (msg) ->
        if confetti.cache.initialized isnt no and confetti.cache.read('notifications') is on
            Client.trayMessage "Pokémon Online - #{Client.windowTitle}", msg
    bot = (msg) ->
        client.printHtml "<font color='#{confetti.cache.get('botcolor')}'><timestamp/><b>#{confetti.cache.get('botname')}:</b></font> #{msg}"

    confetti.msg = {
        notify
        pm
        print: printm
        html
        bold
        notification
        bot
    }
