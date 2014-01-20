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

        # TODO: A command to change this
        pluginsUrl: 'https://raw.github.com/TheUnknownOne/PO-Client-Tools/v2/plugins/'

        dataDir: sys.scriptsFolder
        cacheFile: 'confetti.json'

        loginTime: 0

    Network.playerLogin.connect ->
        confetti.loginTime = +sys.time()
