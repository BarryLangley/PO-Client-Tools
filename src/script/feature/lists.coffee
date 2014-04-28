do ->
    # Command list class
    class CommandList
        constructor: (@name) ->
            commandindicator = confetti.cache.get 'commandindicator'
            @template = [
                "<table width=25%><tr><td><center><font size=5><b>#{@name}</b></font></center></td></tr></table>"
                ""
                "<b style='color:teal'>To use any of these commands, prefix them with '#{commandindicator}' like so:</b> <u>#{commandindicator}commands</u>"
                ""
            ]
        cmd: (name) ->
            command = confetti.commands[name]
            if command
                parts = command.info.complete.split '@'

                aliases = confetti.aliasesOf(name)
                aliasstr = ''
                if aliases
                    aliasstr = " (Alias#{if aliases.length is 1 then '' else 'es'}: <i>#{aliases.join(', ')}</i>)"

                cmdname = "<a href='po:#{parts[0]}/-#{parts[1]}' style='text-decoration:none;color:teal'>#{command.info.usage}</a>"
                @template.push("\u00bb #{cmdname} - #{command.info.desc}#{aliasstr}")
            return this
        cmds: (names) ->
            if typeof names is 'string'
                names = names.split(' ')

            for name in names
                @cmd(name)
            return this
        group: (name) ->
            @whiteline()
            @template.push("<font size=4><b>#{name}</b></font>");
            @whiteline()
            return this
        whiteline: ->
            @template.push("")
            return this
        hooks: (name) ->
            confetti.callHooks("commands:#{name}", this)
            return this
        render: (chan = Client.currentChannel()) ->
            @whiteline()
            confetti.msg.html @template.join("<br>"), chan

    confetti.CommandList = CommandList

    # Command lists
    confetti.command 'configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], ->
        new CommandList("Configuration Commands")
            .cmds('botname botcolor encool notifications commandindicator autoreconnect')
            .hooks('config')

            .whiteline()

            .cmd('defaults')
            .render()

    confetti.command 'commands', ['Shows this command list.', 'send@commands'], ->
        new CommandList("Commands")
            .group("Command Lists").cmds('commands configcommands scriptcommands plugincommands').hooks('list')
            .group("Friends").cmds('friend unfriend friends friendnotifications').hooks('friends')
            .group("Blocking").cmds('block unblock blocked').hooks('block')
            .group("Tracking").cmds('track untrack tracked trackingresolve').hooks('track')
            .group("Flashwords").cmds('flashword removeflashword flashwords flashes').hooks('flashwords')
            .group("Player Symbols").cmds('authsymbols authsymbol').hooks('playersymbols')
            # Custom categories should be done in this hook, afterwards there are the misc. commands.
            .hooks('categories')
            .whiteline()

            .cmds('reconnect define translate news imp info myip chan flip').hooks('misc')
            .cmds('html eval').hooks('dev')
            .render()

    confetti.alias 'commandlist', 'commands'
