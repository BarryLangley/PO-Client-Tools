do ->
    # Command lists
    confetti.command 'commands', "Shows this command list.", ->
        new confetti.CommandList("Commands")
            .group("Command Lists").cmds('commands scriptcommands plugincommands friendcommands blockcommands trackcommands flashcommands configcommands').hooks('list')
            .group("Player Symbols").cmds('authsymbols authsymbol').hooks('playersymbols')
            # Custom categories should be done in this hook, afterwards there are the misc. commands.
            .hooks('categories')
            .whiteline()

            .cmds('reconnect define translate news imp info chan idle pm flip myip').hooks('misc')
            .cmds('html eval').hooks('dev')
            .render()

    confetti.alias 'commandlist', 'commands'

    confetti.command 'configcommands', "Shows various commands that change your settings.", ->
        new confetti.CommandList("Configuration")
            .cmds('botname botcolor encool notifications commandindicator autoreconnect')
            .hooks('config')

            .whiteline()

            .cmd('defaults')
            .render()

    confetti.command 'blockcommands', "Shows commands related to blocking other players.", ->
        confetti.cmdlist("Blocking", 'block unblock blocked', 'block')

    confetti.command 'plugincommands', "Shows commands related to plugins.", ->
        confetti.cmdlist("Plugins", 'plugins addplugin removeplugin updateplugins', 'plugins')

    confetti.command 'scriptcommands', "Shows commands related to Confetti (the script).", ->
        confetti.cmdlist("Confetti", 'updatescript autoupdate changelog version', 'script')

    confetti.command 'trackcommands', "Shows commands related to tracking players (such as their aliases).", ->
        confetti.cmdlist("Tracking", 'track untrack tracked trackingresolve', 'track')

    confetti.command 'flashcommands', "Shows commands related to flashes and flashwords.", ->
        confetti.cmdlist("Flashes", 'flashword removeflashword flashwords flashes', 'flash')

    confetti.command 'friendcommands', "Shows commands related to friends.", ->
        confetti.cmdlist("Friends", 'friend unfriend friends friendnotifications', 'friends')
