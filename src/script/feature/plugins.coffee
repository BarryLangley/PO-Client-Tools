do ->
    findPlugin = (id, plugins = confetti.cache.get('plugins')) ->
        id = id.toLowerCase()

        for plugin in plugins
            if plugin.id is id or plugin.name.toLowerCase() is id
                return plugin

        return null
    hasPlugin = (id, plugins) -> findPlugin(id, plugins) isnt null

    getListing = (chan, callback, verbose=yes) ->
        confetti.io.getRemoteJson "#{confetti.pluginsUrl}listing.json", [(if verbose then "A connection error occured whilst loading the plugin listing." else ""), chan], callback

    getPluginFile = (pid, chan, callback, verbose=yes) ->
        confetti.io.getRemoteFile "#{confetti.pluginsUrl}#{pid}/#{pid}.js", [(if verbose then "A connection error occured whilst loading the plugin source file of the plugin #{pid}." else ""), chan], callback

    updatePlugins = (verbose = no, chan) ->
        plugins = confetti.cache.get('plugins')
        getListing chan, (json) ->
            toUpdate = []

            for plugin in plugins
                plug = findPlugin(plugin.id, json)
                if plug and plugin.version isnt plug.version
                    toUpdate.push [plugin, plug]

            if toUpdate.length
                toUpdate.forEach (plugin) ->
                    plug = plugin[1]
                    pid = plug.id
                    getPluginFile pid, chan, (resp) ->
                        confetti.io.writeLocal "plugin-#{pid}.js", resp

                        index = plugins.indexOf(plugin[0])
                        plugins[index] = plug # Replace plugin with the new one
                        confetti.cache.store('plugins', plugins).save()

                        confetti.msg.bot "Plugin #{plug.name} updated to version #{plug.version}!", chan
                        confetti.initPlugins pid
                    , verbose
            else if verbose
                confetti.msg.bot "All plugins up to date.", chan
        , verbose

    confetti.updatePlugins = updatePlugins

    # TODO: Possibility for local plugins
    confetti.command 'plugins', "Displays a list of enabled and available plugins.", (_, chan) ->
        plugins = confetti.cache.get 'plugins'
        if plugins.length > 0
            confetti.msg.bold "Loaded Plugins <small>[#{plugins.length}]</small>", '', chan

            html = ""
            for plugin in plugins
                # Since '-' is always the command indicator, use it so the command remains clickable even if the user changes their command indicator (inside the send/setmsg protocol).
                html += "#{confetti.msg.bullet} <b>#{plugin.name}</b> (#{plugin.id}) v#{plugin.version} <small>[<a href='po:send/-removeplugin #{plugin.id}' style='text-decoration:none;color:black'>remove</a>]</small><br>"

            html += "<br>"
            confetti.msg.html html, chan

        getListing chan, (json) ->
            len = json.length
            unless len
                return confetti.msg.bot "No plugins are available.", chan

            confetti.msg.bold "Available Plugins <small>[#{len}]</small>", '', chan

            html = ""
            for plugin in json
                addremove = ""
                pid = plugin.id

                # Since '-' is always the command indicator, use it so the command remains clickable even if the user changes their command indicator (inside the send/setmsg protocol).
                unless hasPlugin(pid, plugins)
                    addremove = "<small>[<a href='po:send/-addplugin #{pid}' style='text-decoration:none;color:black'>add</a>]</small>"
                else
                    addremove = "<small>[<a href='po:send/-removeplugin #{pid}' style='text-decoration:none;color:black'>remove</a>]</small>"

                html += "#{confetti.msg.bullet} <b>#{plugin.name}</b> (#{pid}) v#{plugin.version} #{addremove}<br>"

            confetti.msg.html html, chan

    confetti.command 'addplugin', {help: "Adds a plugin. The plugin's ID must be used (inside brackets).", args: ["id"]}, (data, chan) ->
        plugins = confetti.cache.get 'plugins'
        name = data
        data = data.toLowerCase()

        if not name
            return confetti.msg.bot "Specify a plugin!"
        else if hasPlugin(data, plugins)
            return confetti.msg.bot "#{name} is already enabled as a plugin!"

        getListing chan, (json) ->
            if json.length is 0
                return confetti.msg.bot "No plugins are available.", chan

            plugin = findPlugin data, json
            if plugin is null
                return confetti.msg.bot "That plugin is not available! Use the 'plugins' command to see a list of available plugins.", chan

            pid = plugin.id
            getPluginFile pid, chan, (file) ->
                confetti.io.writeLocal "plugin-#{pid}.js", file

                plugins.push plugin
                confetti.cache.store('plugins', plugins).save()

                confetti.initPlugins pid
                confetti.msg.bot "Plugin <b>#{plugin.name}</b> added!", chan

    confetti.command 'removeplugin', {help: "Removes a plugin. The plugin's ID must be used (inside brackets).", args: ["plugin"]}, (data) ->
        name = data
        data = data.toLowerCase()
        plugins = confetti.cache.get 'plugins'
        plugin = findPlugin(data, plugins)

        if plugin is null
            return confetti.msg.bot "#{name} isn't an enabled plugin! Try to use its plugin id (in the plugins list, this is the name in brackets)."

        plugins.splice plugins.indexOf(plugin), 1
        confetti.cache.store('plugins', plugins).save()

        confetti.io.deleteLocal "plugin-#{plugin.id}.js"
        confetti.io.reloadScript()

        confetti.msg.bot "Plugin <b>#{plugin.name}</b> removed."

    confetti.command 'updateplugins', "Updates your plugins to their latest versions.", (_, chan) ->
        if sys.isSafeScripts()
            return confetti.msg.bot "Please disable Safe Scripts before using this command."

        updatePlugins yes, chan
