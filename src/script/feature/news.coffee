do ->
    confetti.command 'news', ['Fetches the latest news headlines from Google.', 'send@news'], ->
        confetti.msg.bot "Fetching latest headlines..."
        sys.webCall 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&rsz=5&topic=h&hl=en', (response) ->
            unless response
                confetti.msg.bot "Couldn't load news - your internet might be down."
                return

            try
                json = JSON.parse response
            catch ex
                confetti.msg.bot "Couldn't load news - your internet might be down."
                return

            data = json.responseData.results
            res = []

            for story in data
                res.push "#{confetti.msg.bullet} <b>" + story.titleNoFormatting.replace(/&#39;/g, "'").replace(/`/g, "'").replace(/&quot;/g, "\"") + "</b>"
                res.push "#{confetti.msg.indent}&nbsp;&nbsp;&nbsp;&nbsp;→ Read more: #{sys.htmlEscape(story.unescapedUrl)}"

            if res.length
                confetti.msg.bold 'News Headlines'
                for mess in res
                    confetti.msg.html mess

            return null
