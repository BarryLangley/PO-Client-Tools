do ->
    read = (file) ->
        sys.appendToFile file, ""
        sys.getFileContent(file)
    readJson = (file) ->
        JSON.parse(read(file) or '{}')
    readLocal = (file) ->
        read(confetti.dataDir + file)
    readLocalJson = (file) ->
        readJson(confetti.dataDir + file)
    write = (file, data) ->
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
