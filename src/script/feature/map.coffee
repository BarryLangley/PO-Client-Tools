do ->
    mapTypes = "command send".split " "
    mapDataValidators = {
        command: (mapdata) -> mapdata.length > 0
        send: (mapdata) -> mapdata.length > 0
    }

    executeMap = (map, chan=Client.currentChannel()) ->
        data = map.data.split('\\n')
        for line in data
            switch map.type
                when "command"
                    confetti.runCommand line, chan
                when "send"
                    confetti.msg.notify line, chan
        return yes

    confetti.command 'maphelp', "Displays help for message mapping.",(_, chan)  ->
        cin = confetti.cache.get('commandindicator')
        min = confetti.cache.get('mapindicator')

        confetti.msg.bot "Message mapping (commonly known as binds) allows you to map a message (starting with your mapping indicator - which is currently <b><font size=4>#{cin}</font></b>) to something else, specified by the mapping <b>type</b>. Its purpose is to expand something short, easily to type, into a longer piece of text which you have defined beforehand using the <b>map</b> command."
        confetti.msg.bot "Maps take a type to indicate what to do. Here they are:"

        confetti.msg.html "#{confetti.msg.bullet} <b>command</b>: Executes a Confetti command. Requires data: the command to execute. It doesn't have to start with your command indicator.", chan
        confetti.msg.html "#{confetti.msg.bullet} <b>send</b>: Sends a message in the channel you are in when you use the map. Requires data: the message to send. Can also be used to execute server commands.", chan
        confetti.msg.html "", chan

        confetti.msg.bot "For example:"
        confetti.msg.html "#{confetti.msg.bullet} <b>Add a mapping</b>: <a href='po:send/-map pl:send:/players'>#{cin}map pl:send:/players</a>", chan
        confetti.msg.html "#{confetti.msg.bullet} <b>Execute it</b>: <a href='po:send/#{min}pl'>#{min}pl</a>", chan
        confetti.msg.html "#{confetti.msg.bullet} <b>Add a multi-map</b>: <a href='po:send/-map hi2:send:hi\\neveryone'>#{cin}map hi2:send:hi\\neveryone</a> (executing it is the same process)", chan
        confetti.msg.html "", chan

        confetti.msg.bot "You can execute multiple commands in your mapping for a map by separating each command with the text \"\\n\". This is called a <b>multi-map</b>."
        confetti.msg.bot "To remove a mapping, use the <b>unmap</b> command. For a list of maps, use the <a href='po:send/-maps'><b>#{cin}maps</b></a> command."

        confetti.msg.bot "You currently have maps #{if confetti.cache.get('mapsenabled') then 'enabled' else 'disabled'}. Toggle it with the <b>togglemaps</b> command."

    confetti.command 'maps', "Displays your message mappings.", (_, chan) ->
        maps = confetti.cache.get('maps')
        mapc = Object.keys(maps).length

        if mapc is 0
            return confetti.msg.bot "You have no message mappings."

        confetti.msg.bold "Your mappings <small>[#{mapc}]</small>", '', chan

        html  = ""
        count = 0

        for _, map of maps
            count += 1

            html += "#{confetti.msg.bullet} <b>#{map.msg}</b>: #{map.type} mapping#{if map.data then ' (' + map.data + ')' else ''}<br>"

        confetti.msg.html html, chan

    confetti.command 'map', ['map [message]:[type]:[data...]', "Creates/overrides a message mapping for the message [message]. [type] is the map's type, [data] is any data to be supplied to the map. For more information (like what maps are, and the available mapping types), use the maphelp command.", 'send@maphelp'], (data) ->
        [msg, type, mapdata...] = data.split(':')
        type ?= ""

        type = type.toLowerCase()
        maps = confetti.cache.get 'maps'

        unless msg
            return confetti.msg.bot "Specify a mapping!"

        if !(type in mapTypes)
            return confetti.msg.bot "#{type} is not a valid map type. Use the maphelp command for more info."

        validator = mapDataValidators[type]

        if validator? and !validator(mapdata)
            return confetti.msg.bot "The validator for mapping type #{type} didn't pass your map data. Use the maphelp command for more info."

        mdata = mapdata.join(':')

        if maps[msg]
            oldmap = maps[msg]
            if oldmap.type is type and oldmap.data is mdata
                return confetti.msg.bot "#{confetti.cache.get('mapindicator')}#{msg} already maps to #{type}#{if mdata then ' (' + mdata + ')' else ''}!"

        maps[msg] = {msg, type, data: mdata}
        confetti.cache.store('maps', maps).save()

        confetti.msg.bot "#{confetti.cache.get('mapindicator')}#{msg} now maps to #{type}#{if mdata then ' (' + mdata + ')' else ''}!"

    confetti.command 'unmap', {help: "Removes the mapping for the message [message].", args: ["message"]}, (data) ->
        maps = confetti.cache.get 'maps'

        unless maps.hasOwnProperty(data)
            return confetti.msg.bot "#{data} isn't mapped to anything!"

        delete maps[data]
        confetti.cache.store('maps', maps).save()

        confetti.msg.bot "You removed #{data} from your message mappings!"

    confetti.command 'mapindicator', {help: "Changes your mapping indicator (to indicate usage of maps) to [symbol].", args: ["symbol"]}, (data) ->
        data = data.toLowerCase()

        if data.length isnt 1
            return confetti.msg.bot "Your mapping indicator has to be one character, nothing more, nothing less!"

        if data in ['/', '!']
            return confetti.msg.bot "'!' and '/' are not allowed as command indicators because they are reserved for server scripts."

        if confetti.cache.read('mapindicator') is data
            return confetti.msg.bot "Your mapping indicator is already #{data}!"

        confetti.cache.store('mapindicator', data).save()
        confetti.msg.bot "Your mapping indicator is now #{data}!"

    confetti.command 'togglemaps', "Toggles whether if message maps should be enabled.", ->
        confetti.cache.store('mapsenabled', !confetti.cache.read('mapsenabled')).save()
        confetti.msg.bot "Message mapping is now #{if confetti.cache.read('mapsenabled') then 'enabled' else 'disabled'}."

    confetti.initFields {maps: {}, mapindicator: ':', mapsenabled: yes}
    confetti.hook 'beforeSendMessage', (message, chan, stop) ->
        if confetti.cache.get('mapsenabled') is on and message[0] is confetti.cache.get('mapindicator')
            mapmsg = message.substr(1)
            maps = confetti.cache.get('maps')
            if maps.hasOwnProperty(mapmsg)
                executeMap(maps[mapmsg], chan)
                stop = yes

        [message, chan, stop]
