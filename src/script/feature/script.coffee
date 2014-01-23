do ->
    differentVersion = (ov, nv) ->
        return no if typeof ov isnt 'object' or typeof nv isnt 'object'
        ov.release isnt nv.release || ov.major isnt nv.major || ov.minor isnt nv.minor
    updateScript = ->
        oldVersion = {release: confetti.version.release, major: confetti.version.major, minor: confetti.version.minor}
        sys.webCall confetti.scriptUrl + 'scripts.js', (file) ->
            unless file
                confetti.msg.bot "Couldn't load script, check your internet connection."
                return

            confetti.io.write sys.scriptsFolder + 'scripts.js', file
            confetti.io.reloadScript yes

            newVersion = confetti.version
            if differentVersion(oldVersion, newVersion)
                confetti.msg.bot "Script updated to version #{newVersion.release}.#{newVersion.major}.#{newVersion.minor}!"
            else
                confetti.msg.bot "Script updated!"

    confetti.command 'scriptcommands', ['Shows various commands related to the script.', 'send@scriptcommands'], (_, chan) ->
        confetti.commandList.border no, chan

        confetti.commandList.header 'Script Commands', 5, chan
        confetti.commandList.cmd 'updatescript', chan

        confetti.callHooks 'commands:script'

        confetti.commandList.border yes, chan

    confetti.command 'updatescript', ['Updates the script to the latest available version.', 'send@updatescript'], ->
        if sys.isSafeScripts()
            confetti.msg.bot "Please disable Safe Scripts before using this command."
            return

        confetti.msg.bot "Updating script..."
        updateScript()

    confetti.alias 'updatescripts', 'updatescript'
