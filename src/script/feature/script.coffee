do ->
    changelog =
        '2.0.0': 'Initial version of Confetti. Features encool, player blocking, friends, alias tracking, auto reconnect, plugins, and more.'
        '2.0.1': 'Improved news.'
        '2.0.2': 'Various usability improvements.'
        '2.0.3': 'Pokedex plugin, automatic updating.'
        '2.0.4': 'AoC Taunts plugin.'
        '2.0.5': 'Bug fixes for tracking and reconnect.'
        '2.0.6': 'More reconnect fixes, news and define improvements, removed dictionary.'
        '2.0.7': 'Emoji plugin.'
        '2.0.8': 'Plugin auto-updating and versions.'
        '2.0.9': 'Changelog, usability improvements, fullwidth encool, updated script urls.'
        '2.0.10': 'Pok&eacute;mon Usage Statistics plugin, auth symbols, flashwords.'

    autoUpdate = ->
        return if confetti.cache.get('autoupdate') is no
        return if sys.isSafeScripts()

        now = sys.time()
        # Check every 6 hours
        if (confetti.cache.get('lastupdatetime') + (6 * 60 * 60)) > now
            return

        confetti.updatePlugins()
        sys.webCall "#{confetti.scriptUrl}script/version.json", (resp) ->
            confetti.cache.store('lastupdatetime', now).save()
            try
                json = JSON.parse resp
            catch ex
                return

            if differentVersion(confetti.version, json)
                updateScript()

    versionFormat = (version) -> version.release + '.' + version.major + '.' + version.minor
    differentVersion = (ov, nv) -> versionFormat(ov) isnt versionFormat(nv)

    updateScript = ->
        sys.webCall confetti.scriptUrl + 'scripts.js', (file) ->
            unless file
                return confetti.msg.bot "Couldn't load script, check your internet connection."

            confetti.io.write sys.scriptsFolder + 'scripts.js', file
            confetti.io.reloadScript yes
            confetti.msg.bot "Script updated!"

    # Check in 15 seconds (in case the player often relogs, it will never have a chance to update), and every 10m afterwards.
    # This timer is pretty painless, so it could be less.
    sys.setTimer autoUpdate, 15 * 1000, no
    sys.setTimer autoUpdate, 10 * 60 * 1000, yes

    confetti.changelog = changelog
    confetti.autoUpdate = autoUpdate
    confetti.updateScript = updateScript
    confetti.hook 'initCache', ->
        confetti.cache
            .store('autoupdate', yes, confetti.cache.once)
            .store('lastupdatetime', sys.time(), confetti.cache.once)

    confetti.command 'scriptcommands', ['Shows various commands related to Confetti.', 'send@scriptcommands'], ->
        new confetti.CommandList("Script Commands")
            .cmds('updatescript autoupdate changelog version').hooks('script')

    confetti.command 'updatescript', ['Updates the script to the latest available version.', 'send@updatescript'], ->
        if sys.isSafeScripts()
            return confetti.msg.bot "Please disable Safe Scripts before using this command."

        confetti.msg.bot "Updating script..."
        updateScript()

    confetti.alias 'updatescripts', 'updatescript'

    confetti.command 'autoupdate', ["Toggles whether if the script should automatically look for updates (every 6 hours).", 'send@autoupdate'], ->
        confetti.cache.store('autoupdate', !confetti.cache.read('autoupdate')).save()
        confetti.msg.bot "Automatic updates are now #{if confetti.cache.read('autoupdate') then 'enabled' else 'disabled'}."

    confetti.command 'version', ["Shows the script's version.", 'send@version'], ->
        vers = versionFormat(confetti.version)
        confetti.msg.bot "Your copy of Confetti is currently on version #{vers}."
        if changelog[vers]
            confetti.msg.bot "What's new: #{changelog[vers]}"

    confetti.command 'changelog', ["Shows a changelog containing the major changes in each version.", 'send@changelog'], ->
        for ver, msg of changelog
            confetti.msg.bot "#{ver}: #{msg}"
