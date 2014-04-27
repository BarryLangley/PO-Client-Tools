do ->
    # Hooks
    hooks = {}

    confetti._hooks = hooks
    confetti.hook = (name, func) ->
        hooks[name] ?= []
        hooks[name].push func

    confetti.callHooks = (event, args...) ->
        return args unless hooks.hasOwnProperty(event)

        for hook in hooks[event]
            res = hook args...
            args = res if res and res.length

        return args

    # Commands
    commands = {}
    aliases  = {}

    confetti.command = (name, help, handler) ->
        usage    = ""
        desc     = ""
        complete = ""

        if help.length is 2
            usage = name
            [desc, complete] = help
        else
            [usage, desc, complete] = help

        commands[name] = {name, help, handler, info: {usage, desc, complete}}

    confetti.alias = (alias, command) ->
        aliases[alias] = command

    confetti.execCommand = (command, data, message, chan) ->
        # Use the alias if available
        if aliases.hasOwnProperty(command)
            command = aliases[command]

        if commands.hasOwnProperty(command)
            commands[command].handler(data, chan, message)
        else
            confetti.msg.bot "The command '#{command}' doesn't exist, silly!"

    confetti.commands = commands
    confetti.aliases  = aliases

    # Initialize cache
    # This is done in one function to mimimize the amount of file rewrites (especially on first use).
    # save is called last and should not be called by one of the hooks
    confetti.initCache = ->
        confetti.cache = new confetti.Cache
        once = confetti.cache.once

        # These are still here as they are part of core functionality (used in components).
        confetti.cache
            .store('botname', '±Confetti', once)
            .store('botcolor', '#07b581', once)
            .store('notifications', yes, once)
            .store('commandindicator', '-', once)
            .store('lastuse', 0, once)
            .store('plugins', [], once)
            .store('tracked', {}, once)
            .store('trackingresolve', yes, once)

        confetti.callHooks 'initCache'
        confetti.cache.save()

    # Also supports loading a single plugin.
    confetti.initPlugins = (id) ->
        plugins = confetti.cache.get('plugins')

        return if plugins.length is 0
        return if sys.isSafeScripts()

        success = no
        for plugin in plugins
            pid = plugin.id
            if typeof id is 'string' and pid isnt id
                continue

            src = confetti.io.readLocal "plugin-#{pid}.js"
            if src
                try
                    sys.eval(src, "plugin-#{pid}.js")
                    success = yes
                catch ex
                    print "Couldn't load plugin #{plugin.name}:"
                    print "#{ex} on line #{ex.lineNumber}"
                    print ex.backtracetext if ex.backtracetext

        # Call initCache again - plugins might need it.
        if success
            confetti.callHooks 'initCache'
            confetti.cache.save()
