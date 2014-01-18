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

        if Object::toString(data) is '[object Object]'
            data = JSON.stringify(data)

        sys.writeToFile(file, data)
    writeLocal = (file, data) ->
        write(confetti.dataDir + file, data)

    confetti.io = {
        read
        readJson
        readLocal
        readLocalJson
        write
        writeLocal
        writeLocalJson: writeLocal # Write serializes objects automatically.
    }
