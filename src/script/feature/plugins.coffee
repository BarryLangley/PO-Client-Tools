do ->
    findPlugin = (id, plugins = confetti.cache.get('plugins')) ->
        id = id.toLowerCase()

        for plugin in plugins
            if plugin.id is id or plugin.name.toLowerCase() is id
                return plugin

        return null
    hasPlugin = (id, plugins) -> findPlugin(id, plugins) isnt null

    updatePlugins = (verbose = no, chan) ->
        plugins = confetti.cache.get('plugins')
        sys.webCall confetti.pluginsUrl + 'listing.json', (resp) ->
            try
                json = JSON.parse resp
            catch ex
                if verbose
                    confetti.msg.bot "Couldn't load plugin listing -- check your internet connection.", chan
                return

            toUpdate = []

            for plugin in plugins
                plug = findPlugin(plugin.id, json)
                if plug
                    if plugin.version isnt plug.version
                        toUpdate.push [plugin, plug]

            if toUpdate.length
                for plugin in toUpdate
                    plug = plugin[1]
                    pid = plug.id
                    sys.webCall confetti.pluginsUrl + "#{pid}/#{pid}.js", do (plugin) ->
                        return (resp) ->
                            unless resp
                                if verbose
                                    return confetti.msg.bot "Couldn't load plugin source for plugin #{pid} -- check your internet connection.", chan

                            confetti.io.writeLocal "plugin-#{pid}.js", resp

                            index = plugins.indexOf(plugin[0])
                            plugins[index] = plug # Replace plugin with the new one
                            confetti.cache.store('plugins', plugins).save()

                            confetti.msg.bot "Plugin #{plug.name} updated to version #{plug.version}!", chan
                            confetti.initPlugins pid
            else
                if verbose
                    confetti.msg.bot "All plugins up to date.", chan

    confetti.updatePlugins = updatePlugins
    confetti.command 'plugincommands', ['Shows various commands related to plugins.', 'send@plugincommands'], ->
        new confetti.CommandList("Plugin Commands")
            .cmds('plugins addplugin removeplugin updateplugins').hooks('plugins')

    # TODO: Possibility for local plugins
    confetti.command 'plugins', ["Displays a list of enabled and available plugins.", 'send@plugins'], (_, chan) ->
        plugins = confetti.cache.get 'plugins'
        if plugins.length > 0
            confetti.msg.bold "Loaded Plugins <small>[#{plugins.length}]</small>", '', chan

            html = ""
            count = 0
            for plugin in plugins
                count += 1
                # Since '-' is always the command indicator, use it so the command remains clickable even if the user changes their command indicator (inside the send/setmsg protocol).
                html += "#{confetti.msg.bullet} <b>#{plugin.name}</b> (#{plugin.id}) v#{plugin.version} <small>[<a href='po:send/-removeplugin #{plugin.id}' style='text-decoration: none; color: black;'>remove</a>]</small>"

                if count % 4 is 0
                    html += "<br>"

            html += "<br>"
            confetti.msg.html html, chan

        sys.webCall confetti.pluginsUrl + 'listing.json', (resp) ->
            try
                json = JSON.parse resp
            catch ex
                return confetti.msg.bot "Couldn't load available plugins listing -- check your internet connection.", chan

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

    confetti.command 'addplugin', ['addplugin [plugin]', "Adds a plugin.", 'setmsg@addplugin name'], (data, chan) ->
        plugins = confetti.cache.get 'plugins'
        name = data
        data = data.toLowerCase()

        if not name
            return confetti.msg.bot "Specify a plugin!"
        else if hasPlugin(data, plugins)
            return confetti.msg.bot "#{name} is already enabled as a plugin!"

        sys.webCall confetti.pluginsUrl + 'listing.json', (resp) ->
            try
                json = JSON.parse resp
            catch ex
                return confetti.msg.bot "Couldn't load available plugins listing -- check your internet connection.", chan

            if json.length is 0
                return confetti.msg.bot "No plugins are available.", chan

            plugin = findPlugin data, json
            if plugin is null
                return confetti.msg.bot "That plugin is not available! Use the 'plugins' command to see a list of available plugins.", chan

            pid = plugin.id
            sys.webCall confetti.pluginsUrl + "#{pid}/#{pid}.js", (file) ->
                if not file
                    return confetti.msg.bot "Couldn't load plugin source -- check your internet connection.", chan

                confetti.io.writeLocal "plugin-#{pid}.js", file

                plugins.push plugin
                confetti.cache.store('plugins', plugins).save()

                confetti.initPlugins pid
                confetti.msg.bot "Plugin <b>#{plugin.name}</b> added!", chan

    confetti.command 'removeplugin', ['removeplugin [plugin]', "Removes a plugin.", 'setmsg@removeplugin plugin'], (data) ->
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

    confetti.command 'updateplugins', ['Updates your plugins to the latest version.', 'send@updateplugins'], (_, chan) ->
        if sys.isSafeScripts()
            return confetti.msg.bot "Please disable Safe Scripts before using this command."

        updatePlugins yes, chan
