# Pokemon Usage Statistics plugin
do ->
    # Want to generate this list? Go here: http://stats.pokemon-online.eu/index.html
    # And type this into your browser console:
    # var names = []; $('.tier').each(function () { names.push($(this).text().trim()); }); names
    # Then run it through a beautifier like http://jsonlint.com/
    tiers = [
        "Adv 200",
        "Adv LC",
        "Adv NU",
        "Adv OU",
        "Adv Uber Doubles",
        "Adv Ubers",
        "Adv UU",
        "Battle Factory",
        "Battle Factory 6v6",
        "BW2 LC",
        "BW2 LU",
        "BW2 NU",
        "BW2 OU",
        "BW2 OU Doubles",
        "BW2 Uber Doubles",
        "BW2 Ubers",
        "BW2 UU",
        "Colosseum",
        "Crystal",
        "Emerald",
        "GSC LC",
        "GSC OU",
        "GSC Ubers",
        "GSC UU",
        "HGSS LC",
        "HGSS NU",
        "HGSS OU",
        "HGSS OU Doubles",
        "HGSS Uber Doubles",
        "HGSS Ubers",
        "HGSS UU",
        "Inverted Battle",
        "JAA",
        "Metronome",
        "Mixed Tiers Gen 1",
        "Mixed Tiers Gen 2",
        "Mixed Tiers Gen 3",
        "Mixed Tiers Gen 4",
        "Mixed Tiers Gen 5",
        "Mixed Tiers Gen 6",
        "Monotype",
        "Platinum",
        "Pre-PokeBank OU",
        "Random Battle",
        "RBY BL",
        "RBY LC",
        "RBY NU",
        "RBY OU",
        "RBY Ubers",
        "RBY UU",
        "Sky Battle",
        "Stadium",
        "Stadium 2",
        "VGC 2014",
        "XY 1v1",
        "XY Cup",
        "XY LC",
        "XY LU",
        "XY OU",
        "XY OU Doubles",
        "XY OU Triples",
        "XY Ubers",
        "XY UU",
        "Yellow"
    ]

    confetti.command 'usagetiers', ['Shows the tiers which have usage statistics. Click on any of them to open full usage statistics.', 'send@usagetiers'], (_, chan) ->
        html = "<table cellpadding='0.8'><tr><th colspan=12><font color=#aa6a2b>Usage Statistics</font></th></tr><tr>"

        for tier, index in tiers
            if index % 12 is 0
                html += "</tr><tr>"

            html += "<td><a href='po:send/-usagestats #{tier}' style='color:#aa6a2b;text-decoration:none;'><b>#{tier}</b></a></td>"

        html += "</tr></table><br>"
        confetti.msg.html html, chan

    confetti.command 'usagestats', ['usagestats [tier]:[all?]', "Shows usage stats of a specific tier. Hover over an entry to see the Pok&eacute;mon's name, click it to go to its usage page. If [all] is 'all', ", 'setmsg@usagestats tier'], (data, chan) ->
        tier = ''
        parts = data.split(':')
        tname = parts[0].toLowerCase()
        all = (parts[1] or '').toLowerCase() is 'all'

        for name in tiers
            if name.toLowerCase() is tname
                tier = name
                break

        unless tier
            return confetti.msg.bot "The tier #{sys.htmlEscape(data)} doesn't have any usage or doesn't exist. For a list of tiers, use the <a href='po:send/-usagetiers'>#{confetti.cache.get('commandindicator')}usagetiers</a> command.", chan

        sys.webCall "http://stats.pokemon-online.eu/#{tier}/ranked_stats.txt", (resp) ->
            unless resp
                return confetti.msg.bot "Couldn't load usage statistics for tier #{tier} -- maybe your internet connection is down? The plugin might also be out of date, or the PO site is having issues (try again later).", chan
            if resp.indexOf("<!DOCTYPE html>") isnt -1
                return confetti.msg.bot "Usage statistics for this tier are unavailable as there were insufficient battles.", chan

            html = "<table cellpadding='0.8'><tr><th colspan=8><font color=#aa6a2b>Usage Statistics for #{tier}</font></th></tr><tr>"
            pokemon = resp.split '\n'
            for poke, index in pokemon
                parts = poke.split(' ')

                if parts.length < 3
                    continue

                # All of this is necessary because of Mr. Mime :(
                name = parts.slice(0, parts.length - 2)
                num = sys.pokeNum(name)
                species = num & 65535

                usage = (+parts.slice(-2, -1)).toFixed(2)
                battles = +parts.slice(-1)

                # Don't render pokemon with < 1% usage
                if !all and +usage <= 1
                    continue

                if index % 6 is 0
                    html += "</tr><tr>"

                html += "<td><a href='http://stats.pokemon-online.eu/#{tier}/#{num}.html' style='font-weight:none;text-decoration:none;color:black;' title='#{name}'><b>#{index + 1}</b>. <img src='icon:#{num}'> - <b>#{usage}%</b> <small>(#{battles} battle#{if battles is 1 then '' else 's'})</small></a></td>"

            confetti.msg.html html, chan

    confetti.hook 'commands:misc', ->
        confetti.commandList.cmd 'usagetiers'
        confetti.commandList.cmd 'usagestats'
