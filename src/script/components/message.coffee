do ->
    notify = (msg) ->
        if typeof chan isnt 'number' or not Client.hasChannel chan
            return

        Network.sendChanMessage chan, msg

    pm = (id, msg, encoolType) ->
        unless confetti.players.hasOwnProperty id
            return

        Client.sendPM id, msg

    printm = (msg) ->
        print msg

    html = (msg, chan) ->
        if typeof chan is 'number'
            Client.printChannelMessage msg, chan, yes
        else
            Client.printHtml msg

    bold = (title, msg = '', chan) ->
        html "<timestamp/><b>#{title}:</b> #{msg}", chan

    notification = (msg) ->
        if confetti.cache.initialized isnt no and confetti.cache.read('notifications') is on
            Client.trayMessage "Pokémon Online - #{Client.windowTitle}", msg

    bot = (msg, chan = Client.currentChannel()) ->
        html "<font color='#{confetti.cache.get('botcolor')}'><timestamp/><b>#{confetti.cache.get('botname')}:</b></font> #{msg}", chan

    confetti.msg = {
        notify
        pm
        print: printm
        html
        bold
        notification
        bot
    }
