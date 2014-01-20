do ->
    # Settings stuff
    confetti.command 'notifications', ["Toggles whether if notifications should be shown (tray messages).", 'send@notifications'], ->
        confetti.cache.store('notifications', !confetti.cache.read('notifications')).save()
        confetti.msg.bot "Notifications are now #{if confetti.cache.read('notifications') then 'on' else 'off'}."

    confetti.command 'botname', ['botname [name]', "Changes the bot's name to [name].", 'setmsg@botname [name]'], (data) ->
        if data.length > 25
            confetti.msg.bot "Uhh, that's too long, I think!"
            return

        if confetti.cache.read('botname') is data
            confetti.msg.bot "I'm already #{data}!"
            return

        confetti.cache.store('botname', data).save()
        confetti.msg.bot "I'm now called #{data}!"

    confetti.command 'botcolor', ['botcolor [color]', "Changes the bot's color to [color].", 'setmsg@botcolor [color]'], (data) ->
        data = data.toLowerCase()

        unless sys.validColor(data)
            confetti.msg.bot "That doesn't look like a valid color to me!"
            return

        if confetti.cache.read('botcolor') is data
            confetti.msg.bot "My color is already #{data}!"
            return

        confetti.cache.store('botcolor', data).save()
        confetti.msg.bot "My color is now #{data}!"

    confetti.command 'commandindicator', ['commandindicator [char]', "Changes your command indicator (to indicate usage of commands) to [char]. <b>-</b> will remain usable, in case you ever forget.", 'setmsg@commandindicator [char]'], (data) ->
        data = data.toLowerCase()

        if data.length isnt 1
            confetti.msg.bot "Your command indicator has to be one character, nothing more, nothing less!"
            return

        if data in ['/', '!']
            confetti.msg.bot "'!' and '/' are not allowed as command indicators because they are reserved for server scripts."
            return

        if confetti.cache.read('commandindicator') is data
            confetti.msg.bot "Your command indicator is already #{data}!"
            return

        confetti.cache.store('commandindicator', data).save()
        confetti.msg.bot "Your command indicator is now #{data}!"

    # Use setmsg here as this command can be dangerous.
    confetti.command 'defaults', ['Resets all settings back to their defaults. There might be some plugins that do not support this.', 'setmsg@defaults'], (data) ->
        if data.toLowerCase() isnt 'sure'
            commandindicator = confetti.cache.get 'commandindicator'
            confetti.msg.bot "<a href='po:send/#{commandindicator}defaults sure' style='text-decoration: none; color: black;'>Are you sure that you want to reset your settings? There is no going back. Click this message to confirm (or type <small>#{commandindicator}defaults sure</small>).</a>"
            return

        # Wipe everything and reset the cache.
        # Scripts are reloaded for plugins.
        confetti.cache.wipe()
        confetti.initCache()
        confetti.io.reloadScript()

        confetti.msg.bot "Your settings have been reset to their defaults!"