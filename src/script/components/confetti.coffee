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
            .store('flashes', yes, once)

        confetti.callHooks 'initCache'
        confetti.cache.save()

    confetti.initFields = (fields) ->
        confetti.hook 'initCache', ->
            for field, value of fields
                confetti.cache.store(field, value, confetti.cache.once)

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

    # UserInfo resolution
    infoRequests = {}
    Network.userInfoReceived.connect (info) ->
        name = info?.name.toLowerCase()
        if info and infoRequests.hasOwnProperty(name)
            (callback(info) for callback in infoRequests[name])
            delete infoRequests[name]

    confetti.requestUserInfo = (n, callback) ->
        name = n.toLowerCase()

        if infoRequests[name]
            infoRequests[name].push(callback)
        else
            infoRequests[name] = [callback]
            Network.getUserInfo(name)
