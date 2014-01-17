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

    confetti.command = (name, help, handler) ->
        usage    = ""
        desc     = ""
        complete = ""

        if help.length is 2
            usage    = name
            desc     = help[0]
            complete = help[1]
        else
            usage    = help[0]
            desc     = help[1]
            complete = help[2]

        commands[name] = {name, help, handler, info: {usage, desc, complete}}

    confetti.execCommand = (command, data, message, chan) ->
        if commands.hasOwnProperty(command)
            commands[command].handler(data, message, chan)
        else
            confetti.msg.bot "The command '#{command}' doesn't exist, silly!"

    confetti.commands = commands

    # Cache
    confetti.initCache = ->
        confetti.cache = new confetti.Cache
        once = confetti.cache.once

        confetti.cache
            .store('ignores', [], once)
            .store('botname', '~Confetti', once)
            .store('botcolor', '#095cef', once)
            .store('notifications', yes, once)
            .store('commandindicator', '-', once)

        confetti.callHooks 'initCache'
        confetti.cache.save()
