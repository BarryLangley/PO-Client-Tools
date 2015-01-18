# Global shortcuts
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
    major: 1
    minor: 5

# TODO: A command to change this
confetti.scriptUrl  = 'https://caresx.github.io/PO-Client-Tools/'
confetti.pluginsUrl = 'https://caresx.github.io/PO-Client-Tools/plugins/'
confetti.dataDir    = sys.scriptsFolder
confetti.cacheFile  = 'confetti.json'
