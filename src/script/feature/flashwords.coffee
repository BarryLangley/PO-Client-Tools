do ->
    classhilight = "<span class='name-hilight'>$1</span><ping/>"

    flashwordCategory = (word) ->
        parts = word.split('/')
        if parts.length < 3
            return {type: 'word', word}

        flags = parts.pop()
        regex = parts.slice(1)

        return {type: 'regex', regex, flags}

    confetti.command 'flashwords', ["Shows your flash words (sequences of characters that ping you when said).", 'send@flashwords'], (_, chan) ->
        flashwords = confetti.cache.get 'flashwords'
        numWords = flashwords.length

        if numWords is 0
            return confetti.msg.bot "You have no flash words."

        confetti.msg.bold "Flash words <small>[#{numWords}]</small>", '', chan

        html = ""
        for word, index in flashwords
            html += confetti.msg.bullet + " #{if flashwordCategory(word).type is 'word' then 'Word' else 'Regex'}: <b>#{word}</b> <small>[<a href='po:send/-removeflashword #{word}' style='text-decoration:none;color:black'>remove</a>]</small><br>"

        confetti.msg.html html, chan

    confetti.alias 'flashwordlist', 'flashwords'

    confetti.command 'flashword', ['flashword [word]', "Adds [word] to your flash word list. [word] may also be a <a href='http://www.regexr.com/' title='Regexr'>regular expression</a>, prefix it with <b>/</b> like so: /(word)/i. The first capture group will be the flashword.", 'setmsg@flashword word'], (data) ->
        flashwords = confetti.cache.get 'flashwords'
        unless data
            return confetti.msg.bot "Specify the flashword!"

        index = flashwords.indexOf(data)
        if index isnt -1
            return confetti.msg.bot "#{sys.htmlEscape(data)} is already in your flashwords list!"

        flashwords.push data
        confetti.cache.store('flashwords', flashwords).save()

        confetti.msg.bot "<b>#{sys.htmlEscape(data)}</b> will now ping you when said!"

    confetti.alias 'stalkword', 'flashword'
    confetti.alias 'addstalkword', 'flashword'

    confetti.command 'removeflashword', ['removeflashword [flashword]', "Removes [flashword] from your flashword list.", 'setmsg@removeflashword flashword'], (data) ->
        flashwords = confetti.cache.get 'flashwords'
        unless data
            return confetti.msg.bot "Specify the flash word!"

        index = flashwords.indexOf(data)
        if index is -1
            return confetti.msg.bot "#{sys.htmlEscape(data)} is not in your flashwords list, check the spelling!"

        flashwords.splice index, 1
        confetti.cache.store('flashwords', flashwords).save()

        confetti.msg.bot "<b>#{sys.htmlEscape(data)}</b> will no longer ping you!"

    confetti.command 'flashes', ["Toggles whether if name flashes and flash words should be enabled.", 'send@flashes'], ->
        confetti.cache.store('flashes', !confetti.cache.read('flashes')).save()
        confetti.msg.bot "Flashes are now #{if confetti.cache.read('flashes') then 'on' else 'off'}."

    confetti.alias 'rmflashword', 'removeflashword'
    confetti.alias 'unflashword', 'removeflashword'
    confetti.alias 'removestalkword', 'removeflashword'
    confetti.alias 'rmstalkword', 'removeflashword'
    confetti.alias 'unstalkword', 'removeflashword'

    confetti.hook 'initCache', ->
        confetti.cache
            .store('flashwords', [], confetti.cache.once)

    confetti.hook 'manipulateChanPlayerMessage', (from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty) ->
        if confetti.cache.get('flashes') is on
            flashwords = confetti.cache.get('flashwords')
            flashMessage = playerMessage

            for flashword in flashwords
                cat = flashwordCategory(flashword)
                if cat.type is 'word'
                    flashMessage = flashMessage.replace(new RegExp("\\b(#{confetti.util.escapeRegex(cat.word)})\\b(?![^\\s<]*>)", "i"), classhilight)
                else
                    flashMessage = flashMessage.replace(new RegExp(cat.regex, cat.flags), classhilight)

            if flashMessage isnt playerMessage
                playerMessage = flashMessage
                dirty = yes

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty]
