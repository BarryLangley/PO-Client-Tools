do ->
    confetti.command 'dictionary', ['dictionary [word]', 'Searches for the given word in an online dictionary.', 'setmsg@dictionary [word]'], (data, chan) ->
        unless data
            confetti.msg.bot "You have to give me a word to define!"
            return

        # Callback function
        getResults = (code, resultCode) ->
            unless code.primaries
                confetti.msg.bot "Couldn't find any definitions for #{code.query}.", chan
                return

            confetti.msg.bold code.query, (code.primaries[0].entries[1] or code.primaries[0].entries[0]).terms[0].text, chan

        confetti.msg.bot "Loading definition..."
        sys.webCall "http://www.google.com/dictionary/json?callback=getResults&sl=en&tl=en&q=#{encodeURIComponent(data)}", (response) ->
            response = ")" unless response # Lazy failure
            try
                # The response is JSONP, so we eval it.
                eval response
            catch ex
                confetti.msg.bot "Couldn't load a definition, check your internet connection.", chan

    confetti.alias 'dict', 'dictionary'
