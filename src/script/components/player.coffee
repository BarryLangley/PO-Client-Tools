do ->
    create = (id) ->
        {id}
    # To know if someone is battling, we request their player info,
    # then check if the flags include the "Battling" (2) flag
    battling = (id) ->
        return no unless Client.player?

        (Client.player(id).flags & (1 << 2)) > 0

    status = (id) ->
        id = Client.id(id) if typeof id is 'string'

        if id is -1
            return "(<font color='red'><b>Offline</b></font>)"
        else
            battlingPart = ""
            if battling(id)
                battlingPart = " - <a href='po:watchplayer/#{id}' style='text-decoration: none; color: blue;'><b>Battling <sub>watch</sub></b></a>"

            return "(<a href='po:pm/#{id}' style='text-decoration: none; color: green;'><b>Online</b></a>#{battlingPart})"

    name = (id) ->
        if typeof id is 'string'
            pname = Client.name Client.id(id)
        else
            pname = Client.name id

        if pname is '~Unknown~'
            return id
        else
            return pname

    fancyName = (id) ->
        pname = name(id)
        id = Client.id(id) if typeof id is 'string'

        "<b style='color: #{Client.color(id)};'>#{pname}</b>"

    confetti.player = {
        create
        battling
        status
        name
        fancyName
    }
