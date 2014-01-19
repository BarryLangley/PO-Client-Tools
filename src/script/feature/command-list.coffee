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

        channel = null if timestamp

    confetti.commandList = {cmd, header, border, channel}

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

        confetti.callHooks 'commands:config'

        border yes

    confetti.command 'commands', ['Shows this command list.', 'send@commands'], (_, chan) ->
        channel = chan
        border()

        header 'Commands'

        header 'Command Lists', 4
        cmd 'commands'
        cmd 'configcommands'

        confetti.callHooks 'commands:list'

        header 'Friends', 4
        cmd 'friend'
        cmd 'unfriend'
        cmd 'friends'
        cmd 'friendnotifications'

        confetti.callHooks 'commands:friends'

        header 'Player Blocking', 4
        cmd 'block'
        cmd 'unblock'
        cmd 'blocked'

        confetti.callHooks 'commands:block'

        # Custom categories should be done in this hook, afterwards there are the misc. commands.
        confetti.callHooks 'commands:categories'
        confetti.msg.html "", chan

        cmd 'reconnect'
        cmd 'define'
        cmd 'news'
        cmd 'imp'
        cmd 'flip'
        cmd 'info'
        cmd 'chan'

        confetti.callHooks 'commands:misc'

        cmd 'html'
        cmd 'eval'

        confetti.callHooks 'commands:dev'

        border yes

    confetti.alias 'commandlist', 'commands'
