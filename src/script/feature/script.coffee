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
        '2.1.0': 'Reworked command lists, pm utility command.'
        '2.1.1': 'Commands split into several new command lists, nato encool mode, idle utility command.'
        '2.1.2': 'Many important bug fixes, ignorepms, teambuilder & findbattle utility commands, improved info command.'
        '2.1.3': 'Message mapping, disconnect utility command, minor fix for info command.'

    autoUpdate = ->
        return if confetti.cache.get('autoupdate') is no
        return if sys.isSafeScripts()

        now = sys.time()
        # Check every 6 hours
        if (confetti.cache.get('lastupdatetime') + (6 * 60 * 60)) > now
            return

        confetti.cache.store('lastupdatetime', now).save()

        confetti.updatePlugins()
        confetti.io.getRemoteJson "#{confetti.scriptUrl}script/version.json", "", (json) ->
            if differentVersion(confetti.version, json)
                updateScript()

    versionFormat = (version) -> version.release + '.' + version.major + '.' + version.minor
    differentVersion = (ov, nv) -> versionFormat(ov) isnt versionFormat(nv)

    updateScript = ->
        confetti.io.getRemoteFile "#{confetti.scriptUrl}scripts.js", ["Couldn't load script, check your internet connection"], (file) ->
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

    confetti.command 'updatescript', "Updates the script to the latest available version.", ->
        if sys.isSafeScripts()
            return confetti.msg.bot "Please disable Safe Scripts before using this command."

        confetti.msg.bot "Updating script..."
        updateScript()

    confetti.alias 'updatescripts', 'updatescript'

    confetti.command 'autoupdate', "Toggles whether if the script should automatically look for updates (every 6 hours).", ->
        confetti.cache.store('autoupdate', !confetti.cache.read('autoupdate')).save()
        confetti.msg.bot "Automatic updates are now #{if confetti.cache.read('autoupdate') then 'enabled' else 'disabled'}."

    confetti.command 'version', "Shows the script's version.", ->
        vers = versionFormat(confetti.version)
        confetti.msg.bot "Your copy of Confetti is currently on version #{vers}."
        if changelog[vers]
            confetti.msg.bot "What's new: #{changelog[vers]}"

    confetti.command 'changelog', "Shows a changelog containing the major changes in each version.", ->
        for ver, msg of changelog
            confetti.msg.bot "#{ver}: #{msg}"

    confetti.initFields {autoupdate: yes, lastupdatetime: sys.time()}
