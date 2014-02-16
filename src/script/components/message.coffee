do ->
    indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
    bullet = "#{indent}&bull;"
    poIcon = '<img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADBElEQVR42o2Tf0zNaxzHn+eL9JWrn4hFuIoTuwxnOqd0SUUT92KJRXOb8uNyRNM014+Jml91/XEtFYcZO8YNK3SSX7NK7PrDJWaYM1Nz/WGK1aFzXp462Eyz+9nee7Znn/f7+bw/n88jxDeBHLX61eAtJSRWVZFx+hyLs4rejw9Jfq6L/xVxlQa/VEdZct6H5j1HcR8v74SrqdTmKovLwfB9csSO9cKw3SmNJWgzrxGU9gxzTiur/3Rz4ATYL+EsOER29+SxednSsA05pgAZvhU5djcy8ggyvppe8+8zdeNbCsrg2mXYa+3I/sqzl8k6Wgz73Snn3VWko8jQLLTg35DDspRgPtJ8DJlUT/SGFvZZ4eoVnCl5zk92Jh4cpA3NLJXBS5E/FSIj8tH6p6L5JKD5z0UOzlAVbUZOttJjzm3Sdn7gxN90otQj8KPFLAcsaNL8flGvpqMNWOIhe8co/Izmm0SX+ChlL+YUI5a9YHsx2FRjxVY08UPYiiTRL94tfWLR+iqirk4vs4JJIdIj5DsHGbIcOa6IXrNqSS+Awzbc2XtbgoToHxUtAmLbpB6F9I5C661IXpORvolIfYpHqM80ZNBCZFgucoqN6TnvyS/BNTe3JVDMWlVpCB6X+kz4m5A+MaqjRgJC44hL2UXvkfPUnRLRlRW/2Z4qJv6FIbOJsMQ9jV0tsFrxPnaS4uSMI/QcaETow6k418zFC7As/zHC34hU1uTAFMTIlYgJuYRM28iOwobiL4O0lRN+voL2U6fbmLFgN9ft7/jnelenEUOmIkITCIxcQ2J6CTv3/8vLu7Q/aSD8qz2qqnCtra9RM7Z38GumlfV/VDN9YRFnTjpw3ILmO3C/Fv5rhNbHWLpdxit2LPdu0P6wHi5dhAd18LTBA8dteP2I9tanHZbv/QavJZtuRJ8521bz6KbrzetG3J1w3HG9qbvaUrmrsHpSZ063zOR1dXq8pTFs/Npmo5503KQn7DcHzi6PDVxUG6vPt5sD0mpNwak1ESGmdQEqXfvM+wh5BaahF9XRVgAAAABJRU5ErkJggg=="/>'

    notify = (msg, chan) ->
        if typeof chan isnt 'number' or not Client.hasChannel chan
            return

        Network.sendChanMessage chan, msg

    pm = (id, msg) ->
        unless confetti.players.hasOwnProperty id
            return

        Network.sendPM id, msg

    printm = (msg) ->
        print msg

    html = (msg, chan) ->
        if typeof chan is 'number' and chan isnt -1
            Client.printChannelMessage msg, chan, yes
        else
            Client.printHtml msg

    bold = (title, msg = '', chan, color = 'black') ->
        html "<timestamp/><b style='color: #{color};'>#{title}:</b> #{msg}", chan

    notification = (msg, title = Client.windowTitle, allowActive = yes) ->
        if confetti.cache.initialized isnt no and confetti.cache.read('notifications') is on
            if Client.windowActive()
                if allowActive
                    html "&nbsp;&nbsp;&nbsp;#{poIcon} <b>#{title}</b><br/>#{bullet} #{msg}"
            else
                # Prefix the server name in tray message, so the user knows what server it's coming from.
                if title isnt Client.windowTitle
                    title = "#{Client.windowTitle} - #{title}"

                Client.trayMessage title, confetti.util.stripHtml(msg)

    bot = (msg, chan = Client.currentChannel()) ->
        html "<font color='#{confetti.cache.get('botcolor')}'><timestamp/><b>#{confetti.cache.get('botname')}:</b></font> #{msg}", chan

    confetti.msg = {
        notify
        pm
        print: printm
        html
        bold
        notification
        bot

        bullet
        indent
        poIcon
    }
