# Pokémon Online global shortcuts
Client = client
Network = Client.network()
Global = this

# Initialize global
if typeof confetti isnt 'object'
    confetti =
        initialized: no
        silentReload: off

        version:
            release: 2
            major: 0
            minor: 1
        cache:
            initialized: no
        players: {}

        # TODO: A command to change this
        scriptUrl: 'https://raw.github.com/TheUnknownOne/PO-Client-Tools/master/'
        pluginsUrl: 'https://raw.github.com/TheUnknownOne/PO-Client-Tools/master/plugins/'

        dataDir: sys.scriptsFolder
        cacheFile: 'confetti.json'

        loginTime: 0

    Network.playerLogin.connect ->
        confetti.loginTime = +sys.time()
