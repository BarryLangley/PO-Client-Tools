do ->
    random = (array) ->
        if Array.isArray array
            return array[sys.rand(0, array.length)]
        else
            return array
    copyArray = (array) ->
        [].concat(array)
    removeDuplicates = (array) ->
        dupeless = []

        for val in array
            if dupeless.indexOf(val) is -1
                dupeless.push val

        return dupeless
    isPlainObject = (obj) ->
        Object::toString.call(obj) is '[object Object]'
    shuffle = (array) ->
        length = array.length

        # While there remain elements to shuffle...
        while length
            # Pick a remaining element...
            i = Math.floor(Math.random() * length--)

            # And swap it with the current element.
            t = array[length]
            array[length] = array[i]
            array[i] = t

        return array
    # Not perfect but it does the job
    an = (what) ->
        if what[0] in ['a', 'e', 'u', 'i', 'o']
            return "an #{what}"
        else
            return "a #{what}"
    fancyJoin = (array, delimiter = ', ', lastDelimiter = 'and') ->
        str = ''
        len = array.length

        if len is 0
            return ''
        else if len is 1
            return array[0]
        else if len is 2
            return "#{array[0]} #{lastDelimiter} #{array[1]}"
        for element, index in array
            # Skip on the last entry
            if len is (index + 1)
                str += "#{lastDelimiter} #{element}"
                break
            else
                str += element + delimiter

        return str
    stripHtml = (str) ->
        str.replace(/<\/?[^>]*>/g, "")
    # Escapes regexp characters.
    escapeRegex = (str) ->
        str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

    sortOnlineOffline = (arr) ->
        online  = []
        offline = []
        for name in arr
            if Client.id(name) isnt -1
                online.push name
            else
                offline.push name

        online.sort()
        offline.sort()
        return online.concat(offline)

    truncate = (str, len) ->
        strlen = str.length
        if strlen > len
            str = str.substr(0, len) + "... [#{strlen - len} more]"
        return str

    stripquotes = (str) ->
        str.replace(/'/g, "\'")

    isAlpha = (chr) ->
        chr = chr.toLowerCase()
        chr >= 'a' and chr <= 'z'
    noop = ->

    confetti.util = {
        random
        copyArray
        removeDuplicates
        isPlainObject
        isAlpha
        shuffle
        an
        fancyJoin
        stripHtml
        sortOnlineOffline
        truncate
        escapeRegex
        stripquotes
        noop
    }
