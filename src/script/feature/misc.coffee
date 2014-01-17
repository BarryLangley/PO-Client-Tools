do ->
    # Command list stuff
    cmd = (name) ->
        if confetti.commands[name]
            command = confetti.commands[name]

            parts = command.info.complete.split '@'
            indicator = confetti.cache.get 'commandindicator'
            complete = "<a href='po:#{parts[0]}/#{indicator}#{parts[1]}' style='text-decoration: none; color: green;'>#{indicator}#{command.info.usage}</a>"

            confetti.msg.html "&bull; #{complete}: #{command.info.desc}"

    header = (msg, size = 2) ->
        confetti.msg.html "<h#{size}>#{msg}</h#{size}>"

    border = (timestamp = no) ->
        confetti.msg.html "#{if timestamp then '<br/><timestamp/><br/>' else ''}<font color='skyblue'><b>≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈</b></font>#{if timestamp then '<br/>' else ''}"

    confetti.command 'configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], ->
        border()

        header 'Configuration Commands'
        cmd 'botname'
        cmd 'botcolor'
        cmd 'encool'
        cmd 'notifications'
        cmd 'autoreconnect'

        border yes

    confetti.command 'commands', ['Shows this command list.', 'send@commands'], ->
        border()

        header 'Commands'
        cmd 'commands'
        cmd 'configcommands'
        cmd 'reconnect'
        cmd 'eval'

        border yes

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
            confetti.msg.bot "I'm already already #{data}!"
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

    confetti.command 'commandindicator', ['commandindicator [char]', "Changes your command indicator (to indicate usage of commands) to [char]. <i>-</i> will remain usable.", 'setmsg@commandindicator [char]'], ->
        data = data.toLowerCase()

        if data.length isnt 1
            confetti.msg.bot "The command indicator has to be one character, nothing more, nothing less!"
            return

        if confetti.cache.read('commandindicator') is data
            confetti.msg.bot "The command indicator is already #{data}!"
            return

        confetti.cache.store('commandindicator', data)
        confetti.msg.bot "The command indicator is now #{data}!"

    # Other bits
    confetti.command 'eval', ['eval [code]', "Evaluates a JavaScript Program.", 'setmsg@eval [code]'], (data) ->
        try
            res = eval(data)
            confetti.msg.html "<timestamp/><b>Eval returned:</b> #{sys.htmlEscape(res)}"
        catch ex
            confetti.msg.html "<timestamp/><b>Eval error:</b> #{ex} on line #{ex.lineNumber}"
            confetti.msg.html ex.backtrace.join('<br/>') if ex.backtrace?
