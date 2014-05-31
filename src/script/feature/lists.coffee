do ->
    # Command lists
    confetti.command 'configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], ->
        new confetti.CommandList("Configuration Commands")
            .cmds('botname botcolor encool notifications commandindicator autoreconnect')
            .hooks('config')

            .whiteline()

            .cmd('defaults')
            .render()

    confetti.command 'commands', ['Shows this command list.', 'send@commands'], ->
        new confetti.CommandList("Commands")
            .group("Command Lists").cmds('commands scriptcommands plugincommands friendcommands blockcommands trackcommands flashcommands configcommands').hooks('list')
            .group("Player Symbols").cmds('authsymbols authsymbol').hooks('playersymbols')
            # Custom categories should be done in this hook, afterwards there are the misc. commands.
            .hooks('categories')
            .whiteline()

            .cmds('reconnect define translate news imp info chan pm flip myip').hooks('misc')
            .cmds('html eval').hooks('dev')
            .render()

    confetti.alias 'commandlist', 'commands'
