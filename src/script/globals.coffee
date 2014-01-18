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

        blocked: []

        dataDir: sys.scriptsFolder
        cacheFile: 'confetti.json'
