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
        confetti.msg.html "<font size='#{size}'><b>#{msg}</b></font><br/>"

    border = (timestamp = no) ->
        confetti.msg.html "#{if timestamp then '<br/><timestamp/><br/>' else ''}<font color='skyblue'><b>≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈</b></font><br/>"

    confetti.command 'configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], ->
        border()

        header 'Configuration Commands'
        cmd 'botname'
        cmd 'botcolor'
        cmd 'encool'
        cmd 'notifications'
        cmd 'commandindicator'
        cmd 'autoreconnect'

        border yes

    confetti.command 'commands', ['Shows this command list.', 'send@commands'], ->
        border()

        header 'Commands'
        cmd 'reconnect'
        cmd 'imp'
        cmd 'flip'
        cmd 'html'
        cmd 'eval'

        header 'Player Blocking', 3
        cmd 'block'
        cmd 'unblock'
        cmd 'blocked'

        header 'Command Lists', 3
        cmd 'commands'
        cmd 'configcommands'

        border yes
