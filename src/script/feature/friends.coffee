do ->
    bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;"
    confetti.command 'friends', ["Displays your friends list.", 'send@friends'], (_, chan) ->
        friends = confetti.util.sortOnlineOffline(confetti.cache.get('friends'))

        if friends.length is 0
            return confetti.msg.bot "<span title='You have 0 friends.'>There is no one on your friend list.</span>"

        confetti.msg.bold "Your friends <small>[#{friends.length}]</small>", '', chan

        html  = ""
        count = 0

        for friend in friends
            count += 1

            html += "#{confetti.msg.bullet} #{confetti.player.fancyName(friend)} #{confetti.player.status(friend)}"
            html += "<br>" if count % 3 is 0

        confetti.msg.html html, chan

    confetti.command 'friend', ['friend [name]', "Adds [name] to your friend list.", 'setmsg@friend name'], (data) ->
        name = confetti.player.name data
        data = data.toLowerCase()
        friends = confetti.cache.get 'friends'

        unless data
            return confetti.msg.bot "Specify a name!"

        if Client.ownName().toLowerCase() is data
            return confetti.msg.bot "You can't add yourself as a friend!"

        if data in friends
            return confetti.msg.bot "#{name} is already on your friends list!"

        friends.push data
        confetti.cache.store('friends', friends).save()

        confetti.msg.bot "#{name} is now on your friends list!"

    confetti.command 'unfriend', ['unfriend [name]', "Removes [name] from your friend list.", 'setmsg@unfriend name'], (data) ->
        data = data.toLowerCase()
        name = confetti.player.name data
        friends = confetti.cache.get 'friends'

        unless data in friends
            return confetti.msg.bot "#{name} isn't on your friends list!"

        friends.splice friends.indexOf(data), 1
        confetti.cache.store('friends', friends).save()

        confetti.msg.bot "You removed #{name} from your friends list!"

    confetti.command 'friendnotifications', ["Toggles whether if notifications specific to friends (logins, logouts) should be shown.", 'send@friendnotifications'], ->
        confetti.cache.store('friendnotifications', !confetti.cache.read('friendnotifications')).save()
        confetti.msg.bot "Friend notifications are now #{if confetti.cache.read('friendnotifications') then 'on' else 'off'}."

    confetti.hook 'initCache', ->
        confetti.cache
            .store('friends', [], confetti.cache.once)
            .store('friendnotifications', yes, confetti.cache.once)

    confetti.hook 'onPlayerReceived', (id) ->
        # In the first few seconds of connection, often a long list of players is sent.
        # If one friend is in this list, their "arrival" is notified.
        # In reality, they were already there. So don't tell about them.
        if confetti.loginTime is 0 or sys.time() <= confetti.loginTime + 4
            return

        if confetti.cache.get('friendnotifications') is no
            return

        # Also see if their "real" name is in the friends list (via tracking).
        name = Client.name(id).toLowerCase()
        friends = confetti.cache.get('friends')
        trackedName = ''
        if confetti.cache.get('trackingresolve')
            tracked = confetti.cache.get('tracked')
            trackedName = (tracked[name] or '').toLowerCase()

        if name in friends or (trackedName and trackedName in friends)
            confetti.msg.notification "#{confetti.player.fancyName(id)} logged in.", "Friend joined"

    confetti.hook 'onPlayerRemoved', (id) ->
        if confetti.cache.get('friendnotifications') is no
            return

        # Also see if their "real" name is in the friends list (via tracking).
        name = Client.name(id).toLowerCase()
        friends = confetti.cache.get('friends')
        trackedName = ''
        if confetti.cache.get('trackingresolve')
            tracked = confetti.cache.get('tracked')
            trackedName = (tracked[name] or '').toLowerCase()

        if name in friends or (trackedName and trackedName in friends)
            confetti.msg.notification "#{confetti.player.fancyName(id, no)} logged out.", "Friend left"
