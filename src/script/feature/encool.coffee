do ->
    normalLetters = 'qwertyuiopasdfghjklzxcvbnm'.split ''
    smallcapsLetters = 'ǫᴡᴇʀᴛʏᴜɪᴏᴘᴀsᴅғɢʜᴊᴋʟᴢxᴄᴠʙɴᴍ'.split ''
    smallcapsConvert = {}

    for chr, index in normalLetters
        smallcap = smallcapsLetters[index]
        smallcapsConvert[chr] = smallcap
        smallcapsConvert[chr.toUpperCase()] = smallcap

    smallcapsify = (msg) ->
        str = []
        for letter, index in msg
            convert = smallcapsConvert[letter]
            if convert
                str[index] = convert
            else
                str[index] = letter
        return str.join ''

    l33tify = (msg) ->
        # English-to-l33t Translator (c) 2004-2006 by Lee W. Fastenau
        msg
            .replace(/\b(hacker|coder|programmer)(s|z)?\b/gi, 'haxor$2')
            .replace(/\b(hack)(ed|s|z)?\b/gi, 'haxor$2')
            .replace(/\b(thank you)\b/gi, 'TY')
            .replace(/\b(luv|love|wuv|like)(s|z)?\b/gi, 'wub$2')
            .replace(/\b(software)(s|z)?\b/gi, 'wares')
            .replace(/\b((is|are|am) +(cool|wicked|awesome|great))\b/gi, 'rocks')
            .replace(/\b((is|are|am) +(\w+) +(cool|wicked|awesome|great))\b/gi, '$3 rocks')
            .replace(/\b(very|extremely)\b/gi, 'totally')
            .replace(/\b(because)\b/gi, 'coz')
            .replace(/\b(due to)\b/gi, 'coz of')
            .replace(/\b(is|am)\b/gi, 'be')
            .replace(/\b(are)\b/gi, 'is')
            .replace(/\b(rock)(s|z)?\b/gi, 'roxor$2')
            .replace(/\b(porn(o(graph(y|ic))?)?)\b/gi, 'pron')
            .replace(/\b(lamer|dork|jerk|moron|idiot)\b/gi, 'loser')
            .replace(/\b(an loser)\b/gi, 'a loser')
            .replace(/\b(what('s)?)\b/gi, 'wot')
            .replace(/\b(that)\b/gi, 'dat')
            .replace(/\b(this)\b/gi, 'dis')
            .replace(/\b(hooray|yippee|yay|yeah)\b/gi, 'woot')
            .replace(/\b(win|own)(s|z)?\b/gi, 'pwn$2')
            .replace(/\b(won|owned)\b/gi, 'pwnt')
            .replace(/\b(suck)(ed|s|z)?\b/gi, 'suxor$2')
            .replace(/\b(was|were|had been)/gi, 'wuz')
            .replace(/\b(elite)/gi, 'leet')
            .replace(/\byou\b/gi, 'joo')
            .replace(/\b(man|dude|guy|boy)(s|z)?\b/gi, 'dood$2')
            .replace(/\b(men)\b/gi, 'doods')
            .replace(/\bstarbucks?\b/gi, 'bizzo')
            .replace(/\b(the)\b/gi, 'teh')
            .replace(/(ing)\b/gi, 'in\'')
            .replace(/\b(stoked|happy|excited|thrilled|stimulated)\b/gi, 'geeked')
            .replace(/\b(unhappy|depressed|miserable|sorry)\b/gi, 'bummed out')
            .replace(/\b(and|an)\b/gi, 'n')
            .replace(/\b(your|hey|hello|hi)\b/gi, 'yo')
            .replace(/\b(might)\b/gi, 'gonna')
            .replace(/\blater\b/gi, 'l8r')
            .replace(/\bare\b/gi, 'R')
            .replace(/\bbe\b/gi, 'b')
            .replace(/\bto\b/gi, '2')
            .replace(/\ba\b/gi, '@')
            .replace(/(\S)l/g, '$1L')
            .replace(/(\S)l/g, '$1L') # Twice to catch "LL"
            .replace(/a/gi, '4')
            .replace(/\bfor\b/gi, '4')
            .replace(/e/gi, '3')
            .replace(/i/gi, '1')
            .replace(/o/gi, '0')
            .replace(/s\b/gi, 'z')

    encoolHandlers =
        none: (msg) -> msg
        spaces: (msg) -> msg.split('').join(' ')
        smallcaps: (msg) -> smallcapsify msg
        leet: (msg) -> l33tify msg
        l33t: (msg) -> l33tify msg
        reverse: (msg) -> msg.split('').reverse().join('')

    encool = (msg, type = confetti.cache.read('encool')) ->
        encoolHandlers[type or 'none'](msg)

    confetti.encool = encool
    confetti.encool.register = (type, handler) -> encoolHandlers[type] = handler

    confetti.hook 'initCache', ->
        confetti.cache.store('encool', 'none', confetti.cache.once)

    confetti.hook 'manipulateOwnMessage', (message, chan, dirty) ->
        mess = encool(message)
        dirty = dirty or (mess isnt message)

        [mess, chan, dirty]

    confetti.command 'encool', ['encool [type]', 'Changes your encool type to (none, space, smallcaps, leet, reverse).', 'setmsg@encool [type]'], (data) ->
        data = data.toLowerCase()

        if !(data in ['none', 'spaces', 'smallcaps', 'leet', 'l33t', 'reverse'])
            confetti.msg.bot "That doesn't look right to me!"
            confetti.msg.bot "Use one of the following types: none, spaces, smallcaps, leet, reverse"
            return

        if confetti.cache.read('encool') is data
            confetti.msg.bot "Your encool type is already #{data}!"
            return

        confetti.cache.store('encool', data).save()
        confetti.msg.bot "Your encool type is now #{data}!"
