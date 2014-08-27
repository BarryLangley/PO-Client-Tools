do ->
    clearDuplicateCommas = /,,/g

    confetti.command 'translate', ['translate [message]:[to language code]-[from language code]', "Translates a message from a language to another one. [from language code] is optional and might even be ignored, it's purely a hint (note the dash). Language codes are two letters, for example <b>en</b> (English), <b>es</b> (Spanish), <b>de</b> (German). A full list is available <a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table'>here</a> (ISO 639-1 language codes).", 'setmsg@translate message:to-from'], (data, chan) ->
        parts = data.split ':'
        message = parts[0]

        languageParts = (parts[1] or '').split '-'
        to = languageParts[0]
        from = languageParts[1] or ''

        unless message and to
            return confetti.msg.bot "You have to specify a message and a language to translate to (message:es, for example)."

        url = "http://translate.google.com/translate_a/t?client=t&text=#{encodeURIComponent(message)}&hl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&trs=1&ssel=3&tsel=6&sc=1&tl=#{encodeURIComponent(to)}"
        url += "&sl=#{encodeURIComponent(from)}" if from

        sys.webCall url, (response) ->
            # This has to be done twice for it to work
            response = response.replace(clearDuplicateCommas, ',').replace(clearDuplicateCommas, ',')
            try
                json = JSON.parse(response)
            catch ex
                return confetti.msg.bot "Failed to translate your message -- check your internet connection", chan

            confetti.msg.bot "'#{sys.htmlEscape(message)}' is '#{sys.htmlEscape(json[0][0][0])}' in '#{to.toUpperCase()}'.", chan

    confetti.alias 'trans, tr', 'translate'
