var Client, Global, Network, confetti, confettiScript,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Client = client;

Network = Client.network();

Global = this;

if (typeof confetti !== 'object') {
  confetti = {
    initialized: false,
    silentReload: false,
    cache: {
      initialized: false
    },
    players: {},
    ignoreNextChanMessage: false,
    loginTime: 0,
    debug: false
  };
  Network.playerLogin.connect(function() {
    return confetti.loginTime = +sys.time();
  });
}

confetti.version = {
  release: 2,
  major: 0,
  minor: 8
};

confetti.scriptUrl = 'https://raw.github.com/TheUnknownOne/PO-Client-Tools/master/';

confetti.pluginsUrl = 'https://raw.github.com/TheUnknownOne/PO-Client-Tools/master/plugins/';

confetti.dataDir = sys.scriptsFolder;

confetti.cacheFile = 'confetti.json';

(function() {
  var an, copyArray, escapeRegex, fancyJoin, isAlpha, isPlainObject, noop, random, removeDuplicates, shuffle, sortOnlineOffline, stripHtml, stripquotes, truncate;
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
  sortOnlineOffline = function(arr) {
    var name, offline, online, _i, _len;
    online = [];
    offline = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      name = arr[_i];
      if (Client.id(name) !== -1) {
        online.push(name);
      } else {
        offline.push(name);
      }
    }
    online.sort();
    offline.sort();
    return online.concat(offline);
  };
  truncate = function(str, len) {
    var strlen;
    strlen = str.length;
    if (strlen > len) {
      str = str.substr(0, len) + ("... [" + (strlen - len) + " more]");
    }
    return str;
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
    sortOnlineOffline: sortOnlineOffline,
    truncate: truncate,
    escapeRegex: escapeRegex,
    stripquotes: stripquotes,
    noop: noop
  };
})();

(function() {
  var deleteLocal, read, readJson, readLocal, readLocalJson, reloadScript, write, writeLocal;
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
    if (typeof data === 'object' && Object.prototype.toString(data) === '[object Object]') {
      data = JSON.stringify(data);
    }
    return sys.writeToFile(file, data);
  };
  writeLocal = function(file, data) {
    return write(confetti.dataDir + file, data);
  };
  deleteLocal = function(file) {
    return sys.deleteFile(confetti.dataDir + file);
  };
  reloadScript = function(verbose) {
    var file;
    if (verbose == null) {
      verbose = false;
    }
    file = read(sys.scriptsFolder + "scripts.js");
    if (file) {
      confetti.silentReload = !verbose;
      sys.unsetAllTimers();
      return sys.changeScript(file);
    }
  };
  return confetti.io = {
    read: read,
    readJson: readJson,
    readLocal: readLocal,
    readLocalJson: readLocalJson,
    write: write,
    writeLocal: writeLocal,
    writeLocalJson: writeLocal,
    deleteLocal: deleteLocal,
    reloadScript: reloadScript
  };
})();

