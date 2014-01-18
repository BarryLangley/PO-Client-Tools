do ->
    confetti.command 'blocked', ["Displays a list of blocked players.", 'send@blocklist'], ->
        confetti.msg.bold "Blocked Players"

        html = ""
        (html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; #{confetti.player.name(blocked)}" for blocked in confetti.blocked)

        confetti.msg.html html

    confetti.command 'block', ['block [name]', "Blocks a user by automatically ignoring them.", 'setmsg@block [name]'], (data) ->
        if data.length < 1 or data.length > 20
            confetti.msg.bot "Uhh, that's too long, I think!"
            return

        name = confetti.player.name data
        data = data.toLowerCase()
        if data in confetti.blocked
            confetti.msg.bot "#{name} is already blocked!"
            return

        confetti.blocked.push data
        confetti.cache.store('blocked', confetti.blocked)

        id = Client.id data
        Client.ignore(id, yes) if id isnt -1

        confetti.msg.bot "#{name} is now blocked!"

    confetti.command 'unblock', ['unblock [name]', "Unblocks a user.", 'setmsg@unblock [name]'], (data) ->
        data = data.toLowerCase()
        name = confetti.player.name data

        unless data in confetti.blocked
            confetti.msg.bot "#{name} isn't blocked!"
            return

        confetti.blocked.splice confetti.blocked.indexOf(data), 1
        confetti.cache.store('blocked', confetti.blocked)

        id = Client.id data
        Client.ignore(id, no) if id isnt -1

        confetti.msg.bot "You are no longer blocking #{name}!"
