do ->
    create = (id) ->
        {id}
    isIgnored = (id) ->
        Client.isIgnored(id) or Client.name(id).toLowerCase() in confetti.ignores
    name = (id) ->
        if typeof id is 'string'
            name = Client.name Client.id(id)
        else
            name = Client.name id

        if name is '~Unknown~'
            return id
        else
            return name

    confetti.player = {
        create
        isIgnored
        name
    }
