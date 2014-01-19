do ->
    create = (id) ->
        {id, name: Client.name(id)}
    # To know if someone is battling, we request their player info,
    # then check if the flags include the "Battling" (2) flag
    battling = (id) ->
        return no unless Client.player?

        (Client.player(id).flags & (1 << 2)) > 0

    authToName = (auth) ->
        ['User', 'Moderator', 'Administrator', 'Owner'][auth] or 'Invisible'

    status = (id) ->
        id = Client.id(id) if typeof id is 'string'

        if id is -1
            return "(<font color='red'><b>Offline</b></font>)"
        else
            battlingPart = ""
            if battling(id)
                battlingPart = " - <a href='po:watchplayer/#{id}' style='text-decoration: none; color: blue;' title='Watch #{confetti.util.stripquotes(Client.name(id))} battle'><b>Battling</b></a>"

            return "(<a href='po:pm/#{id}' style='text-decoration: none; color: green;'><b>Online</b></a>#{battlingPart})"

    name = (id) ->
        if typeof id is 'string'
            pname = Client.name Client.id(id)
        else
            pname = Client.name id

        if pname is '~Unknown~'
            storedname = confetti.players[id]?.name
            return storedname if storedname
            return id # Original name passed
        else
            return pname

    fancyName = (id, tooltip = yes) ->
        pname = name(id)
        id = Client.id(id) if typeof id is 'string'
        showInfo = typeof id isnt 'string' and tooltip

        "<a " + (if showInfo then 'href=\'po:info/' + id + '\' ' else '') + "style='text-decoration: none; color: #{Client.color(id)};'" + (if showInfo then (' title="Challenge ' + confetti.util.stripquotes(pname) + '"') else '') + "><b>#{pname}</b></a>"

    confetti.player = {
        create
        battling
        authToName
        status
        name
        fancyName
    }
