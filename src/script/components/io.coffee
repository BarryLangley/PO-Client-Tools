do ->
    read = (file) ->
        return "" if sys.isSafeScripts()

        sys.appendToFile file, ""
        sys.getFileContent(file) or ""
    readJson = (file) ->
        JSON.parse(read(file) or '{}')
    readLocal = (file) ->
        read(confetti.dataDir + file)
    readLocalJson = (file) ->
        readJson(confetti.dataDir + file)
    write = (file, data) ->
        return if sys.isSafeScripts()

        if typeof data is 'object' and Object::toString(data) is '[object Object]'
            data = JSON.stringify(data)

        sys.writeToFile(file, data)
    writeLocal = (file, data) ->
        write(confetti.dataDir + file, data)
    deleteLocal = (file) ->
        sys.deleteFile confetti.dataDir + file
    reloadScript = (verbose = no, oldVersion) ->
        file = read(sys.scriptsFolder + "scripts.js")
        if file
            confetti.silentReload = !verbose
            confetti.oldVersion = oldVersion
            sys.unsetAllTimers()
            sys.changeScript file

    confetti.io = {
        read
        readJson
        readLocal
        readLocalJson
        write
        writeLocal
        writeLocalJson: writeLocal # Write serializes objects automatically.
        deleteLocal
        reloadScript
    }
