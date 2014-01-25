confetti.pokedex = ->
    return confetti.pokedex.data if confetti.pokedex.data

    parseDbFile = (file) ->
        res = sys.getFileContent("db/pokes/#{file}.txt")

        unless res
            return []

        return res.split '\n'

    parseMoveFile = (file) -> parseDbFile("6G/#{file}_moves")

    dumpMoves = (moveArray) ->
        obj = {}

        for move in moveArray
            unless move.trim()
                continue

            split  = move.split(":")
            space  = move.split(" ")
            pokeId = parseInt(split[0], 10)

            # Formes (41:1)
            if split[1][0] isnt "0"
                continue

            space.splice(0, 1)
            obj[pokeId] = space.join(" ")

        return obj

    dumpInfo = (infoArray, slashes = no) ->
        obj = {}

        for info in infoArray
            parts = info.split ' '
            pokemon = parts[0].split ':'

            unless pokemon[1]
                continue

            # Formes, MissingNo
            if pokemon[0][0] is '0' or pokemon[1][0] isnt '0'
                continue

            num = parts[1]
            if slashes
                if num.indexOf('/') isnt -1
                    num = num.split('/')[0]

            obj[+pokemon[0]] = +num

        return obj

    Pokedex =
        # Object[String pokeName->Object pokeInfo]
        data: {}
        files:
            stats: parseDbFile("6G/stats")
            weight: parseDbFile("weight")
            height: parseDbFile("height")
            evos: parseDbFile("evos")
            evolevels: parseDbFile("6G/minlevels")
            genders: parseDbFile("gender")
            cc: parseDbFile("level_balance")

            egggroup1: parseDbFile("egg_group_1")
            egggroup2: parseDbFile("egg_group_2")

            moves:
                #dw: parseMoveFile("dw")
                egg: parseMoveFile("egg")
                level: parseMoveFile("level")
                evo: parseMoveFile("pre_evo")
                event: parseMoveFile("special")
                tms: parseMoveFile("tm_and_hm")
                tutor: parseMoveFile("tutor")

    dexFiles = Pokedex.files
    moveFiles = dexFiles.moves

    # Prepare certain files
    pokeWeight = dumpInfo(dexFiles.weight)
    pokeHeight = dumpInfo(dexFiles.height)
    pokeGender = dumpInfo(dexFiles.genders)
    # Minimum level
    pokeEvoLevel = dumpInfo(dexFiles.evolevels, yes)

    # Moves
    # Object[String pokeId->Array[String] moveNums]
    # moveNums is a string of numbers separated with a space.
    #dwMoves = dumpMoves(moveFiles.dw)
    eggMoves = dumpMoves(moveFiles.egg)
    levelMoves = dumpMoves(moveFiles.level)
    evoMoves = dumpMoves(moveFiles.evo)
    eventMoves = dumpMoves(moveFiles.event)
    tmMoves = dumpMoves(moveFiles.tms)
    tutorMoves = dumpMoves(moveFiles.tutor)

    # Filled later on, same structure.
    pokeMoves = {};

    # Pokemon with a second egg group. Object[String pokeId->String eggGroup]
    eggGroup2Pokes = {}

    # Challenge Cup levels. Object[String pokeId->Number ccLevel]
    ccLevels = {}

    pokeEvolutions = {}

    # Bogus iteration variable
    pokeId = 718

    # High speed loop
    while pokeId
        uniqueMoves = []

        # Start with level moves.
        moves = [levelMoves[pokeId]]

        # Then Dream World moves, Egg moves, Event moves, Evolution moves, Tutor moves, and TM moves
        #if dwMoves.hasOwnProperty(pokeId)
            #moves.push dwMoves[pokeId]

        if eggMoves.hasOwnProperty(pokeId)
            moves.push eggMoves[pokeId]

        if eventMoves.hasOwnProperty(pokeId)
            moves.push eventMoves[pokeId]

        if evoMoves.hasOwnProperty(pokeId)
            moves.push evoMoves[pokeId]

        if tutorMoves.hasOwnProperty(pokeId)
            moves.push tutorMoves[pokeId]

        if tmMoves.hasOwnProperty(pokeId)
            moves.push tmMoves[pokeId]

        # Construct a list of unique moves (sometimes multiple categories have the same move).
        for movelist in moves
            categoryMoves = movelist.split ' '

            for moveNum in categoryMoves
                move = +moveNum

                if uniqueMoves.indexOf(move) is -1
                    uniqueMoves.push move

        pokeMoves[pokeId] = uniqueMoves
        pokeId -= 1

    # Checking Challenge Cup levels.
    for poke, i in dexFiles.cc
        space = poke.split ' '
        split = space[0].split ':'

        unless space[1]
            continue

        pokenum  = +split[0]
        pokeName = sys.pokemon pokenum

        # Missingno & formes
        if poke[0] is '0' or split[1][0] isnt '0'
            continue

        # Space will be something like ["num:0", "minlvl"]
        ccLevels[pokenum] = +space[1]

    # Evolutions
    for poke, i in dexFiles.evos
        split = poke.split " "
        pokeNum = +split[0]
        nextPoke = dexFiles.evos[i + 1]
        pokeName = sys.pokemon pokeNum

        nextPoke = nextPoke.split ' ' if nextPoke

        # Two evolutions
        if nextPoke and +split[1] is +nextPoke[0]
            pokeEvolutions[pokeNum] = [split[1], nextPoke[1]]
        # Feebas evolution bug (still not fixed...)
        else if split.length is 3 and split[1] is split[2]
            pokeEvolutions[pokeNum] = [split[1]]
        # Single evolution
        else if split.length isnt 2
            split.splice(0, 1)
            pokeEvolutions[pokeNum] = split
        # Single evolution also
        else if (+split[0] + 1) is +split[1]
            pokeEvolutions[pokeNum] = [split[1]]

    # Done!

    # Get egg group 2 from Pokémons which do have it.
    for poke in dexFiles.egggroup2
        poke = poke.split ' '

        # Missingno
        if poke is '0'
            continue

        # poke[0] is the pokeId, poke[1] is the egg group.
        eggGroup2Pokes[poke[0]] = poke[1]

    # Reset pokeId, as we're going to use it again
    pokeId = 0

    # Generate most of the stats, most expensive operation.
    for stat in dexFiles.stats
        poke = stat.split ':'

        # Invalid (EOF)
        unless poke[1]
            break

        # Formes, Missingno
        if poke[1][0] isnt '0' or poke[0] is '0'
            continue

        pokeId += 1
        pokeName = sys.pokemon pokeId

        stats = (+pokestat for pokestat in stat.split ' ')
        stats.splice(0, 1)

        eggGroup1 = ''
        eggGroup2 = ''

        # Egg Group stuff
        if dexFiles.egggroup1.hasOwnProperty(pokeId)
            eggGroup1 = dexFiles.egggroup1[pokeId].split(' ').splice(1).join(' ')

        if eggGroup2Pokes.hasOwnProperty(pokeId)
            eggGroup2 = eggGroup2Pokes[pokeId]

        # Generate the data.
        Pokedex.data[pokeName] =
            weight: pokeWeight[pokeId]
            height: pokeHeight[pokeId]
            minlvl: pokeEvoLevel[pokeId]
            genders: pokeGender[pokeId]
            egg: [eggGroup1, eggGroup2]
            moves: pokeMoves[pokeId]
            cc: ccLevels[pokeId]
            evos: pokeEvolutions[pokeId]

            stats:
                HP: stats[0]
                ATK: stats[1]
                DEF: stats[2]
                SPATK: stats[3]
                SPDEF: stats[4]
                SPD: stats[5]

    confetti.pokedex.data = Pokedex
    return Pokedex
