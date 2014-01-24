do ->
    findPlugin = (id, plugins = confetti.cache.get('plugins')) ->
        id = id.toLowerCase()

        for plugin in plugins
            if plugin.id is id or plugin.name.toLowerCase() is id
                return plugin

        return null
    hasPlugin = (id, plugins) -> findPlugin(id, plugins) isnt null

    confetti.command 'plugincommands', ['Shows various commands related to plugins.', 'send@plugincommands'], (_, chan) ->
        confetti.commandList.border no, chan

        confetti.commandList.header 'Plugin Commands', 5, chan
        confetti.commandList.cmd 'plugins', chan
        confetti.commandList.cmd 'addplugin', chan
        confetti.commandList.cmd 'removeplugin', chan

        confetti.callHooks 'commands:plugins'

        confetti.commandList.border yes, chan

    # TODO: Updateplugins
    # TODO: Possibility for local plugins
    confetti.command 'plugins', ["Displays a list of enabled and available plugins.", 'send@plugins'], (_, chan) ->
        plugins = confetti.cache.get 'plugins'
        if plugins.length > 0
            confetti.msg.bold "Loaded Plugins"

            html = ""
            for plugin in plugins
                html += "#{confetti.msg.bullet} <b>#{plugin.name}</b> (#{plugin.id}) <small>[<a href='po:send/#{confetti.cache.get('commandindicator')}removeplugin #{plugin.name}' style='text-decoration: none; color: black;'>remove</a>]</small>"

            confetti.msg.html html

        sys.webCall confetti.pluginsUrl + 'listing.json', (resp) ->
            try
                json = JSON.parse resp
            catch ex
                print ex
                confetti.msg.bot "Couldn't load available plugins listing -- check your internet connection.", chan
                return

            if json.length is 0
                confetti.msg.bot "No plugins are available.", chan
                return

            confetti.msg.bold "Available Plugins", '', chan

            html = ""
            for plugin in json
                addremove = ""

                unless hasPlugin(plugin.id, plugins)
                    addremove = "<small>[<a href='po:send/#{confetti.cache.get('commandindicator')}addplugin #{plugin.name}' style='text-decoration: none; color: black;'>add</a>]</small>"
                else
                    addremove = "<small>[<a href='po:send/#{confetti.cache.get('commandindicator')}removeplugin #{plugin.name}' style='text-decoration: none; color: black;'>remove</a>]</small>"

                html += "#{confetti.msg.bullet} <b>#{plugin.name}</b> (#{plugin.id}) #{addremove}<br/>"

            confetti.msg.html html, chan

    confetti.command 'addplugin', ['addplugin [plugin]', "Adds a plugin.", 'setmsg@addplugin [name]'], (data, chan) ->
        plugins = confetti.cache.get 'plugins'
        name = data
        data = data.toLowerCase()

        if name.length is 0
            confetti.msg.bot "Specify a plugin!"
            return

        if hasPlugin(data, plugins)
            confetti.msg.bot "#{name} is already enabled as a plugin!"
            return

        confetti.msg.bot "Locating plugin source..."
        sys.webCall confetti.pluginsUrl + 'listing.json', (resp) ->
            try
                json = JSON.parse resp
            catch ex
                confetti.msg.bot "Couldn't load available plugins listing -- check your internet connection.", chan
                return

            if json.length is 0
                confetti.msg.bot "No plugins are available.", chan
                return

            plugin = findPlugin data, json
            if plugin is null
                confetti.msg.bot "That plugin is not available! Use the 'plugins' command to see a list of available plugins.", chan
                return

            confetti.msg.bot "Downloading plugin #{plugin.name}...", chan
            sys.webCall "#{confetti.pluginsUrl}#{plugin.id}/#{plugin.id}.js", (file) ->
                if not file
                    confetti.msg.bot "Couldn't load plugin source -- check your internet connection.", chan
                    return

                sys.writeToFile "#{confetti.dataDir}plugin-#{plugin.id}.js", file

                plugins.push plugin
                confetti.cache.store('plugins', plugins).save()

                confetti.msg.bot "Plugin #{plugin.name} added!", chan
                confetti.initPlugins plugin.id

    confetti.command 'removeplugin', ['removeplugin [plugin]', "Removes a plugin.", 'setmsg@removeplugin [plugin]'], (data) ->
        name = data
        data = data.toLowerCase()
        plugins = confetti.cache.get 'plugins'
        plugin  = findPlugin(data, plugins)

        if plugin is null
            confetti.msg.bot "#{name} isn't an enabled plugin!"
            return

        plugins.splice plugins.indexOf(plugin), 1
        confetti.cache.store('plugins', plugins).save()

        confetti.io.deleteLocal "plugin-#{plugin.id}.js"
        confetti.io.reloadScript()

        confetti.msg.bot "Plugin #{plugin.name} removed."
