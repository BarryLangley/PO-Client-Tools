var Client, Global, Network, confetti, poScript,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Client = client;

Network = Client.network();

Global = this;

if (typeof confetti !== 'object') {
  confetti = {
    initialized: false,
    cache: {
      initialized: false
    },
    players: {},
    dataDir: sys.scriptsFolder,
    cacheFile: 'confetti.json',
    loginTime: 0
  };
}

Network.playerLogin.connect(function() {
  return confetti.loginTime = +sys.time();
});

(function() {
  var an, copyArray, escapeRegex, fancyJoin, isAlpha, isPlainObject, noop, random, removeDuplicates, shuffle, stripHtml, stripquotes;
  random = function(array) {
    if (Array.isArray(array)) {
      return array[sys.rand(0, array.length)];
    } else {
      return array;
    }
  };
  copyArray = function(array) {
    return [].concat(array);
  };
  removeDuplicates = function(array) {
    var dupeless, val, _i, _len;
    dupeless = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      val = array[_i];
      if (dupeless.indexOf(val) === -1) {
        dupeless.push(val);
      }
    }
    return dupeless;
  };
  isPlainObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };
  shuffle = function(array) {
    var i, length, t;
    length = array.length;
    while (length) {
      i = Math.floor(Math.random() * length--);
      t = array[length];
      array[length] = array[i];
      array[i] = t;
    }
    return array;
  };
  an = function(what) {
    var _ref;
    if ((_ref = what[0]) === 'a' || _ref === 'e' || _ref === 'u' || _ref === 'i' || _ref === 'o') {
      return "an " + what;
    } else {
      return "a " + what;
    }
  };
  fancyJoin = function(array, delimiter, lastDelimiter) {
    var element, index, len, str, _i, _len;
    if (delimiter == null) {
      delimiter = ', ';
    }
    if (lastDelimiter == null) {
      lastDelimiter = 'and';
    }
    str = '';
    len = array.length;
    if (len === 0) {
      return '';
    } else if (len === 1) {
      return array[0];
    } else if (len === 2) {
      return "" + array[0] + " " + lastDelimiter + " " + array[1];
    }
    for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
      element = array[index];
      if (len === (index + 1)) {
        str += "" + lastDelimiter + " " + element;
        break;
      } else {
        str += element + delimiter;
      }
    }
    return str;
  };
  stripHtml = function(str) {
    return str.replace(/<\/?[^>]*>/g, "");
  };
  escapeRegex = function(str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  };
  stripquotes = function(str) {
    return str.replace(/'/g, "\'");
  };
  isAlpha = function(chr) {
    chr = chr.toLowerCase();
    return chr >= 'a' && chr <= 'z';
  };
  noop = function() {};
  return confetti.util = {
    random: random,
    copyArray: copyArray,
    removeDuplicates: removeDuplicates,
    isPlainObject: isPlainObject,
    isAlpha: isAlpha,
    shuffle: shuffle,
    an: an,
    fancyJoin: fancyJoin,
    stripHtml: stripHtml,
    escapeRegex: escapeRegex,
    stripquotes: stripquotes,
    noop: noop
  };
})();

(function() {
  var read, readJson, readLocal, readLocalJson, write, writeLocal;
  read = function(file) {
    if (sys.isSafeScripts()) {
      return "";
    }
    sys.appendToFile(file, "");
    return sys.getFileContent(file) || "";
  };
  readJson = function(file) {
    return JSON.parse(read(file) || '{}');
  };
  readLocal = function(file) {
    return read(confetti.dataDir + file);
  };
  readLocalJson = function(file) {
    return readJson(confetti.dataDir + file);
  };
  write = function(file, data) {
    if (sys.isSafeScripts()) {
      return;
    }
    if (Object.prototype.toString(data) === '[object Object]') {
      data = JSON.stringify(data);
    }
    return sys.writeToFile(file, data);
  };
  writeLocal = function(file, data) {
    return write(confetti.dataDir + file, data);
  };
  return confetti.io = {
    read: read,
    readJson: readJson,
    readLocal: readLocal,
    readLocalJson: readLocalJson,
    write: write,
    writeLocal: writeLocal,
    writeLocalJson: writeLocal
  };
})();