(function() {
  var Cache;
  Cache = (function() {
    function Cache(file, hash) {
      var ex;
      this.file = file != null ? file : confetti.cacheFile;
      this.hash = hash != null ? hash : {};
      this.saved = 0;
      try {
        this.hash = confetti.io.readLocalJson(this.file);
      } catch (_error) {
        ex = _error;
        confetti.io.writeLocalJson(this.file, {});
      }
    }

    Cache.prototype.store = function(key, value, once) {
      if (once == null) {
        once = false;
      }
      if (once && this.hash.hasOwnProperty(key)) {
        return this;
      }
      this.hash[key] = value;
      this.saved += 1;
      return this;
    };

    Cache.prototype.remove = function(key) {
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
      this.saved = 0;
      confetti.io.writeLocalJson(this.file, {});
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
      id: id,
      name: Client.name(id)
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
  status = function(id, trackingResolve) {
    var battlingPart;
    if (typeof id === 'string') {
      id = Client.id(id);
    }
    if (id === -1) {
      return "(<font color='red'><b>Offline</b></font>)";
    } else {
      battlingPart = "";
      if (battling(id)) {
        battlingPart = " - <a href='po:watchplayer/" + id + "' style='text-decoration: none; color: blue;' title='Watch " + (confetti.util.stripquotes(name(id, trackingResolve))) + " battle'><b>Battling</b></a>";
      }
      return "(<a href='po:pm/" + id + "' style='text-decoration: none; color: green;'><b>Online</b></a>" + battlingPart + ")";
    }
  };
  name = function(id, trackingResolve) {
    var pname, storedname, trackName, tracked, _ref;
    if (trackingResolve == null) {
      trackingResolve = confetti.cache.get('trackingresolve');
    }
    if (typeof id === 'string') {
      pname = Client.name(Client.id(id));
    } else {
      pname = Client.name(id);
    }
    if (pname === '~Unknown~') {
      storedname = (_ref = confetti.players[id]) != null ? _ref.name : void 0;
      return storedname != null ? storedname : id;
    }
    if (trackingResolve === false) {
      return pname;
    } else {
      tracked = confetti.cache.get('tracked');
      trackName = tracked[pname.toLowerCase()];
      return trackName != null ? trackName : pname;
    }
  };
  fancyName = function(id, tooltip, trackingResolve) {
    var pid, pname, showInfo;
    if (tooltip == null) {
      tooltip = true;
    }
    pname = name(id, trackingResolve);
    pid = typeof id === 'string' ? Client.id(id) : id;
    showInfo = pid !== -1 && tooltip;
    return "<a " + (showInfo ? 'href=\'po:info/' + pid + '\' ' : '') + ("style='text-decoration: none; color: " + (Client.color(pid)) + ";'") + (showInfo ? ' title="Challenge ' + confetti.util.stripquotes(pname) + '"' : '') + ("><b>" + pname + "</b></a>");
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
  var bold, bot, bullet, html, indent, notification, notify, pm, poIcon, printm;
  indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  bullet = "" + indent + "&bull;";
  poIcon = '<img width="16" height="16" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADBElEQVR42o2Tf0zNaxzHn+eL9JWrn4hFuIoTuwxnOqd0SUUT92KJRXOb8uNyRNM014+Jml91/XEtFYcZO8YNK3SSX7NK7PrDJWaYM1Nz/WGK1aFzXp462Eyz+9nee7Znn/f7+bw/n88jxDeBHLX61eAtJSRWVZFx+hyLs4rejw9Jfq6L/xVxlQa/VEdZct6H5j1HcR8v74SrqdTmKovLwfB9csSO9cKw3SmNJWgzrxGU9gxzTiur/3Rz4ATYL+EsOER29+SxednSsA05pgAZvhU5djcy8ggyvppe8+8zdeNbCsrg2mXYa+3I/sqzl8k6Wgz73Snn3VWko8jQLLTg35DDspRgPtJ8DJlUT/SGFvZZ4eoVnCl5zk92Jh4cpA3NLJXBS5E/FSIj8tH6p6L5JKD5z0UOzlAVbUZOttJjzm3Sdn7gxN90otQj8KPFLAcsaNL8flGvpqMNWOIhe8co/Izmm0SX+ChlL+YUI5a9YHsx2FRjxVY08UPYiiTRL94tfWLR+iqirk4vs4JJIdIj5DsHGbIcOa6IXrNqSS+Awzbc2XtbgoToHxUtAmLbpB6F9I5C661IXpORvolIfYpHqM80ZNBCZFgucoqN6TnvyS/BNTe3JVDMWlVpCB6X+kz4m5A+MaqjRgJC44hL2UXvkfPUnRLRlRW/2Z4qJv6FIbOJsMQ9jV0tsFrxPnaS4uSMI/QcaETow6k418zFC7As/zHC34hU1uTAFMTIlYgJuYRM28iOwobiL4O0lRN+voL2U6fbmLFgN9ft7/jnelenEUOmIkITCIxcQ2J6CTv3/8vLu7Q/aSD8qz2qqnCtra9RM7Z38GumlfV/VDN9YRFnTjpw3ILmO3C/Fv5rhNbHWLpdxit2LPdu0P6wHi5dhAd18LTBA8dteP2I9tanHZbv/QavJZtuRJ8521bz6KbrzetG3J1w3HG9qbvaUrmrsHpSZ063zOR1dXq8pTFs/Npmo5503KQn7DcHzi6PDVxUG6vPt5sD0mpNwak1ESGmdQEqXfvM+wh5BaahF9XRVgAAAABJRU5ErkJggg=="/>';
  notify = function(msg, chan) {
    if (typeof chan !== 'number' || !Client.hasChannel(chan)) {
      return;
    }
    return Network.sendChanMessage(chan, msg);
  };
  pm = function(id, msg) {
    if (!confetti.players.hasOwnProperty(id)) {
      return;
    }
    return Network.sendPM(id, msg);
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
  bold = function(title, msg, chan, color) {
    if (msg == null) {
      msg = '';
    }
    if (color == null) {
      color = 'black';
    }
    return html("<timestamp/><b style='color: " + color + ";'>" + title + ":</b> " + msg, chan);
  };
  notification = function(msg, title, allowActive) {
    if (title == null) {
      title = Client.windowTitle;
    }
    if (allowActive == null) {
      allowActive = true;
    }
    if (confetti.cache.initialized !== false && confetti.cache.read('notifications') === true) {
      if (Client.windowActive()) {
        if (allowActive) {
          return html("&nbsp;&nbsp;&nbsp;" + poIcon + " <b>" + title + "</b><br/>" + bullet + " " + msg);
        }
      } else {
        if (title !== Client.windowTitle) {
          title = "" + Client.windowTitle + " - " + title;
        }
        return Client.trayMessage(title, confetti.util.stripHtml(msg));
      }
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
    indent: indent,
    poIcon: poIcon
  };
})();

(function() {
  var aliases, commands, hooks;
  hooks = {};
  confetti._hooks = hooks;
  confetti.hook = function(name, func) {
    if (hooks[name] == null) {
      hooks[name] = [];
    }
    return hooks[name].push(func);
  };
  confetti.callHooks = function() {
    var args, event, hook, res, _i, _len, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!hooks.hasOwnProperty(event)) {
      return args;
    }
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
  confetti.initCache = function() {
    var once;
    confetti.cache = new confetti.Cache;
    once = confetti.cache.once;
    confetti.cache.store('botname', '±Confetti', once).store('botcolor', '#07b581', once).store('notifications', true, once).store('commandindicator', '-', once).store('lastuse', 0, once).store('plugins', [], once).store('tracked', {}, once).store('trackingresolve', true, once);
    confetti.callHooks('initCache');
    return confetti.cache.save();
  };
  return confetti.initPlugins = function(id) {
    var ex, plugin, plugins, src, success, _i, _len;
    plugins = confetti.cache.get('plugins');
    if (plugins.length === 0) {
      return;
    }
    if (sys.isSafeScripts()) {
      return;
    }
    success = false;
    for (_i = 0, _len = plugins.length; _i < _len; _i++) {
      plugin = plugins[_i];
      if (typeof id === 'string' && plugin.id !== id) {
        continue;
      }
      src = confetti.io.readLocal("plugin-" + plugin.id + ".js");
      if (src) {
        try {
          sys["eval"](src, "plugin-" + plugin.id + ".js");
          success = true;
        } catch (_error) {
          ex = _error;
          print("Couldn't load plugin " + plugin.name + ":");
          print("" + ex + " on line " + ex.lineNumber);
          if (ex.backtracetext) {
            print(ex.backtracetext);
          }
        }
      }
    }
    if (success) {
      confetti.callHooks('initCache');
      return confetti.cache.save();
    }
  };
})();

(function() {
  confetti.command('blocked', ["Displays a list of blocked players.", 'send@blocked'], function(_, chan) {
    var blocked, blocklist, count, html, _i, _len;
    blocklist = confetti.util.sortOnlineOffline(confetti.cache.get('blocked'));
    if (blocklist.length === 0) {
      confetti.msg.bot("There is no one on your block list.");
      return;
    }
    confetti.msg.bold("Blocked players <small>[" + blocklist.length + "]</small>", '', chan);
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
    return confetti.msg.html(html, chan);
  });
  confetti.command('block', ['block [name]', "Blocks a user by automatically ignoring them.", 'setmsg@block name'], function(data) {
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
    if (Client.ownName().toLowerCase() === data) {
      confetti.msg.bot("You can't block yourself!");
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
  confetti.command('unblock', ['unblock [name]', "Unblocks a user.", 'setmsg@unblock name'], function(data) {
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
    var blocked, name;
    name = Client.name(id).toLowerCase();
    blocked = confetti.cache.get('blocked');
    if (__indexOf.call(blocked, name) >= 0) {
      return Client.ignore(id, true);
    }
  });
})();

(function() {
  return confetti.command('define', ['define [term]', 'Attempts to find a definition for the given term.', 'setmsg@define term'], function(data, chan) {
    if (!data) {
      confetti.msg.bot("You need to give me a term!");
      return;
    }
    confetti.msg.bot("Loading definition...");
    return sys.webCall("http://api.urbandictionary.com/v0/define?term=" + (encodeURIComponent(data)), function(response) {
      var def, entry, ex, example, examples, json, list, _i, _len;
      if (!response) {
        confetti.msg.bot("Couldn't load the definition - your internet might be down.", chan);
        return;
      }
      try {
        json = JSON.parse(response);
      } catch (_error) {
        ex = _error;
        confetti.msg.bot("Couldn't load the definition - your internet might be down.", chan);
        return;
      }
      list = json.list;
      if (json.result_type === 'no_results') {
        confetti.msg.bot("I couldn't find anything for " + data + "!");
        return;
      }
      entry = confetti.util.random(list);
      examples = entry.example.split('\n');
      def = entry.definition || '';
      if (def.trim()) {
        confetti.msg.bold(data, sys.htmlEscape(def), chan);
      }
      for (_i = 0, _len = examples.length; _i < _len; _i++) {
        example = examples[_i];
        if (example.trim()) {
          confetti.msg.html("&nbsp;&nbsp;&nbsp;&nbsp;<b>→</b> " + (sys.htmlEscape(example)), chan);
        }
      }
      return null;
    });
  });
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
  confetti.hook('manipulateOwnMessage', function(message, chan, dirty) {
    var mess;
    mess = message;
    if (mess[0] !== '/') {
      mess = encool(message);
      dirty = true;
    }
    return [mess, chan, dirty];
  });
  return confetti.command('encool', ['encool [type]', 'Changes your encool type to (none, spaces, smallcaps, leet, reverse).', 'setmsg@encool type'], function(data) {
    data = data.toLowerCase();
    if (!(data === 'none' || data === 'spaces' || data === 'smallcaps' || data === 'leet' || data === 'l33t' || data === 'reverse')) {
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
  confetti.command('friends', ["Displays your friends list.", 'send@friends'], function(_, chan) {
    var count, friend, friends, html, _i, _len;
    friends = confetti.util.sortOnlineOffline(confetti.cache.get('friends'));
    if (friends.length === 0) {
      confetti.msg.bot("<span title='You have 0 friends.'>There is no one on your friend list.</span>");
      return;
    }
    confetti.msg.bold("Your friends <small>[" + friends.length + "]</small>", '', chan);
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
    return confetti.msg.html(html, chan);
  });
  confetti.command('friend', ['friend [name]', "Adds [name] to your friend list.", 'setmsg@friend name'], function(data) {
    var friends, name;
    name = confetti.player.name(data);
    data = data.toLowerCase();
    friends = confetti.cache.get('friends');
    if (data.length === 0) {
      confetti.msg.bot("Specify a name!");
      return;
    }
    if (Client.ownName().toLowerCase() === data) {
      confetti.msg.bot("You can't add yourself as a friend!");
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
  confetti.command('unfriend', ['unfriend [name]', "Removes [name] from your friend list.", 'setmsg@unfriend name'], function(data) {
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
  confetti.command('friendnotifications', ["Toggles whether if notifications specific to friends (logins, logouts) should be shown.", 'send@friendnotifications'], function() {
    confetti.cache.store('friendnotifications', !confetti.cache.read('friendnotifications')).save();
    return confetti.msg.bot("Friend notifications are now " + (confetti.cache.read('friendnotifications') ? 'on' : 'off') + ".");
  });
  confetti.hook('initCache', function() {
    return confetti.cache.store('friends', [], confetti.cache.once).store('friendnotifications', true, confetti.cache.once);
  });
  confetti.hook('onPlayerReceived', function(id) {
    var friends, name, tracked, trackedName;
    if (confetti.loginTime === 0 || +sys.time() <= confetti.loginTime + 4) {
      return;
    }
    if (confetti.cache.get('friendnotifications') === false) {
      return;
    }
    name = Client.name(id).toLowerCase();
    friends = confetti.cache.get('friends');
    trackedName = '';
    if (confetti.cache.get('trackingresolve')) {
      tracked = confetti.cache.get('tracked');
      trackedName = (tracked[name] || '').toLowerCase();
    }
    if (__indexOf.call(friends, name) >= 0 || (trackedName && __indexOf.call(friends, trackedName) >= 0)) {
      return confetti.msg.notification("" + (confetti.player.fancyName(id)) + " logged in.", "Friend joined");
    }
  });
  return confetti.hook('onPlayerRemoved', function(id) {
    var friends, name, tracked, trackedName;
    if (confetti.cache.get('friendnotifications') === false) {
      return;
    }
    name = Client.name(id).toLowerCase();
    friends = confetti.cache.get('friends');
    trackedName = '';
    if (confetti.cache.get('trackingresolve')) {
      tracked = confetti.cache.get('tracked');
      trackedName = (tracked[name] || '').toLowerCase();
    }
    if (__indexOf.call(friends, name) >= 0 || (trackedName && __indexOf.call(friends, trackedName) >= 0)) {
      return confetti.msg.notification("" + (confetti.player.fancyName(id, false)) + " logged out.", "Friend left");
    }
  });
})();

(function() {
  var border, channel, cmd, header;
  channel = null;
  cmd = function(name, chan) {
    var command, complete, indicator, parts;
    if (chan == null) {
      chan = channel;
    }
    command = confetti.commands[name];
    if (command) {
      parts = command.info.complete.split('@');
      indicator = confetti.cache.get('commandindicator');
      complete = "<a href='po:" + parts[0] + "/" + indicator + parts[1] + "' style='text-decoration: none; color: green;'>" + indicator + command.info.usage + "</a>";
      return confetti.msg.html("&bull; " + complete + ": " + command.info.desc, chan);
    }
  };
  header = function(msg, size, chan) {
    if (size == null) {
      size = 5;
    }
    if (chan == null) {
      chan = channel;
    }
    return confetti.msg.html("<br/><font size='" + size + "'><b>" + msg + "</b></font><br/>", chan);
  };
  border = function(timestamp, chan) {
    if (timestamp == null) {
      timestamp = false;
    }
    if (chan == null) {
      chan = channel;
    }
    confetti.msg.html("" + (timestamp ? '<br/><timestamp/><br/>' : '<br/>') + "<font color='skyblue'><b>≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈</b></font>" + (timestamp ? '<br/>' : ''), chan);
    if (timestamp) {
      return channel = null;
    }
  };
  confetti.commandList = {
    cmd: cmd,
    header: header,
    border: border
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
    confetti.callHooks('commands:config');
    confetti.msg.html("", chan);
    cmd('defaults');
    return border(true);
  });
  confetti.command('commands', ['Shows this command list.', 'send@commands'], function(_, chan) {
    channel = chan;
    border();
    header('Commands');
    header('Command Lists', 4);
    cmd('commands');
    cmd('configcommands');
    cmd('scriptcommands');
    cmd('plugincommands');
    confetti.callHooks('commands:list');
    header('Friends', 4);
    cmd('friend');
    cmd('unfriend');
    cmd('friends');
    cmd('friendnotifications');
    confetti.callHooks('commands:friends');
    header('Tracking', 4);
    cmd('track');
    cmd('untrack');
    cmd('tracked');
    cmd('trackingresolve');
    confetti.callHooks('commands:track');
    header('Blocking', 4);
    cmd('block');
    cmd('unblock');
    cmd('blocked');
    confetti.callHooks('commands:block');
    confetti.callHooks('commands:categories');
    confetti.msg.html("", chan);
    cmd('reconnect');
    cmd('define');
    cmd('translate');
    cmd('news');
    cmd('imp');
    cmd('info');
    cmd('myip');
    cmd('chan');
    cmd('flip');
    confetti.callHooks('commands:misc');
    cmd('html');
    cmd('eval');
    confetti.callHooks('commands:dev');
    return border(true);
  });
  return confetti.alias('commandlist', 'commands');
})();

(function() {
  confetti.command('eval', ['eval [code]', "Evaluates a JavaScript Program.", 'setmsg@eval code'], function(data, chan) {
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
  confetti.command('imp', ['imp [name]', "Changes your name to [name]. If the name is deemed invalid, you will be kicked, so be careful!", 'setmsg@imp name'], function(data) {
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
  confetti.command('html', ['html [code]', "Displays some HTML [code] (for testing purposes).", 'setmsg@html code'], function(data, chan) {
    return confetti.msg.html(data, chan);
  });
  confetti.command('chan', ['chan [name]', "Joins, jumps to, or creates a channel.", 'setmsg@chan name'], function(data) {
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
  confetti.command('info', ['info [name]', "Shows info for a given user. If you are a moderator, also opens a control panel for the player.", 'setmsg@info name'], function(data) {
    var auth, avatar, color, id, isMod, name;
    isMod = Client.ownAuth() > 0;
    id = Client.id(data);
    if (isMod) {
      Client.controlPanel(id);
      Network.getUserInfo(data);
      Network.getBanList();
    }
    if (id === -1) {
      confetti.msg.bot("" + data + " is offline, I can't fetch any information about them.");
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
  confetti.alias('userinfo', 'info');
  return confetti.command('myip', ['Shows your IP address.', 'send@myip'], function() {
    confetti.msg.bot("Obtaining your IP address...");
    return sys.webCall('http://bot.whatismyipaddress.com/', function(resp) {
      if (!resp) {
        confetti.msg.bot("Couldn't obtain your IP address - check your internet connection.");
        return;
      }
      return confetti.msg.bot("Your IP address is <b>" + resp + "</b>.");
    });
  });
})();

(function() {
  return confetti.command('news', ['news [language code?]:[topic?]', "Fetches the latest news, either the headlines or on a specific topic, from Google News, in an optional <a href='<a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table'>[language]</a>.", 'send@news'], function(data, chan) {
    var lang, query, topic;
    data = data.split(':');
    lang = data[0].toLowerCase().trim();
    query = data.slice(1).join(':').trim();
    topic = '&topic=h';
    if (lang.length !== 2) {
      lang = 'en';
    }
    if (query) {
      topic = "&q=" + (encodeURIComponent(query.toLowerCase()));
    }
    confetti.msg.bot("Fetching latest headlines...");
    return sys.webCall("https://ajax.googleapis.com/ajax/services/search/news?v=1.0&rsz=6&hl=" + (encodeURIComponent(lang)) + topic, function(response) {
      var ex, json, mess, res, stories, story, _i, _j, _len, _len1;
      if (!response) {
        confetti.msg.bot("Couldn't load news - your internet might be down.", chan);
        return;
      }
      try {
        json = JSON.parse(response);
      } catch (_error) {
        ex = _error;
        confetti.msg.bot("Couldn't load news - your internet might be down.", chan);
        return;
      }
      stories = json.responseData.results;
      res = [];
      for (_i = 0, _len = stories.length; _i < _len; _i++) {
        story = stories[_i];
        res.push(("" + confetti.msg.bullet + " <b>") + story.titleNoFormatting.replace(/&#39;/g, "'").replace(/`/g, "'").replace(/&quot;/g, "\"") + ("</b><br/>" + confetti.msg.indent + "&nbsp;&nbsp;&nbsp;&nbsp;→ Read more: " + (sys.htmlEscape(story.unescapedUrl))));
      }
      if (res.length) {
        confetti.msg.bold("News " + (query ? 'on ' + query : 'Headlines'), '', chan);
        for (_j = 0, _len1 = res.length; _j < _len1; _j++) {
          mess = res[_j];
          confetti.msg.html(mess, chan);
        }
      }
      return null;
    });
  });
})();

(function() {
  var findPlugin, hasPlugin, updatePlugins;
  findPlugin = function(id, plugins) {
    var plugin, _i, _len;
    if (plugins == null) {
      plugins = confetti.cache.get('plugins');
    }
    id = id.toLowerCase();
    for (_i = 0, _len = plugins.length; _i < _len; _i++) {
      plugin = plugins[_i];
      if (plugin.id === id || plugin.name.toLowerCase() === id) {
        return plugin;
      }
    }
    return null;
  };
  hasPlugin = function(id, plugins) {
    return findPlugin(id, plugins) !== null;
  };
  updatePlugins = function() {
    var plugins;
    plugins = confetti.cache.get('plugins');
    return sys.webCall(confetti.pluginsUrl + 'listing.json', function(resp) {
      var ex, json, plug, plugin, readable, toUpdate, _i, _j, _len, _len1, _results;
      try {
        json = JSON.parse(resp);
      } catch (_error) {
        ex = _error;
        confetti.msg.bot("Couldn't load plugin listing -- check your internet connection.");
        return;
      }
      toUpdate = [];
      for (_i = 0, _len = plugins.length; _i < _len; _i++) {
        plugin = plugins[_i];
        plug = findPlugin(plugin.id, json);
        if (plug) {
          if (plugin.version !== plug.version) {
            toUpdate.push([plugin, plug]);
          }
        }
      }
      if (toUpdate.length) {
        readable = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = toUpdate.length; _j < _len1; _j++) {
            plugin = toUpdate[_j];
            _results.push(plugin[1].name);
          }
          return _results;
        })();
        confetti.msg.bot("Updating plugins: " + (readable.join(', ')));
        _results = [];
        for (_j = 0, _len1 = toUpdate.length; _j < _len1; _j++) {
          plugin = toUpdate[_j];
          _results.push(sys.webCall("" + confetti.pluginsUrl + plugin[1].id + "/" + plugin[1].id + ".js", (function(plugin) {
            return function(resp) {
              var index;
              if (!resp) {
                confetti.msg.bot("Couldn't load plugin source -- check your internet connection.");
                return;
              }
              sys.writeToFile("" + confetti.dataDir + "plugin-" + plugin[1].id + ".js", resp);
              index = plugins.indexOf(plugin[0]);
              plugins[index] = plugin[1];
              confetti.cache.store('plugins', plugins).save();
              confetti.msg.bot("Plugin " + plugin[1].name + " updated to version " + plugin[1].version + "!");
              return confetti.initPlugins(plugin[1].id);
            };
          })(plugin)));
        }
        return _results;
      } else {
        return confetti.msg.bot("All plugins up to date.");
      }
    });
  };
  confetti.updatePlugins = updatePlugins;
  confetti.command('plugincommands', ['Shows various commands related to plugins.', 'send@plugincommands'], function(_, chan) {
    confetti.commandList.border(false, chan);
    confetti.commandList.header('Plugin Commands', 5, chan);
    confetti.commandList.cmd('plugins', chan);
    confetti.commandList.cmd('addplugin', chan);
    confetti.commandList.cmd('removeplugin', chan);
    confetti.commandList.cmd('updateplugins', chan);
    confetti.callHooks('commands:plugins');
    return confetti.commandList.border(true, chan);
  });
  confetti.command('plugins', ["Displays a list of enabled and available plugins.", 'send@plugins'], function(_, chan) {
    var html, plugin, plugins, _i, _len;
    plugins = confetti.cache.get('plugins');
    if (plugins.length > 0) {
      confetti.msg.bold("Loaded Plugins");
      html = "";
      for (_i = 0, _len = plugins.length; _i < _len; _i++) {
        plugin = plugins[_i];
        html += "" + confetti.msg.bullet + " <b>" + plugin.name + "</b> (" + plugin.id + ") <small>[<a href='po:send/-removeplugin " + plugin.name + "' style='text-decoration: none; color: black;'>remove</a>]</small>";
      }
      confetti.msg.html(html);
    }
    return sys.webCall(confetti.pluginsUrl + 'listing.json', function(resp) {
      var addremove, ex, json, _j, _len1;
      try {
        json = JSON.parse(resp);
      } catch (_error) {
        ex = _error;
        print(ex);
        confetti.msg.bot("Couldn't load available plugins listing -- check your internet connection.", chan);
        return;
      }
      if (json.length === 0) {
        confetti.msg.bot("No plugins are available.", chan);
        return;
      }
      confetti.msg.bold("Available Plugins", '', chan);
      html = "";
      for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
        plugin = json[_j];
        addremove = "";
        if (!hasPlugin(plugin.id, plugins)) {
          addremove = "<small>[<a href='po:send/-addplugin " + plugin.name + "' style='text-decoration: none; color: black;'>add</a>]</small>";
        } else {
          addremove = "<small>[<a href='po:send/-removeplugin " + plugin.name + "' style='text-decoration: none; color: black;'>remove</a>]</small>";
        }
        html += "" + confetti.msg.bullet + " <b>" + plugin.name + "</b> (" + plugin.id + ") " + addremove + "<br/>";
      }
      return confetti.msg.html(html, chan);
    });
  });
  confetti.command('addplugin', ['addplugin [plugin]', "Adds a plugin.", 'setmsg@addplugin name'], function(data, chan) {
    var name, plugins;
    plugins = confetti.cache.get('plugins');
    name = data;
    data = data.toLowerCase();
    if (name.length === 0) {
      confetti.msg.bot("Specify a plugin!");
      return;
    }
    if (hasPlugin(data, plugins)) {
      confetti.msg.bot("" + name + " is already enabled as a plugin!");
      return;
    }
    confetti.msg.bot("Locating plugin source...");
    return sys.webCall(confetti.pluginsUrl + 'listing.json', function(resp) {
      var ex, json, plugin;
      try {
        json = JSON.parse(resp);
      } catch (_error) {
        ex = _error;
        confetti.msg.bot("Couldn't load available plugins listing -- check your internet connection.", chan);
        return;
      }
      if (json.length === 0) {
        confetti.msg.bot("No plugins are available.", chan);
        return;
      }
      plugin = findPlugin(data, json);
      if (plugin === null) {
        confetti.msg.bot("That plugin is not available! Use the 'plugins' command to see a list of available plugins.", chan);
        return;
      }
      confetti.msg.bot("Downloading plugin " + plugin.name + "...", chan);
      return sys.webCall("" + confetti.pluginsUrl + plugin.id + "/" + plugin.id + ".js", function(file) {
        if (!file) {
          confetti.msg.bot("Couldn't load plugin source -- check your internet connection.", chan);
          return;
        }
        sys.writeToFile("" + confetti.dataDir + "plugin-" + plugin.id + ".js", file);
        plugins.push(plugin);
        confetti.cache.store('plugins', plugins).save();
        confetti.msg.bot("Plugin " + plugin.name + " added!", chan);
        return confetti.initPlugins(plugin.id);
      });
    });
  });
  confetti.command('removeplugin', ['removeplugin [plugin]', "Removes a plugin.", 'setmsg@removeplugin plugin'], function(data) {
    var name, plugin, plugins;
    name = data;
    data = data.toLowerCase();
    plugins = confetti.cache.get('plugins');
    plugin = findPlugin(data, plugins);
    if (plugin === null) {
      confetti.msg.bot("" + name + " isn't an enabled plugin!");
      return;
    }
    plugins.splice(plugins.indexOf(plugin), 1);
    confetti.cache.store('plugins', plugins).save();
    confetti.io.deleteLocal("plugin-" + plugin.id + ".js");
    confetti.io.reloadScript();
    return confetti.msg.bot("Plugin " + plugin.name + " removed.");
  });
  return confetti.command('updateplugins', ['Updates your plugins to the latest version.', 'send@updateplugins'], function() {
    if (sys.isSafeScripts()) {
      confetti.msg.bot("Please disable Safe Scripts before using this command.");
      return;
    }
    confetti.msg.bot("Updating plugins...");
    return updatePlugins();
  });
})();

(function() {
  var attemptToReconnect, attempts, autoReconnectTimer, forced, stopReconnecting;
  autoReconnectTimer = -1;
  attempts = 0;
  stopReconnecting = false;
  forced = false;
  attemptToReconnect = function() {
    if (attempts >= 3) {
      return false;
    }
    attempts += 1;
    return Client.reconnect();
  };
  Network.playerLogin.connect(function() {
    var stopTrying;
    if (autoReconnectTimer !== -1) {
      confetti.msg.notification("Reconnected to server!");
      sys.unsetTimer(autoReconnectTimer);
      autoReconnectTimer = -1;
      attempts = 0;
      stopTrying = false;
      return stopReconnecting = false;
    }
  });
  Network.disconnected.connect(function() {
    if (confetti.cache.get('autoreconnect') === true && autoReconnectTimer === -1 && forced !== true) {
      confetti.msg.bot("Attempting to reconnect...");
      confetti.msg.notification("Disconnection detected, attempting to reconnect.");
      autoReconnectTimer = sys.setTimer(function() {
        if (autoReconnectTimer === -1) {
          return;
        }
        if (attemptToReconnect() === false) {
          confetti.msg.bot("Three attempts at reconnecting have failed, stopping.");
          confetti.msg.notification("Failed to reconnect.");
          sys.unsetTimer(autoReconnectTimer);
          autoReconnectTimer = -1;
          return stopReconnecting = true;
        }
      }, 5000, true);
    }
    return forced = false;
  });
  confetti.hook('initCache', function() {
    return confetti.cache.store('autoreconnect', true, confetti.cache.once);
  });
  confetti.command('reconnect', ['Forces a reconnect to the server.', 'send@reconnect'], function() {
    confetti.msg.bot("Reconnecting to the server...");
    attempts = 0;
    forced = true;
    stopReconnecting = false;
    return Client.reconnect();
  });
  return confetti.command('autoreconnect', ["Toggles whether if you should automatically reconnect to the server when detected you've dc'd.", 'send@autoreconnect'], function() {
    confetti.cache.store('autoreconnect', !confetti.cache.read('autoreconnect')).save();
    return confetti.msg.bot("Auto reconnect is now " + (confetti.cache.read('autoreconnect') ? 'on' : 'off') + ".");
  });
})();

(function() {
  var autoUpdate, differentVersion, updateScript, versionFormat;
  autoUpdate = function() {
    var now;
    if (confetti.cache.get('autoupdate') === false) {
      return;
    }
    if (sys.isSafeScripts()) {
      return;
    }
    now = +sys.time();
    if ((confetti.cache.get('lastupdatetime') + (6 * 60 * 60)) > now) {
      return;
    }
    confetti.updatePlugins();
    return sys.webCall("" + confetti.scriptUrl + "script/version.json", function(resp) {
      var ex, json;
      confetti.cache.store('lastupdatetime', now).save();
      try {
        json = JSON.parse(resp);
      } catch (_error) {
        ex = _error;
        return;
      }
      if (differentVersion(confetti.version, json)) {
        return updateScript();
      }
    });
  };
  versionFormat = function(version) {
    return version.release + '.' + version.major + '.' + version.minor;
  };
  differentVersion = function(ov, nv) {
    return versionFormat(ov) !== versionFormat(nv);
  };
  updateScript = function() {
    var oldVersion;
    oldVersion = {
      release: confetti.version.release,
      major: confetti.version.major,
      minor: confetti.version.minor
    };
    return sys.webCall(confetti.scriptUrl + 'scripts.js', function(file) {
      if (!file) {
        confetti.msg.bot("Couldn't load script, check your internet connection.");
        return;
      }
      confetti.io.write(sys.scriptsFolder + 'scripts.js', file);
      confetti.io.reloadScript(true);
      return sys.setTimer(function() {
        if (differentVersion(oldVersion, confetti.version)) {
          return confetti.msg.bot("Script updated to version " + (versionFormat(confetti.version)) + "!");
        } else {
          return confetti.msg.bot("Script updated!");
        }
      }, 100, false);
    });
  };
  sys.setTimer(autoUpdate, 15 * 1000, false);
  sys.setTimer(autoUpdate, 10 * 60 * 1000, true);
  confetti.autoUpdate = autoUpdate;
  confetti.updateScript = updateScript;
  confetti.hook('initCache', function() {
    return confetti.cache.store('autoupdate', true, confetti.cache.once).store('lastupdatetime', +sys.time(), confetti.cache.once);
  });
  confetti.command('scriptcommands', ['Shows various commands related to the script.', 'send@scriptcommands'], function(_, chan) {
    var border, cmd, header, _ref;
    _ref = confetti.commandList, header = _ref.header, border = _ref.border, cmd = _ref.cmd;
    border(false, chan);
    header('Script Commands', 5, chan);
    cmd('updatescript', chan);
    cmd('autoupdate', chan);
    cmd('version', chan);
    confetti.callHooks('commands:script');
    return border(true, chan);
  });
  confetti.command('updatescript', ['Updates the script to the latest available version.', 'send@updatescript'], function() {
    if (sys.isSafeScripts()) {
      confetti.msg.bot("Please disable Safe Scripts before using this command.");
      return;
    }
    confetti.msg.bot("Updating script...");
    return updateScript();
  });
  confetti.alias('updatescripts', 'updatescript');
  confetti.command('autoupdate', ["Toggles whether if the script should automatically look for updates (every 6 hours).", 'send@autoupdate'], function() {
    confetti.cache.store('autoupdate', !confetti.cache.read('autoupdate')).save();
    return confetti.msg.bot("Automatic updates are now " + (confetti.cache.read('autoupdate') ? 'enabled' : 'disabled') + ".");
  });
  return confetti.command('version', ["Shows the script's version.", 'send@version'], function() {
    return confetti.msg.bot("Your copy of Confetti is currently on version " + (versionFormat(confetti.version)) + ".");
  });
})();

(function() {
  confetti.command('notifications', ["Toggles whether if notifications should be shown (tray messages).", 'send@notifications'], function() {
    confetti.cache.store('notifications', !confetti.cache.read('notifications')).save();
    return confetti.msg.bot("Notifications are now " + (confetti.cache.read('notifications') ? 'on' : 'off') + ".");
  });
  confetti.command('botname', ['botname [name]', "Changes the bot's name to [name].", 'setmsg@botname name'], function(data) {
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
  confetti.command('botcolor', ['botcolor [color]', "Changes the bot's color to [color].", 'setmsg@botcolor color'], function(data) {
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
  confetti.command('commandindicator', ['commandindicator [char]', "Changes your command indicator (to indicate usage of commands) to [char]. <b>-</b> will remain usable, in case you ever forget.", 'setmsg@commandindicator char'], function(data) {
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
  return confetti.command('defaults', ['Resets all settings back to their defaults. There might be some plugins that do not support this.', 'setmsg@defaults'], function(data) {
    var commandindicator;
    if (data.toLowerCase() !== 'sure') {
      commandindicator = confetti.cache.get('commandindicator');
      confetti.msg.bot("<a href='po:send/-defaults sure' style='text-decoration: none; color: black;'>Are you sure that you want to reset your settings? There is no going back. Click this message to confirm (or type <small>" + commandindicator + "defaults sure</small>).</a>");
      return;
    }
    confetti.cache.wipe();
    confetti.initCache();
    confetti.io.reloadScript();
    return confetti.msg.bot("Your settings have been reset to their defaults!");
  });
})();

(function() {
  var bullet;
  bullet = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull;";
  confetti.command('tracked', ["Displays a list of tracked players.", 'send@tracked'], function(_, chan) {
    var alt, alts, html, name, names, numTracked, tracked, _i, _len;
    tracked = confetti.cache.get('tracked');
    numTracked = Object.keys(tracked).length;
    if (numTracked === 0) {
      confetti.msg.bot("There is no one on your tracking list.");
      return;
    }
    confetti.msg.bold("Tracked players <small>[" + numTracked + "]</small>", '', chan);
    html = "";
    names = {};
    for (alt in tracked) {
      name = tracked[alt];
      if (names[name] == null) {
        names[name] = [];
      }
      names[name].push(alt);
    }
    for (name in names) {
      alts = names[name];
      html += "" + confetti.msg.bullet + " " + (confetti.player.fancyName(name, null, false)) + " " + (confetti.player.status(name, false)) + " as <small>[" + alts.length + "]</small><br/>";
      alts = confetti.util.sortOnlineOffline(alts);
      for (_i = 0, _len = alts.length; _i < _len; _i++) {
        alt = alts[_i];
        html += "&nbsp;&nbsp;&nbsp;&nbsp;" + confetti.msg.bullet + " " + (confetti.player.fancyName(alt, null, false)) + " " + (confetti.player.status(alt, false)) + "<br/>";
      }
    }
    return confetti.msg.html(html, chan);
  });
  confetti.alias('tracking', 'tracked');
  confetti.alias('trackinglist', 'tracked');
  confetti.command('track', ['track [alt]:[name]', "Adds [alt] as an alt of [name] to your tracking list.", 'setmsg@track alt:name'], function(data) {
    var alt, altName, name, parts, tracked;
    parts = data.split(':');
    if (parts[1] == null) {
      parts[1] = '';
    }
    alt = parts[0], name = parts[1];
    alt = alt.toLowerCase().trim();
    name = name.trim();
    altName = confetti.player.name(alt, false);
    tracked = confetti.cache.get('tracked');
    if (alt.length === 0 || name.length === 0) {
      confetti.msg.bot("Specify both the alt and the name!");
      return;
    }
    if (tracked.hasOwnProperty(alt)) {
      confetti.msg.bot("" + altName + " is already on your tracking list!");
      return;
    }
    tracked[alt] = name;
    confetti.cache.store('tracked', tracked).save();
    return confetti.msg.bot("" + altName + " is now on your tracking list as an alt of " + (confetti.player.name(name, false)) + "!");
  });
  confetti.command('untrack', ['untrack [alt]', "Removes [alt] from your tracking list.", 'setmsg@untrack alt'], function(data) {
    var name, tracked;
    data = data.toLowerCase();
    name = confetti.player.name(data, false);
    tracked = confetti.cache.get('tracked');
    if (!tracked.hasOwnProperty(data)) {
      confetti.msg.bot("" + name + " isn't on your tracking list!");
      return;
    }
    delete tracked[data];
    confetti.cache.store('tracked', tracked).save();
    return confetti.msg.bot("You removed " + name + " from your tracking list!");
  });
  confetti.command('trackingresolve', ["Toggles whether if tracked names should resolve to their real name (in lists &c.). Does not affect chat name resolution.", 'send@trackingresolve'], function() {
    confetti.cache.store('trackingresolve', !confetti.cache.read('trackingresolve')).save();
    return confetti.msg.bot("Tracking name resolve is now " + (confetti.cache.read('trackingresolve') ? 'on' : 'off') + ".");
  });
  return confetti.hook('manipulateChanPlayerMessage', function(from, fromId, message, playerMessage, _arg, chan, html, dirty) {
    var auth, authSymbol, color, ownId, tracked, trackedName;
    color = _arg[0], auth = _arg[1], authSymbol = _arg[2];
    tracked = confetti.cache.get('tracked');
    trackedName = from.toLowerCase();
    ownId = Client.ownId();
    if (fromId !== ownId && tracked.hasOwnProperty(trackedName)) {
      from = "<span title='" + (confetti.util.stripquotes(from)) + "'>" + tracked[trackedName] + "</span>";
      dirty = true;
    }
    return [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty];
  });
})();

(function() {
  var clearDuplicateCommas;
  clearDuplicateCommas = /,,/g;
  confetti.command('translate', ['translate [message]:[to language code]-[from language code]', "Translates a message from a language to another one. [from language code] is optional and might even be ignored, it's purely a hint (note the dash). Language codes are two letters, for example <b>en</b> (English). A full list is available <a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table'>here</a>.", 'setmsg@translate message:to-from'], function(data, chan) {
    var from, languageParts, message, parts, to, url;
    parts = data.split(':');
    message = parts[0];
    languageParts = (parts[1] || '').split('-');
    to = languageParts[0];
    from = languageParts[1] || '';
    if (!(message && to)) {
      confetti.msg.bot("You have to specify a message and a language to translate to (message:es, for example).");
      return false;
    }
    url = "http://translate.google.com/translate_a/t?client=t&text=" + (encodeURIComponent(message)) + "&hl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&trs=1&ssel=3&tsel=6&sc=1&tl=" + (encodeURIComponent(to));
    if (from) {
      url += "&sl=" + (encodeURIComponent(from));
    }
    confetti.msg.bot("Translating '" + message + "' to " + to + "!");
    return sys.webCall(url, function(response) {
      var ex, json;
      response = response.replace(clearDuplicateCommas, ',').replace(clearDuplicateCommas, ',');
      try {
        json = JSON.parse(response);
      } catch (_error) {
        ex = _error;
        confetti.msg.bot("Failed to receive a reply -- check your internet connection", chan);
        return;
      }
      return confetti.msg.bot("'" + message + "' is '" + json[0][0][0] + "' in '" + (to.toUpperCase()) + "'.", chan);
    });
  });
  confetti.alias('trans', 'translate');
  return confetti.alias('tr', 'translate');
})();

if (confetti.initialized && !confetti.silentReload) {
  print("Script Check: OK");
  if ((typeof script !== "undefined" && script !== null ? script.clientStartUp : void 0) != null) {
    script.clientStartUp();
  }
}

if (!(confetti.initialized && (typeof confettiScript !== "undefined" && confettiScript !== null))) {
  sys.setTimer(function() {
    var chans, id, player, players;
    if (confetti.initialized) {
      return;
    }
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
      if (!(player && confetti.players.hasOwnProperty(player))) {
        confetti.players[player] = confetti.player.create(player);
      }
    }
    return script.clientStartUp();
  }, 1, false);
}

confetti.silentReload = false;

confettiScript = {
  clientStartUp: function() {
    var commandindicator;
    if (confetti.cache.initialized === false) {
      confetti.initCache();
    }
    confetti.initPlugins();
    if (!confetti.initialized) {
      if ((confetti.cache.get('lastuse') + (5 * 24 * 60 * 60)) < (+sys.time())) {
        commandindicator = confetti.cache.get('commandindicator');
        confetti.msg.bot("Type <a href='po:send/-commands' style='text-decoration: none; color: green;'><b>" + commandindicator + "commands</b></a> for a list of client commands.", -1);
      }
      confetti.cache.store('lastuse', +sys.time()).save();
    }
    if (sys.isSafeScripts()) {
      confetti.msg.bot("<b style='color: red;'>Safe Scripts is enabled</b>. This will disable persistent data storage and limit other features.", -1);
      confetti.msg.bot("Disable it by unticking the \"<b>Safe Scripts</b>\" box in the <i>Script Window</i> [<i>Plugins->Script Window</i>].", -1);
      confetti.msg.bot("Afterwards, re-login to see the effects.", -1);
    }
    return confetti.initialized = true;
  },
  onPlayerReceived: function(id) {
    confetti.players[id] = confetti.player.create(id);
    return confetti.callHooks('onPlayerReceived', id);
  },
  onPlayerRemoved: function(id) {
    confetti.callHooks('onPlayerRemoved', id);
    return delete confetti.players[id];
  },
  beforePMSent: function(tar, message) {
    var dirty, _ref;
    dirty = false;
    _ref = confetti.callHooks('manipulateOwnPM', tar, message, dirty), tar = _ref[0], message = _ref[1], dirty = _ref[2];
    if (dirty) {
      sys.stopEvent();
      return Network.sendPM(tar, message);
    }
  },
  afterPMReceived: function(src, message) {
    return confetti.callHooks('pmReceived', src, message);
  },
  beforeSendMessage: function(message, chan) {
    var command, data, dirty, space, _ref, _ref1;
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
    dirty = false;
    _ref1 = confetti.callHooks('manipulateOwnMessage', message, chan, dirty), message = _ref1[0], chan = _ref1[1], dirty = _ref1[2];
    if (dirty) {
      sys.stopEvent();
      return Network.sendChanMessage(chan, message);
    }
  },
  beforeChannelMessage: function(message, chan, html) {
    var auth, authSymbol, color, dirty, finishedMessage, from, fromId, fromSrc, id, line, name, originalMessage, ownId, playerMessage, _ref, _ref1, _ref2, _ref3;
    if (confetti.ignoreNextChanMessage) {
      confetti.ignoreNextChanMessage = false;
      return;
    }
    ownId = Client.ownId();
    if (ownId === -1) {
      return;
    }
    originalMessage = message;
    if (html) {
      message = confetti.util.stripHtml(message).trim();
    }
    from = fromSrc = message.substring(0, message.indexOf(":")).trim();
    fromId = Client.id(from);
    if (html && ((_ref = from.charAt(0)) === '~' || _ref === '+')) {
      from = from.substr(1).trim();
      fromId = Client.id(from);
    } else if (html && message.substr(0, 3).trim() === '***') {
      line = message.substr(3).trim();
      for (id in confetti.players) {
        name = Client.name(id);
        if (line.substring(0, name.length) === name) {
          from = name;
          fromId = id;
          break;
        }
      }
    }
    playerMessage = originalMessage.substring(originalMessage.indexOf(":") + 1).trim();
    if (html) {
      playerMessage = playerMessage.replace('</b>', '').replace('</i>', '').replace('</font>', '');
    }
    if (fromId === -1) {
      dirty = false;
      _ref1 = confetti.callHooks('manipulateChanBotMessage', fromSrc, message, playerMessage, chan, html, dirty), fromSrc = _ref1[0], message = _ref1[1], playerMessage = _ref1[2], chan = _ref1[3], html = _ref1[4], dirty = _ref1[5];
      if (dirty) {
        if (message) {
          Client.printChannelMessage(message, chan, html);
        }
        sys.stopEvent();
      }
      return;
    } else if (ownId !== fromId) {
      if (Client.isIgnored(fromId)) {
        sys.stopEvent();
        return;
      }
    }
    dirty = false;
    color = Client.color(fromId);
    auth = Client.auth(fromId);
    authSymbol = ['', ''];
    if (auth > 4) {
      auth = 4;
    } else if (auth < 0) {
      auth = 0;
    }
    _ref2 = confetti.callHooks('manipulateChanPlayerMessage', from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty), from = _ref2[0], fromId = _ref2[1], message = _ref2[2], playerMessage = _ref2[3], (_ref3 = _ref2[4], color = _ref3[0], auth = _ref3[1], authSymbol = _ref3[2]), chan = _ref2[5], html = _ref2[6], dirty = _ref2[7];
    if (dirty) {
      if (!color) {
        color = Client.color(fromId);
      }
      if (auth == null) {
        auth = Client.auth(fromId);
      }
      if (!(authSymbol[0] && authSymbol[1])) {
        if (auth > 0 && auth < 4) {
          authSymbol = ['+<i>', '</i>'];
        } else {
          authSymbol = ['', ''];
        }
      }
      if (!html) {
        playerMessage = sys.htmlEscape(playerMessage);
        playerMessage = Client.channel(chan).addChannelLinks(playerMessage);
      }
      finishedMessage = "<font color='" + color + "'><timestamp/>" + authSymbol[0] + "<b>" + from + ":" + authSymbol[1] + "</b></font> " + playerMessage;
      sys.stopEvent();
      confetti.ignoreNextChanMessage = true;
      if (confetti.debug) {
        print(message);
        print(playerMessage);
        return print(finishedMessage);
      } else {
        return Client.printChannelMessage(finishedMessage, chan, true);
      }
    }
  }
};
