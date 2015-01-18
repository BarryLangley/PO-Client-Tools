# AoC Taunts plugin
do ->
    # Disable a taunt by setting its source to -
    # .wav is automatically appended
    taunts = [
        '-'
        '01 Yes'
        '02 No'
        '03 Food, please'
        '04 Wood, please'
        '05 Gold, please'
        '06 Stone, please'
        '07 Ahh'
        '08 All hail'
        '09 Oooh'
        '10 Back to Age 1'
        '11 Herb laugh'
        '12 Being rushed'
        '13 Blame your isp'
        '14 Start the game'
        "15 Don't Point That Thing"
        '16 Enemy Sighted'
        '17 It Is Good'
        '18 I Need a Monk'
        '19 Long Time No Siege'
        '20 My granny'
        "21 Nice Town I'll Take It"
        '22 Quit Touchin'
        '23 Raiding Party'
        '24 Dadgum'
        '25 Smite Me'
        '26 The wonder'
        '27 You play 2 hours'
        '28 You Should See The Other Guy'
        '29 Roggan'
        '30 Wololo'
        '31 Attack an Enemy Now'
        '32 Cease Creating Extra Villagers'
        '33 Create Extra Villagers'
        '34 Build a Navy'
        '35 Stop Building a Navy'
        '36 Wait for My Signal to Attack'
        '37 Build a Wonder'
        '38 Give Me Your Extra Resources'
        '39 Ally'
        '40 Enemy'
        '41 Neutral'
        '42 What Age Are You In'
    ]

    checkTaunts = (verbose = yes) ->
        if sys.filesForDirectory('aoctaunts')
            return yes

        if verbose
            confetti.msg.bot "<a href='https://github.com/caresx/PO-Client-Tools/releases/download/2.0.4/aoctaunts.zip'>AoC Taunts need to be downloaded</a> <small>(2.8 MB)</small> and placed in your PO directory (typically <i>C:\\Program Files (x86)\\Pokemon Online\\</i> on Windows). Copy the <i>aoctaunts</i> directory into your PO directory instead of simply extracting."
            confetti.msg.bot "Once that's done, a message starting with the numbers 1-42 in chat and PM will play the taunt."
        return no

    playTaunt = (message) ->
        unless confetti.cache.get('aoctaunts') is on
            return

        # parseInt will get rid of any trailing gibberish
        taunt = parseInt(message, 10)
        file = taunts[taunt]

        if file and file isnt '-'
            if checkTaunts()
                sys.playSound "aoctaunts/#{file}.wav"

    confetti.taunts ?= {}
    confetti.taunts.aoc =
        play: playTaunt
        check: checkTaunts

    confetti.command 'aoctaunts', ["Toggles whether if AoC taunts should be enabled.", 'send@aoctaunts'], ->
        checkTaunts()

        confetti.cache.store('aoctaunts', !confetti.cache.read('aoctaunts')).save()
        confetti.msg.bot "AoC Taunts are now #{if confetti.cache.read('aoctaunts') then 'enabled' else 'disabled'}."

    confetti.hook 'commands:misc', (template) ->
        template.cmd 'aoctaunts'

    confetti.hook 'manipulateChanPlayerMessage', (from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty) ->
        playTaunt(playerMessage)
        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty]

    confetti.hook 'pmReceived', (src, message) ->
        playTaunt(message)

    confetti.hook 'manipulateOwnPM', (tar, message, dirty) ->
        playTaunt(message)
        [tar, message, dirty]

    confetti.initFields {aoctaunts: yes}
    checkTaunts()
