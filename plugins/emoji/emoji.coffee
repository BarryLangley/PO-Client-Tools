# Emoji plugin
do ->
    emoji = {}
    parsed = no
    url = 'https://caresx.github.io/PO-Client-Tools/plugins/emoji/emoji.json'

    emojiRegex = /:([a-z0-9\+\-_]+):/g

    checkEmoji = (verbose = yes) ->
        if parsed
            return yes

        file = confetti.io.readLocal('emoji.json')
        if file
            emoji = JSON.parse(file)
            parsed = yes
            return yes

        confetti.msg.bot "Downloading emojis, this may take a while. [1.226 MB]"

        content = sys.synchronousWebCall(url)
        emoji = JSON.parse(content)
        parsed = yes

        confetti.io.writeLocal('emoji.json', content)
        confetti.msg.bot "Done! <img src='#{emoji.sparkles}'>"
        return no

    parseEmoji = (message) ->
        unless confetti.cache.get('emoji') is on
            return message

        checkEmoji()

        count = 0
        max = confetti.cache.get('emojimax')
        message.replace emojiRegex, (name) ->
            if count >= max
                return name

            emojiname = name.substr(1, name.length - 2)
            if emoji.hasOwnProperty(emojiname)
                code = emoji[emojiname]
                count += 1
                return "<img src='#{code}'>"

            return name

    confetti.emotes ?= {}
    confetti.emotes.emoji =
        emotes: emoji
        parse: parseEmoji
        check: checkEmoji

    confetti.command 'emoji', "Toggles whether if emojis should be shown.", (_, chan) ->
        checkEmoji()

        confetti.cache.store('emoji', !confetti.cache.read('emoji')).save()
        confetti.msg.bot "Emojis are now #{if confetti.cache.read('emoji') then 'enabled' else 'disabled'}.", chan

    confetti.command 'emojimax', {help: "Changes how many emoji there may be in one message. Subsequent emoji won't be parsed. If no valid number is given, shows the current emoji max.", args: ["count"]}, (data, chan) ->
        checkEmoji()

        num = parseInt(data, 10)
        if isNaN(num)
            count = confetti.cache.get('emojimax')
            confetti.msg.bot "#{count} #{if count is 1 then 'emoji is' else 'emojis are'} currently allowed per message.", chan
            return

        if num < 0
            num = 0

        confetti.cache.store('emojimax', num).save()
        confetti.msg.bot "#{num} #{if num is 1 then 'emoji is' else 'emojis are'} now allowed per message.", chan

    confetti.command 'emojis', "Shows the list of emoji.", (_, chan) ->
        checkEmoji()

        confetti.msg.bot "There are currently 872 emojis! You can look them up here:"
        confetti.msg.bot "<a href='http://www.emoji-cheat-sheet.com/'>http://www.emoji-cheat-sheet.com/</a>", chan

    confetti.hook 'commands:misc', (template) ->
        template.cmds('emoji emojis')

    confetti.hook 'manipulateChanPlayerMessage', (from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty) ->
        newMessage = parseEmoji(playerMessage)
        if newMessage isnt playerMessage
            playerMessage = newMessage
            html = yes
            dirty = yes

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty]

    confetti.initFields {emoji: yes, emojimax: 5}
    checkEmoji()
