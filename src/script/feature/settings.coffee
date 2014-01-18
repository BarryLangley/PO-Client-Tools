do ->
    # Settings stuff
    confetti.command 'notifications', ["Toggles whether if notifications for the script should be shown (tray messages).", 'send@notifications'], ->
        if confetti.cache.read('notifications')
            confetti.cache.store 'notifications', off
        else
            confetti.cache.store 'notifications', on

        confetti.msg.bot "Notifications are now #{if confetti.cache.read('notifications') then 'on' else 'off'}."

    confetti.command 'botname', ['botname [name]', "Changes the bot's name to [name].", 'setmsg@botname [name]'], (data) ->
        if data.length > 25
            confetti.msg.bot "Uhh, that's too long, I think!"
            return

        if confetti.cache.read('botname') is data
            confetti.msg.bot "I'm already #{data}!"
            return

        confetti.cache.store('botname', data)
        confetti.msg.bot "I'm now called #{data}!"

    confetti.command 'botcolor', ['botcolor [color]', "Changes the bot's color to [color].", 'setmsg@botcolor [color]'], (data) ->
        data = data.toLowerCase()

        unless sys.validColor(data)
            confetti.msg.bot "That doesn't look like a valid color to me!"
            return

        if confetti.cache.read('botcolor') is data
            confetti.msg.bot "My color is already #{data}!"
            return

        confetti.cache.store('botcolor', data)
        confetti.msg.bot "My color is now #{data}!"

    confetti.command 'commandindicator', ['commandindicator [char]', "Changes your command indicator (to indicate usage of commands) to [char]. '<b>-</b>' will remain usable.", 'setmsg@commandindicator [char]'], (data) ->
        data = data.toLowerCase()

        if data.length isnt 1
            confetti.msg.bot "Your command indicator has to be one character, nothing more, nothing less!"
            return

        if confetti.cache.read('commandindicator') is data
            confetti.msg.bot "Your command indicator is already #{data}!"
            return

        confetti.cache.store('commandindicator', data)
        confetti.msg.bot "Your command indicator is now #{data}!"
