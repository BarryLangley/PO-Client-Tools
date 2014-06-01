do ->
    # Settings stuff
    confetti.command 'notifications', "Toggles whether if notifications should be shown (tray messages).", ->
        confetti.cache.store('notifications', !confetti.cache.read('notifications')).save()
        confetti.msg.bot "Notifications are now #{if confetti.cache.read('notifications') then 'on' else 'off'}."

    confetti.command 'botname', {help: "Changes the bot's name to [name].", args: ["name"]}, (data) ->
        if data.length > 25
            return confetti.msg.bot "Uhh, that's too long, I think!"

        if confetti.cache.read('botname') is data
            return confetti.msg.bot "I'm already #{data}!"

        confetti.cache.store('botname', data).save()
        confetti.msg.bot "I'm now called #{data}!"

    confetti.command 'botcolor', {help: "Changes the bot's color to [color].", args: ["color"]}, (data) ->
        data = data.toLowerCase()

        unless sys.validColor(data)
            return confetti.msg.bot "That doesn't look like a valid color to me!"

        if confetti.cache.read('botcolor') is data
            return confetti.msg.bot "My color is already #{data}!"

        confetti.cache.store('botcolor', data).save()
        confetti.msg.bot "My color is now #{data}!"

    confetti.command 'commandindicator', {help: "Changes your command indicator (to indicate usage of commands) to [symbol]. <b>-</b> will remain usable, in case you ever forget.", args: ["symbol"]}, (data) ->
        data = data.toLowerCase()

        if data.length isnt 1
            return confetti.msg.bot "Your command indicator has to be one character, nothing more, nothing less!"

        if data in ['/', '!']
            return confetti.msg.bot "'!' and '/' are not allowed as command indicators because they are reserved for server scripts."

        if confetti.cache.read('commandindicator') is data
            return confetti.msg.bot "Your command indicator is already #{data}!"

        confetti.cache.store('commandindicator', data).save()
        confetti.msg.bot "Your command indicator is now #{data}!"

    # Use setmsg here as this command can be dangerous.
    confetti.command 'defaults', "Sets all settings back to their defaults. There may be some plugins which do not support this action, in which case they might break.", (data) ->
        if data.toLowerCase() isnt 'sure'
            # Since '-' is always the command indicator, use it so the command remains clickable even if the user changes their command indicator (inside the send/setmsg protocol).
            return confetti.msg.bot "<a href='po:send/-defaults sure' style='text-decoration: none; color: black;'>Are you sure that you want to reset your settings? There is no going back. Click this message to confirm (or type <small>#{confetti.cache.get('commandindicator')}defaults sure</small>).</a>"

        # Wipe everything and reset the cache.
        # Scripts are reloaded for plugins.
        confetti.cache.wipe()
        confetti.initCache()
        confetti.io.reloadScript()

        confetti.msg.bot "Your settings have been reset to their defaults!"
