confetti.pokedex = function() {
  var Pokedex, categoryMoves, ccLevels, dexFiles, dumpInfo, dumpMoves, eggGroup1, eggGroup2, eggGroup2Pokes, eggMoves, eventMoves, evoMoves, i, levelMoves, move, moveFiles, moveNum, movelist, moves, nextPoke, parseDbFile, parseMoveFile, poke, pokeEvoLevel, pokeEvolutions, pokeGender, pokeHeight, pokeId, pokeMoves, pokeName, pokeNum, pokeWeight, pokenum, pokestat, space, split, stat, stats, tmMoves, tutorMoves, uniqueMoves, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1, _ref2, _ref3;
  if (confetti.pokedex.data) {
    return confetti.pokedex.data;
  }
  parseDbFile = function(file) {
    var res;
    res = sys.getFileContent("db/pokes/" + file + ".txt");
    if (!res) {
      return [];
    }
    return res.split('\n');
  };
  parseMoveFile = function(file) {
    return parseDbFile("6G/" + file + "_moves");
  };
  dumpMoves = function(moveArray) {
    var move, obj, pokeId, space, split, _i, _len;
    obj = {};
    for (_i = 0, _len = moveArray.length; _i < _len; _i++) {
      move = moveArray[_i];
      if (!move.trim()) {
        continue;
      }
      split = move.split(":");
      space = move.split(" ");
      pokeId = parseInt(split[0], 10);
      if (split[1][0] !== "0") {
        continue;
      }
      space.splice(0, 1);
      obj[pokeId] = space.join(" ");
    }
    return obj;
  };
  dumpInfo = function(infoArray, slashes) {
    var info, num, obj, parts, pokemon, _i, _len;
    if (slashes == null) {
      slashes = false;
    }
    obj = {};
    for (_i = 0, _len = infoArray.length; _i < _len; _i++) {
      info = infoArray[_i];
      parts = info.split(' ');
      pokemon = parts[0].split(':');
      if (!pokemon[1]) {
        continue;
      }
      if (pokemon[0][0] === '0' || pokemon[1][0] !== '0') {
        continue;
      }
      num = parts[1];
      if (slashes) {
        if (num.indexOf('/') !== -1) {
          num = num.split('/')[0];
        }
      }
      obj[+pokemon[0]] = +num;
    }
    return obj;
  };
  Pokedex = {
    data: {},
    files: {
      stats: parseDbFile("6G/stats"),
      weight: parseDbFile("weight"),
      height: parseDbFile("height"),
      evos: parseDbFile("evos"),
      evolevels: parseDbFile("6G/minlevels"),
      genders: parseDbFile("gender"),
      cc: parseDbFile("level_balance"),
      egggroup1: parseDbFile("egg_group_1"),
      egggroup2: parseDbFile("egg_group_2"),
      moves: {
        egg: parseMoveFile("egg"),
        level: parseMoveFile("level"),
        evo: parseMoveFile("pre_evo"),
        event: parseMoveFile("special"),
        tms: parseMoveFile("tm_and_hm"),
        tutor: parseMoveFile("tutor")
      }
    }
  };
  dexFiles = Pokedex.files;
  moveFiles = dexFiles.moves;
  pokeWeight = dumpInfo(dexFiles.weight);
  pokeHeight = dumpInfo(dexFiles.height);
  pokeGender = dumpInfo(dexFiles.genders);
  pokeEvoLevel = dumpInfo(dexFiles.evolevels, true);
  eggMoves = dumpMoves(moveFiles.egg);
  levelMoves = dumpMoves(moveFiles.level);
  evoMoves = dumpMoves(moveFiles.evo);
  eventMoves = dumpMoves(moveFiles.event);
  tmMoves = dumpMoves(moveFiles.tms);
  tutorMoves = dumpMoves(moveFiles.tutor);
  pokeMoves = {};
  eggGroup2Pokes = {};
  ccLevels = {};
  pokeEvolutions = {};
  pokeId = 718;
  while (pokeId) {
    uniqueMoves = [];
    moves = [levelMoves[pokeId]];
    if (eggMoves.hasOwnProperty(pokeId)) {
      moves.push(eggMoves[pokeId]);
    }
    if (eventMoves.hasOwnProperty(pokeId)) {
      moves.push(eventMoves[pokeId]);
    }
    if (evoMoves.hasOwnProperty(pokeId)) {
      moves.push(evoMoves[pokeId]);
    }
    if (tutorMoves.hasOwnProperty(pokeId)) {
      moves.push(tutorMoves[pokeId]);
    }
    if (tmMoves.hasOwnProperty(pokeId)) {
      moves.push(tmMoves[pokeId]);
    }
    for (_i = 0, _len = moves.length; _i < _len; _i++) {
      movelist = moves[_i];
      categoryMoves = movelist.split(' ');
      for (_j = 0, _len1 = categoryMoves.length; _j < _len1; _j++) {
        moveNum = categoryMoves[_j];
        move = +moveNum;
        if (uniqueMoves.indexOf(move) === -1) {
          uniqueMoves.push(move);
        }
      }
    }
    pokeMoves[pokeId] = uniqueMoves;
    pokeId -= 1;
  }
  _ref = dexFiles.cc;
  for (i = _k = 0, _len2 = _ref.length; _k < _len2; i = ++_k) {
    poke = _ref[i];
    space = poke.split(' ');
    split = space[0].split(':');
    if (!space[1]) {
      continue;
    }
    pokenum = +split[0];
    pokeName = sys.pokemon(pokenum);
    if (poke[0] === '0' || split[1][0] !== '0') {
      continue;
    }
    ccLevels[pokenum] = +space[1];
  }
  _ref1 = dexFiles.evos;
  for (i = _l = 0, _len3 = _ref1.length; _l < _len3; i = ++_l) {
    poke = _ref1[i];
    split = poke.split(" ");
    pokeNum = +split[0];
    nextPoke = dexFiles.evos[i + 1];
    pokeName = sys.pokemon(pokeNum);
    if (nextPoke) {
      nextPoke = nextPoke.split(' ');
    }
    if (nextPoke && +split[1] === +nextPoke[0]) {
      pokeEvolutions[pokeNum] = [split[1], nextPoke[1]];
    } else if (split.length === 3 && split[1] === split[2]) {
      pokeEvolutions[pokeNum] = [split[1]];
    } else if (split.length !== 2) {
      split.splice(0, 1);
      pokeEvolutions[pokeNum] = split;
    } else if ((+split[0] + 1) === +split[1]) {
      pokeEvolutions[pokeNum] = [split[1]];
    }
  }
  _ref2 = dexFiles.egggroup2;
  for (_m = 0, _len4 = _ref2.length; _m < _len4; _m++) {
    poke = _ref2[_m];
    poke = poke.split(' ');
    if (poke === '0') {
      continue;
    }
    eggGroup2Pokes[poke[0]] = poke[1];
  }
  pokeId = 0;
  _ref3 = dexFiles.stats;
  for (_n = 0, _len5 = _ref3.length; _n < _len5; _n++) {
    stat = _ref3[_n];
    poke = stat.split(':');
    if (!poke[1]) {
      break;
    }
    if (poke[1][0] !== '0' || poke[0] === '0') {
      continue;
    }
    pokeId += 1;
    pokeName = sys.pokemon(pokeId);
    stats = (function() {
      var _len6, _o, _ref4, _results;
      _ref4 = stat.split(' ');
      _results = [];
      for (_o = 0, _len6 = _ref4.length; _o < _len6; _o++) {
        pokestat = _ref4[_o];
        _results.push(+pokestat);
      }
      return _results;
    })();
    stats.splice(0, 1);
    eggGroup1 = '';
    eggGroup2 = '';
    if (dexFiles.egggroup1.hasOwnProperty(pokeId)) {
      eggGroup1 = dexFiles.egggroup1[pokeId].split(' ').splice(1).join(' ');
    }
    if (eggGroup2Pokes.hasOwnProperty(pokeId)) {
      eggGroup2 = eggGroup2Pokes[pokeId];
    }
    Pokedex.data[pokeName] = {
      weight: pokeWeight[pokeId],
      height: pokeHeight[pokeId],
      minlvl: pokeEvoLevel[pokeId],
      genders: pokeGender[pokeId],
      egg: [eggGroup1, eggGroup2],
      moves: pokeMoves[pokeId],
      cc: ccLevels[pokeId],
      evos: pokeEvolutions[pokeId],
      stats: {
        HP: stats[0],
        ATK: stats[1],
        DEF: stats[2],
        SPATK: stats[3],
        SPDEF: stats[4],
        SPD: stats[5]
      }
    };
  }
  confetti.pokedex.data = Pokedex;
  return Pokedex;
};

