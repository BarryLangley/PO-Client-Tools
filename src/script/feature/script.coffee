do ->
    autoUpdate = ->
        return if confetti.cache.get('autoupdate') is no
        return if sys.isSafeScripts()

        now = +sys.time()
        # Check every 6 hours
        if (confetti.cache.get('lastupdatetime') + (6 * 60 * 60)) > now
            return

        sys.webCall "#{confetti.scriptUrl}script/version.json", (resp) ->
            confetti.cache.store('lastupdatetime', now).save()
            try
                json = JSON.parse resp
            catch ex
                return

            if differentVersion(confetti.version, json)
                updateScript()

    versionFormat = (version) ->
        version.release + '.' + version.major + '.' + version.minor

    differentVersion = (ov, nv) ->
        return no if typeof ov isnt 'object' or typeof nv isnt 'object'

        versionFormat(ov) isnt versionFormat(nv)

    updateScript = ->
        oldVersion = {release: confetti.version.release, major: confetti.version.major, minor: confetti.version.minor}
        sys.webCall confetti.scriptUrl + 'scripts.js', (file) ->
            unless file
                confetti.msg.bot "Couldn't load script, check your internet connection."
                return

            confetti.io.write sys.scriptsFolder + 'scripts.js', file
            confetti.io.reloadScript yes

            sys.setTimer ->
                if differentVersion(oldVersion, confetti.version)
                    confetti.msg.bot "Script updated to version #{versionFormat(confetti.version)}!"
                else
                    confetti.msg.bot "Script updated!"
            , 100, no

    # Check in 15 seconds (in case the player often relogs, it will never have a chance to update), and every 10m afterwards.
    # This timer is pretty painless, so it could be less.
    sys.setTimer autoUpdate, 15 * 1000, no
    sys.setTimer autoUpdate, 10 * 60 * 1000, yes

    confetti.hook 'initCache', ->
        confetti.cache
            .store('autoupdate', yes, confetti.cache.once)
            .store('lastupdatetime', +sys.time(), confetti.cache.once)

    confetti.command 'scriptcommands', ['Shows various commands related to the script.', 'send@scriptcommands'], (_, chan) ->
        {header, border, cmd} = confetti.commandList

        border no, chan

        header 'Script Commands', 5, chan
        cmd 'updatescript', chan
        cmd 'autoupdate', chan
        cmd 'version', chan

        confetti.callHooks 'commands:script'

        border yes, chan

    confetti.command 'updatescript', ['Updates the script to the latest available version.', 'send@updatescript'], ->
        if sys.isSafeScripts()
            confetti.msg.bot "Please disable Safe Scripts before using this command."
            return

        confetti.msg.bot "Updating script..."
        updateScript()

    confetti.alias 'updatescripts', 'updatescript'

    confetti.command 'autoupdate', ["Toggles whether if the script should automatically look for updates (every 6 hours).", 'send@autoupdate'], ->
        confetti.cache.store('autoupdate', !confetti.cache.read('autoupdate')).save()
        confetti.msg.bot "Automatic updates are now #{if confetti.cache.read('autoupdate') then 'enabled' else 'disabled'}."

    confetti.command 'version', ["Shows the script's version.", 'send@version'], ->
        confetti.msg.bot "Your copy of Confetti is currently on version #{versionFormat(confetti.version)}."
