do ->
    confetti.command 'news', ['news [language code?]', "Fetches the latest news headlines from Google, in an optional <a href='<a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table'>[language]</a>.", 'send@news'], (data, chan) ->
        data = data.toLowerCase()
        if data.length isnt 2
            data = 'en'

        confetti.msg.bot "Fetching latest headlines..."
        sys.webCall "https://ajax.googleapis.com/ajax/services/search/news?v=1.0&rsz=5&topic=h&hl=#{encodeURIComponent(data)}", (response) ->
            unless response
                confetti.msg.bot "Couldn't load news - your internet might be down.", chan
                return

            try
                json = JSON.parse response
            catch ex
                confetti.msg.bot "Couldn't load news - your internet might be down.", chan
                return

            data = json.responseData.results
            res = []

            for story in data
                res.push "#{confetti.msg.bullet} <b>" + story.titleNoFormatting.replace(/&#39;/g, "'").replace(/`/g, "'").replace(/&quot;/g, "\"") + "</b><br/>#{confetti.msg.indent}&nbsp;&nbsp;&nbsp;&nbsp;→ Read more: #{sys.htmlEscape(story.unescapedUrl)}"

            if res.length
                confetti.msg.bold 'News Headlines', '', chan
                for mess in res
                    confetti.msg.html mess, chan

            return null
