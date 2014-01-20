do ->
    updateScript = (cb) ->
        sys.webCall confetti.scriptUrl + 'scripts.js', (file) ->
            unless file
                confetti.msg.bot "Couldn't load script, check your internet connection."
                return

            confetti.io.write sys.scriptsFolder + 'scripts.js', file
            confetti.io.reloadScript yes

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
