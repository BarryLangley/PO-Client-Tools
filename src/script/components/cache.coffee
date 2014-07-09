do ->
    class Cache
        constructor: (@file = confetti.cacheFile, @hash = {}) ->
            @saved = 0
            try
                @hash = confetti.io.readLocalJson(@file)
            catch ex
                confetti.io.writeLocalJson @file, {}
        store: (key, value, once = false) ->
            if once and @hash.hasOwnProperty(key)
                return this

            @hash[key] = value
            @saved += 1
            return this
        remove: (key) ->
            if typeof @hash[key] isnt 'undefined'
                delete @hash[key]
                @saved += 1
            return this
        read: (key) ->
            @hash[key]
        get: (key) ->
            @hash[key]
        init: (keys) ->
            for key, value of keys
                @store(key, value, yes)
            return this
        save: ->
            if @saved > 0
                confetti.io.writeLocalJson @file, @hash
                @saved = 0
            return this
        wipe: ->
            @hash = {}
            @saved = 0
            confetti.io.writeLocalJson @file, {}
            return this
        once: yes

    confetti.Cache = Cache
