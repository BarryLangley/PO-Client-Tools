do ->
    # Hooks
    hooks = {}
    stophook = no

    confetti.hook = (name, func) ->
        hooks[name] ?= []
        hooks[name].push func

    confetti.callHooks = (event, args...) ->
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
            usage    = name
            [desc, complete] = help
        else
            [usage, desc, complete] = help

        commands[name] = {name, help, handler, info: {usage, desc, complete}}

    confetti.alias = (alias, command) ->
        aliases[alias] = command

    confetti.execCommand = (command, data, message, chan) ->
        # Use the alias
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
            .store('botcolor', '#09abdc', once)
            .store('notifications', yes, once)
            .store('commandindicator', '-', once)

        confetti.callHooks 'initCache'
        confetti.cache.save()