(function() {
  var Cache;
  Cache = (function() {
    function Cache(file, hash, saved) {
      var ex;
      this.file = file != null ? file : confetti.cacheFile;
      this.hash = hash != null ? hash : {};
      this.saved = saved != null ? saved : 0;
      try {
        this.hash = confetti.io.readLocalJson(this.file);
      } catch (_error) {
        ex = _error;
        confetti.io.writeLocal(this.file, '{}');
      }
    }

    Cache.prototype.store = function(key, value, once) {
      if (once == null) {
        once = false;
      }
      if (!once || (once && typeof this.hash[key] === 'undefined')) {
        this.hash[key] = value;
        this.saved += 1;
      }
      return this;
    };

    Cache.prototype.clear = function(key, value) {
      if (typeof this.hash[key] !== 'undefined') {
        delete this.hash[key];
        this.saved += 1;
      }
      return this;
    };

    Cache.prototype.read = function(key) {
      return this.hash[key];
    };

    Cache.prototype.get = function(key) {
      return this.hash[key];
    };

    Cache.prototype.save = function() {
      if (this.saved > 0) {
        confetti.io.writeLocalJson(this.file, this.hash);
        this.saved = 0;
      }
      return this;
    };

    Cache.prototype.wipe = function() {
      this.hash = {};
      confetti.io.writeLocal(this.file, '{}');
      return this;
    };

    Cache.prototype.once = true;

    return Cache;

  })();
  return confetti.Cache = Cache;
})();

(function() {
  var authToName, battling, create, fancyName, name, status;
  create = function(id) {
    return {
      id: id
    };
  };
  battling = function(id) {
    if (Client.player == null) {
      return false;
    }
    return (Client.player(id).flags & (1 << 2)) > 0;
  };
  authToName = function(auth) {
    return ['User', 'Moderator', 'Administrator', 'Owner'][auth] || 'Invisible';
  };
  status = function(id) {
    var battlingPart;
    if (typeof id === 'string') {
      id = Client.id(id);
    }
    if (id === -1) {
      return "(<font color='red'><b>Offline</b></font>)";
    } else {
      battlingPart = "";
      if (battling(id)) {
        battlingPart = " - <a href='po:watchplayer/" + id + "' style='text-decoration: none; color: blue;' title='Watch " + (confetti.util.stripquotes(Client.name(id))) + " battle'><b>Battling</b></a>";
      }
      return "(<a href='po:pm/" + id + "' style='text-decoration: none; color: green;'><b>Online</b></a>" + battlingPart + ")";
    }
  };
  name = function(id) {
    var pname;
    if (typeof id === 'string') {
      pname = Client.name(Client.id(id));
    } else {
      pname = Client.name(id);
    }
    if (pname === '~Unknown~') {
      return id;
    } else {
      return pname;
    }
  };
  fancyName = function(id) {
    var pname;
    pname = name(id);
    if (typeof id === 'string') {
      id = Client.id(id);
    }
    return "<a " + (typeof id !== 'string' ? 'href=\'po:info/' + id + '\' ' : '') + ("style='text-decoration: none; color: " + (Client.color(id)) + ";' title='Challenge " + (confetti.util.stripquotes(pname)) + "'><b>" + pname + "</b></a>");
  };
  return confetti.player = {
    create: create,
    battling: battling,
    authToName: authToName,
    status: status,
    name: name,
    fancyName: fancyName
  };
})();

(function() {
  var channelIds, players;
  channelIds = function() {
    var chan, _i, _len, _ref, _results;
    _ref = Client.myChannels();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      chan = _ref[_i];
      _results.push(Client.channelId(chan));
    }
    return _results;
  };
  players = function(chan) {
    var channel, id;
    channel = Client.channel(chan);
    return (function() {
      var _results;
      _results = [];
      for (id in confetti.players) {
        if (channel.hasPlayer(id)) {
          _results.push(parseInt(id, 10));
        }
      }
      return _results;
    })();
  };
  return confetti.channel = {
    channelIds: channelIds,
    players: players
  };
})();

(function() {
  var bold, bot, bullet, html, indent, notification, notify, pm, printm;
  indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  bullet = "" + indent + "&bull;";
  notify = function(msg) {
    if (typeof chan !== 'number' || !Client.hasChannel(chan)) {
      return;
    }
    return Network.sendChanMessage(chan, msg);
  };
  pm = function(id, msg, encoolType) {
    if (!confetti.players.hasOwnProperty(id)) {
      return;
    }
    return Client.sendPM(id, msg);
  };
  printm = function(msg) {
    return print(msg);
  };
  html = function(msg, chan) {
    if (typeof chan === 'number' && chan !== -1) {
      return Client.printChannelMessage(msg, chan, true);
    } else {
      return Client.printHtml(msg);
    }
  };
  bold = function(title, msg, chan) {
    if (msg == null) {
      msg = '';
    }
    return html("<timestamp/><b>" + title + ":</b> " + msg, chan);
  };
  notification = function(msg, title) {
    if (title == null) {
      title = Client.windowTitle;
    }
    if (confetti.cache.initialized !== false && confetti.cache.read('notifications') === true) {
      return Client.trayMessage(title, msg);
    }
  };
  bot = function(msg, chan) {
    if (chan == null) {
      chan = Client.currentChannel();
    }
    return html("<font color='" + (confetti.cache.get('botcolor')) + "'><timestamp/><b>" + (confetti.cache.get('botname')) + ":</b></font> " + msg, chan);
  };
  return confetti.msg = {
    notify: notify,
    pm: pm,
    print: printm,
    html: html,
    bold: bold,
    notification: notification,
    bot: bot,
    bullet: bullet,
    indent: indent
  };
})();

