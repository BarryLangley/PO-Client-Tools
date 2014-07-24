do ->
    # Command core
    commands = {}
    aliases  = {}
    reverseAliases = {}

    confetti.command = (name, help, handler) ->
        usage    = ""
        desc     = ""
        complete = ""

        if typeof help is 'string'
            [usage, desc, complete] = confetti.cmdhelp(name, help)
        else if typeof help is 'object' and !Array.isArray(help)
            [usage, desc, complete] = confetti.cmdhelp(name, help.desc || help.help, help.args, help.mode)
        else if help.length is 2
            usage = name
            [desc, complete] = help
        else
            [usage, desc, complete] = help

        commands[name] = {name, help, handler, info: {usage, desc, complete}}

    # confetti.cmdhelp("imp", "Changes your name to [name].", ["name"], confetti.SetMsg)
    # => ["imp [name]", "Changes your name to [name].", "setmsg@imp [name]"]
    confetti.cmdhelp = (name, desc, args=[], mode=confetti.Send) ->
        help = []

        if args.length
            mode = confetti.SetMsg

        switch mode
            when confetti.Send
                help = [name, desc, "send@#{name}"]
            when confetti.SetMsg
                argl = if Array.isArray(args) then args else args.split(' ')
                arglist = []
                for arg in argl
                    arglist.push "[#{arg}]"

                help = ["#{name} #{arglist.join(':')}", desc, "setmsg@#{name} #{argl.join(':')}"]

        return help

    confetti.Send   = 0
    confetti.SetMsg = 1

    confetti.alias = (caliases, command) ->
        unless Array.isArray(caliases)
            caliases = caliases.split(', ')

        reverseAliases[command] ?= []
        for alias in caliases
            aliases[alias] = command
            reverseAliases[command].push(alias)

    confetti.aliasesOf = (command) -> reverseAliases[command]

    confetti.isCommand = (message) ->
        # Forbid -- etc from triggering commands
        message[0] in [confetti.cache.get('commandindicator'), '-'] and message.length > 1 and confetti.util.isAlpha(message[1])

    confetti.execCommand = (command, data, message, chan) ->
        # Use the alias if available
        if aliases.hasOwnProperty(command)
            command = aliases[command]

        if commands.hasOwnProperty(command)
            commands[command].handler(data, chan, message)
        else
            confetti.msg.bot "The command '#{command}' doesn't exist!"

    confetti.runCommand = (message, chan=Client.currentChannel()) ->
        if confetti.isCommand(message)
            message = message.substr(1)

        space   = message.indexOf ' '
        command = ""
        data    = ""

        if space isnt -1
            command = message.substr(0, space)
            data = message.substr(space + 1)
        else
            command = message

        confetti.execCommand command, data, message, chan

    confetti.commands = commands
    confetti.aliases  = aliases

    # Command lists
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

                caliases = confetti.aliasesOf(name)
                aliasstr = ''
                if caliases
                    aliasstr = " (Alias#{if caliases.length is 1 then '' else 'es'}: <i>#{caliases.join(', ')}</i>)"

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
