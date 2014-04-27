do ->
    confetti.command 'news', ['news [language code?]:[topic?]', "Fetches the latest news, either the headlines or on a specific topic, from Google News, in an optional <a href='<a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table'>[language]</a>.", 'send@news'], (data, chan) ->
        data = data.split(':')
        lang = data[0].toLowerCase().trim()
        query = data.slice(1).join(':').trim()
        topic = '&topic=h'

        if lang.length isnt 2
            lang = 'en'
        if query
            topic = "&q=#{encodeURIComponent(query.toLowerCase())}"

        sys.webCall "https://ajax.googleapis.com/ajax/services/search/news?v=1.0&rsz=6&hl=#{encodeURIComponent(lang)}#{topic}", (response) ->
            unless response
                return confetti.msg.bot "Couldn't load news - your internet might be down.", chan

            try
                json = JSON.parse response
            catch ex
                return confetti.msg.bot "Couldn't load news - your internet might be down.", chan

            stories = json.responseData.results
            res = []

            for story in stories
                res.push "#{confetti.msg.bullet} <b>" + story.titleNoFormatting.replace(/&#39;/g, "'").replace(/`/g, "'").replace(/&quot;/g, "\"") + "</b><br>#{confetti.msg.indent}&nbsp;&nbsp;&nbsp;&nbsp;→ Read more: #{sys.htmlEscape(story.unescapedUrl)}"

            if res.length
                confetti.msg.bold "News #{if query then 'on ' + query else 'Headlines'}", '', chan
                for mess in res
                    confetti.msg.html mess, chan

            return null
