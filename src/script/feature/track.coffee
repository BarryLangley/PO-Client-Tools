do ->
    # Command lists
    confetti.command 'trackcommands', ['Shows commands related to tracking players (such as their aliases).', 'send@trackcommands'], ->
        confetti.cmdlist("Tracking", 'track untrack tracked trackingresolve', 'track')

    # Commands
    confetti.command 'tracked', ["Displays a list of tracked players.", 'send@tracked'], (_, chan) ->
        tracked = confetti.cache.get 'tracked'
        numTracked = Object.keys(tracked).length

        if numTracked is 0
            return confetti.msg.bot "There is no one on your tracking list."

        confetti.msg.bold "Tracked players <small>[#{numTracked}]</small>", '', chan

        html  = ""
        names = {}

        for alt, name of tracked
            names[name] ?= []
            names[name].push alt

        for name, alts of names
            # Forbid auto-resolve
            html += "#{confetti.msg.bullet} #{confetti.player.fancyName(name, null, no)} #{confetti.player.status(name, no)} as <small>[#{alts.length}]</small><br>"

            alts = confetti.util.sortOnlineOffline(alts)
            for alt in alts
                # Forbid auto-resolve
                html += "&nbsp;&nbsp;&nbsp;&nbsp;#{confetti.msg.bullet} #{confetti.player.fancyName(alt, null, no)} #{confetti.player.status(alt, no)}<br>"

        confetti.msg.html html, chan

    confetti.alias 'tracking', 'tracked'
    confetti.alias 'trackinglist', 'tracked'

    confetti.command 'track', ['track [alt]:[name]', "Adds [alt] as an alt of [name] to your tracking list.", 'setmsg@track alt:name'], (data) ->
        parts = data.split ':'
        parts[1] = '' unless parts[1]?

        [alt, name] = parts

        alt     = alt.toLowerCase().trim()
        name    = name.trim()
        altName = confetti.player.name(alt, no)

        tracked = confetti.cache.get 'tracked'

        if !alt and !name
            return confetti.msg.bot "Specify both the alt and the name!"

        if tracked.hasOwnProperty(alt)
            return confetti.msg.bot "#{altName} is already on your tracking list!"

        tracked[alt] = name
        confetti.cache.store('tracked', tracked).save()

        confetti.msg.bot "#{altName} is now on your tracking list as an alt of #{confetti.player.name(name, no)}!"

    confetti.command 'untrack', ['untrack [alt]', "Removes [alt] from your tracking list.", 'setmsg@untrack alt'], (data) ->
        data = data.toLowerCase()
        name = confetti.player.name(data, no)
        tracked = confetti.cache.get 'tracked'

        unless tracked.hasOwnProperty(data)
            return confetti.msg.bot "#{name} isn't on your tracking list!"

        delete tracked[data]
        confetti.cache.store('tracked', tracked).save()

        confetti.msg.bot "You removed #{name} from your tracking list!"

    confetti.command 'trackingresolve', ["Toggles whether if tracked names should resolve to their real name (in lists &c.). Does not affect chat name resolution.", 'send@trackingresolve'], ->
        confetti.cache.store('trackingresolve', !confetti.cache.read('trackingresolve')).save()
        confetti.msg.bot "Tracking name resolve is now #{if confetti.cache.read('trackingresolve') then 'on' else 'off'}."

    # The initCache work is done in the main function due to it being used in core functionality.

    confetti.hook 'manipulateChanPlayerMessage', (from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty) ->
        tracked     = confetti.cache.get 'tracked'
        trackedName = from.toLowerCase()

        ownId = Client.ownId()

        if fromId isnt ownId and tracked.hasOwnProperty(trackedName)
            from = "<span title='#{confetti.util.stripquotes(from)}'>#{tracked[trackedName]}</span>"
            dirty = true

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty]
