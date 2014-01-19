do ->
    # Other bits
    confetti.command 'eval', ['eval [code]', "Evaluates a JavaScript Program.", 'setmsg@eval [code]'], (data, chan) ->
        try
            res = eval(data)
            confetti.msg.bold "Eval returned", sys.htmlEscape(res), chan
        catch ex
            confetti.msg.bold "Eval error", "#{ex} on line #{ex.lineNumber}", chan
            confetti.msg.html ex.backtrace.join('<br/>'), chan if ex.backtrace?

    confetti.command 'evalp', 'eval'

    confetti.command 'imp', ['imp [name]', "Changes your name to [name]. If the name is deemed invalid, you will be kicked, so be careful!", 'setmsg@imp [name]'], (data) ->
        if data.length < 1 or data.length > 20
            confetti.msg.bot "That name is too long or too short (max 20 characters)!"
            return

        confetti.msg.bot "You are now known as #{data}!"
        Client.changeName data

    confetti.alias 'changename', 'imp'

    confetti.command 'flip', ["Flips a coin in virtual life.", 'send@flip'], ->
        confetti.msg.bot "The coin landed #{if Math.random() > 0.5 then 'heads' else 'tails'}!"

    confetti.alias 'coin', 'flip'

    confetti.command 'html', ['html [code]', "Displays some HTML [code] (for testing purposes).", 'setmsg@html [code]'], (data, chan) ->
        confetti.msg.html data, chan

    confetti.command 'chan', ['chan [name]', "Joins, jumps to, or creates a channel.", 'setmsg@chan [name]'], (data) ->
        name = data
        data = data.toLowerCase()

        channelNames = Client.channelNames()
        exists = no

        # We could do a quick channelId test, however, it returns 0 if the channel does not exist.
        # So this complicated loop is necessary*. While we're at it, though, we can possibly get the correct cased name as well.

        # *: It's also possible to do Client.channelId(name) is 0 and name.toLowerCase() isnt Client.channelName(0)
        # But that won't give us the correct case.
        for cid, cname of channelNames
            if cname.toLowerCase() is data
                name = cname
                exists = yes
                break

        if exists
            cid = Client.channelId(name)
            # If the player is in the channel, jump to it, otherwise join it.
            if Client.hasChannel(cid)
                Client.activateChannel name
            else
                Client.join name
                Client.activateChannel name
        else
            Client.join name
            # Give it some time to join
            sys.setTimer ->
                # In case the script refused the channel
                # or the network is really slow, don't do anything here (the channel won't exist here).
                # We can assume chan 0 already existed (and therefore would've been exists = true), so just compare here.

                cid = Client.channelId name
                return if cid is 0

                Client.activateChannel name
                confetti.msg.bot "Channel #{name} created.", cid
            , 500, no # Wait 500 ms

    confetti.alias 'joinchan', 'chan'
    confetti.alias 'channel', 'chan'
    confetti.alias 'goto', 'chan'

    confetti.command 'info', ['info [name]', "Shows info for a given user. If you are a moderator, also opens a control panel for the player.", 'setmsg@info [name]'], (data) ->
        isMod = Client.ownAuth() > 0
        id = Client.id data

        if isMod
            Client.controlPanel id

            Network.getUserInfo data
            Network.getBanList()

        if id is -1
            confetti.msg.bot "#{data} is offline, I can't fetch any information about them."
            return

        name = confetti.player.fancyName id
        auth = Client.auth id
        color = Client.color id

        confetti.msg.html "<timestamp/> #{name} #{confetti.player.status(id)} <small>#{id}</small>"
        confetti.msg.html "#{confetti.msg.bullet} <b>Auth</b>: #{confetti.player.authToName(auth)} [#{auth}]"
        confetti.msg.html "#{confetti.msg.bullet} <b>Color</b>: <b style='color: #{color};'>#{color}</b>"

        if Client.player?
            avatar = Client.player(id).avatar
            confetti.msg.html "#{confetti.msg.bullet} <b>Avatar</b>: #{avatar}<br/>#{confetti.msg.indent}<img src='trainer:#{avatar}'>"

    confetti.alias 'userinfo', 'info'
