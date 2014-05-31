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
    confetti.cmdlist = (name, cmds, hooks) ->
        list = new CommandList(name).cmds(cmds)
        if hooks
            list.hooks(hooks)

        list.render()
