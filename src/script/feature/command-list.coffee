do ->
    # Command list stuff
    channel = null

    cmd = (name) ->
        if confetti.commands[name]
            command = confetti.commands[name]

            parts = command.info.complete.split '@'
            indicator = confetti.cache.get 'commandindicator'
            complete = "<a href='po:#{parts[0]}/#{indicator}#{parts[1]}' style='text-decoration: none; color: green;'>#{indicator}#{command.info.usage}</a>"

            confetti.msg.html "&bull; #{complete}: #{command.info.desc}", channel

    header = (msg, size = 5) ->
        confetti.msg.html "<br/><font size='#{size}'><b>#{msg}</b></font><br/>", channel

    border = (timestamp = no) ->
        confetti.msg.html "#{if timestamp then '<br/><timestamp/><br/>' else '<br/>'}<font color='skyblue'><b>≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈</b></font>#{if timestamp then '<br/>' else ''}", channel

    # TODO: Hooks for custom commands via plugins
    confetti.command 'configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], (_, chan) ->
        channel = chan

        border()

        header 'Configuration Commands'
        cmd 'botname'
        cmd 'botcolor'
        cmd 'encool'
        cmd 'notifications'
        cmd 'commandindicator'
        cmd 'autoreconnect'

        border yes

    confetti.command 'commands', ['Shows this command list.', 'send@commands'], (_, chan) ->
        channel = chan
        border()

        header 'Commands'

        header 'Command Lists', 4
        cmd 'commands'
        cmd 'configcommands'

        header 'Friends', 4
        cmd 'friend'
        cmd 'unfriend'
        cmd 'friends'

        header 'Player Blocking', 4
        cmd 'block'
        cmd 'unblock'
        cmd 'blocked'

        confetti.msg.html "", chan

        cmd 'reconnect'
        cmd 'news'
        cmd 'imp'
        cmd 'flip'
        cmd 'info'
        cmd 'chan'

        cmd 'html'
        cmd 'eval'

        border yes

    confetti.alias 'commandlist', 'commands'