(function() {
  var aliases, commands, hooks, stophook;
  hooks = {};
  stophook = false;
  confetti.hook = function(name, func) {
    if (hooks[name] == null) {
      hooks[name] = [];
    }
    return hooks[name].push(func);
  };
  confetti.callHooks = function() {
    var args, event, hook, res, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    _ref = hooks[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      hook = _ref[_i];
      res = hook.apply(null, args);
      if (res && res.length) {
        args = res;
      }
    }
    return args;
  };
  commands = {};
  aliases = {};
  confetti.command = function(name, help, handler) {
    var complete, desc, usage;
    usage = "";
    desc = "";
    complete = "";
    if (help.length === 2) {
      usage = name;
      desc = help[0], complete = help[1];
    } else {
      usage = help[0], desc = help[1], complete = help[2];
    }
    return commands[name] = {
      name: name,
      help: help,
      handler: handler,
      info: {
        usage: usage,
        desc: desc,
        complete: complete
      }
    };
  };
  confetti.alias = function(alias, command) {
    return aliases[alias] = command;
  };
  confetti.execCommand = function(command, data, message, chan) {
    if (aliases.hasOwnProperty(command)) {
      command = aliases[command];
    }
    if (commands.hasOwnProperty(command)) {
      return commands[command].handler(data, chan, message);
    } else {
      return confetti.msg.bot("The command '" + command + "' doesn't exist, silly!");
    }
  };
  confetti.commands = commands;
  confetti.aliases = aliases;
  return confetti.initCache = function() {
    var once;
    confetti.cache = new confetti.Cache;
    once = confetti.cache.once;
    confetti.cache.store('botname', '±Confetti', once).store('botcolor', '#09abdc', once).store('notifications', true, once).store('commandindicator', '-', once).store('lastuse', 0, once);
    confetti.callHooks('initCache');
    return confetti.cache.save();
  };
})();

(function() {
  confetti.command('blocked', ["Displays a list of blocked players.", 'send@blocked'], function() {
    var blocked, blocklist, count, html, _i, _len;
    blocklist = confetti.cache.get('blocked');
    if (blocklist.length === 0) {
      confetti.msg.bot("There is no one on your block list.");
      return;
    }
    confetti.msg.bold("Blocked Players");
    html = "";
    count = 0;
    for (_i = 0, _len = blocklist.length; _i < _len; _i++) {
      blocked = blocklist[_i];
      count += 1;
      html += "" + confetti.msg.bullet + " " + (confetti.player.fancyName(blocked)) + " " + (confetti.player.status(blocked));
      if (count % 3 === 0) {
        html += "<br/>";
      }
    }
    return confetti.msg.html(html);
  });
  confetti.command('block', ['block [name]', "Blocks a user by automatically ignoring them.", 'setmsg@block [name]'], function(data) {
    var blocked, id, name;
    if (data.length < 1 || data.length > 20) {
      confetti.msg.bot("Uhh, that's too long, I think!");
      return;
    }
    name = confetti.player.name(data);
    data = data.toLowerCase();
    blocked = confetti.cache.get('blocked');
    if (data.length === 0) {
      confetti.msg.bot("Specify a name!");
      return;
    }
    if (__indexOf.call(blocked, data) >= 0) {
      confetti.msg.bot("" + name + " is already blocked!");
      return;
    }
    blocked.push(data);
    confetti.cache.store('blocked', blocked).save();
    id = Client.id(data);
    if (id !== -1) {
      Client.ignore(id, true);
    }
    return confetti.msg.bot("" + name + " is now blocked!");
  });
  confetti.command('unblock', ['unblock [name]', "Unblocks a user.", 'setmsg@unblock [name]'], function(data) {
    var blocked, id, name;
    data = data.toLowerCase();
    name = confetti.player.name(data);
    blocked = confetti.cache.get('blocked');
    if (__indexOf.call(blocked, data) < 0) {
      confetti.msg.bot("" + name + " isn't blocked!");
      return;
    }
    blocked.splice(blocked.indexOf(data), 1);
    confetti.cache.store('blocked', blocked).save();
    id = Client.id(data);
    if (id !== -1) {
      Client.ignore(id, false);
    }
    return confetti.msg.bot("You are no longer blocking " + name + "!");
  });
  confetti.hook('initCache', function() {
    return confetti.cache.store('blocked', [], confetti.cache.once);
  });
  return confetti.hook('onPlayerReceived', function(id) {
    var _ref;
    if (_ref = Client.name(id).toLowerCase(), __indexOf.call(confetti.cache.get('blocked'), _ref) >= 0) {
      return Client.ignore(id, true);
    }
  });
})();

