# Pokémon Online global shortcuts
Client = client
Network = Client.network()
Global = this

# Initialize global
if typeof confetti isnt 'object'
    confetti =
        initialized: no

        cache:
            initialized: no
        players: {}

        dataDir: sys.scriptsFolder
        cacheFile: 'confetti.json'
        loginTime: 0

    Network.playerLogin.connect ->
        confetti.loginTime = +sys.time()
