do ->
    findPlugin = (id, plugins = confetti.cache.get('plugins')) ->
        id = id.toLowerCase()

        for plugin in plugins
            if plugin.id is id or plugin.name.toLowerCase() is id
                return plugin

        return null
    hasPlugin = (id, plugins) -> findPlugin(id, plugins) isnt null

    confetti.command 'plugins', ["Displays a list of enabled and available plugins.", 'send@plugins'], ->
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
                confetti.msg.bot "Couldn't load available plugins listing -- check your internet connection."
                return

            if json.length is 0
                confetti.msg.bot "No plugins are available."
                return

            confetti.msg.bold "Available Plugins"

            html = ""
            for plugin in json
                addremove = ""

                unless hasPlugin(plugin.id, plugins)
                    addremove = "<small>[<a href='po:send/#{confetti.cache.get('commandindicator')}addplugin #{plugin.name}' style='text-decoration: none; color: black;'>add</a>]</small>"
                else
                    addremove = "<small>[<a href='po:send/#{confetti.cache.get('commandindicator')}removeplugin #{plugin.name}' style='text-decoration: none; color: black;'>remove</a>]</small>"

                html += "#{confetti.msg.bullet} <b>#{plugin.name}</b> (#{plugin.id}) #{addremove}"

            confetti.msg.html html

    # TODO: Make loading/unloading easier (automatic).
    confetti.command 'addplugin', ['addplugin [plugin]', "Adds a plugin.", 'setmsg@addplugin [name]'], (data) ->
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
                confetti.msg.bot "Couldn't load available plugins listing -- check your internet connection."
                return

            if json.length is 0
                confetti.msg.bot "No plugins are available."
                return

            plugin = findPlugin data, json
            if plugin is null
                confetti.msg.bot "That plugin is not available! Use the 'plugins' command to see a list of available plugins."
                return

            confetti.msg.bot "Downloading plugin #{plugin.name}..."
            sys.webCall "#{confetti.pluginsUrl}#{plugin.id}/#{plugin.id}.js", (file) ->
                if not file
                    confetti.msg.bot "Couldn't load plugin source -- check your internet connection."
                    return

                sys.writeToFile "#{confetti.dataDir}plugin-#{plugin.id}.js", file

                plugins.push plugin
                confetti.cache.store('plugins', plugins).save()

                confetti.msg.bot "Plugin #{plugin.name} added! Reload to see the effects."

    confetti.command 'removeplugin', ['removeplugin [plugin]', "Removes a plugin.", 'setmsg@removeplugin [plugin]'], (data) ->
        name = data
        data = data.toLowerCase()
        plugins = confetti.cache.get 'plugins'

        unless hasPlugin(data, plugins)
            confetti.msg.bot "#{name} isn't an enabled plugin!"
            return

        plugins.splice plugins.indexOf(data), 1
        confetti.cache.store('plugins', plugins).save()

        confetti.msg.bot "#{name} was disabled. Reload to see the effects."
