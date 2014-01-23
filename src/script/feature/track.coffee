do ->
    bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;"
    confetti.command 'tracked', ["Displays a list of tracked players.", 'send@tracked'], (_, chan) ->
        tracked = confetti.cache.get 'tracked'

        if Object.keys(tracked).length is 0
            confetti.msg.bot "There is no one on your tracking list."
            return

        confetti.msg.bold "Tracked players", '', chan

        html  = ""
        names = {}

        for alt, name of tracked
            names[name] ?= []
            names[name].push alt

        for name, alts of names
            html += "#{confetti.msg.bullet} #{confetti.player.fancyName(name)} #{confetti.player.status(name)} as:<br/>"

            alts = alts.sort().sort(confetti.util.sortOnline)
            for alt in alts
                html += "&nbsp;&nbsp;&nbsp;&nbsp;#{confetti.msg.bullet} #{confetti.player.fancyName(alt)} #{confetti.player.status(alt)}<br/>"

            # There should already be a remaining new line from the above code.
            # html += "<br/>"

        confetti.msg.html html, chan

    confetti.alias 'tracking', 'tracked'
    confetti.alias 'trackinglist', 'tracked'

    confetti.command 'track', ['track [alt]:[name]', "Adds [alt] as an alt of [name] to your tracking list.", 'setmsg@track [alt]:[name]'], (data) ->
        parts       = data.split ':'
        parts[1] = '' unless parts[1]?

        [alt, name] = parts

        alt     = alt.toLowerCase().trim()
        name    = name.trim()
        altName = confetti.player.name(alt)

        tracked = confetti.cache.get 'tracked'

        if alt.length is 0 or name.length is 0
            confetti.msg.bot "Specify both the alt and the name!"
            return

        if tracked.hasOwnProperty(alt)
            confetti.msg.bot "#{altName} is already on your tracking list!"
            return

        tracked[alt] = name
        confetti.cache.store('tracked', tracked).save()

        confetti.msg.bot "#{altName} is now on your tracking list!"

    confetti.command 'untrack', ['untrack [alt]', "Removes [alt] from your tracking list.", 'setmsg@untrack [alt]'], (data) ->
        data = data.toLowerCase()
        name = confetti.player.name data
        tracked = confetti.cache.get 'tracked'

        unless tracked.hasOwnProperty(data)
            confetti.msg.bot "#{name} isn't on your tracking list!"
            return

        delete tracked[data]
        confetti.cache.store('tracked', tracked).save()

        confetti.msg.bot "You removed #{name} from your tracking list!"

    confetti.hook 'initCache', ->
        confetti.cache
            .store('tracked', {}, confetti.cache.once)

    confetti.hook 'manipulateChanPlayerMessage', (from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty) ->
        tracked = confetti.cache.get 'tracked'
        trackedName = from.toLowerCase()

        if tracked.hasOwnProperty(trackedName)
            from = "<span title='#{confetti.util.stripquotes(from)}'>#{tracked[trackedName]}</span>"
            dirty = true

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty]
