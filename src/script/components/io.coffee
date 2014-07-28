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
    reloadScript = (verbose = no) ->
        file = read(sys.scriptsFolder + "scripts.js")
        if file
            confetti.silentReload = !verbose
            sys.unsetAllTimers()
            sys.changeScript file
    getRemoteFile = (url, errback, callback) ->
        sys.webCall url, (resp) ->
            if resp is ""
                if Array.isArray(errback)
                    [errmsg, chan] = errback
                    unless errmsg
                        return

                    return confetti.msg.bot(errmsg, chan)
                else if typeof errback is 'function'
                    return errback()
                else return

            callback(resp)

    getRemoteJson = (url, errback, callback) ->
        sys.webCall url, (resp) ->
            try
                json = JSON.parse(resp)
            catch ex
                if Array.isArray(errback)
                    [errmsg, chan] = errback
                    unless errmsg
                        return

                    return confetti.msg.bot(errmsg, chan)
                else if typeof errback is 'function'
                    return errback()
                else return

            callback(json, resp)

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
        getRemoteFile
        getRemoteJson
    }
