do ->
    confetti.command 'define', ['define [term]', 'Attempts to find a definition for the given term.', 'setmsg@define term'], (data, chan) ->
        unless data
            return confetti.msg.bot "You need to give me a term!"

        sys.webCall "http://api.urbandictionary.com/v0/define?term=#{encodeURIComponent(data)}", (response) ->
            unless response
                return confetti.msg.bot "Couldn't load the definition - your internet might be down.", chan

            try
                json = JSON.parse response
            catch ex
                return confetti.msg.bot "Couldn't load the definition - your internet might be down.", chan

            list = json.list
            if json.result_type is 'no_results'
                return confetti.msg.bot "I couldn't find anything for #{data}!"

            entry = confetti.util.random list
            examples = entry.example.split '\n'

            def = entry.definition or ''
            if def.trim()
                confetti.msg.bold data, sys.htmlEscape(def), chan

            for example in examples
                if example.trim()
                    confetti.msg.html "&nbsp;&nbsp;&nbsp;&nbsp;<b>&bull;</b> #{sys.htmlEscape(example)}", chan

            return null
