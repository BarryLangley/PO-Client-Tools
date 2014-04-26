do ->
    # Taken from PO's source code.
    statRanges = [30, 50, 60, 70, 80, 90, 100, 200, 300]
    statTotalRanges = [150, 250, 300, 350, 400, 450, 500, 630, 720]
    statColors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"]
    stats = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"]

    moveColors =
        0: "#a8a878"
        1: "#c03028"
        2: "#a890f0"
        3: "#a040a0"
        4: "#e0c068"
        5: "#b8a038"
        6: "#a8b820"
        7: "#705898"
        8: "#b8b8d0"
        9: "#f08030"
        10: "#6890f0"
        11: "#78c850"
        12: "#f8d030"
        13: "#f85888"
        14: "#98d8d8"
        15: "#7038f8"
        16: "#705848"
        17: "#f088f6"
        18: "#68a090"

    pokeGender = (data) ->
        gender = data.genders

        # Dual gender
        if gender is 3
            return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>"

        # 2, 1, 0: single gender
        return "<img src='Themes/Classic/genders/gender#{gender}.png'>"

    firstGen = (poke) ->
        if poke <= 151
            return 1
        else if poke <= 251
            return 2
        else if poke <= 386
            return 3
        else if poke <= 493
            return 4
        else if poke <= 649
            return 5
        else
            return 6

    evosOf = (data) ->
        evos = data.evos or []
        result = []
        for evo in evos
            pokeName = sys.pokemon evo
            result.push "<b><a href='http://veekun.com/dex/pokemon/#{pokeName}' style='color: #{moveColors[sys.pokeType1(evo)]}'>#{pokeName}</a></b>"

        return confetti.util.fancyJoin(result)

    pokeType = (pokeId) ->
        type1 = sys.pokeType1 pokeId
        type2 = sys.pokeType2 pokeId
        result = ''

        typeName = sys.type type1
        result += "<b><a href='http://veekun.com/dex/types/#{typeName}' style='color: #{moveColors[type1]}'>#{typeName}</a></b>"

        if type2 isnt 18
            typeName = sys.type type2
            result += " & <b><a href='http://veekun.com/dex/types/#{typeName}' style='color: #{moveColors[type2]}'>#{typeName}</a></b>"

        return result

    pokeAbilities = (pokeId) ->
        abilities = [
            sys.pokeAbility(pokeId, 0)
            sys.pokeAbility(pokeId, 1)
            sys.pokeAbility(pokeId, 2)
        ]
        result = ''

        abilityName = sys.ability(abilities[0])
        result += "<b><a href='http://veekun.com/dex/abilities/#{encodeURIComponent(abilityName)}' style='color: black;'>#{abilityName}</a></b>"
        if abilities[1] isnt 0
            abilityName = sys.ability(abilities[1])
            result += " | <b><a href='http://veekun.com/dex/abilities/#{encodeURIComponent(abilityName)}' style='color: black;'>#{abilityName}</a></b>"
        if abilities[2] isnt 0
            abilityName = sys.ability(abilities[2])
            result += " | <b><a href='http://veekun.com/dex/abilities/#{encodeURIComponent(abilityName)}' style='color: black;'>#{abilityName}</a></b> (<u>Hidden Ability</u>)"
        return result

    movesOf = (data) ->
        moves = data.moves.sort (a, b) -> sys.moveType(b) - sys.moveType(a)
        result = []

        for move in moves
            moveName = sys.move(move)
            result.push "<small><b><a href='http://veekun.com/dex/moves/#{encodeURIComponent(moveName)}' style='color: #{moveColors[sys.moveType(move)]}'>#{moveName}</b></small>"

        return result.join(', ') + '.'

    baseStatTotal = (data) ->
        total = 0
        for _, stat of data.stats
            total += stat

        for range, i in statTotalRanges
            if total <= range
                return "<b style='color: #{statColors[i]}'>#{total}</b>"

        return "<b style='color: #{statColors.slice(-1)}'>#{total}</b>"

    formatStat = (data, stat) ->
        value = data.stats[stat]

        for range, i in statRanges
            if value <= range
                return "<b style='color: #{statColors[i]}'>#{value}</b>"

        return "<b style='color: #{statColors.slice(-1)}'>#{value}</b>"

    statsOf = (data) ->
        result = ""
        for stat in stats
            result += stat + ": " + formatStat(data, stat)
            result += " | " if stat isnt 'SPD'

        return result

    weightDamage = (weight) ->
        damage = 0
        color  = ""

        if weight >= 200
            damage = 120
            color  = "#6c92bd"
        else if weight >= 100
            damage = 100
            color  = "#5ee70a"
        else if weight >= 50
            damage = 80
            color  = "#b9d749"
        else if weight >= 25
            damage = 60
            color  = "#ffaf49"
        else if weight >= 10
            damage = 40
            color  = "#fd5300"
        else
            damage = 20
            color  = "#ff0505"

        return "<b style='color: #{color}'>#{damage}</b>"

    confetti.pokedex.render = (pokemon, chan) ->
        pokeId = sys.pokeNum(pokemon)
        data = confetti.pokedex().data[pokemon]
        multiType = (sys.pokeType2(pokeId) isnt 18)
        multiAbility = (sys.pokeAbility(pokeId, 1) isnt 0)

        template = [
            "<font color='cornflowerblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>"
            "<br><font size='5'><b><a href='http://veekun.com/dex/pokemon/#{pokemon}' style='color: #{moveColors[sys.pokeType1(pokeId)]}'>#{pokemon}</a></b></font>"
        ]

        # Sprites
        template.push "<img src='pokemon:num=#{pokeId}'> <img src='pokemon:num=#{pokeId}&back=true'> <img src='pokemon:num=#{pokeId}&shiny=true'> <img src='pokemon:num=#{pokeId}&shiny=true&back=true'><br>"

        # Gender icon
        template.push  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + pokeGender(data)

        template.push "National Dex Number: <b>#{pokeId}</b>"
        template.push "Generation <b>#{firstGen(pokeId)}</b> Pokémon."

        # Add a white line if the pokemon has evolutions or it's min level isn't 1 or 100.
        if data.evos or (data.minlvl isnt 1 and data.minlvl isnt 100)
            template.push ""

        if data.evos
            template.push "Evolution#{if data.evos.length is 1 then 's' else ''}: " + evosOf(data)

        if data.minlvl isnt 1 and data.minlvl isnt 100
            template.push "Minimum Level: <b>#{data.minlvl}</b>"

        template.push "Level in Challenge Cup: <b>#{data.cc}</b><br>"

        template.push "Type#{if multiType then 's' else ''}: " + pokeType(pokeId)

        eggInfo = ""
        if data.egg[0]
            eggInfo += "<b>#{data.egg[0]}</b>"

        if data.egg[1]
            eggInfo += " #{if data.egg[0] then 'and' else ''} <b>#{data.egg[1]}</b>"

        if eggInfo
            template.push "Egg Group#{if data.egg[1] then 's' else ''}: " + eggInfo

        template.push "Abilit#{if multiAbility then 'ies' else 'y'}: #{pokeAbilities(pokeId)}<br>"

        template.push "Weight: <b>#{data.weight}kg</b>"
        template.push "Height <b>#{data.height}m</b>"
        template.push "Weight Attack Damage: <b>#{weightDamage(data.weight)}</b><br>"

        template.push statsOf(data)
        template.push "Base Stat Total: " + baseStatTotal(data)

        if pokemon isnt 'Smeargle'
            template.push "<br> " + movesOf(data)
        else
            template.push "<br> Smeargle learns all moves but Chatter and Transform."

        template.push "<br><timestamp/><br><font color='cornflowerblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>"

        confetti.msg.html template.join("<br>"), chan
