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
    blocked: [],
    dataDir: sys.scriptsFolder,
    cacheFile: 'confetti.json'
  };
}

(function() {
  var an, copyArray, escapeRegex, fancyJoin, isAlpha, isPlainObject, noop, random, removeDuplicates, shuffle, stripHtml;
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
    noop: noop
  };
})();

(function() {
  var read, readJson, readLocal, readLocalJson, write, writeLocal;
  read = function(file) {
    sys.appendToFile(file, "");
    return sys.getFileContent(file);
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
  var create, name;
  create = function(id) {
    return {
      id: id
    };
  };
  name = function(id) {
    if (typeof id === 'string') {
      name = Client.name(Client.id(id));
    } else {
      name = Client.name(id);
    }
    if (name === '~Unknown~') {
      return id;
    } else {
      return name;
    }
  };
  return confetti.player = {
    create: create,
    name: name
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
  var bold, bot, html, notification, notify, pm, printm;
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
    return Network.sendPM(id, msg);
  };
  printm = function(msg) {
    return print(msg);
  };
  html = function(msg) {
    return Client.printHtml(msg);
  };
  bold = function(title, msg) {
    if (msg == null) {
      msg = '';
    }
    return html("<timestamp/><b>" + title + ":</b> " + msg);
  };
  notification = function(msg) {
    if (confetti.cache.initialized !== false && confetti.cache.read('notifications') === true) {
      return Client.trayMessage("Pokémon Online - " + Client.windowTitle, msg);
    }
  };
  bot = function(msg) {
    return client.printHtml("<font color='" + (confetti.cache.get('botcolor')) + "'><timestamp/><b>" + (confetti.cache.get('botname')) + ":</b></font> " + msg);
  };
  return confetti.msg = {
    notify: notify,
    pm: pm,
    print: printm,
    html: html,
    bold: bold,
    notification: notification,
    bot: bot
  };
})();

(function() {
  var commands, hooks, stophook;
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
  confetti.command = function(name, help, handler) {
    var complete, desc, usage;
    usage = "";
    desc = "";
    complete = "";
    if (help.length === 2) {
      usage = name;
      desc = help[0];
      complete = help[1];
    } else {
      usage = help[0];
      desc = help[1];
      complete = help[2];
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
  confetti.execCommand = function(command, data, message, chan) {
    if (commands.hasOwnProperty(command)) {
      return commands[command].handler(data, message, chan);
    } else {
      return confetti.msg.bot("The command '" + command + "' doesn't exist, silly!");
    }
  };
  confetti.commands = commands;
  return confetti.initCache = function() {
    var once;
    confetti.cache = new confetti.Cache;
    once = confetti.cache.once;
    confetti.cache.store('blocked', [], once).store('botname', '±Confetti', once).store('botcolor', '#09abdc', once).store('notifications', true, once).store('commandindicator', '-', once);
    confetti.callHooks('initCache');
    return confetti.cache.save();
  };
})();

(function() {
  confetti.command('blocked', ["Displays a list of blocked players.", 'send@blocklist'], function() {
    var blocked, html, _i, _len, _ref;
    confetti.msg.bold("Blocked Players");
    html = "";
    _ref = confetti.blocked;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      blocked = _ref[_i];
      html += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; " + (confetti.player.name(blocked));
    }
    return confetti.msg.html(html);
  });
  confetti.command('block', ['block [name]', "Blocks a user by automatically ignoring them.", 'setmsg@block [name]'], function(data) {
    var id, name;
    if (data.length < 1 || data.length > 20) {
      confetti.msg.bot("Uhh, that's too long, I think!");
      return;
    }
    name = confetti.player.name(data);
    data = data.toLowerCase();
    if (__indexOf.call(confetti.blocked, data) >= 0) {
      confetti.msg.bot("" + name + " is already blocked!");
      return;
    }
    confetti.blocked.push(data);
    confetti.cache.store('blocked', confetti.blocked);
    id = Client.id(data);
    if (id !== -1) {
      Client.ignore(id, true);
    }
    return confetti.msg.bot("" + name + " is now blocked!");
  });
  return confetti.command('unblock', ['unblock [name]', "Unblocks a user.", 'setmsg@unblock [name]'], function(data) {
    var id, name;
    data = data.toLowerCase();
    name = confetti.player.name(data);
    if (__indexOf.call(confetti.blocked, data) < 0) {
      confetti.msg.bot("" + name + " isn't blocked!");
      return;
    }
    confetti.blocked.splice(confetti.blocked.indexOf(data), 1);
    confetti.cache.store('blocked', confetti.blocked);
    id = Client.id(data);
    if (id !== -1) {
      Client.ignore(id, false);
    }
    return confetti.msg.bot("You are no longer blocking " + name + "!");
  });
})();

(function() {
  var border, cmd, header;
  cmd = function(name) {
    var command, complete, indicator, parts;
    if (confetti.commands[name]) {
      command = confetti.commands[name];
      parts = command.info.complete.split('@');
      indicator = confetti.cache.get('commandindicator');
      complete = "<a href='po:" + parts[0] + "/" + indicator + parts[1] + "' style='text-decoration: none; color: green;'>" + indicator + command.info.usage + "</a>";
      return confetti.msg.html("&bull; " + complete + ": " + command.info.desc);
    }
  };
  header = function(msg, size) {
    if (size == null) {
      size = 2;
    }
    return confetti.msg.html("<font size='" + size + "'><b>" + msg + "</b></font><br/>");
  };
  border = function(timestamp) {
    if (timestamp == null) {
      timestamp = false;
    }
    return confetti.msg.html("" + (timestamp ? '<br/><timestamp/><br/>' : '') + "<font color='skyblue'><b>≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈</b></font><br/>");
  };
  confetti.command('configcommands', ['Shows various commands that change your settings.', 'send@configcommands'], function() {
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
  return confetti.command('commands', ['Shows this command list.', 'send@commands'], function() {
    border();
    header('Commands');
    cmd('reconnect');
    cmd('imp');
    cmd('flip');
    cmd('html');
    cmd('eval');
    header('Player Blocking', 3);
    cmd('block');
    cmd('unblock');
    cmd('blocked');
    header('Command Lists', 3);
    cmd('commands');
    cmd('configcommands');
    return border(true);
  });
})();

(function() {
  var chr, encool, index, l33tify, normalLetters, reverseify, smallcap, smallcapsConvert, smallcapsLetters, smallcapsify, spaceify, _i, _len;
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
  spaceify = function(msg) {
    return msg.split('').join(' ');
  };
  l33tify = function(msg) {
    return msg.replace(/\b(hacker|coder|programmer)(s|z)?\b/gi, 'haxor$2').replace(/\b(hack)(ed|s|z)?\b/gi, 'haxor$2').replace(/\b(thank you)\b/gi, 'TY').replace(/\b(luv|love|wuv|like)(s|z)?\b/gi, 'wub$2').replace(/\b(software)(s|z)?\b/gi, 'wares').replace(/\b((is|are|am) +(cool|wicked|awesome|great))\b/gi, 'rocks').replace(/\b((is|are|am) +(\w+) +(cool|wicked|awesome|great))\b/gi, '$3 rocks').replace(/\b(very|extremely)\b/gi, 'totally').replace(/\b(because)\b/gi, 'coz').replace(/\b(due to)\b/gi, 'coz of').replace(/\b(is|am)\b/gi, 'be').replace(/\b(are)\b/gi, 'is').replace(/\b(rock)(s|z)?\b/gi, 'roxor$2').replace(/\b(porn(o(graph(y|ic))?)?)\b/gi, 'pron').replace(/\b(lamer|dork|jerk|moron|idiot)\b/gi, 'loser').replace(/\b(an loser)\b/gi, 'a loser').replace(/\b(what('s)?)\b/gi, 'wot').replace(/\b(that)\b/gi, 'dat').replace(/\b(this)\b/gi, 'dis').replace(/\b(hooray|yippee|yay|yeah)\b/gi, 'woot').replace(/\b(win|own)(s|z)?\b/gi, 'pwn$2').replace(/\b(won|owned)\b/gi, 'pwnt').replace(/\b(suck)(ed|s|z)?\b/gi, 'suxor$2').replace(/\b(was|were|had been)/gi, 'wuz').replace(/\b(elite)/gi, 'leet').replace(/\byou\b/gi, 'joo').replace(/\b(man|dude|guy|boy)(s|z)?\b/gi, 'dood$2').replace(/\b(men)\b/gi, 'doods').replace(/\bstarbucks?\b/gi, 'bizzo').replace(/\b(the)\b/gi, 'teh').replace(/(ing)\b/gi, 'in\'').replace(/\b(stoked|happy|excited|thrilled|stimulated)\b/gi, 'geeked').replace(/\b(unhappy|depressed|miserable|sorry)\b/gi, 'bummed out').replace(/\b(and|an)\b/gi, 'n').replace(/\b(your|hey|hello|hi)\b/gi, 'yo').replace(/\b(might)\b/gi, 'gonna').replace(/\blater\b/gi, 'l8r').replace(/\bare\b/gi, 'R').replace(/\bbe\b/gi, 'b').replace(/\bto\b/gi, '2').replace(/\ba\b/gi, '@').replace(/(\S)l/g, '$1L').replace(/(\S)l/g, '$1L').replace(/a/gi, '4').replace(/\bfor\b/gi, '4').replace(/e/gi, '3').replace(/i/gi, '1').replace(/o/gi, '0').replace(/s\b/gi, 'z');
  };
  reverseify = function(msg) {
    return msg.split('').reverse().join('');
  };
  encool = function(msg, type) {
    if (type == null) {
      type = confetti.cache.read('encool');
    }
    switch (type) {
      case 'none':
        return msg;
      case 'spaces':
        return spaceify(msg);
      case 'smallcaps':
        return smallcapsify(msg);
      case 'leet':
        return l33tify(msg);
      case 'reverse':
        return reverseify(msg);
    }
  };
  confetti.encool = encool;
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
    confetti.cache.store('encool', data);
    return confetti.msg.bot("Your encool type is now " + data + "!");
  });
})();

(function() {
  confetti.command('eval', ['eval [code]', "Evaluates a JavaScript Program.", 'setmsg@eval [code]'], function(data) {
    var ex, res;
    try {
      res = eval(data);
      return confetti.msg.html("<timestamp/><b>Eval returned:</b> " + (sys.htmlEscape(res)));
    } catch (_error) {
      ex = _error;
      confetti.msg.html("<timestamp/><b>Eval error:</b> " + ex + " on line " + ex.lineNumber);
      if (ex.backtrace != null) {
        return confetti.msg.html(ex.backtrace.join('<br/>'));
      }
    }
  });
  confetti.command('imp', ['imp [name]', "Changes your name to [name]. If the name is deemed invalid, you will be kicked, so be careful!", 'setmsg@imp [name]'], function(data) {
    if (data.length < 1 || data.length > 20) {
      confetti.msg.bot("That name is too long or too short (max 20 characters)!");
      return;
    }
    confetti.msg.bot("You are now known as " + data + "!");
    return Client.changeName(data);
  });
  confetti.command('flip', ["Flips a coin in virtual life.", 'send@flip'], function() {
    return confetti.msg.bot("The coin landed " + (Math.random() > 0.5 ? 'heads' : 'tails') + "!");
  });
  return confetti.command('html', ['html [code]', "Displays some HTML [code] (for testing purposes).", 'setmsg@html [code]'], function(data) {
    return confetti.msg.html(data);
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
  confetti.command('reconnect', ['Forces a reconnect to the server', 'send@reconnect'], function() {
    var forced;
    confetti.msg.bot("Reconnecting to the server...");
    attempts = 0;
    forced = true;
    return Client.reconnect();
  });
  return confetti.command('autoreconnect', ["Toggles whether if you should automatically reconnect to the server when detected you've dc'd.", 'send@autoreconnect'], function() {
    if (confetti.cache.read('autoreconnect')) {
      confetti.cache.store('autoreconnect', false);
    } else {
      confetti.cache.store('autoreconnect', true);
    }
    return confetti.msg.bot("Auto reconnect is now " + (confetti.cache.read('autoreconnect') ? 'on' : 'off') + ".");
  });
})();

(function() {
  confetti.command('notifications', ["Toggles whether if notifications for the script should be shown (tray messages).", 'send@notifications'], function() {
    if (confetti.cache.read('notifications')) {
      confetti.cache.store('notifications', false);
    } else {
      confetti.cache.store('notifications', true);
    }
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
    confetti.cache.store('botname', data);
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
    confetti.cache.store('botcolor', data);
    return confetti.msg.bot("My color is now " + data + "!");
  });
  return confetti.command('commandindicator', ['commandindicator [char]', "Changes your command indicator (to indicate usage of commands) to [char]. '<b>-</b>' will remain usable.", 'setmsg@commandindicator [char]'], function(data) {
    data = data.toLowerCase();
    if (data.length !== 1) {
      confetti.msg.bot("Your command indicator has to be one character, nothing more, nothing less!");
      return;
    }
    if (confetti.cache.read('commandindicator') === data) {
      confetti.msg.bot("Your command indicator is already " + data + "!");
      return;
    }
    confetti.cache.store('commandindicator', data);
    return confetti.msg.bot("Your command indicator is now " + data + "!");
  });
})();

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
    return confetti.initialized = true;
  },
  onPlayerReceived: function(id) {
    var _ref;
    confetti.players[id] = confetti.player.create(id);
    if (_ref = Client.name(id).toLowerCase(), __indexOf.call(confetti.blocked, _ref) >= 0) {
      return Client.ignore(id, true);
    }
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
