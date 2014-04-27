(function() {
  var tiers;
  tiers = ["Adv 200", "Adv LC", "Adv NU", "Adv OU", "Adv Uber Doubles", "Adv Ubers", "Adv UU", "Battle Factory", "Battle Factory 6v6", "BW2 LC", "BW2 LU", "BW2 NU", "BW2 OU", "BW2 OU Doubles", "BW2 Uber Doubles", "BW2 Ubers", "BW2 UU", "Colosseum", "Crystal", "Emerald", "GSC LC", "GSC OU", "GSC Ubers", "GSC UU", "HGSS LC", "HGSS NU", "HGSS OU", "HGSS OU Doubles", "HGSS Uber Doubles", "HGSS Ubers", "HGSS UU", "Inverted Battle", "JAA", "Metronome", "Mixed Tiers Gen 1", "Mixed Tiers Gen 2", "Mixed Tiers Gen 3", "Mixed Tiers Gen 4", "Mixed Tiers Gen 5", "Mixed Tiers Gen 6", "Monotype", "Platinum", "Pre-PokeBank OU", "Random Battle", "RBY BL", "RBY LC", "RBY NU", "RBY OU", "RBY Ubers", "RBY UU", "Sky Battle", "Stadium", "Stadium 2", "VGC 2014", "XY 1v1", "XY Cup", "XY LC", "XY LU", "XY OU", "XY OU Doubles", "XY OU Triples", "XY Ubers", "XY UU", "Yellow"];
  confetti.command('usagetiers', ['Shows the tiers which have usage statistics. Click on any of them to open full usage statistics.', 'send@usagetiers'], function(_, chan) {
    var html, index, tier, _i, _len;
    html = "<table cellpadding='0.8'><tr><th colspan=12><font color=#aa6a2b>Usage Statistics</font></th></tr><tr>";
    for (index = _i = 0, _len = tiers.length; _i < _len; index = ++_i) {
      tier = tiers[index];
      if (index % 12 === 0) {
        html += "</tr><tr>";
      }
      html += "<td><a href='po:send/-usagestats " + tier + "' style='color:#aa6a2b;text-decoration:none;'><b>" + tier + "</b></a></td>";
    }
    html += "</tr></table><br>";
    return confetti.msg.html(html, chan);
  });
  confetti.command('usagestats', ['usagestats [tier]', "Shows usage stats of a specific tier. Hover over an entry to see the Pok&eacute;mon's name, click it to go to its usage page.", 'setmsg@usagestats tier'], function(data, chan) {
    var name, tier, tname, _i, _len;
    tier = '';
    tname = data.toLowerCase();
    for (_i = 0, _len = tiers.length; _i < _len; _i++) {
      name = tiers[_i];
      if (name.toLowerCase() === tname) {
        tier = name;
        break;
      }
    }
    if (!tier) {
      return confetti.msg.bot("The tier " + (sys.htmlEscape(data)) + " doesn't have any usage or doesn't exist. For a list of tiers, use the <a href='po:send/-usagetiers'>" + (confetti.cache.get('commandindicator')) + "usagetiers</a> command.", chan);
    }
    return sys.webCall("http://stats.pokemon-online.eu/" + tier + "/ranked_stats.txt", function(resp) {
      var battles, html, index, num, parts, poke, pokemon, species, usage, _j, _len1;
      if (!resp) {
        return confetti.msg.bot("Couldn't load usage statistics for tier " + tier + " -- maybe your internet connection is down? The plugin might also be out of date, or the PO site is having issues (try again later).", chan);
      }
      if (resp.indexOf("<!DOCTYPE html>") !== -1) {
        return confetti.msg.bot("Usage statistics for this tier are unavailable as there were insufficient battles.", chan);
      }
      html = "<table cellpadding='0.8'><tr><th colspan=8><font color=#aa6a2b>Usage Statistics for " + tier + "</font></th></tr><tr>";
      pokemon = resp.split('\n');
      for (index = _j = 0, _len1 = pokemon.length; _j < _len1; index = ++_j) {
        poke = pokemon[index];
        parts = poke.split(' ');
        if (parts.length < 3) {
          continue;
        }
        name = parts.slice(0, parts.length - 2);
        num = sys.pokeNum(name);
        species = num & 65535;
        usage = (+parts.slice(-2, -1)).toFixed(2);
        battles = +parts.slice(-1);
        if (+usage === 0) {
          continue;
        }
        if (index % 6 === 0) {
          html += "</tr><tr>";
        }
        html += "<td><a href='http://stats.pokemon-online.eu/" + tier + "/" + num + ".html' style='font-weight:none;text-decoration:none;color:black;' title='" + name + "'><b>" + (index + 1) + "</b>. <img src='icon:" + num + "'> - <b>" + usage + "%</b> <small>(" + battles + " battle" + (battles === 1 ? '' : 's') + ")</small></a></td>";
      }
      return confetti.msg.html(html, chan);
    });
  });
  return confetti.hook('commands:misc', function() {
    confetti.commandList.cmd('usagetiers');
    return confetti.commandList.cmd('usagestats');
  });
})();
