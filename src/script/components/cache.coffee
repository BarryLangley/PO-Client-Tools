do ->
    class Cache
        constructor: (@file = confetti.cacheFile, @hash = {}, @saved = 0) ->
            try
                @hash = confetti.io.readLocalJson(@file)
            catch ex
                # print "Cache read error: #{ex} - resetting file #{@file}."
                confetti.io.writeLocal @file, '{}'
        store: (key, value, once = false) ->
            if !once or (once and typeof @hash[key] is 'undefined')
                @hash[key] = value
                @saved += 1
            return this
        clear: (key, value) ->
            if typeof @hash[key] isnt 'undefined'
                delete @hash[key]
                @saved += 1
            return this
        read: (key) ->
            @hash[key]
        get: (key) ->
            @hash[key]
        save: ->
            if @saved > 0
                confetti.io.writeLocalJson @file, @hash
                @saved = 0
            return this
        wipe: ->
            @hash = {}
            confetti.io.writeLocal @file, '{}'
            return this
        once: yes

    confetti.Cache = Cache