(function() {
  var baseStatTotal, evosOf, firstGen, formatStat, moveColors, movesOf, pokeAbilities, pokeGender, pokeType, statColors, statRanges, statTotalRanges, stats, statsOf, weightDamage;
  statRanges = [30, 50, 60, 70, 80, 90, 100, 200, 300];
  statTotalRanges = [150, 250, 300, 350, 400, 450, 500, 630, 720];
  statColors = ["#ff0505", "#fd5300", "#ff7c49", "#ffaf49", "#ffd749", "#b9d749", "#5ee70a", "#3093ff", "#6c92bd"];
  stats = ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"];
  moveColors = {
    0: "#a8a878",
    1: "#c03028",
    2: "#a890f0",
    3: "#a040a0",
    4: "#e0c068",
    5: "#b8a038",
    6: "#a8b820",
    7: "#705898",
    8: "#b8b8d0",
    9: "#f08030",
    10: "#6890f0",
    11: "#78c850",
    12: "#f8d030",
    13: "#f85888",
    14: "#98d8d8",
    15: "#7038f8",
    16: "#705848",
    17: "#f088f6",
    18: "#68a090"
  };
  pokeGender = function(data) {
    var gender;
    gender = data.genders;
    if (gender === 3) {
      return "<img src='Themes/Classic/genders/gender1.png'> <img src='Themes/Classic/genders/gender2.png'>";
    }
    return "<img src='Themes/Classic/genders/gender" + gender + ".png'>";
  };
  firstGen = function(poke) {
    if (poke <= 151) {
      return 1;
    } else if (poke <= 251) {
      return 2;
    } else if (poke <= 386) {
      return 3;
    } else if (poke <= 493) {
      return 4;
    } else if (poke <= 649) {
      return 5;
    } else {
      return 6;
    }
  };
  evosOf = function(data) {
    var evo, evos, pokeName, result, _i, _len;
    evos = data.evos || [];
    result = [];
    for (_i = 0, _len = evos.length; _i < _len; _i++) {
      evo = evos[_i];
      pokeName = sys.pokemon(evo);
      result.push("<b><a href='http://veekun.com/dex/pokemon/" + pokeName + "' style='color: " + moveColors[sys.pokeType1(evo)] + "'>" + pokeName + "</a></b>");
    }
    return confetti.util.fancyJoin(result);
  };
  pokeType = function(pokeId) {
    var result, type1, type2, typeName;
    type1 = sys.pokeType1(pokeId);
    type2 = sys.pokeType2(pokeId);
    result = '';
    typeName = sys.type(type1);
    result += "<b><a href='http://veekun.com/dex/types/" + typeName + "' style='color: " + moveColors[type1] + "'>" + typeName + "</a></b>";
    if (type2 !== 18) {
      typeName = sys.type(type2);
      result += " & <b><a href='http://veekun.com/dex/types/" + typeName + "' style='color: " + moveColors[type2] + "'>" + typeName + "</a></b>";
    }
    return result;
  };
  pokeAbilities = function(pokeId) {
    var abilities, abilityName, result;
    abilities = [sys.pokeAbility(pokeId, 0), sys.pokeAbility(pokeId, 1), sys.pokeAbility(pokeId, 2)];
    result = '';
    abilityName = sys.ability(abilities[0]);
    result += "<b><a href='http://veekun.com/dex/abilities/" + (encodeURIComponent(abilityName)) + "' style='color: black;'>" + abilityName + "</a></b>";
    if (abilities[1] !== 0) {
      abilityName = sys.ability(abilities[1]);
      result += " | <b><a href='http://veekun.com/dex/abilities/" + (encodeURIComponent(abilityName)) + "' style='color: black;'>" + abilityName + "</a></b>";
    }
    if (abilities[2] !== 0) {
      abilityName = sys.ability(abilities[2]);
      result += " | <b><a href='http://veekun.com/dex/abilities/" + (encodeURIComponent(abilityName)) + "' style='color: black;'>" + abilityName + "</a></b> (<u>Hidden Ability</u>)";
    }
    return result;
  };
  movesOf = function(data) {
    var move, moveName, moves, result, _i, _len;
    moves = data.moves.sort(function(a, b) {
      return sys.moveType(b) - sys.moveType(a);
    });
    result = [];
    for (_i = 0, _len = moves.length; _i < _len; _i++) {
      move = moves[_i];
      moveName = sys.move(move);
      result.push("<small><b><a href='http://veekun.com/dex/moves/" + (encodeURIComponent(moveName)) + "' style='color: " + moveColors[sys.moveType(move)] + "'>" + moveName + "</b></small>");
    }
    return result.join(', ') + '.';
  };
  baseStatTotal = function(data) {
    var i, range, stat, total, _, _i, _len, _ref;
    total = 0;
    _ref = data.stats;
    for (_ in _ref) {
      stat = _ref[_];
      total += stat;
    }
    for (i = _i = 0, _len = statTotalRanges.length; _i < _len; i = ++_i) {
      range = statTotalRanges[i];
      if (total <= range) {
        return "<b style='color: " + statColors[i] + "'>" + total + "</b>";
      }
    }
    return "<b style='color: " + (statColors.slice(-1)) + "'>" + total + "</b>";
  };
  formatStat = function(data, stat) {
    var i, range, value, _i, _len;
    value = data.stats[stat];
    for (i = _i = 0, _len = statRanges.length; _i < _len; i = ++_i) {
      range = statRanges[i];
      if (value <= range) {
        return "<b style='color: " + statColors[i] + "'>" + value + "</b>";
      }
    }
    return "<b style='color: " + (statColors.slice(-1)) + "'>" + value + "</b>";
  };
  statsOf = function(data) {
    var result, stat, _i, _len;
    result = "";
    for (_i = 0, _len = stats.length; _i < _len; _i++) {
      stat = stats[_i];
      result += stat + ": " + formatStat(data, stat);
      if (stat !== 'SPD') {
        result += " | ";
      }
    }
    return result;
  };
  weightDamage = function(weight) {
    var color, damage;
    damage = 0;
    color = "";
    if (weight >= 200) {
      damage = 120;
      color = "#6c92bd";
    } else if (weight >= 100) {
      damage = 100;
      color = "#5ee70a";
    } else if (weight >= 50) {
      damage = 80;
      color = "#b9d749";
    } else if (weight >= 25) {
      damage = 60;
      color = "#ffaf49";
    } else if (weight >= 10) {
      damage = 40;
      color = "#fd5300";
    } else {
      damage = 20;
      color = "#ff0505";
    }
    return "<b style='color: " + color + "'>" + damage + "</b>";
  };
  return confetti.pokedex.render = function(pokemon, chan) {
    var data, eggInfo, multiAbility, multiType, pokeId, template;
    pokeId = sys.pokeNum(pokemon);
    data = confetti.pokedex().data[pokemon];
    multiType = sys.pokeType2(pokeId) !== 18;
    multiAbility = sys.pokeAbility(pokeId, 1) !== 0;
    template = ["<font color='cornflowerblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>", "<br><font size='5'><b><a href='http://veekun.com/dex/pokemon/" + pokemon + "' style='color: " + moveColors[sys.pokeType1(pokeId)] + "'>" + pokemon + "</a></b></font>"];
    template.push("<img src='pokemon:num=" + pokeId + "'> <img src='pokemon:num=" + pokeId + "&back=true'> <img src='pokemon:num=" + pokeId + "&shiny=true'> <img src='pokemon:num=" + pokeId + "&shiny=true&back=true'><br>");
    template.push("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + pokeGender(data));
    template.push("National Dex Number: <b>" + pokeId + "</b>");
    template.push("Generation <b>" + (firstGen(pokeId)) + "</b> Pokémon.");
    if (data.evos || (data.minlvl !== 1 && data.minlvl !== 100)) {
      template.push("");
    }
    if (data.evos) {
      template.push(("Evolution" + (data.evos.length === 1 ? 's' : '') + ": ") + evosOf(data));
    }
    if (data.minlvl !== 1 && data.minlvl !== 100) {
      template.push("Minimum Level: <b>" + data.minlvl + "</b>");
    }
    template.push("Level in Challenge Cup: <b>" + data.cc + "</b><br>");
    template.push(("Type" + (multiType ? 's' : '') + ": ") + pokeType(pokeId));
    eggInfo = "";
    if (data.egg[0]) {
      eggInfo += "<b>" + data.egg[0] + "</b>";
    }
    if (data.egg[1]) {
      eggInfo += " " + (data.egg[0] ? 'and' : '') + " <b>" + data.egg[1] + "</b>";
    }
    if (eggInfo) {
      template.push(("Egg Group" + (data.egg[1] ? 's' : '') + ": ") + eggInfo);
    }
    template.push("Abilit" + (multiAbility ? 'ies' : 'y') + ": " + (pokeAbilities(pokeId)) + "<br>");
    template.push("Weight: <b>" + data.weight + "kg</b>");
    template.push("Height <b>" + data.height + "m</b>");
    template.push("Weight Attack Damage: <b>" + (weightDamage(data.weight)) + "</b><br>");
    template.push(statsOf(data));
    template.push("Base Stat Total: " + baseStatTotal(data));
    if (pokemon !== 'Smeargle') {
      template.push("<br> " + movesOf(data));
    } else {
      template.push("<br> Smeargle learns all moves but Chatter and Transform.");
    }
    template.push("<br><timestamp/><br><font color='cornflowerblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</b></font>");
    return confetti.msg.html(template.join("<br>"), chan);
  };
})();

(function() {
  confetti.command('pokedex', ['pokedex [pokémon?]', 'Shows a Pokédex entry for the given Pokémon, or a random one if none was given. This command will cause slight lag when first used in this session.', 'setmsg@pokedex [pokemon]'], function(data, chan) {
    var ex, forme, num, pokeName;
    forme = data.indexOf('-');
    if (forme !== -1) {
      data = data.substr(0, forme);
    }
    num = sys.pokeNum(data);
    if (!num) {
      data = parseInt(data, 10);
      pokeName = sys.pokemon(data);
      if (pokeName) {
        data = pokeName;
      }
    } else {
      data = sys.pokemon(num);
    }
    try {
      return confetti.pokedex.render(data, chan);
    } catch (_error) {
      ex = _error;
      confetti.msg.bot("Selecting an entry at random.");
      return confetti.pokedex.render(sys.pokemon(sys.rand(1, 719)), chan);
    }
  });
  confetti.alias('dex', 'pokedex');
  return confetti.hook('commands:misc', function() {
    return confetti.commandList.cmd('pokedex');
  });
})();
