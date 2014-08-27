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
    loginTime: 0
  };
  Network.playerLogin.connect(function() {
    return confetti.loginTime = sys.time();
  });
}

confetti.version = {
  release: 2,
  major: 1,
  minor: 4
};

confetti.scriptUrl = 'https://theunknownone.github.io/PO-Client-Tools/';

confetti.pluginsUrl = 'https://theunknownone.github.io/PO-Client-Tools/plugins/';

confetti.dataDir = sys.scriptsFolder;

confetti.cacheFile = 'confetti.json';

(function() {
  var addNameHighlights, an, escapeRegex, fancyJoin, isAlpha, random, shuffle, sortOnlineOffline, stripHtml, stripquotes, truncate, willFlash;
  random = function(array) {
    if (Array.isArray(array)) {
      return array[sys.rand(0, array.length)];
    } else {
      return array;
    }
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
    return str.replace(/'/g, "\\'");
  };
  isAlpha = function(chr) {
    chr = chr.toLowerCase();
    return chr >= 'a' && chr <= 'z';
  };
  addNameHighlights = function(msg, name) {
    return msg.replace(new RegExp("\\b(" + (escapeRegex(name)) + ")\\b(?![^\\s<]*>)", "i"), "<span class='name-hilight'>$1</span><ping/>");
  };
  willFlash = function(msg, name) {
    var regex;
    regex = new RegExp("\\b" + (escapeRegex(name)) + "\\b(?![^\\s<]*>)", "i");
    return msg.search(regex) !== -1;
  };
  return confetti.util = {
    random: random,
    isAlpha: isAlpha,
    shuffle: shuffle,
    an: an,
    fancyJoin: fancyJoin,
    stripHtml: stripHtml,
    sortOnlineOffline: sortOnlineOffline,
    truncate: truncate,
    escapeRegex: escapeRegex,
    stripquotes: stripquotes,
    addNameHighlights: addNameHighlights,
    willFlash: willFlash
  };
})();

(function() {
  var deleteLocal, getRemoteFile, getRemoteJson, read, readJson, readLocal, readLocalJson, reloadScript, write, writeLocal;
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
  getRemoteFile = function(url, errback, callback) {
    return sys.webCall(url, function(resp) {
      var chan, errmsg;
      if (resp === "") {
        if (Array.isArray(errback)) {
          errmsg = errback[0], chan = errback[1];
          if (!errmsg) {
            return;
          }
          return confetti.msg.bot(errmsg, chan);
        } else if (typeof errback === 'function') {
          return errback();
        } else {
          return;
        }
      }
      return callback(resp);
    });
  };
  getRemoteJson = function(url, errback, callback) {
    return sys.webCall(url, function(resp) {
      var chan, errmsg, ex, json;
      try {
        json = JSON.parse(resp);
      } catch (_error) {
        ex = _error;
        if (Array.isArray(errback)) {
          errmsg = errback[0], chan = errback[1];
          if (!errmsg) {
            return;
          }
          return confetti.msg.bot(errmsg, chan);
        } else if (typeof errback === 'function') {
          return errback();
        } else {
          return;
        }
      }
      return callback(json, resp);
    });
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
    reloadScript: reloadScript,
    getRemoteFile: getRemoteFile,
    getRemoteJson: getRemoteJson
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

    Cache.prototype.init = function(keys) {
      var key, value;
      for (key in keys) {
        value = keys[key];
        this.store(key, value, true);
      }
      return this;
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
  var bold, bot, bullet, html, indent, notification, notify, pm, poIcon;
  indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  bullet = "" + indent + "&bull;";
  poIcon = '<img width=16 height=16 src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADBElEQVR42o2Tf0zNaxzHn+eL9JWrn4hFuIoTuwxnOqd0SUUT92KJRXOb8uNyRNM014+Jml91/XEtFYcZO8YNK3SSX7NK7PrDJWaYM1Nz/WGK1aFzXp462Eyz+9nee7Znn/f7+bw/n88jxDeBHLX61eAtJSRWVZFx+hyLs4rejw9Jfq6L/xVxlQa/VEdZct6H5j1HcR8v74SrqdTmKovLwfB9csSO9cKw3SmNJWgzrxGU9gxzTiur/3Rz4ATYL+EsOER29+SxednSsA05pgAZvhU5djcy8ggyvppe8+8zdeNbCsrg2mXYa+3I/sqzl8k6Wgz73Snn3VWko8jQLLTg35DDspRgPtJ8DJlUT/SGFvZZ4eoVnCl5zk92Jh4cpA3NLJXBS5E/FSIj8tH6p6L5JKD5z0UOzlAVbUZOttJjzm3Sdn7gxN90otQj8KPFLAcsaNL8flGvpqMNWOIhe8co/Izmm0SX+ChlL+YUI5a9YHsx2FRjxVY08UPYiiTRL94tfWLR+iqirk4vs4JJIdIj5DsHGbIcOa6IXrNqSS+Awzbc2XtbgoToHxUtAmLbpB6F9I5C661IXpORvolIfYpHqM80ZNBCZFgucoqN6TnvyS/BNTe3JVDMWlVpCB6X+kz4m5A+MaqjRgJC44hL2UXvkfPUnRLRlRW/2Z4qJv6FIbOJsMQ9jV0tsFrxPnaS4uSMI/QcaETow6k418zFC7As/zHC34hU1uTAFMTIlYgJuYRM28iOwobiL4O0lRN+voL2U6fbmLFgN9ft7/jnelenEUOmIkITCIxcQ2J6CTv3/8vLu7Q/aSD8qz2qqnCtra9RM7Z38GumlfV/VDN9YRFnTjpw3ILmO3C/Fv5rhNbHWLpdxit2LPdu0P6wHi5dhAd18LTBA8dteP2I9tanHZbv/QavJZtuRJ8521bz6KbrzetG3J1w3HG9qbvaUrmrsHpSZ063zOR1dXq8pTFs/Npmo5503KQn7DcHzi6PDVxUG6vPt5sD0mpNwak1ESGmdQEqXfvM+wh5BaahF9XRVgAAAABJRU5ErkJggg==">';
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
    return html("<timestamp/><b style='color:" + color + "'>" + title + ":</b> " + msg, chan);
  };
  notification = function(msg, title, allowActive, force) {
    if (title == null) {
      title = Client.windowTitle;
    }
    if (allowActive == null) {
      allowActive = true;
    }
    if (force == null) {
      force = false;
    }
    if (force === true || (confetti.cache.initialized !== false && confetti.cache.read('notifications') === true)) {
      if (Client.windowActive()) {
        if (allowActive) {
          return html("&nbsp;&nbsp;&nbsp;" + poIcon + " <b>" + title + "</b><br>" + bullet + " " + msg);
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
    return html("<font color=" + (confetti.cache.get('botcolor')) + "><timestamp/><b>" + (confetti.cache.get('botname')) + ":</b></font> " + msg, chan);
  };
  return confetti.msg = {
    notify: notify,
    pm: pm,
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
  var hooks, infoRequests;
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
  confetti.initCache = function() {
    confetti.cache = new confetti.Cache;
    confetti.cache.init({
      botname: '±Confetti',
      botcolor: '#07b581',
      notifications: true,
      commandindicator: '-',
      lastuse: 0,
      plugins: [],
      tracked: {},
      trackingresolve: true,
      flashes: true,
      ignorepms: false
    });
    confetti.callHooks('initCache');
    return confetti.cache.save();
  };
  confetti.initFields = function(fields) {
    return confetti.hook('initCache', function() {
      return confetti.cache.init(fields);
    });
  };
  confetti.initPlugins = function(id) {
    var ex, pid, plugin, plugins, src, success, _i, _len, _ref;
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
      pid = plugin.id;
      if (typeof id === 'string' && pid !== id) {
        continue;
      } else if (Array.isArray(id) && (_ref = !pid, __indexOf.call(id, _ref) >= 0)) {
        continue;
      }
      src = confetti.io.readLocal("plugin-" + pid + ".js");
      if (src) {
        try {
          sys["eval"](src, "plugin-" + pid + ".js");
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
  infoRequests = {};
  Network.userInfoReceived.connect(function(info) {
    var callback, name, _i, _len, _ref;
    name = info != null ? info.name.toLowerCase() : void 0;
    if (info && infoRequests.hasOwnProperty(name)) {
      _ref = infoRequests[name];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        callback(info);
      }
      return delete infoRequests[name];
    }
  });
  return confetti.requestUserInfo = function(n, callback) {
    var name;
    name = n.toLowerCase();
    if (infoRequests[name]) {
      return infoRequests[name].push(callback);
    } else {
      infoRequests[name] = [callback];
      return Network.getUserInfo(name);
    }
  };
})();

(function() {
  var CommandList, aliases, commands, reverseAliases;
  commands = {};
  aliases = {};
  reverseAliases = {};
  confetti.command = function(name, help, handler) {
    var complete, desc, usage, _ref, _ref1;
    usage = "";
    desc = "";
    complete = "";
    if (typeof help === 'string') {
      _ref = confetti.cmdhelp(name, help), usage = _ref[0], desc = _ref[1], complete = _ref[2];
    } else if (typeof help === 'object' && !Array.isArray(help)) {
      _ref1 = confetti.cmdhelp(name, help.desc || help.help, help.args, help.mode), usage = _ref1[0], desc = _ref1[1], complete = _ref1[2];
    } else if (help.length === 2) {
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
  confetti.cmdhelp = function(name, desc, args, mode) {
    var arg, argl, arglist, help, _i, _len;
    if (args == null) {
      args = [];
    }
    if (mode == null) {
      mode = confetti.Send;
    }
    help = [];
    if (args.length) {
      mode = confetti.SetMsg;
    }
    switch (mode) {
      case confetti.Send:
        help = [name, desc, "send@" + name];
        break;
      case confetti.SetMsg:
        argl = Array.isArray(args) ? args : args.split(' ');
        arglist = [];
        for (_i = 0, _len = argl.length; _i < _len; _i++) {
          arg = argl[_i];
          arglist.push("[" + arg + "]");
        }
        help = ["" + name + " " + (arglist.join(':')), desc, "setmsg@" + name + " " + (argl.join(':'))];
    }
    return help;
  };
  confetti.Send = 0;
  confetti.SetMsg = 1;
  confetti.alias = function(caliases, command) {
    var alias, _i, _len, _results;
    if (!Array.isArray(caliases)) {
      caliases = caliases.split(', ');
    }
    if (reverseAliases[command] == null) {
      reverseAliases[command] = [];
    }
    _results = [];
    for (_i = 0, _len = caliases.length; _i < _len; _i++) {
      alias = caliases[_i];
      aliases[alias] = command;
      _results.push(reverseAliases[command].push(alias));
    }
    return _results;
  };
  confetti.aliasesOf = function(command) {
    return reverseAliases[command];
  };
  confetti.isCommand = function(message) {
    var _ref;
    return ((_ref = message[0]) === confetti.cache.get('commandindicator') || _ref === '-') && message.length > 1 && confetti.util.isAlpha(message[1]);
  };
  confetti.execCommand = function(command, data, message, chan) {
    if (aliases.hasOwnProperty(command)) {
      command = aliases[command];
    }
    if (commands.hasOwnProperty(command)) {
      return commands[command].handler(data, chan, message);
    } else {
      return confetti.msg.bot("The command '" + command + "' doesn't exist!");
    }
  };
  confetti.runCommand = function(message, chan) {
    var command, data, space;
    if (chan == null) {
      chan = Client.currentChannel();
    }
    if (confetti.isCommand(message)) {
      message = message.substr(1);
    }
    space = message.indexOf(' ');
    command = "";
    data = "";
    if (space !== -1) {
      command = message.substr(0, space);
      data = message.substr(space + 1);
    } else {
      command = message;
    }
    return confetti.execCommand(command, data, message, chan);
  };
  confetti.commands = commands;
  confetti.aliases = aliases;
  CommandList = (function() {
    function CommandList(name, highlight) {
      var commandindicator;
      this.name = name;
      this.highlight = highlight != null ? highlight : [];
      commandindicator = confetti.cache.get('commandindicator');
      this.template = ["<table width=25%><tr><td><center><font size=5><b>" + this.name + "</b></font></center></td></tr></table>", "", "<b style='color:teal'>To use any of these commands, prefix them with '" + commandindicator + "' like so:</b> <u>" + commandindicator + "commands</u>", ""];
    }

    CommandList.prototype.cmd = function(name) {
      var aliasstr, caliases, cmdname, command, desc, info, parts;
      command = confetti.commands[name];
      if (command) {
        info = command.info;
        parts = info.complete.split('@');
        desc = typeof info.desc === 'function' ? info.desc() : info.desc;
        caliases = confetti.aliasesOf(name);
        aliasstr = '';
        if (caliases) {
          aliasstr = " (Alias" + (caliases.length === 1 ? '' : 'es') + ": <i>" + (caliases.join(', ')) + "</i>)";
        }
        cmdname = "<a href='po:" + parts[0] + "/-" + parts[1] + "' style='text-decoration:none;color:teal'>" + info.usage + "</a>";
        if (__indexOf.call(this.highlight, name) >= 0) {
          cmdname = "<b class='name-hilight'>" + cmdname + "</b>";
        }
        this.template.push("\u00bb " + cmdname + " - " + desc + aliasstr);
      }
      return this;
    };

    CommandList.prototype.cmds = function(names) {
      var name, _i, _len;
      if (typeof names === 'string') {
        names = names.split(' ');
      }
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        this.cmd(name);
      }
      return this;
    };

    CommandList.prototype.group = function(name) {
      this.whiteline();
      this.template.push("<font size=4><b>" + name + "</b></font>");
      this.whiteline();
      return this;
    };

    CommandList.prototype.whiteline = function() {
      this.template.push("");
      return this;
    };

    CommandList.prototype.hooks = function(name) {
      confetti.callHooks("commands:" + name, this);
      return this;
    };

    CommandList.prototype.render = function(chan) {
      if (chan == null) {
        chan = Client.currentChannel();
      }
      this.whiteline();
      return confetti.msg.html(this.template.join("<br>"), chan);
    };

    return CommandList;

  })();
  confetti.CommandList = CommandList;
  return confetti.cmdlist = function(name, cmds, hooks) {
    var list;
    list = new CommandList(name).cmds(cmds);
    if (hooks) {
      list.hooks(hooks);
    }
    return list.render();
  };
})();

(function() {
  confetti.command('authsymbols', "Shows the auth symbols you have set.", function(_, chan) {
    var auth, authlvl, authlvls, authsymbols, end, html, numSymbols, parts, start;
    authsymbols = confetti.cache.get('authsymbols');
    numSymbols = Object.keys(authsymbols).length;
    if (numSymbols === 0) {
      return confetti.msg.bot("You have not set any auth symbols.");
    }
    confetti.msg.bold("Auth symbols <small>[" + numSymbols + "]</small>", '', chan);
    html = "";
    start = "";
    end = "";
    authlvls = ["", "", "", "", ""];
    for (auth in authsymbols) {
      parts = authsymbols[auth];
      start = parts[0], end = parts[1];
      authlvls[auth] = "" + confetti.msg.bullet + " Auth <b>" + (confetti.player.authToName(auth)) + "</b> (" + auth + "): " + (sys.htmlEscape(start)) + "<b>Name</b>" + (sys.htmlEscape(end));
    }
    authlvls = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = authlvls.length; _i < _len; _i++) {
        authlvl = authlvls[_i];
        if (authlvl !== "") {
          _results.push(authlvl);
        }
      }
      return _results;
    })();
    return confetti.msg.html(authlvls.join("<br>") + "<br>", chan);
  });
  confetti.alias('authsymbollist, authsymbolist', 'authsymbols');
  confetti.command('authsymbol', ['authsymbol [auth]:[start]:[end?]', "Changes the auth symbol of [auth] (0 - User, 1 - Moderator, 2 - Administrator, 3 - Owner, or 4 - \"Invisible\") to [start]. [end?] is optional and will be inserted after the name (useful for HTML). If neither [start] nor [end?] is given, the auth symbol for [auth] is reset (if you want an empty auth symbol for auth level [auth], do <code>authsymbol:</code>).", 'setmsg@authsymbol auth:start'], function(data) {
    var authl, authn, authsymbols, end, parts, start;
    parts = data.split(':');
    authl = parts[0], start = parts[1], end = parts[2];
    authl = parseInt(authl, 10);
    if (start != null) {
      start = start.trim();
    }
    if (end != null) {
      end = end.trim();
    }
    authsymbols = confetti.cache.get('authsymbols');
    if (isNaN(authl)) {
      return confetti.msg.bot("" + (sys.htmlEscape(parts[0])) + " is not a number. Give a number in the range 0-4.");
    } else if (authl < 0) {
      authl = 0;
    } else if (authl > 4) {
      authl = 4;
    }
    authn = confetti.player.authToName(authl);
    if ((start == null) && (end == null)) {
      if (authsymbols.hasOwnProperty(authl)) {
        delete authsymbols[authl];
        confetti.cache.store('authsymbols', authsymbols).save();
        return confetti.msg.bot("Auth symbol for auth " + authn + " (" + authl + ") removed!");
      } else {
        return confetti.msg.bot("There is no auth symbol for auth " + authn + " (" + authl + "). Give a start and an end for the auth level.");
      }
    }
    if (start == null) {
      start = '';
    }
    if (end == null) {
      end = '';
    }
    authsymbols[authl] = [start, end];
    confetti.cache.store('authsymbols', authsymbols).save();
    return confetti.msg.bot("Players whose auth is " + authn + " (" + authl + ") will now be formatted like so: " + start + "<b>Name</b>" + end);
  });
  confetti.initFields({
    authsymbols: {}
  });
  return confetti.hook('manipulateChanPlayerMessage', function(from, fromId, message, playerMessage, _arg, chan, html, dirty) {
    var auth, authSymbol, authsymbols, color, symbol;
    color = _arg[0], auth = _arg[1], authSymbol = _arg[2];
    authsymbols = confetti.cache.get('authsymbols');
    if (auth > 4) {
      auth = 4;
    }
    symbol = authsymbols[auth];
    if (symbol) {
      authSymbol = symbol;
      dirty = true;
    }
    return [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty];
  });
})();

(function() {
  confetti.command('blocked', "Displays a list of blocked players.", function(_, chan) {
    var blocked, blocklist, count, html, _i, _len;
    blocklist = confetti.util.sortOnlineOffline(confetti.cache.get('blocked'));
    if (blocklist.length === 0) {
      return confetti.msg.bot("There is no one on your block list.");
    }
    confetti.msg.bold("Blocked players <small>[" + blocklist.length + "]</small>", '', chan);
    html = "";
    count = 0;
    for (_i = 0, _len = blocklist.length; _i < _len; _i++) {
      blocked = blocklist[_i];
      count += 1;
      html += "" + confetti.msg.bullet + " " + (confetti.player.fancyName(blocked)) + " " + (confetti.player.status(blocked));
      if (count % 3 === 0) {
        html += "<br>";
      }
    }
    return confetti.msg.html(html, chan);
  });
  confetti.command('block', {
    help: "Blocks a user by automatically ignoring them when they log in.",
    args: ["name"]
  }, function(data) {
    var blocked, id, len, name;
    len = data.length;
    if (!data) {
      return confetti.msg.bot("Specify a name!");
    } else if (len > 20) {
      return confetti.msg.bot("That name's a bit too long.");
    }
    name = confetti.player.name(data);
    data = data.toLowerCase();
    blocked = confetti.cache.get('blocked');
    if (Client.ownName().toLowerCase() === data) {
      return confetti.msg.bot("You can't block yourself!");
    }
    if (__indexOf.call(blocked, data) >= 0) {
      return confetti.msg.bot("" + (sys.htmlEscape(name)) + " is already blocked!");
    }
    blocked.push(data);
    confetti.cache.store('blocked', blocked).save();
    id = Client.id(data);
    if (id !== -1) {
      Client.ignore(id, true);
    }
    return confetti.msg.bot("" + (sys.htmlEscape(name)) + " is now blocked!");
  });
  confetti.command('unblock', {
    help: "Unblocks a user.",
    args: ["name"]
  }, function(data) {
    var blocked, id, name;
    data = data.toLowerCase();
    name = confetti.player.name(data);
    blocked = confetti.cache.get('blocked');
    if (__indexOf.call(blocked, data) < 0) {
      return confetti.msg.bot("" + (sys.htmlEscape(name)) + " isn't blocked!");
    }
    blocked.splice(blocked.indexOf(data), 1);
    confetti.cache.store('blocked', blocked).save();
    id = Client.id(data);
    if (id !== -1) {
      Client.ignore(id, false);
    }
    return confetti.msg.bot("You are no longer blocking " + (sys.htmlEscape(name)) + "!");
  });
  confetti.initFields({
    blocked: []
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
  return confetti.command('define', {
    help: "Attempts to find a definition for the given term.",
    args: ["term"]
  }, function(data, chan) {
    if (!data) {
      return confetti.msg.bot("You need to give me a term!");
    }
    return sys.webCall("http://api.urbandictionary.com/v0/define?term=" + (encodeURIComponent(data)), function(response) {
      var def, entry, ex, example, examples, json, list, _i, _len;
      if (!response) {
        return confetti.msg.bot("Couldn't load the definition - your internet might be down.", chan);
      }
      try {
        json = JSON.parse(response);
      } catch (_error) {
        ex = _error;
        return confetti.msg.bot("Couldn't load the definition - your internet might be down.", chan);
      }
      list = json.list;
      if (json.result_type === 'no_results') {
        return confetti.msg.bot("I couldn't find anything for " + data + "!");
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
          confetti.msg.html("&nbsp;&nbsp;&nbsp;&nbsp;<b>&bull;</b> " + (sys.htmlEscape(example)), chan);
        }
      }
      return null;
    });
  });
})();

(function() {
  var chr, encool, encoolHandlers, encoolTypes, fullwidthChars, fullwidthConvert, fullwidthify, halfwidthChars, index, l33tify, natoTable, natoify, normalLetters, smallcapsConvert, smallcapsLetters, smallcapsify, val, _i, _j, _len, _len1;
  normalLetters = 'qwertyuiopasdfghjklzxcvbnm'.split('');
  smallcapsLetters = 'ǫᴡᴇʀᴛʏᴜɪᴏᴘᴀsᴅғɢʜᴊᴋʟᴢxᴄᴠʙɴᴍ'.split('');
  smallcapsConvert = {};
  for (index = _i = 0, _len = normalLetters.length; _i < _len; index = ++_i) {
    chr = normalLetters[index];
    smallcapsConvert[chr] = smallcapsConvert[chr.toUpperCase()] = smallcapsLetters[index];
  }
  halfwidthChars = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('');
  fullwidthChars = "！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～".split('');
  fullwidthConvert = {};
  for (index = _j = 0, _len1 = halfwidthChars.length; _j < _len1; index = ++_j) {
    chr = halfwidthChars[index];
    fullwidthConvert[chr] = fullwidthChars[index];
  }
  natoTable = {
    a: "Alpha",
    b: "Bravo",
    c: "Charlie",
    d: "Delta",
    e: "Echo",
    f: "Foxtrot",
    g: "Golf",
    h: "Hotel",
    i: "India",
    j: "Juliet",
    k: "Kilo",
    l: "Lima",
    m: "Mike",
    n: "November",
    o: "Oscar",
    p: "Papa",
    q: "Quebec",
    r: "Romeo",
    s: "Sierra",
    t: "Tango",
    u: "Uniform",
    v: "Victor",
    w: "Whiskey",
    x: "Xray",
    y: "Yankee",
    z: "Zulu",
    0: "Zero",
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Niner"
  };
  for (chr in natoTable) {
    val = natoTable[chr];
    natoTable[chr.toUpperCase()] = val;
  }
  smallcapsify = function(msg) {
    var letter, str, _k, _len2;
    str = [];
    for (index = _k = 0, _len2 = msg.length; _k < _len2; index = ++_k) {
      letter = msg[index];
      str[index] = smallcapsConvert[letter] || letter;
    }
    return str.join('');
  };
  fullwidthify = function(msg) {
    var letter, str, _k, _len2;
    str = [];
    for (index = _k = 0, _len2 = msg.length; _k < _len2; index = ++_k) {
      letter = msg[index];
      str[index] = fullwidthConvert[letter] || letter;
    }
    return str.join('');
  };
  natoify = function(msg) {
    var letter, ntl, str, _k, _len2;
    msg = msg.replace(/\b(the|a(n)?|is|are)\b/gi, "");
    str = [];
    for (index = _k = 0, _len2 = msg.length; _k < _len2; index = ++_k) {
      letter = msg[index];
      ntl = natoTable[letter];
      if (ntl) {
        str.push(ntl);
        if (natoTable[msg[index + 1]]) {
          str.push("-");
        }
      } else {
        str.push(letter);
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
    fullwidth: function(msg) {
      return fullwidthify(msg);
    },
    nato: function(msg) {
      return natoify(msg);
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
  encoolTypes = Object.keys(encoolHandlers);
  confetti.encool = encool;
  confetti._encool = {
    encoolHandlers: encoolHandlers,
    encoolTypes: encoolTypes
  };
  confetti.encool.register = function(type, handler) {
    encoolHandlers[type] = handler;
    return encoolTypes = Object.keys(encoolHandlers);
  };
  confetti.msg.notify = function(msg, chan) {
    if (typeof chan !== 'number' || !Client.hasChannel(chan)) {
      return;
    }
    return Network.sendChanMessage(chan, encool(msg));
  };
  confetti.command('encool', {
    help: function() {
      return "Changes your encool type to (" + (encoolTypes.join(', ')) + ").";
    },
    args: ["type"]
  }, function(data) {
    data = data.toLowerCase();
    if (!(__indexOf.call(encoolTypes, data) >= 0)) {
      confetti.msg.bot("That doesn't look right to me!");
      return confetti.msg.bot("Use one of the following types: " + (encoolTypes.join(', ')));
    }
    if (confetti.cache.read('encool') === data) {
      return confetti.msg.bot("Your encool type is already " + data + "!");
    }
    confetti.cache.store('encool', data).save();
    return confetti.msg.bot("Your encool type is now " + data + "!");
  });
  confetti.initFields({
    encool: 'none'
  });
  return confetti.hook('manipulateOwnMessage', function(message, chan, dirty) {
    var mess;
    mess = message;
    if (mess[0] !== '/') {
      mess = encool(message);
      dirty = true;
    }
    return [mess, chan, dirty];
  });
})();

(function() {
  var classhilight, flashwordCategory;
  classhilight = "<span class='name-hilight'>$1</span><ping/>";
  flashwordCategory = function(word) {
    var flags, parts, regex;
    parts = word.split('/');
    if (parts.length < 3) {
      return {
        type: 'word',
        word: word
      };
    }
    flags = parts.pop();
    regex = parts.slice(1);
    return {
      type: 'regex',
      regex: regex,
      flags: flags
    };
  };
  confetti.command('flashwords', "Shows your flash words (sequences of characters that ping you when said).", function(_, chan) {
    var flashwords, html, index, numWords, word, _i, _len;
    flashwords = confetti.cache.get('flashwords');
    numWords = flashwords.length;
    if (numWords === 0) {
      return confetti.msg.bot("You have no flash words.");
    }
    confetti.msg.bold("Flash words <small>[" + numWords + "]</small>", '', chan);
    html = "";
    for (index = _i = 0, _len = flashwords.length; _i < _len; index = ++_i) {
      word = flashwords[index];
      html += confetti.msg.bullet + (" " + (flashwordCategory(word).type === 'word' ? 'Word' : 'Regex') + ": <b>" + (sys.htmlEscape(word)) + "</b> <small>[<a href='po:send/-removeflashword " + (confetti.util.stripquotes(word)) + "' style='text-decoration:none;color:black'>remove</a>]</small><br>");
    }
    return confetti.msg.html(html, chan);
  });
  confetti.alias('flashwordlist', 'flashwords');
  confetti.command('flashword', {
    help: "Adds [word] to your flash word list. [word] may also be a <a href='http://www.regexr.com/' title='Regexr'>regular expression</a>, prefix it with <b>/</b> like so: /(word)/i. The first capture group will be the flashword.",
    args: ["word"]
  }, function(data) {
    var flashwords, index;
    flashwords = confetti.cache.get('flashwords');
    if (!data) {
      return confetti.msg.bot("Specify the flashword!");
    }
    index = flashwords.indexOf(data);
    if (index !== -1) {
      return confetti.msg.bot("" + (sys.htmlEscape(data)) + " is already in your flashwords list!");
    }
    flashwords.push(data);
    confetti.cache.store('flashwords', flashwords).save();
    return confetti.msg.bot("<b>" + (sys.htmlEscape(data)) + "</b> will now ping you when said!");
  });
  confetti.alias('addflashword, stalkword, addstalkword', 'flashword');
  confetti.command('removeflashword', {
    help: "Removes [flashword] from your flashword list.",
    args: ["flashword"]
  }, function(data) {
    var flashwords, index;
    flashwords = confetti.cache.get('flashwords');
    if (!data) {
      return confetti.msg.bot("Specify the flash word!");
    }
    index = flashwords.indexOf(data);
    if (index === -1) {
      return confetti.msg.bot("" + (sys.htmlEscape(data)) + " is not in your flashwords list, check the spelling!");
    }
    flashwords.splice(index, 1);
    confetti.cache.store('flashwords', flashwords).save();
    return confetti.msg.bot("<b>" + (sys.htmlEscape(data)) + "</b> will no longer ping you!");
  });
  confetti.command('flashes', "Toggles whether if name flashes and flash words should be enabled.", function() {
    confetti.cache.store('flashes', !confetti.cache.read('flashes')).save();
    return confetti.msg.bot("Flashes are now " + (confetti.cache.read('flashes') ? 'on' : 'off') + ".");
  });
  confetti.alias('rmflashword, unflashword, removestalkword, rmstalkword, unstalkword', 'removeflashword');
  confetti.initFields({
    flashwords: []
  });
  return confetti.hook('manipulateChanPlayerMessage', function(from, fromId, message, playerMessage, _arg, chan, html, dirty) {
    var auth, authSymbol, cat, color, flashMessage, flashword, flashwords, _i, _len;
    color = _arg[0], auth = _arg[1], authSymbol = _arg[2];
    if (confetti.cache.get('flashes') === true) {
      flashwords = confetti.cache.get('flashwords');
      flashMessage = playerMessage;
      for (_i = 0, _len = flashwords.length; _i < _len; _i++) {
        flashword = flashwords[_i];
        cat = flashwordCategory(flashword);
        if (cat.type === 'word') {
          flashMessage = flashMessage.replace(new RegExp("\\b(" + (confetti.util.escapeRegex(cat.word)) + ")\\b(?![^\\s<]*>)", "gi"), classhilight);
        } else {
          flashMessage = flashMessage.replace(new RegExp(cat.regex, cat.flags), classhilight);
        }
      }
      if (flashMessage !== playerMessage) {
        playerMessage = flashMessage;
        dirty = true;
      }
    }
    return [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty];
  });
})();

(function() {
  confetti.command('friends', "Displays your friends list.", function(_, chan) {
    var count, friend, friends, html, _i, _len;
    friends = confetti.util.sortOnlineOffline(confetti.cache.get('friends'));
    if (friends.length === 0) {
      return confetti.msg.bot("<span title='You have 0 friends.'>There is no one on your friend list.</span>");
    }
    confetti.msg.bold("Your friends <small>[" + friends.length + "]</small>", '', chan);
    html = "";
    count = 0;
    for (_i = 0, _len = friends.length; _i < _len; _i++) {
      friend = friends[_i];
      count += 1;
      html += "" + confetti.msg.bullet + " " + (confetti.player.fancyName(friend)) + " " + (confetti.player.status(friend));
      if (count % 3 === 0) {
        html += "<br>";
      }
    }
    return confetti.msg.html(html, chan);
  });
  confetti.command('friend', {
    help: "Adds [name] to your friend list.",
    args: ["name"]
  }, function(data) {
    var friends, name;
    name = confetti.player.name(data);
    data = data.toLowerCase();
    friends = confetti.cache.get('friends');
    if (!data) {
      return confetti.msg.bot("Specify a name!");
    }
    if (Client.ownName().toLowerCase() === data) {
      return confetti.msg.bot("You can't add yourself as a friend!");
    }
    if (__indexOf.call(friends, data) >= 0) {
      return confetti.msg.bot("" + name + " is already on your friends list!");
    }
    friends.push(data);
    confetti.cache.store('friends', friends).save();
    return confetti.msg.bot("" + (sys.htmlEscape(name)) + " is now on your friends list!");
  });
  confetti.command('unfriend', {
    help: "Removes [name] from your friend list.",
    args: ["name"]
  }, function(data) {
    var friends, name;
    data = data.toLowerCase();
    name = confetti.player.name(data);
    friends = confetti.cache.get('friends');
    if (__indexOf.call(friends, data) < 0) {
      return confetti.msg.bot("" + (sys.htmlEscape(name)) + " isn't on your friends list!");
    }
    friends.splice(friends.indexOf(data), 1);
    confetti.cache.store('friends', friends).save();
    return confetti.msg.bot("You removed " + (sys.htmlEscape(name)) + " from your friends list!");
  });
  confetti.command('friendnotifications', "Toggles whether if notifications specific to friends (logins, logouts) should be shown.", function() {
    confetti.cache.store('friendnotifications', !confetti.cache.read('friendnotifications')).save();
    return confetti.msg.bot("Friend notifications are now " + (confetti.cache.read('friendnotifications') ? 'on' : 'off') + ".");
  });
  confetti.initFields({
    friends: [],
    friendnotifications: true
  });
  confetti.hook('onPlayerReceived', function(id) {
    var friends, name, tracked, trackedName;
    if (confetti.loginTime === 0 || sys.time() <= confetti.loginTime + 4) {
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
  confetti.command('commands', "Shows this command list.", function() {
    return new confetti.CommandList("Commands").group("Command Lists").cmds('commands scriptcommands plugincommands friendcommands blockcommands trackcommands flashcommands mapcommands configcommands').hooks('list').group("Player Symbols").cmds('authsymbols authsymbol').hooks('playersymbols').hooks('categories').whiteline().cmds('reconnect define translate news imp info chan idle pm flip myip teambuilder findbattle disconnect').hooks('misc').cmds('html eval').hooks('dev').render();
  });
  confetti.alias('commandlist', 'commands');
  confetti.command('configcommands', "Shows various commands that change your settings.", function() {
    return new confetti.CommandList("Configuration").cmds('botname botcolor encool notifications commandindicator autoreconnect ignorepms').hooks('config').whiteline().cmd('defaults').render();
  });
  confetti.command('blockcommands', "Shows commands related to blocking other players.", function() {
    return confetti.cmdlist("Blocking", 'block unblock blocked', 'block');
  });
  confetti.command('plugincommands', "Shows commands related to plugins.", function() {
    return confetti.cmdlist("Plugins", 'plugins addplugin removeplugin updateplugins', 'plugins');
  });
  confetti.command('scriptcommands', "Shows commands related to Confetti (the script).", function() {
    return confetti.cmdlist("Confetti", 'updatescript autoupdate changelog version', 'script');
  });
  confetti.command('trackcommands', "Shows commands related to tracking players (such as their aliases).", function() {
    return confetti.cmdlist("Tracking", 'track untrack tracked trackingresolve', 'track');
  });
  confetti.command('flashcommands', "Shows commands related to flashes and flashwords.", function() {
    return confetti.cmdlist("Flashes", 'flashword removeflashword flashwords flashes', 'flash');
  });
  confetti.command('mapcommands', "Shows commands related to message mapping", function() {
    return confetti.cmdlist("Message Mapping", 'map unmap maphelp mapindicator togglemaps', 'map');
  });
  return confetti.command('friendcommands', "Shows commands related to friends.", function() {
    return confetti.cmdlist("Friends", 'friend unfriend friends friendnotifications', 'friends');
  });
})();

(function() {
  var executeMap, mapDataValidators, mapTypes;
  mapTypes = "command send".split(" ");
  mapDataValidators = {
    command: function(mapdata) {
      return mapdata.length > 0;
    },
    send: function(mapdata) {
      return mapdata.length > 0;
    }
  };
  executeMap = function(map, param, chan) {
    var data, line, _i, _len;
    if (chan == null) {
      chan = Client.currentChannel();
    }
    data = map.data.replace(/\$%/g, param).replace(/\$\\%/g, '$%').split('\\n');
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      line = data[_i];
      switch (map.type) {
        case "command":
          confetti.runCommand(line, chan);
          break;
        case "send":
          confetti.msg.notify(line, chan);
      }
    }
    return true;
  };
  confetti.command('maphelp', "Displays help for message mapping.", function(_, chan) {
    var cin, min;
    cin = confetti.cache.get('commandindicator');
    min = confetti.cache.get('mapindicator');
    confetti.msg.bot("Message mapping (commonly known as binds) allows you to map a message (starting with your mapping indicator - which is currently <b><font size=4>" + cin + "</font></b>) to something else, specified by the mapping <b>type</b>. Its purpose is to expand something short, easily to type, into a longer piece of text which you have defined beforehand using the <b>map</b> command.");
    confetti.msg.bot("Maps take a type to indicate what to do. Here they are:");
    confetti.msg.html("" + confetti.msg.bullet + " <b>command</b>: Executes a Confetti command. Requires data: the command to execute. It doesn't have to start with your command indicator.", chan);
    confetti.msg.html("" + confetti.msg.bullet + " <b>send</b>: Sends a message in the channel you are in when you use the map. Requires data: the message to send. Can also be used to execute server commands.", chan);
    confetti.msg.html("", chan);
    confetti.msg.bot("For example:");
    confetti.msg.html("" + confetti.msg.bullet + " <b>Add a mapping</b>: <a href='po:send/-map pl:send:/players'>" + cin + "map pl:send:/players</a>", chan);
    confetti.msg.html("" + confetti.msg.bullet + " <b>Execute it</b>: <a href='po:send/" + min + "pl'>" + min + "pl</a>", chan);
    confetti.msg.html("" + confetti.msg.bullet + " <b>Add a multi map</b>: <a href='po:send/-map hi2:send:hi\\neveryone'>" + cin + "map hi2:send:hi\\neveryone</a> (executing it is the same process)", chan);
    confetti.msg.html("" + confetti.msg.bullet + " <b>Add a parameter map</b>: <a href='po:send/-map ch:command:chan $%'>" + cin + "map ch:send:chan $%</a>", chan);
    confetti.msg.html("" + confetti.msg.bullet + " <b>Execute it</b>: <a href='po:send/" + min + "ch Confetti'>" + min + "ch Confetti</a>", chan);
    confetti.msg.html("", chan);
    confetti.msg.bot("You can execute multiple commands in your mapping for a map by separating each command with the text \"\\n\". This is called a <b>multi map</b>.");
    confetti.msg.bot("If you want your map to take a parameter, you can do so by putting $% in your map (see below). If you need to have $% in your map, you can do $\\%. This is called a <b>parameter map</b>. Parameter maps and multi maps can be combined just fine.");
    confetti.msg.bot("To remove a mapping, use the <b>unmap</b> command. For a list of maps, use the <a href='po:send/-maps'><b>" + cin + "maps</b></a> command.");
    return confetti.msg.bot("You currently have maps " + (confetti.cache.get('mapsenabled') ? 'enabled' : 'disabled') + ". Toggle it with the <a href='po:send/-togglemaps'><b>" + cin + "togglemaps</b></a> command.");
  });
  confetti.command('maps', "Displays your message mappings.", function(_, chan) {
    var count, html, map, mapc, maps;
    maps = confetti.cache.get('maps');
    mapc = Object.keys(maps).length;
    if (mapc === 0) {
      return confetti.msg.bot("You have no message mappings.");
    }
    confetti.msg.bold("Your mappings <small>[" + mapc + "]</small>", '', chan);
    html = "";
    count = 0;
    for (_ in maps) {
      map = maps[_];
      count += 1;
      html += "" + confetti.msg.bullet + " <b>" + (sys.htmlEscape(map.msg)) + "</b>: " + map.type + " mapping" + (map.data ? ' (' + sys.htmlEscape(map.data) + ')' : '') + "<br>";
    }
    return confetti.msg.html(html, chan);
  });
  confetti.command('map', ['map [message]:[type]:[data...]', "Creates/overrides a message mapping for the message [message]. [type] is the map's type, [data] is any data to be supplied to the map. For more information (like what maps are, and the available mapping types), use the maphelp command.", 'send@maphelp'], function(data) {
    var mapdata, maps, mdata, msg, oldmap, type, validator, _ref;
    _ref = data.split(':'), msg = _ref[0], type = _ref[1], mapdata = 3 <= _ref.length ? __slice.call(_ref, 2) : [];
    if (type == null) {
      type = "";
    }
    type = type.toLowerCase();
    maps = confetti.cache.get('maps');
    if (!msg) {
      return confetti.msg.bot("Specify a mapping!");
    }
    if (msg.indexOf(' ') !== -1) {
      return confetti.msg.bot("Map names cannot contain spaces.");
    }
    if (!(__indexOf.call(mapTypes, type) >= 0)) {
      return confetti.msg.bot("" + type + " is not a valid map type. Use the maphelp command for more info.");
    }
    validator = mapDataValidators[type];
    if ((validator != null) && !validator(mapdata)) {
      return confetti.msg.bot("The validator for mapping type " + type + " didn't pass your map data. Use the maphelp command for more info.");
    }
    mdata = mapdata.join(':');
    if (maps[msg]) {
      oldmap = maps[msg];
      if (oldmap.type === type && oldmap.data === mdata) {
        return confetti.msg.bot("" + (confetti.cache.get('mapindicator')) + msg + " already maps to " + type + (mdata ? ' (' + mdata + ')' : '') + "!");
      }
    }
    maps[msg] = {
      msg: msg,
      type: type,
      data: mdata
    };
    confetti.cache.store('maps', maps).save();
    return confetti.msg.bot("" + (confetti.cache.get('mapindicator')) + (sys.htmlEscape(msg)) + " now maps to " + type + (mdata ? ' (' + sys.htmlEscape(mdata) + ')' : '') + "!");
  });
  confetti.command('unmap', {
    help: "Removes the mapping for the message [message].",
    args: ["message"]
  }, function(data) {
    var maps;
    maps = confetti.cache.get('maps');
    if (!maps.hasOwnProperty(data)) {
      return confetti.msg.bot("" + data + " isn't mapped to anything!");
    }
    delete maps[data];
    confetti.cache.store('maps', maps).save();
    return confetti.msg.bot("You removed " + (sys.htmlEscape(data)) + " from your message mappings!");
  });
  confetti.command('mapindicator', {
    help: "Changes your mapping indicator (to indicate usage of maps) to [symbol].",
    args: ["symbol"]
  }, function(data) {
    data = data.toLowerCase();
    if (data.length !== 1) {
      return confetti.msg.bot("Your mapping indicator has to be one character, nothing more, nothing less!");
    }
    if (data === '/' || data === '!') {
      return confetti.msg.bot("'!' and '/' are not allowed as command indicators because they are reserved for server scripts.");
    }
    if (confetti.cache.read('mapindicator') === data) {
      return confetti.msg.bot("Your mapping indicator is already " + (sys.htmlEscape(data)) + "!");
    }
    confetti.cache.store('mapindicator', data).save();
    return confetti.msg.bot("Your mapping indicator is now " + (sys.htmlEscape(data)) + "!");
  });
  confetti.command('togglemaps', "Toggles whether if message maps should be enabled.", function() {
    confetti.cache.store('mapsenabled', !confetti.cache.read('mapsenabled')).save();
    return confetti.msg.bot("Message mapping is now " + (confetti.cache.read('mapsenabled') ? 'enabled' : 'disabled') + ".");
  });
  confetti.initFields({
    maps: {},
    mapindicator: ':',
    mapsenabled: true
  });
  return confetti.hook('beforeSendMessage', function(message, chan, stop) {
    var mapmsg, mapparts, maps, params;
    if (confetti.cache.get('mapsenabled') === true && message[0] === confetti.cache.get('mapindicator')) {
      mapparts = message.substr(1).split(' ');
      mapmsg = mapparts[0];
      params = mapparts.slice(1);
      maps = confetti.cache.get('maps');
      if (maps.hasOwnProperty(mapmsg)) {
        executeMap(maps[mapmsg], params, chan);
        stop = true;
      }
    }
    return [message, chan, stop];
  });
})();

(function() {
  confetti.command('eval', {
    help: "Evaluates a JavaScript Program.",
    args: ["code"]
  }, function(data, chan) {
    var ex, res;
    try {
      res = eval(data);
      return confetti.msg.bold("Eval returned", sys.htmlEscape(res), chan);
    } catch (_error) {
      ex = _error;
      confetti.msg.bold("Eval error", "" + ex + " on line " + ex.lineNumber, chan);
      if (ex.backtrace != null) {
        return confetti.msg.html(ex.backtrace.join('<br>'), chan);
      }
    }
  });
  confetti.command('evalp', 'eval');
  confetti.command('imp', {
    help: "Changes your name to [name]. If the name is deemed invalid, you will be kicked, so be careful!",
    args: ["name"]
  }, function(data) {
    if (!data) {
      return confetti.msg.bot("Specify a name!");
    } else if (data.length > 20) {
      return confetti.msg.bot("That name is too long or too short (max 20 characters)!");
    }
    Client.changeName(data);
    return confetti.msg.bot("You are now known as " + data + "!");
  });
  confetti.alias('changename', 'imp');
  confetti.command('flip', "Flips a coin in virtual life.", function() {
    return confetti.msg.bot("The coin landed " + (Math.random() > 0.5 ? 'heads' : 'tails') + "!");
  });
  confetti.alias('coin', 'flip');
  confetti.command('html', {
    help: "Displays some HTML [code] (for testing purposes).",
    args: ["code"]
  }, function(data, chan) {
    return confetti.msg.html(data, chan);
  });
  confetti.command('idle', "Toggles your idle status.", function() {
    var away;
    away = !Client.away();
    Client.goAway(away);
    return confetti.msg.bot("You are " + (away ? 'now idle' : 'no longer idle') + ".");
  });
  confetti.command('teambuilder', "Opens the teambuilder.", function() {
    return Client.openTeamBuilder();
  });
  confetti.alias('tb', 'teambuilder');
  confetti.command('findbattle', "Opens the find battle dialog.", function() {
    return Client.openBattleFinder();
  });
  confetti.alias('fb', 'findbattle');
  confetti.command('disconnect', "Disconnects you from the server and returns you to the server selection screen.", function() {
    return Client.done();
  });
  confetti.alias('dc', 'disconnect');
  confetti.command('chan', {
    help: "Joins, jumps to, or creates a channel.",
    args: ["name"]
  }, function(data) {
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
  confetti.alias('joinchan, channel, goto', 'chan');
  confetti.command('pm', {
    help: "Opens a PM session with [name].",
    args: ["name"]
  }, function(data) {
    var id;
    if (!data) {
      return confetti.msg.bot("Specify a name!");
    }
    id = Client.id(data);
    if (id === -1) {
      return confetti.msg.bot("" + (sys.htmlEscape(data)) + " is not online right now.");
    } else if (id === Client.ownId()) {
      return confetti.msg.bot("You can't PM yourself!");
    }
    return Client.startPM(id);
  });
  confetti.command('info', {
    help: "Shows some info (like id, color, auth level) for a given user. If you are a moderator, this will also open a control panel for the player and display additional information.",
    args: ["name"]
  }, function(data, chan) {
    var auth, bullet, color, hasAuth, id, name, showAvatar;
    id = Client.id(data);
    hasAuth = Client.ownAuth() >= 1;
    bullet = function(title, msg) {
      return confetti.msg.html("" + confetti.msg.bullet + " <b>" + title + "</b>: " + msg, chan);
    };
    showAvatar = function() {
      var avatar;
      if (id !== -1 && (Client.player != null)) {
        avatar = Client.player(id).avatar;
        return bullet("Avatar", "" + avatar + "<br>" + confetti.msg.indent + "<img src='trainer:" + avatar + "'>");
      }
    };
    if (hasAuth) {
      confetti.requestUserInfo(data, function(ui) {
        var FlagBanned, FlagMuted, FlagNonExistant, FlagOnline, FlagTempBanned, mode;
        FlagOnline = 1;
        FlagBanned = 2;
        FlagMuted = 4;
        FlagNonExistant = 8;
        FlagTempBanned = 16;
        if (ui.flags & FlagNonExistant) {
          return confetti.msg.bot("" + (sys.htmlEscape(data)) + " has not been on this server yet.", chan);
        }
        if (id === -1) {
          confetti.msg.html("<timestamp/><b>" + ui.name + "</b> (<b>" + (ui.flags & FlagOnline ? '<font color="green">Online</font>' : '<font color="red">Offline</font>') + "</b>)", chan);
          bullet("Auth", confetti.player.authToName(ui.auth) + (" (" + ui.auth + ")"));
        }
        bullet("IP", ui.ip);
        bullet("Last Online", ui.date.replace('T', ' at ') + " (GMT)");
        if (ui.os) {
          bullet("Operating System", ui.os);
        }
        mode = [];
        if (ui.flags & FlagBanned) {
          mode.push('Banned');
        }
        if (ui.flags & FlagMuted) {
          mode.push('Muted');
        }
        if (ui.flags & FlagTempBanned) {
          mode.push('Tempbanned');
        }
        if (mode.length) {
          confetti.msg.html("<timestamp/> <b>" + (mode.join('; ')) + "</b>");
        }
        return showAvatar();
      });
      Network.getBanList();
      Client.controlPanel(id);
    }
    if (id === -1) {
      if (!hasAuth) {
        confetti.msg.bot("" + (sys.htmlEscape(data)) + " is offline, I can't fetch any information about them.");
      }
      return;
    }
    name = confetti.player.fancyName(id);
    auth = Client.auth(id);
    color = Client.color(id);
    confetti.msg.html("<timestamp/>" + name + " " + (confetti.player.status(id)) + " <small>" + id + "</small>", chan);
    bullet("Auth", confetti.player.authToName(auth) + (" (" + auth + ")"));
    bullet("Color", "<b style='color:" + color + "'>" + color + "</b>");
    if (!hasAuth) {
      return showAvatar();
    }
  });
  confetti.alias('userinfo', 'info');
  confetti.alias('controlpanel', 'info');
  confetti.alias('cp', 'info');
  return confetti.command('myip', "Shows your IP address.", function() {
    return sys.webCall('http://bot.whatismyipaddress.com/', function(resp) {
      if (!resp) {
        return confetti.msg.bot("Couldn't obtain your IP address - check your internet connection.");
      }
      return confetti.msg.bot("Your IP address is <b>" + resp + "</b>.");
    });
  });
})();

(function() {
  var newsurl;
  newsurl = 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&rsz=6&hl=';
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
    return confetti.io.getRemoteJson("" + newsurl + (encodeURIComponent(lang)) + topic, ["A connection error occured while loading news.", chan], function(json) {
      var mess, res, stories, story, _i, _j, _len, _len1;
      stories = json.responseData.results;
      res = [];
      for (_i = 0, _len = stories.length; _i < _len; _i++) {
        story = stories[_i];
        res.push(("" + confetti.msg.bullet + " <b>") + story.titleNoFormatting.replace(/&#39;/g, "'").replace(/`/g, "'").replace(/&quot;/g, "\"") + ("</b><br>" + confetti.msg.indent + "&nbsp;&nbsp;&nbsp;&nbsp;→ Read more: " + (sys.htmlEscape(story.unescapedUrl))));
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
  var findPlugin, getListing, getPluginFile, hasPlugin, pluginIndex, updatePlugins;
  pluginIndex = function(id, plugins) {
    var index, plugin, _i, _len;
    if (plugins == null) {
      plugins = confetti.cache.get('plugins');
    }
    id = id.toLowerCase();
    for (index = _i = 0, _len = plugins.length; _i < _len; index = ++_i) {
      plugin = plugins[index];
      if (plugin.id === id) {
        return index;
      }
    }
    return -1;
  };
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
  getListing = function(chan, callback, verbose) {
    if (verbose == null) {
      verbose = true;
    }
    return confetti.io.getRemoteJson("" + confetti.pluginsUrl + "listing.json", [(verbose ? "An error occured whilst loading the plugin listing." : ""), chan], callback);
  };
  getPluginFile = function(pid, chan, callback, verbose) {
    if (verbose == null) {
      verbose = true;
    }
    return confetti.io.getRemoteFile("" + confetti.pluginsUrl + pid + "/" + pid + ".js", [(verbose ? "An error occured whilst loading the plugin source file of the plugin " + pid + "." : ""), chan], callback);
  };
  updatePlugins = function(verbose, chan) {
    if (verbose == null) {
      verbose = false;
    }
    return getListing(chan, function(json) {
      var done, plug, plugin, plugins, toUpdate, _i, _len;
      toUpdate = [];
      done = 0;
      plugins = confetti.cache.get('plugins');
      for (_i = 0, _len = plugins.length; _i < _len; _i++) {
        plugin = plugins[_i];
        plug = findPlugin(plugin.id, json);
        if (plug && plugin.version !== plug.version) {
          toUpdate.push([plugin, plug]);
        }
      }
      if (toUpdate.length) {
        return toUpdate.forEach(function(plugin) {
          var nplug, pid;
          nplug = plugin[1];
          pid = nplug.id;
          return getPluginFile(pid, chan, function(resp) {
            var p, pids, _j, _len1;
            confetti.io.writeLocal("plugin-" + pid + ".js", resp);
            plugins[pluginIndex(pid, plugins)] = nplug;
            done += 1;
            if (done === toUpdate.length) {
              pids = [];
              for (_j = 0, _len1 = toUpdate.length; _j < _len1; _j++) {
                p = toUpdate[_j];
                confetti.msg.bot("Plugin " + p[1].name + " updated to version " + p[1].version + "!", chan);
                pids.push(p[1].id);
              }
              confetti.cache.store('plugins', plugins).save();
              return confetti.initPlugins(pids);
            }
          }, verbose);
        });
      } else if (verbose) {
        return confetti.msg.bot("All plugins up to date.", chan);
      }
    }, verbose);
  };
  confetti.updatePlugins = updatePlugins;
  confetti._pluginAPI = {
    pluginIndex: pluginIndex,
    findPlugin: findPlugin,
    hasPlugin: hasPlugin,
    getListing: getListing,
    getPluginFile: getPluginFile,
    updatePlugins: updatePlugins
  };
  confetti.command('plugins', "Displays a list of enabled and available plugins.", function(_, chan) {
    var html, plugin, plugins, _i, _len;
    plugins = confetti.cache.get('plugins');
    if (plugins.length > 0) {
      confetti.msg.bold("Loaded Plugins <small>[" + plugins.length + "]</small>", '', chan);
      html = "";
      for (_i = 0, _len = plugins.length; _i < _len; _i++) {
        plugin = plugins[_i];
        html += "" + confetti.msg.bullet + " <b>" + plugin.name + "</b> (" + plugin.id + ") v" + plugin.version + " <small>[<a href='po:send/-removeplugin " + plugin.id + "' style='text-decoration:none;color:black'>remove</a>]</small><br>";
      }
      confetti.msg.html(html, chan);
    }
    return getListing(chan, function(json) {
      var addremove, len, pid, _j, _len1;
      len = json.length;
      if (!len) {
        return confetti.msg.bot("No plugins are available.", chan);
      }
      confetti.msg.bold("Available Plugins <small>[" + len + "]</small>", '', chan);
      html = "";
      for (_j = 0, _len1 = json.length; _j < _len1; _j++) {
        plugin = json[_j];
        addremove = "";
        pid = plugin.id;
        if (!hasPlugin(pid, plugins)) {
          addremove = "<small>[<a href='po:send/-addplugin " + pid + "' style='text-decoration:none;color:black'>add</a>]</small>";
        } else {
          addremove = "<small>[<a href='po:send/-removeplugin " + pid + "' style='text-decoration:none;color:black'>remove</a>]</small>";
        }
        html += "" + confetti.msg.bullet + " <b>" + plugin.name + "</b> (" + pid + ") v" + plugin.version + " " + addremove + "<br>";
      }
      return confetti.msg.html(html, chan);
    });
  });
  confetti.command('addplugin', {
    help: "Adds a plugin. The plugin's ID must be used (inside brackets).",
    args: ["id"]
  }, function(data, chan) {
    var name, plugins;
    plugins = confetti.cache.get('plugins');
    name = data;
    data = data.toLowerCase();
    if (!name) {
      return confetti.msg.bot("Specify a plugin!");
    } else if (hasPlugin(data, plugins)) {
      return confetti.msg.bot("" + name + " is already enabled as a plugin!");
    }
    return getListing(chan, function(json) {
      var pid, plugin;
      if (json.length === 0) {
        return confetti.msg.bot("No plugins are available.", chan);
      }
      plugin = findPlugin(data, json);
      if (plugin === null) {
        return confetti.msg.bot("That plugin is not available! Use the 'plugins' command to see a list of available plugins.", chan);
      }
      pid = plugin.id;
      return getPluginFile(pid, chan, function(file) {
        confetti.io.writeLocal("plugin-" + pid + ".js", file);
        plugins.push(plugin);
        confetti.cache.store('plugins', plugins).save();
        confetti.initPlugins(pid);
        return confetti.msg.bot("Plugin <b>" + plugin.name + "</b> added!", chan);
      });
    });
  });
  confetti.command('removeplugin', {
    help: "Removes a plugin. The plugin's ID must be used (inside brackets).",
    args: ["plugin"]
  }, function(data) {
    var name, plugin, plugins;
    name = data;
    data = data.toLowerCase();
    plugins = confetti.cache.get('plugins');
    plugin = findPlugin(data, plugins);
    if (plugin === null) {
      return confetti.msg.bot("" + name + " isn't an enabled plugin! Try to use its plugin id (in the plugins list, this is the name in brackets).");
    }
    plugins.splice(plugins.indexOf(plugin), 1);
    confetti.cache.store('plugins', plugins).save();
    confetti.io.deleteLocal("plugin-" + plugin.id + ".js");
    confetti.io.reloadScript();
    return confetti.msg.bot("Plugin <b>" + plugin.name + "</b> removed.");
  });
  return confetti.command('updateplugins', "Updates your plugins to their latest versions.", function(_, chan) {
    if (sys.isSafeScripts()) {
      return confetti.msg.bot("Please disable Safe Scripts before using this command.");
    }
    return updatePlugins(true, chan);
  });
})();

(function() {
  var attemptToReconnect, attempts, autoReconnectTimer, failed, forceIgnore;
  autoReconnectTimer = -1;
  attempts = 0;
  forceIgnore = false;
  failed = false;
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
      attempts = 0;
      return failed = false;
    }
  });
  Network.disconnected.connect(function() {
    if (confetti.cache.get('autoreconnect') === true && autoReconnectTimer === -1 && !forceIgnore && !failed) {
      confetti.msg.bot("Attempting to reconnect...");
      confetti.msg.notification("Disconnection detected, attempting to reconnect.");
      autoReconnectTimer = sys.setTimer(function() {
        if (attemptToReconnect() === false) {
          confetti.msg.bot("Three attempts at reconnecting have failed, stopping.");
          confetti.msg.notification("Failed to reconnect.");
          sys.unsetTimer(autoReconnectTimer);
          autoReconnectTimer = -1;
          return failed = true;
        }
      }, 5000, true);
    }
    return forceIgnore = false;
  });
  confetti.command('reconnect', "Forces a reconnect to the server.", function() {
    confetti.msg.bot("Reconnecting to the server...");
    attempts = 0;
    forceIgnore = true;
    failed = false;
    return Client.reconnect();
  });
  confetti.command('autoreconnect', "Toggles whether if you should automatically reconnect to the server when detected you've disconnected.", function() {
    confetti.cache.store('autoreconnect', !confetti.cache.read('autoreconnect')).save();
    return confetti.msg.bot("Auto reconnect is now " + (confetti.cache.read('autoreconnect') ? 'on' : 'off') + ".");
  });
  return confetti.initFields({
    autoreconnect: true
  });
})();

(function() {
  var autoUpdate, changelog, differentVersion, updateScript, versionFormat;
  changelog = {
    '2.0.0': 'Initial version of Confetti. Features encool, player blocking, friends, alias tracking, auto reconnect, plugins, and more.',
    '2.0.1': 'Improved news.',
    '2.0.2': 'Various usability improvements.',
    '2.0.3': 'Pokedex plugin, automatic updating.',
    '2.0.4': 'AoC Taunts plugin.',
    '2.0.5': 'Bug fixes for tracking and reconnect.',
    '2.0.6': 'More reconnect fixes, news and define improvements, removed dictionary.',
    '2.0.7': 'Emoji plugin.',
    '2.0.8': 'Plugin auto-updating and versions.',
    '2.0.9': 'Changelog, usability improvements, fullwidth encool, updated script urls.',
    '2.0.10': 'Pok&eacute;mon Usage Statistics plugin, auth symbols, flashwords.',
    '2.1.0': 'Reworked command lists, pm utility command.',
    '2.1.1': 'Commands split into several new command lists, nato encool mode, idle utility command.',
    '2.1.2': 'Many important bug fixes, ignorepms, teambuilder & findbattle utility commands, improved info command.',
    '2.1.3': 'Message mapping, disconnect utility command, minor fix for info command.',
    '2.1.4': 'Parameter maps, improved maphelp, minor fixes, Ye Olde & Deladder plugins.'
  };
  autoUpdate = function() {
    var now;
    if (confetti.cache.get('autoupdate') === false) {
      return;
    }
    if (sys.isSafeScripts()) {
      return;
    }
    now = sys.time();
    if ((confetti.cache.get('lastupdatetime') + (6 * 60 * 60)) > now) {
      return;
    }
    confetti.cache.store('lastupdatetime', now).save();
    confetti.updatePlugins();
    return confetti.io.getRemoteJson("" + confetti.scriptUrl + "script/version.json", "", function(json) {
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
    return confetti.io.getRemoteFile("" + confetti.scriptUrl + "scripts.js", ["Couldn't load script, check your internet connection"], function(file) {
      confetti.io.write(sys.scriptsFolder + 'scripts.js', file);
      confetti.io.reloadScript(true);
      return confetti.msg.bot("Script updated!");
    });
  };
  sys.setTimer(autoUpdate, 15 * 1000, false);
  sys.setTimer(autoUpdate, 10 * 60 * 1000, true);
  confetti.changelog = changelog;
  confetti.autoUpdate = autoUpdate;
  confetti.updateScript = updateScript;
  confetti.command('updatescript', "Updates the script to the latest available version.", function() {
    if (sys.isSafeScripts()) {
      return confetti.msg.bot("Please disable Safe Scripts before using this command.");
    }
    confetti.msg.bot("Updating script...");
    return updateScript();
  });
  confetti.alias('updatescripts', 'updatescript');
  confetti.command('autoupdate', "Toggles whether if the script should automatically look for updates (every 6 hours).", function() {
    confetti.cache.store('autoupdate', !confetti.cache.read('autoupdate')).save();
    return confetti.msg.bot("Automatic updates are now " + (confetti.cache.read('autoupdate') ? 'enabled' : 'disabled') + ".");
  });
  confetti.command('version', "Shows the script's version.", function() {
    var vers;
    vers = versionFormat(confetti.version);
    confetti.msg.bot("Your copy of Confetti is currently on version " + vers + ".");
    if (changelog[vers]) {
      return confetti.msg.bot("What's new: " + changelog[vers]);
    }
  });
  confetti.command('changelog', "Shows a changelog containing the major changes in each version.", function() {
    var msg, ver, _results;
    _results = [];
    for (ver in changelog) {
      msg = changelog[ver];
      _results.push(confetti.msg.bot("" + ver + ": " + msg));
    }
    return _results;
  });
  return confetti.initFields({
    autoupdate: true,
    lastupdatetime: sys.time()
  });
})();

(function() {
  confetti.command('notifications', "Toggles whether if notifications should be shown (tray messages).", function() {
    confetti.cache.store('notifications', !confetti.cache.read('notifications')).save();
    return confetti.msg.bot("Notifications are now " + (confetti.cache.read('notifications') ? 'on' : 'off') + ".");
  });
  confetti.command('ignorepms', "Toggles whether if PMs should be ignored. This feature is separate from the client's built-in (this one actually works). You can still send PMs, but no one will be able to send them to you and you won't receive notification of it (so be careful to leave this on).", function() {
    confetti.cache.store('ignorepms', !confetti.cache.read('ignorepms')).save();
    return confetti.msg.bot("PMs are now " + (confetti.cache.read('ignorepms') ? 'being ignored' : 'enabled') + ".");
  });
  confetti.command('botname', {
    help: "Changes the bot's name to [name].",
    args: ["name"]
  }, function(data) {
    if (data.length > 25) {
      return confetti.msg.bot("Uhh, that's too long, I think!");
    }
    if (confetti.cache.read('botname') === data) {
      return confetti.msg.bot("I'm already " + (sys.htmlEscape(data)) + "!");
    }
    confetti.cache.store('botname', data).save();
    return confetti.msg.bot("I'm now called " + (sys.htmlEscape(data)) + "!");
  });
  confetti.command('botcolor', {
    help: "Changes the bot's color to [color].",
    args: ["color"]
  }, function(data) {
    data = data.toLowerCase();
    if (!sys.validColor(data)) {
      return confetti.msg.bot("That doesn't look like a valid color to me!");
    }
    if (confetti.cache.read('botcolor') === data) {
      return confetti.msg.bot("My color is already " + data + "!");
    }
    confetti.cache.store('botcolor', data).save();
    return confetti.msg.bot("My color is now " + data + "!");
  });
  confetti.command('commandindicator', {
    help: "Changes your command indicator (to indicate usage of commands) to [symbol]. <b>-</b> will remain usable, in case you ever forget.",
    args: ["symbol"]
  }, function(data) {
    data = data.toLowerCase();
    if (data.length !== 1) {
      return confetti.msg.bot("Your command indicator has to be one character, nothing more, nothing less!");
    }
    if (data === '/' || data === '!') {
      return confetti.msg.bot("'!' and '/' are not allowed as command indicators because they are reserved for server scripts.");
    }
    if (confetti.cache.read('commandindicator') === data) {
      return confetti.msg.bot("Your command indicator is already " + (sys.htmlEscape(data)) + "!");
    }
    confetti.cache.store('commandindicator', data).save();
    return confetti.msg.bot("Your command indicator is now " + (sys.htmlEscape(data)) + "!");
  });
  return confetti.command('defaults', "Sets all settings back to their defaults. There may be some plugins which do not support this action, in which case they might break.", function(data) {
    if (data.toLowerCase() !== 'sure') {
      return confetti.msg.bot("<a href='po:send/-defaults sure' style='text-decoration: none; color: black;'>Are you sure that you want to reset your settings? There is no going back. Click this message to confirm (or type <small>" + (confetti.cache.get('commandindicator')) + "defaults sure</small>).</a>");
    }
    confetti.cache.wipe();
    confetti.initCache();
    confetti.io.reloadScript();
    return confetti.msg.bot("Your settings have been reset to their defaults!");
  });
})();

(function() {
  confetti.command('tracked', "Displays a list of tracked players.", function(_, chan) {
    var alt, alts, html, name, names, numTracked, tracked, _i, _len;
    tracked = confetti.cache.get('tracked');
    numTracked = Object.keys(tracked).length;
    if (numTracked === 0) {
      return confetti.msg.bot("There is no one on your tracking list.");
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
      html += "" + confetti.msg.bullet + " " + (confetti.player.fancyName(name, null, false)) + " " + (confetti.player.status(name, false)) + " as <small>[" + alts.length + "]</small><br>";
      alts = confetti.util.sortOnlineOffline(alts);
      for (_i = 0, _len = alts.length; _i < _len; _i++) {
        alt = alts[_i];
        html += "&nbsp;&nbsp;&nbsp;&nbsp;" + confetti.msg.bullet + " " + (confetti.player.fancyName(alt, null, false)) + " " + (confetti.player.status(alt, false)) + "<br>";
      }
    }
    return confetti.msg.html(html, chan);
  });
  confetti.alias('tracking, trackinglist', 'tracked');
  confetti.command('track', {
    help: "Adds [alias] as an alias of [name] to your tracking list.",
    args: ["alias", "name"]
  }, function(data) {
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
    if (!alt && !name) {
      return confetti.msg.bot("Specify both the alt and the name!");
    }
    if (tracked.hasOwnProperty(alt)) {
      return confetti.msg.bot("" + altName + " is already on your tracking list!");
    }
    tracked[alt] = name;
    confetti.cache.store('tracked', tracked).save();
    return confetti.msg.bot("" + altName + " is now on your tracking list as an alt of " + (confetti.player.name(name, false)) + "!");
  });
  confetti.command('untrack', {
    help: "Removes [alias] from your tracking list.",
    args: ["alias"]
  }, function(data) {
    var name, tracked;
    data = data.toLowerCase();
    name = confetti.player.name(data, false);
    tracked = confetti.cache.get('tracked');
    if (!tracked.hasOwnProperty(data)) {
      return confetti.msg.bot("" + name + " isn't on your tracking list!");
    }
    delete tracked[data];
    confetti.cache.store('tracked', tracked).save();
    return confetti.msg.bot("You removed " + name + " from your tracking list!");
  });
  confetti.command('trackingresolve', "Toggles whether if tracked names should resolve to their real name (in lists &c.). Does not affect chat name resolution.", function() {
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
  confetti.command('translate', ['translate [message]:[to language code]-[from language code]', "Translates a message from a language to another one. [from language code] is optional and might even be ignored, it's purely a hint (note the dash). Language codes are two letters, for example <b>en</b> (English), <b>es</b> (Spanish), <b>de</b> (German). A full list is available <a href='http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes#Partial_ISO_639_table'>here</a> (ISO 639-1 language codes).", 'setmsg@translate message:to-from'], function(data, chan) {
    var from, languageParts, message, parts, to, url;
    parts = data.split(':');
    message = parts[0];
    languageParts = (parts[1] || '').split('-');
    to = languageParts[0];
    from = languageParts[1] || '';
    if (!(message && to)) {
      return confetti.msg.bot("You have to specify a message and a language to translate to (message:es, for example).");
    }
    url = "http://translate.google.com/translate_a/t?client=t&text=" + (encodeURIComponent(message)) + "&hl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&trs=1&ssel=3&tsel=6&sc=1&tl=" + (encodeURIComponent(to));
    if (from) {
      url += "&sl=" + (encodeURIComponent(from));
    }
    return sys.webCall(url, function(response) {
      var ex, json;
      response = response.replace(clearDuplicateCommas, ',').replace(clearDuplicateCommas, ',');
      try {
        json = JSON.parse(response);
      } catch (_error) {
        ex = _error;
        return confetti.msg.bot("Failed to translate your message -- check your internet connection", chan);
      }
      return confetti.msg.bot("'" + (sys.htmlEscape(message)) + "' is '" + (sys.htmlEscape(json[0][0][0])) + "' in '" + (to.toUpperCase()) + "'.", chan);
    });
  });
  return confetti.alias('trans, tr', 'translate');
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
    if (confetti.cache.initialized === false) {
      confetti.initCache();
    }
    confetti.initPlugins();
    if (!confetti.initialized) {
      if ((confetti.cache.get('lastuse') + (5 * 24 * 60 * 60)) < sys.time()) {
        confetti.msg.bot("Type <a href='po:send/-commands' style='text-decoration:none;color:green'><b>" + (confetti.cache.get('commandindicator')) + "commands</b></a> for a list of client commands.", -1);
      }
      confetti.cache.store('lastuse', sys.time()).save();
      if (confetti.cache.get('ignorepms') === true) {
        confetti.msg.bot("<b style='color:red'>PMs are currently being ignored. You can re-enable them with <a href='po:send/-ignorepms' style='text-decoration:none;color:green'><b>" + (confetti.cache.get('commandindicator')) + "ignorepms</b></a> (toggle command).", -1);
      }
    }
    if (sys.isSafeScripts()) {
      confetti.msg.bot("<b style='color:red'>Safe Scripts is enabled</b>. This will disable persistent data storage (your settings won't be saved) and limit other features.", -1);
      confetti.msg.bot("Disable it by unticking the \"<b>Safe Scripts</b>\" box in the <i>Script Window</i> [<i>Plugins->Script Window</i>] and clicking <b>Ok</b>.", -1);
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
  beforePMReceived: function(src, message) {
    if (confetti.cache.get('ignorepms') === true) {
      return sys.stopEvent();
    }
  },
  afterPMReceived: function(src, message) {
    return confetti.callHooks('pmReceived', src, message);
  },
  beforeSendMessage: function(message, chan) {
    var dirty, stop, _ref, _ref1;
    stop = false;
    _ref = confetti.callHooks('beforeSendMessage', message, chan, stop), message = _ref[0], chan = _ref[1], stop = _ref[2];
    if (stop) {
      sys.stopEvent();
      return;
    }
    if (confetti.isCommand(message)) {
      sys.stopEvent();
      confetti.runCommand(message, chan);
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
    var auth, authSymbol, channel, color, dirty, finishedMessage, flashes, from, fromId, fromSrc, id, line, name, originalMessage, ownId, ownName, playerMessage, willFlash, _ref, _ref1, _ref2, _ref3;
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
    channel = Client.channel(chan);
    ownName = Client.ownName();
    willFlash = confetti.util.willFlash(playerMessage, ownName);
    flashes = confetti.cache.get('flashes') === true;
    dirty = !flashes && willFlash;
    color = Client.color(fromId);
    auth = Client.auth(fromId);
    authSymbol = [];
    if (auth > 4) {
      auth = 4;
    }
    if (!html) {
      playerMessage = sys.htmlEscape(playerMessage);
      playerMessage = Client.channel(chan).addChannelLinks(playerMessage);
    }
    _ref2 = confetti.callHooks('manipulateChanPlayerMessage', from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty), from = _ref2[0], fromId = _ref2[1], message = _ref2[2], playerMessage = _ref2[3], (_ref3 = _ref2[4], color = _ref3[0], auth = _ref3[1], authSymbol = _ref3[2]), chan = _ref2[5], html = _ref2[6], dirty = _ref2[7];
    if (dirty) {
      if (authSymbol.length !== 2) {
        if ((4 > auth && auth > 0)) {
          authSymbol = ['+<i>', '</i>'];
        } else {
          authSymbol = ['', ''];
        }
      }
      if (flashes) {
        playerMessage = confetti.util.addNameHighlights(playerMessage, ownName);
      }
      finishedMessage = "<font color='" + color + "'><timestamp/>" + authSymbol[0] + "<b>" + from + ":</b>" + authSymbol[1] + "</font> " + playerMessage;
      sys.stopEvent();
      confetti.ignoreNextChanMessage = true;
      Client.printChannelMessage(finishedMessage, chan, true);
      if (flashes && playerMessage.indexOf('<ping/>') !== -1) {
        return confetti.msg.notification(confetti.util.stripHtml("" + from + ": " + playerMessage), "Ping in #" + (Client.channelName(chan)), false);
      }
    }
  }
};
