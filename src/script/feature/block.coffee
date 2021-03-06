do ->
    confetti.command 'blocked', "Displays a list of blocked players.", (_, chan) ->
        blocklist = confetti.util.sortOnlineOffline(confetti.cache.get('blocked'))

        if blocklist.length is 0
            return confetti.msg.bot "There is no one on your block list."

        confetti.msg.bold "Blocked players <small>[#{blocklist.length}]</small>", '', chan

        html  = ""
        count = 0
        for blocked in blocklist
            count += 1

            html += "#{confetti.msg.bullet} #{confetti.player.fancyName(blocked)} #{confetti.player.status(blocked)}"
            html += "<br>" if count % 3 is 0

        confetti.msg.html html, chan

    confetti.command 'block', {help: "Blocks a user by automatically ignoring them when they log in.", args: ["name"]}, (data) ->
        len = data.length

        if not data
            return confetti.msg.bot "Specify a name!"
        else if len > 20
            return confetti.msg.bot "That name's a bit too long."

        name = confetti.player.name data
        data = data.toLowerCase()
        blocked = confetti.cache.get 'blocked'

        if Client.ownName().toLowerCase() is data
            return confetti.msg.bot "You can't block yourself!"

        if data in blocked
            return confetti.msg.bot "#{sys.htmlEscape(name)} is already blocked!"

        blocked.push data
        confetti.cache.store('blocked', blocked).save()

        id = Client.id data
        Client.ignore(id, yes) if id isnt -1

        confetti.msg.bot "#{sys.htmlEscape(name)} is now blocked!"

    confetti.command 'unblock', {help: "Unblocks a user.", args: ["name"]}, (data) ->
        data = data.toLowerCase()
        name = confetti.player.name data
        blocked = confetti.cache.get 'blocked'

        unless data in blocked
            return confetti.msg.bot "#{sys.htmlEscape(name)} isn't blocked!"

        blocked.splice blocked.indexOf(data), 1
        confetti.cache.store('blocked', blocked).save()

        id = Client.id data
        Client.ignore(id, no) if id isnt -1

        confetti.msg.bot "You are no longer blocking #{sys.htmlEscape(name)}!"

    confetti.initFields {blocked: []}
    confetti.hook 'onPlayerReceived', (id) ->
        name    = Client.name(id).toLowerCase()
        blocked = confetti.cache.get('blocked')

        if name in blocked
            Client.ignore(id, yes)
