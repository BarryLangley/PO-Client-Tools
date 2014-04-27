# Pokémon Online global shortcuts
Client = client
Network = Client.network()
Global = this

# Initialize global
if typeof confetti isnt 'object'
    confetti =
        initialized: no
        silentReload: off

        cache:
            initialized: no
        players: {}
        ignoreNextChanMessage: no
        loginTime: 0

    Network.playerLogin.connect ->
        confetti.loginTime = sys.time()

confetti.version =
    release: 2
    major: 0
    minor: 9

# TODO: A command to change this
confetti.scriptUrl  = 'https://raw.githubusercontent.com/TheUnknownOne/PO-Client-Tools/master/'
confetti.pluginsUrl = 'https://raw.githubusercontent.com/TheUnknownOne/PO-Client-Tools/master/plugins/'
confetti.dataDir    = sys.scriptsFolder
confetti.cacheFile  = 'confetti.json'
