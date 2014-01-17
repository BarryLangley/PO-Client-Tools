do ->
    channelIds = ->
        (Client.channelId chan for chan in Client.myChannels())
    players = (chan) ->
        channel = Client.channel chan
        return (parseInt(id, 10) for id of confetti.players when channel.hasPlayer(id))

    confetti.channel = {channelIds, players}
