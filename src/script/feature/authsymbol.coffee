do ->
    confetti.command 'authsymbols', ["Shows the auth symbols you have set.", 'send@authsymbols'], (_, chan) ->
        authsymbols = confetti.cache.get 'authsymbols'
        numSymbols = Object.keys(authsymbols).length

        if numSymbols is 0
            return confetti.msg.bot "You have not set any auth symbols."

        confetti.msg.bold "Auth symbols <small>[#{numSymbols}]</small>", '', chan

        html = ""
        start = ""
        end = ""
        authlvls = ["", "", "", "", ""]

        for auth, parts of authsymbols
            [start, end] = parts
            authlvls[auth] = "#{confetti.msg.bullet} Auth <b>#{confetti.player.authToName(auth)}</b> (#{auth}): #{sys.htmlEscape(start)}<b>Name</b>#{sys.htmlEscape(end)}"

        authlvls = (authlvl for authlvl in authlvls when authlvl isnt "")
        confetti.msg.html authlvls.join("<br>") + "<br>", chan

    confetti.alias 'authsymbollist', 'authsymbols'
    confetti.alias 'authsymbolist', 'authsymbols'

    confetti.command 'authsymbol', ['authsymbol [auth]:[start]:[end?]', "Changes the auth symbol of [auth] (0 - User, 1 - Moderator, 2 - Administrator, 3 - Owner, or 4 - \"Invisible\") to [start]. [end?] is optional and will be inserted after the name (useful for HTML). If neither [start] nor [end?] is given, the auth symbol for [auth] is reset (if you want an empty auth symbol for auth level [auth], do <code>authsymbol:</code>).", 'setmsg@authsymbol auth:start'], (data) ->
        parts = data.split ':'
        [authl, start, end] = parts

        authl = parseInt(authl, 10)
        start = start.trim() if start?
        end   = end.trim() if end?

        authsymbols = confetti.cache.get 'authsymbols'
        if isNaN(authl)
            return confetti.msg.bot "#{parts[0]} is not a number. Give a number in the range 0-4."
        else if authl < 0
            authl = 0
        else if authl > 4
            authl = 4

        authn = confetti.player.authToName(authl)
        if !start? and !end?
            if authsymbols.hasOwnProperty(authl)
                delete authsymbols[authl]
                confetti.cache.store('authsymbols', authsymbols).save()

                return confetti.msg.bot "Auth symbol for auth #{authn} (#{authl}) removed!"
            else
                return confetti.msg.bot "There is no auth symbol for auth #{authn} (#{authl}). Give a start and an end for the auth level."

        start ?= ''
        end ?= ''
        authsymbols[authl] = [start, end]
        confetti.cache.store('authsymbols', authsymbols).save()

        confetti.msg.bot "Players whose auth is #{authn} (#{authl}) will now be formatted like so: #{start}<b>Name</b>#{end}"

    confetti.hook 'initCache', ->
        confetti.cache.store('authsymbols', {}, confetti.cache.once)

    confetti.hook 'manipulateChanPlayerMessage', (from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty) ->
        authsymbols = confetti.cache.get 'authsymbols'

        if auth > 4
            auth = 4

        symbol = authsymbols[auth]
        if symbol
            authSymbol = symbol
            dirty = true

        [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty]