(function() {
  var border, channel, cmd, header;
  channel = null;
  cmd = function(name) {
    var command, complete, indicator, parts;
    if (confetti.commands[name]) {
      command = confetti.commands[name];
      parts = command.info.complete.split('@');
      indicator = confetti.cache.get('commandindicator');
      complete = "<a href='po:" + parts[0] + "/" + indicator + parts[1] + "' style='text-decoration: none; color: green;'>" + indicator + command.info.usage + "</a>";
      return confetti.msg.html("&bull; " + complete + ": " + command.info.desc, channel);
    }
  };
  header = function(msg, size) {
    if (size == null) {
      size = 5;
    }
    return confetti.msg.html("<br/><font size='" + size + "'><b>" + msg + "</b></font><br/>", channel);
  };
  border = function(timestamp) {
    if (timestamp == null) {
      timestamp = false;
    }
    return confetti.msg.html("" + (timestamp ? '<br/><timestamp/><br/>' : '<br/>') + "<font color='skyblue'><b>≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈</b></font>" + (timestamp ? '<br/>' : ''), channel);
  };
  confetti.command('configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], function(_, chan) {
    channel = chan;
    border();
    header('Configuration Commands');
    cmd('botname');
    cmd('botcolor');
    cmd('encool');
    cmd('notifications');
    cmd('commandindicator');
    cmd('autoreconnect');
    return border(true);
  });
  confetti.command('commands', ['Shows this command list.', 'send@commands'], function(_, chan) {
    channel = chan;
    border();
    header('Commands');
    header('Command Lists', 4);
    cmd('commands');
    cmd('configcommands');
    header('Friends', 4);
    cmd('friend');
    cmd('unfriend');
    cmd('friends');
    header('Player Blocking', 4);
    cmd('block');
    cmd('unblock');
    cmd('blocked');
    confetti.msg.html("", chan);
    cmd('reconnect');
    cmd('news');
    cmd('imp');
    cmd('flip');
    cmd('info');
    cmd('chan');
    cmd('html');
    cmd('eval');
    return border(true);
  });
  return confetti.alias('commandlist', 'commands');
})();

