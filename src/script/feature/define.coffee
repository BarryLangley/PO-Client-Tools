do ->
    confetti.command 'define', ['define [term]', 'Attempts to find a definition for the given term.', 'setmsg@define [term]'], (data, chan) ->
        unless data
            confetti.msg.bot "You need to give me a term!"
            return

        confetti.msg.bot "Loading definition..."
        sys.webCall "http://api.urbandictionary.com/v0/define?term=#{encodeURIComponent(data)}", (response) ->
            unless response
                confetti.msg.bot "Couldn't load the definition - your internet might be down.", chan
                return

            try
                json = JSON.parse response
            catch ex
                confetti.msg.bot "Couldn't load the definition - your internet might be down.", chan
                return

            list = json.list
            if json.result_type is 'no_results'
                confetti.msg.bot "I couldn't find anything for #{data}!"
                return

            entry = confetti.util.random list
            examples = entry.example.split '\n'

            def = entry.definition or ''
            if def.trim()
                confetti.msg.bold data, sys.htmlEscape(def), chan

            for example in examples
                if example.trim()
                    confetti.msg.html "&nbsp;&nbsp;&nbsp;&nbsp;<b>→</b> #{sys.htmlEscape(example)}", chan

            return null
