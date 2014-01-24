do ->
    confetti.command 'pokedex', ['pokedex [pokemon?]', 'Shows a Pokédex entry for the given Pokémon, or a random one if none was given. This command will cause lag when first used in this session.', 'setmsg@pokedex [pokemon]'], (data, chan) ->
        forme = data.indexOf '-'
        if forme isnt -1
            data = data.substr 0, forme

        num = sys.pokeNum(data)
        unless num
            data = parseInt(data, 10)
            pokeName = sys.pokemon(data)

            data = pokeName if pokeName
        else
            data = sys.pokemon(num) # Corrects case, necessary for the dex to work.
        unless data
            confetti.msg.bot "You have to give me a word to define!"
            return

        try
            confetti.pokedex.render(data, chan)
        catch ex
            confetti.msg.bot "Selecting an entry at random."
            confetti.pokedex.render(sys.pokemon(sys.rand(1, 719)), chan)

    confetti.alias 'dex', 'pokedex'

    confetti.hook 'commands:misc', ->
        confetti.commandList.cmd 'pokedex'