(function() {
  var chr, encool, encoolHandlers, index, l33tify, normalLetters, smallcap, smallcapsConvert, smallcapsLetters, smallcapsify, _i, _len;
  normalLetters = 'qwertyuiopasdfghjklzxcvbnm'.split('');
  smallcapsLetters = 'ǫᴡᴇʀᴛʏᴜɪᴏᴘᴀsᴅғɢʜᴊᴋʟᴢxᴄᴠʙɴᴍ'.split('');
  smallcapsConvert = {};
  for (index = _i = 0, _len = normalLetters.length; _i < _len; index = ++_i) {
    chr = normalLetters[index];
    smallcap = smallcapsLetters[index];
    smallcapsConvert[chr] = smallcap;
    smallcapsConvert[chr.toUpperCase()] = smallcap;
  }
  smallcapsify = function(msg) {
    var convert, letter, str, _j, _len1;
    str = [];
    for (index = _j = 0, _len1 = msg.length; _j < _len1; index = ++_j) {
      letter = msg[index];
      convert = smallcapsConvert[letter];
      if (convert) {
        str[index] = convert;
      } else {
        str[index] = letter;
      }
    }
    return str.join('');
  };
  l33tify = function(msg) {
    return msg.replace(/\b(hacker|coder|programmer)(s|z)?\b/gi, 'haxor$2').replace(/\b(hack)(ed|s|z)?\b/gi, 'haxor$2').replace(/\b(thank you)\b/gi, 'TY').replace(/\b(luv|love|wuv|like)(s|z)?\b/gi, 'wub$2').replace(/\b(software)(s|z)?\b/gi, 'wares').replace(/\b((is|are|am) +(cool|wicked|awesome|great))\b/gi, 'rocks').replace(/\b((is|are|am) +(\w+) +(cool|wicked|awesome|great))\b/gi, '$3 rocks').replace(/\b(very|extremely)\b/gi, 'totally').replace(/\b(because)\b/gi, 'coz').replace(/\b(due to)\b/gi, 'coz of').replace(/\b(is|am)\b/gi, 'be').replace(/\b(are)\b/gi, 'is').replace(/\b(rock)(s|z)?\b/gi, 'roxor$2').replace(/\b(porn(o(graph(y|ic))?)?)\b/gi, 'pron').replace(/\b(lamer|dork|jerk|moron|idiot)\b/gi, 'loser').replace(/\b(an loser)\b/gi, 'a loser').replace(/\b(what('s)?)\b/gi, 'wot').replace(/\b(that)\b/gi, 'dat').replace(/\b(this)\b/gi, 'dis').replace(/\b(hooray|yippee|yay|yeah)\b/gi, 'woot').replace(/\b(win|own)(s|z)?\b/gi, 'pwn$2').replace(/\b(won|owned)\b/gi, 'pwnt').replace(/\b(suck)(ed|s|z)?\b/gi, 'suxor$2').replace(/\b(was|were|had been)/gi, 'wuz').replace(/\b(elite)/gi, 'leet').replace(/\byou\b/gi, 'joo').replace(/\b(man|dude|guy|boy)(s|z)?\b/gi, 'dood$2').replace(/\b(men)\b/gi, 'doods').replace(/\bstarbucks?\b/gi, 'bizzo').replace(/\b(the)\b/gi, 'teh').replace(/(ing)\b/gi, 'in\'').replace(/\b(stoked|happy|excited|thrilled|stimulated)\b/gi, 'geeked').replace(/\b(unhappy|depressed|miserable|sorry)\b/gi, 'bummed out').replace(/\b(and|an)\b/gi, 'n').replace(/\b(your|hey|hello|hi)\b/gi, 'yo').replace(/\b(might)\b/gi, 'gonna').replace(/\blater\b/gi, 'l8r').replace(/\bare\b/gi, 'R').replace(/\bbe\b/gi, 'b').replace(/\bto\b/gi, '2').replace(/\ba\b/gi, '@').replace(/(\S)l/g, '$1L').replace(/(\S)l/g, '$1L').replace(/a/gi, '4').replace(/\bfor\b/gi, '4').replace(/e/gi, '3').replace(/i/gi, '1').replace(/o/gi, '0').replace(/s\b/gi, 'z');
  };
  encoolHandlers = {
    none: function(msg) {
      return msg;
    },
    spaces: function(msg) {
      return msg.split('').join(' ');
    },
    smallcaps: function(msg) {
      return smallcapsify(msg);
    },
    leet: function(msg) {
      return l33tify(msg);
    },
    l33t: function(msg) {
      return l33tify(msg);
    },
    reverse: function(msg) {
      return msg.split('').reverse().join('');
    }
  };
  encool = function(msg, type) {
    if (type == null) {
      type = confetti.cache.read('encool');
    }
    return encoolHandlers[type || 'none'](msg);
  };
  confetti.encool = encool;
  confetti.encool.register = function(type, handler) {
    return encoolHandlers[type] = handler;
  };
  confetti.hook('initCache', function() {
    return confetti.cache.store('encool', 'none', confetti.cache.once);
  });
  confetti.hook('manipulateOwnMessage', function(message, chan) {
    return [encool(message), chan];
  });
  return confetti.command('encool', ['encool [type]', 'Changes your encool type to (none, space, smallcaps, leet, reverse).', 'setmsg@encool [type]'], function(data) {
    data = data.toLowerCase();
    if (!(data === 'none' || data === 'spaces' || data === 'smallcaps' || data === 'leet' || data === 'reverse')) {
      confetti.msg.bot("That doesn't look right to me!");
      confetti.msg.bot("Use one of the following types: none, spaces, smallcaps, leet, reverse");
      return;
    }
    if (confetti.cache.read('encool') === data) {
      confetti.msg.bot("Your encool type is already " + data + "!");
      return;
    }
    confetti.cache.store('encool', data).save();
    return confetti.msg.bot("Your encool type is now " + data + "!");
  });
})();

(function() {
  var bullet;
  bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;";
  confetti.command('friends', ["Displays your friends list.", 'send@friends'], function() {
    var count, friend, friends, html, _i, _len;
    friends = confetti.cache.get('friends');
    if (friends.length === 0) {
      confetti.msg.bot("<span title='You have 0 friends.'>There is no one on your friend list.</span>");
      return;
    }
    confetti.msg.bold("Your friends");
    html = "";
    count = 0;
    for (_i = 0, _len = friends.length; _i < _len; _i++) {
      friend = friends[_i];
      count += 1;
      html += "" + confetti.msg.bullet + " " + (confetti.player.fancyName(friend)) + " " + (confetti.player.status(friend));
      if (count % 3 === 0) {
        html += "<br/>";
      }
    }
    return confetti.msg.html(html);
  });
  confetti.command('friend', ['friend [name]', "Adds [name] to your friend list.", 'setmsg@friend [name]'], function(data) {
    var friends, name;
    name = confetti.player.name(data);
    data = data.toLowerCase();
    friends = confetti.cache.get('friends');
    if (data.length === 0) {
      confetti.msg.bot("Specify a name!");
      return;
    }
    if (__indexOf.call(friends, data) >= 0) {
      confetti.msg.bot("" + name + " is already on your friends list!");
      return;
    }
    friends.push(data);
    confetti.cache.store('friends', friends).save();
    return confetti.msg.bot("" + name + " is now on your friends list!");
  });
  confetti.command('unfriend', ['unfriend [name]', "Removes [name] from your friend list.", 'setmsg@unfriend [name]'], function(data) {
    var friends, name;
    data = data.toLowerCase();
    name = confetti.player.name(data);
    friends = confetti.cache.get('friends');
    if (__indexOf.call(friends, data) < 0) {
      confetti.msg.bot("" + name + " isn't on your friends list!");
      return;
    }
    friends.splice(friends.indexOf(data), 1);
    confetti.cache.store('friends', friends).save();
    return confetti.msg.bot("You removed " + name + " from your friends list!");
  });
  confetti.hook('initCache', function() {
    return confetti.cache.store('friends', [], confetti.cache.once);
  });
  return confetti.hook('onPlayerReceived', function(id) {
    var name, time, _ref;
    time = +sys.time();
    if (confetti.loginTime === 0 || time <= confetti.loginTime + 3) {
      return;
    }
    name = Client.name(id);
    if (_ref = name.toLowerCase(), __indexOf.call(confetti.cache.get('friends'), _ref) >= 0) {
      return confetti.msg.notification("" + name + " logged in.", "" + Client.windowTitle + " - Friend");
    }
  });
})();

(function() {
  confetti.command('eval', ['eval [code]', "Evaluates a JavaScript Program.", 'setmsg@eval [code]'], function(data, chan) {
    var ex, res;
    try {
      res = eval(data);
      return confetti.msg.bold("Eval returned", sys.htmlEscape(res), chan);
    } catch (_error) {
      ex = _error;
      confetti.msg.bold("Eval error", "" + ex + " on line " + ex.lineNumber, chan);
      if (ex.backtrace != null) {
        return confetti.msg.html(ex.backtrace.join('<br/>'), chan);
      }
    }
  });
  confetti.command('evalp', 'eval');
  confetti.command('imp', ['imp [name]', "Changes your name to [name]. If the name is deemed invalid, you will be kicked, so be careful!", 'setmsg@imp [name]'], function(data) {
    if (data.length < 1 || data.length > 20) {
      confetti.msg.bot("That name is too long or too short (max 20 characters)!");
      return;
    }
    confetti.msg.bot("You are now known as " + data + "!");
    return Client.changeName(data);
  });
  confetti.alias('changename', 'imp');
  confetti.command('flip', ["Flips a coin in virtual life.", 'send@flip'], function() {
    return confetti.msg.bot("The coin landed " + (Math.random() > 0.5 ? 'heads' : 'tails') + "!");
  });
  confetti.alias('coin', 'flip');
  confetti.command('html', ['html [code]', "Displays some HTML [code] (for testing purposes).", 'setmsg@html [code]'], function(data, chan) {
    return confetti.msg.html(data, chan);
  });
  confetti.command('chan', ['chan [name]', "Joins, jumps to, or creates a channel.", 'setmsg@chan [name]'], function(data) {
    var channelNames, cid, cname, exists, name;
    name = data;
    data = data.toLowerCase();
    channelNames = Client.channelNames();
    exists = false;
    for (cid in channelNames) {
      cname = channelNames[cid];
      if (cname.toLowerCase() === data) {
        name = cname;
        exists = true;
        break;
      }
    }
    if (exists) {
      cid = Client.channelId(name);
      if (Client.hasChannel(cid)) {
        return Client.activateChannel(name);
      } else {
        Client.join(name);
        return Client.activateChannel(name);
      }
    } else {
      Client.join(name);
      return sys.setTimer(function() {
        cid = Client.channelId(name);
        if (cid === 0) {
          return;
        }
        Client.activateChannel(name);
        return confetti.msg.bot("Channel " + name + " created.", cid);
      }, 500, false);
    }
  });
  confetti.alias('joinchan', 'chan');
  confetti.alias('channel', 'chan');
  confetti.alias('goto', 'chan');
  confetti.command('info', ['info [name]', "Shows info for a given user. If you are a moderator, also opens a control panel for the player.", 'setmsg@info [name]'], function(data) {
    var auth, avatar, color, id, isMod, name;
    isMod = Client.ownAuth() > 0;
    id = Client.id(data);
    if (isMod) {
      Client.controlPanel(id);
      Network.getUserInfo(data);
      Network.getBanList();
    }
    if (id === -1) {
      confetti.bot.msg("" + data + " is offline, I can't fetch any information about them.");
      return;
    }
    name = confetti.player.fancyName(id);
    auth = Client.auth(id);
    color = Client.color(id);
    confetti.msg.html("<timestamp/> " + name + " " + (confetti.player.status(id)) + " <small>" + id + "</small>");
    confetti.msg.html("" + confetti.msg.bullet + " <b>Auth</b>: " + (confetti.player.authToName(auth)) + " [" + auth + "]");
    confetti.msg.html("" + confetti.msg.bullet + " <b>Color</b>: <b style='color: " + color + ";'>" + color + "</b>");
    if (Client.player != null) {
      avatar = Client.player(id).avatar;
      return confetti.msg.html("" + confetti.msg.bullet + " <b>Avatar</b>: " + avatar + "<br/>" + confetti.msg.indent + "<img src='trainer:" + avatar + "'>");
    }
  });
  return confetti.alias('userinfo', 'info');
})();

(function() {
  return confetti.command('news', ['Fetches the latest news headlines from Google.', 'send@news'], function() {
    confetti.msg.bot("Fetching latest headlines...");
    return sys.webCall('https://ajax.googleapis.com/ajax/services/search/news?v=1.0&rsz=5&topic=h&hl=en', function(response) {
      var data, ex, json, mess, res, story, _i, _j, _len, _len1;
      if (!response) {
        confetti.msg.bot("Couldn't load news - your internet might be down.");
        return;
      }
      try {
        json = JSON.parse(response);
      } catch (_error) {
        ex = _error;
        confetti.msg.bot("Couldn't load news - your internet might be down.");
        return;
      }
      data = json.responseData.results;
      res = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        story = data[_i];
        res.push(("" + confetti.msg.bullet + " ") + story.titleNoFormatting.replace(/&#39;/g, "'").replace(/`/g, "'").replace(/&quot;/g, "\""));
        res.push("" + confetti.msg.indent + "&nbsp;&nbsp;&nbsp;&nbsp;→ Read more: " + (sys.htmlEscape(story.unescapedUrl)));
      }
      if (res.length) {
        confetti.msg.bold('News Headlines');
        for (_j = 0, _len1 = res.length; _j < _len1; _j++) {
          mess = res[_j];
          confetti.msg.html(mess);
        }
      }
      return null;
    });
  });
})();

(function() {
  var attemptToReconnect, attempts, autoReconnectTimer;
  autoReconnectTimer = -1;
  attempts = 0;
  attemptToReconnect = function() {
    if (attempts >= 3) {
      return false;
    }
    attempts += 1;
    return Client.reconnect();
  };
  Network.playerLogin.connect(function() {
    if (autoReconnectTimer !== -1) {
      confetti.msg.notification("Reconnected to server!");
      sys.unsetTimer(autoReconnectTimer);
      autoReconnectTimer = -1;
      return attempts = 0;
    }
  });
  Network.disconnected.connect(function() {
    var forced;
    if (confetti.cache.get('autoreconnect') === true && autoReconnectTimer === -1 && forced !== true) {
      confetti.msg.bot("Attempting to reconnect...");
      confetti.msg.notification("Disconnection detected, attempting to reconnect.");
      attemptToReconnect();
      autoReconnectTimer = sys.setTimer(function() {
        if (autoReconnectTimer === -1) {
          return;
        }
        if (attemptToReconnect() === false) {
          confetti.msg.bot("Three attempts at reconnecting have failed, stopping.");
          confetti.msg.notification("Failed to reconnect.");
          sys.unsetTimer(autoReconnectTimer);
          return autoReconnectTimer = -1;
        }
      }, 5000, true);
    }
    return forced = false;
  });
  confetti.hook('initCache', function() {
    return confetti.cache.store('autoreconnect', true, confetti.cache.once);
  });
  confetti.command('reconnect', ['Forces a reconnect to the server.', 'send@reconnect'], function() {
    var forced;
    confetti.msg.bot("Reconnecting to the server...");
    attempts = 0;
    forced = true;
    return Client.reconnect();
  });
  return confetti.command('autoreconnect', ["Toggles whether if you should automatically reconnect to the server when detected you've dc'd.", 'send@autoreconnect'], function() {
    confetti.cache.store('autoreconnect', !confetti.cache.read('autoreconnect')).save();
    return confetti.msg.bot("Auto reconnect is now " + (confetti.cache.read('autoreconnect') ? 'on' : 'off') + ".");
  });
})();

(function() {
  confetti.command('notifications', ["Toggles whether if notifications for the script should be shown (tray messages).", 'send@notifications'], function() {
    confetti.cache.store('notifications', !confetti.cache.read('notifications')).save();
    return confetti.msg.bot("Notifications are now " + (confetti.cache.read('notifications') ? 'on' : 'off') + ".");
  });
  confetti.command('botname', ['botname [name]', "Changes the bot's name to [name].", 'setmsg@botname [name]'], function(data) {
    if (data.length > 25) {
      confetti.msg.bot("Uhh, that's too long, I think!");
      return;
    }
    if (confetti.cache.read('botname') === data) {
      confetti.msg.bot("I'm already " + data + "!");
      return;
    }
    confetti.cache.store('botname', data).save();
    return confetti.msg.bot("I'm now called " + data + "!");
  });
  confetti.command('botcolor', ['botcolor [color]', "Changes the bot's color to [color].", 'setmsg@botcolor [color]'], function(data) {
    data = data.toLowerCase();
    if (!sys.validColor(data)) {
      confetti.msg.bot("That doesn't look like a valid color to me!");
      return;
    }
    if (confetti.cache.read('botcolor') === data) {
      confetti.msg.bot("My color is already " + data + "!");
      return;
    }
    confetti.cache.store('botcolor', data).save();
    return confetti.msg.bot("My color is now " + data + "!");
  });
  return confetti.command('commandindicator', ['commandindicator [char]', "Changes your command indicator (to indicate usage of commands) to [char]. '<b>-</b>' will remain usable.", 'setmsg@commandindicator [char]'], function(data) {
    data = data.toLowerCase();
    if (data.length !== 1) {
      confetti.msg.bot("Your command indicator has to be one character, nothing more, nothing less!");
      return;
    }
    if (data === '/' || data === '!') {
      confetti.msg.bot("'!' and '/' are not allowed as command indicators because they are reserved for server scripts.");
      return;
    }
    if (confetti.cache.read('commandindicator') === data) {
      confetti.msg.bot("Your command indicator is already " + data + "!");
      return;
    }
    confetti.cache.store('commandindicator', data).save();
    return confetti.msg.bot("Your command indicator is now " + data + "!");
  });
})();

if (confetti.initialized) {
  print("Script Check: OK");
}

if (!confetti.initialized && (typeof script !== "undefined" && script !== null)) {
  script.clientStartUp();
}

poScript = {
  clientStartUp: function() {
    var chans, id, player, players;
    if (!confetti.initialized) {
      chans = confetti.channel.channelIds();
      players = ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = chans.length; _i < _len; _i++) {
          id = chans[_i];
          _results.push(confetti.channel.players(id).join(','));
        }
        return _results;
      })()).join(',').split(',');
      for (player in players) {
        if (!(confetti.players.hasOwnProperty(player) && player)) {
          confetti.players[player] = confetti.player.create(player);
        }
      }
    }
    if (confetti.cache.initialized === false) {
      confetti.initCache();
    }
    if ((confetti.cache.get('lastuse') + 345600) < (+sys.time())) {
      confetti.msg.bot("Type " + (confetti.cache.get('commandindicator')) + "commands for a list of client commands.", -1);
    }
    confetti.cache.store('lastuse', +sys.time()).save();
    if (sys.isSafeScripts()) {
      confetti.msg.bot("<b style='color: red;'>Safe Scripts is enabled</b>. This will disable persistent data storage and limit other features.", -1);
      confetti.msg.bot("Disable it by unticking the \"<b>Safe Scripts</b>\" box in the <i>Script Window</i> [<i>Plugins->Script Window</i>].", -1);
    }
    return confetti.initialized = true;
  },
  onPlayerReceived: function(id) {
    confetti.players[id] = confetti.player.create(id);
    return confetti.callHooks('onPlayerReceived', id);
  },
  onPlayerRemoved: function(id) {
    return delete confetti.players[id];
  },
  beforeSendMessage: function(message, chan) {
    var command, data, oldMess, space, _ref, _ref1;
    if (((_ref = message[0]) === confetti.cache.get('commandindicator') || _ref === '-') && message.length > 1 && confetti.util.isAlpha(message[1])) {
      space = message.indexOf(' ');
      command = "";
      data = "";
      if (space !== -1) {
        command = message.substr(1, space - 1);
        data = message.substr(space + 1);
      } else {
        command = message.substr(1);
      }
      sys.stopEvent();
      confetti.execCommand(command, data, message, chan);
      return;
    }
    oldMess = message;
    _ref1 = confetti.callHooks('manipulateOwnMessage', message, chan), message = _ref1[0], chan = _ref1[1];
    if (message !== oldMess) {
      sys.stopEvent();
      return Network.sendChanMessage(chan, message);
    }
  }
};
