do ->
    bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;"
    confetti.command 'friends', ["Displays your friends list.", 'send@friends'], ->
        friends = confetti.cache.get 'friends'

        if friends.length is 0
            confetti.msg.bot "<span title='You have 0 friends.'>There is no one on your friend list.</span>"
            return

        confetti.msg.bold "Your friends"

        html  = ""
        count = 0

        for friend in friends
            count += 1

            html += "#{bullet} #{confetti.player.fancyName(friend)} #{confetti.player.status(friend)}"
            html += "<br/>" if count % 3 is 0

        confetti.msg.html html

    confetti.command 'friend', ['friend [name]', "Adds [name] to your friend list.", 'setmsg@friend [name]'], (data) ->
        name = confetti.player.name data
        data = data.toLowerCase()
        friends = confetti.cache.get 'friends'

        if data in friends
            confetti.msg.bot "#{name} is already on your friends list!"
            return

        friends.push data
        confetti.cache.store('friends', friends).save()

        confetti.msg.bot "#{name} is now on your friends list!"

    confetti.command 'unfriend', ['unfriend [name]', "Removes [name] from your friend list.", 'setmsg@unfriend [name]'], (data) ->
        data = data.toLowerCase()
        name = confetti.player.name data
        friends = confetti.cache.get 'friends'

        unless data in friends
            confetti.msg.bot "#{name} isn't on your friends list!"
            return

        friends.splice friends.indexOf(data), 1
        confetti.cache.store('friends', friends).save()

        confetti.msg.bot "You removed #{name} from your friends list!"

    confetti.hook 'initCache', ->
        confetti.cache.store('friends', [], confetti.cache.once)
