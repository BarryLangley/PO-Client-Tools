/* Settings Help:
- If the next line is BOOLEAN, the given value must be:
true (yes/on)
false (no/off)

- If the next line is STRING, the given value must be:
wrapped in quotes ("text", for example)

- If the next line is COLOR, the given value must be:
wrapped in quotes
sys.validColor must return true (it must be a valid color)

- If the next line is ARRAY, the given value must:
follow this format: ["player1", "player2", "player3"]
*/

Settings = {
    AutoIdle: true,
    // BOOLEAN
    FlashOnPMReceived: true,
    // BOOLEAN
    FlashOnMentioned: true,
    // BOOLEAN
    ShowScriptCheckOK: false,
    // BOOLEAN
    ReturnToMenuOnReconnectFailure: false,
    // BOOLEAN
    AutoReconnect: false,
    // BOOLEAN
    Bot: "~Client~",
    // STRING
    BotColor: "green",
    // COLOR 
    AutoIgnore: [],
    // ARRAY
    CommandStarts: ["-", "~"],
    // ARRAY
    Replacements: {
        "\\[\\[(.*?)\\]\\]": "http://en.wikipedia.com/$1",
        "\\[(.*?)\\]": "http://google.com/search?q=$1",
        "\{(.*?)\}": "http://wiki.pokemon-online.eu/$1",
    },
    // OBJECT
};

// End settings //
if (!sys.validColor(Settings.BotColor)) {
    Settings.BotColor = "green";
}

cli = client;
net = cli.network();
GLOBAL = this;

// connect function //
connect = function (ref, func) {
    ref.connect(func);
}

ensure = function (name, value) {
    if (typeof GLOBAL[name] == "undefined") {
        GLOBAL[name] = value;
    }
}

getVal = function (name, defaultValue) {
    var res = sys.getVal(name);
    if (res == "") {
        return defaultValue;
    }

    return res;
}

saveVal = function (name, content) {
    sys.saveVal(name, content);
}

ensure("PLAYERS", []);
ensure("border", "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>");
ensure("callcount", 0);
ensure("endcalls", false);
ensure("periodictimers", []);
ensure("ignoreflash", false);
ensure("routinetimer", sys.intervalTimer("script.playerRoutine();", 5));
ensure("reconnectfailed", false);
ensure("announcement", "");
ensure("EvalID", -1);
ensure("ignoreNoHtml", false);
ensure("AutoIdleTimer", -1);
ensure("NoHTML", false);
ensure("ReplacementsOn", true);

// Signal Attaching //
connect(net.playerLogin, function () {
    if (Settings.AutoIdle) {
        AutoIdleTimer = sys.intervalCall(function goAway() {
            if (isConnected()) {
                if (!cli.away()) {
                    cli.goAway(true);
                }
                sys.callQuickly("sys.stopTimer(AutoIdleTimer);", 10);
            }
        }, 20);
    }

    reconnectfailed = false;
});

connect(net.disconnected, function () {
    PLAYERS = [];
    callcount = 0;
    endcalls = false;
    ignoreflash = false;
    endCalls();
    announcement = "";

    if (reconnectfailed) {
        if (Settings.ReturnToMenuOnReconnectFailure) {
            bot("Returning to the menu in 3 seconds..");
            sys.callLater("cli.done();", 3);
        } else {
            bot("Reconnecting failed.");
        }
    } else {
        if (Settings.AutoReconnect) {
            bot("Automatically reconnecting..");
            client.reconnect();
        }
    }

    reconnectfailed = true;
});

connect(net.PMReceived, function (id, message) {
    if (Settings.FlashOnPMReceived && !cli.isIgnored(id)) {
        cli.channel(cli.currentChannel()).checkFlash("a", "a"); // Flash
    }
});

connect(net.reconnectFailure, function (reason) {
    reconnectfailed = true;

    if (Settings.ReturnToMenuOnReconnectFailure) {
        bot("Returning to the menu in 3 seconds..");
        sys.callLater("cli.done();", 3);
    } else {
        bot("Reconnecting failed.");
    }
});

connect(net.announcement, function (ann) {
    announcement = ann;
});

// Utilities //
defineCoreProperty = function (core, prop, func) {
    Object.defineProperty(core, prop, {
        "value": func,

        writable: true,
        enumerable: false,
        configurable: true
    });
}

defineCoreProperty(String.prototype, "isEmpty", function () {
    var mess = this;
    return mess == "" || mess.trim() == "";
});

defineCoreProperty(String.prototype, "contains", function (string) {
    var str = this;
    return str.indexOf(string) > -1;
});

defineCoreProperty(String.prototype, "has", function (string) {
    return this.contains(string);
});

defineCoreProperty(String.prototype, "format", function () {
    var str = this,
        exp, i, args = arguments.length,
        icontainer = 0;
    for (i = 0; i < args; i++) {
        icontainer++;
        exp = new RegExp("%" + icontainer, "");
        str = str.replace(exp, arguments[i]);
    }
    return str;
});

defineCoreProperty(String.prototype, "fontsize", function (size) {
    var str = this;

    return "<font size='" + size + "'>" + str + "</font>";
});

defineCoreProperty(Boolean.prototype, "isEmpty", function () {
    return this === false;
});

defineCoreProperty(Number.prototype, "isEmpty", function () {
    return !isFinite(this) || this === 0;
});

defineCoreProperty(Number.prototype, "positive", function () {
    return !this.isEmpty();
});

defineCoreProperty(Object.prototype, "isEmpty", function () {
    return this.length() === 0;
});

defineCoreProperty(Object.prototype, "keys", function () {
    return Object.keys(this);
});

defineCoreProperty(Object.prototype, "has", function (prop) {
    return typeof this[prop] !== "undefined";
});

defineCoreProperty(Object.prototype, "contains", function (prop) {
    return this.has(prop);
});

defineCoreProperty(Object.prototype, "insert", function (name, val) {
    this[name] = val;
});

defineCoreProperty(Object.prototype, "extend", function (other) {
    var x;

    if (typeof other === "object" && !Array.isArray(other) && other !== null) {
        for (x in other) {
            this[x] = other[x];
        }
    }

    return this;
});

defineCoreProperty(Object.prototype, "remove", function (name) {
    if (!this.has(name)) {
        return;
    }

    delete this[name];
});

defineCoreProperty(Object.prototype, "length", function () {
    return Object.keys(this).length;
});

defineCoreProperty(Array.prototype, "has", function (prop) {
    var x;
    for (x in this) {
        if (this[x] == prop) {
            return true;
        }
    }

    return false;
});

defineCoreProperty(Array.prototype, "isEmpty", function () {
    return this.length === 0;
});

defineCoreProperty(Array.prototype, "contains", function (prop) {
    return this.has(prop);
});

htmlMessage = function (mess, channel) {
    if (typeof channel != "number" || !cli.hasChannel(channel)) {
        channel = cli.currentChannel();
    }

    ignoreNoHtml = true;
    cli.printChannelMessage(mess, channel, true);
    ignoreNoHtml = false;
}

bot = function (mess, channel) {
    ensureChannel(channel);
    htmlMessage("<font color='" + Settings.BotColor + "'><timestamp/><b>" + Settings.Bot + ":</b></font> " + mess);
}

white = function (channel) {
    htmlMessage("", channel);
}

endCalls = function () {
    var x, timers = periodictimers.length;
    for (x in periodictimers) {
        sys.stopTimer(periodictimers[x]);
    }

    periodictimers = [];

    return timers;
}
ensureChannel = function (channel) {
    if (ownChannels().length == 0) {
        var main = cli.defaultChannel();
        if (typeof channel != "undefined") {
            main = channel;
        }

        cli.join(main);
        cli.activateChannel(main);
    }
}

ownChannels = function () {
    var x, current, channelNames = cli.channelNames(),
        ret = [];
    for (x in cli.channelNames()) {
        current = cli.channel(Number(x));
        if (current) {
            ret.push(current.id());
        }
    }

    return ret;
}

isConnected = function () {
    return cli.ownId() != -1;
}

id = function (str) {
    if (typeof str == "number") {
        return str;
    }

    return client.id(str);
}

isMod = function () {
    return cli.ownAuth() > 0;
}

hasCommandStart = function (msg) {
    return Settings.CommandStarts.indexOf(msg[0]) > -1;
}

html_escape = function (str) {
    if (typeof str != "string") {
        str = String(str);
    }

    return str.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
}

fancyJoin = function (array) {
    var x, retstr = '',
        arrlen = array.length;

    if (arrlen === 0 || arrlen === 1) {
        return array.join("");
    }

    arrlen--;

    for (x in array) {
        if (Number(x) === arrlen) {
            retstr = retstr.substr(0, retstr.lastIndexOf(","));
            retstr += " or '" + array[x] + "'";

            return retstr;
        }

        retstr += "'" + array[x] + "', ";
    }

    return "";
}

cut = function (array, entry, join) {
    if (!join) {
        join = ":";
    }

    return array.splice(entry).join(join);
}

millitime = function () {
    var now = new Date().getTime();
    return now;
}

FormatError = function (mess, e) {
    if (typeof mess != "string") {
        mess = "";
    }

    var lastChar = mess[mess.length - 1],
        lineData = "";
    if (mess != "" && lastChar !== "." && lastChar !== "!" && lastChar !== "?" && lastChar !== ":") {
        mess += ".";
    }

    if (e.lineNumber != 1) {
        lineData = " on line " + e.lineNumber;
    }

    var name = e.name,
        msg = e.message,
        str = name + lineData + ": " + msg,
        lastChar = msg[msg.length - 1];

    if (lastChar != "." && lastChar != "?" && lastChar != ":" && lastChar != "!") {
        str += ".";
    }

    return mess + " " + str;
}

html_strip = function (str) {
    return str.replace(/<\/?[^>]*>/g, "");
}

sendAll = function (message, channel) {
    if (typeof channel != "number" || !cli.hasChannel(channel)) {
        channel = cli.currentChannel();
    }
    net.sendChanMessage(channel, message);
}

cmd = function (cmd, args, desc) {
    var str = "<font color='green'><b>" + cmd + "</b></font>",
        x, arglist = {},
        current, next, part;
    desc = desc.split(" ");

    if (!args.isEmpty()) {
    str += " ";
    }
    
    for (x in args) {
        current = args[x];
        next = x + 1;

        arglist[current] = 1;
        str += "<b>" + current + "</b>:";
    }

    if (!args.isEmpty()) {
        str += " ";
    } else {
        str += ": ";
    }

    for (x in desc) {
        current = desc[x];
        part = current.substring(0, current.length - 1);

        if (arglist[current.toLowerCase()]) {
            str += "<b>" + current + "</b> ";
        } else if (arglist[part.toLowerCase()]) {
            str += "<b>" + part + "</b>" + current[part.length] + " ";
        }
        else {
            str += current + " ";
        }
    }

    if (arguments.length == 4) {
        var aliases = arguments[3];
        str += "<i>Aliases: " + aliases.join(", ") + "</i>";
    }

    htmlMessage(str);
}

PMEval = function ($1) {
    var ret;
    try {
        ret = eval($1.substring(2, $1.length - 3));
    } catch (e) {
        ret = "";
        print(FormatError("Error in PM:", e));
    }

    delete EvalID;
    return ret;
}

// Commands //
commands = {
    commands: function () {
        htmlMessage(border + " <br/>");
        htmlMessage("<h2>Commands</h2>");
        htmlMessage("Use " + fancyJoin(Settings.CommandStarts) + " before the following commands in order to use them: <br/>");

        white();

        cmd("pm", ["players", "message"], "Sends a PM to players (use , and a space to seperate them) containing message. Use %name for the current player's name. Code inside <% %> will get evaluated (EvalID is the id of the current player).");
        cmd("masspm", ["message"], "Sends a PM to everyone containing message. Use %name for the current player's name. Code inside <% %> will get evaluated (EvalID is the id of the current player). Don't use this on big servers as you will go overactive.");
        cmd("flashall", ["server|channel", "exceptions"], "To flash everyone on the server or channel. Default is channel. Server doesn't work if there are more than 60 people on the server. Separate exceptions with <b>,</b>. Exceptions is a list of player names which won't be pinged.");

        white();

        cmd("id", ["name"], "Displays the id of name.");
        cmd("color", ["name"], "Displays the hex color of name.");
        cmd("ipinfo", ["ip"], "Displays the hostname and country of ip.", ["info"]);

        white();

        cmd("periodicsay", ["seconds", "channels", "message"], "Sends message every seconds in channels. Seconds must be a number. Seperate channels with \"<b>,</b>\". The current channel will be used if no channels are specified.");
        cmd("endcalls", ["type"], "Ends the next called periodic say. Use all as type to cancel all periodic says.");

        white();

        cmd("nohtml", [], "Toggles No HTML. Default value for this is off. Escapes all HTML when on.");
        cmd("replace", [], "Toggles Replacements. If on (default), performs replacing specified in Settings.Replacements");
        cmd("announcement", [], "Displays this server's raw announcement (which you can copy).", ["ann"]);
        cmd("eval", ["code"], "Evaluates code and returns the result (for advanced users ONLY).");

        if (isMod()) { // These require moderator to work properly
            white();

            cmd("cp", ["player"], "Opens a CP of player.", ["controlpanel"]);
        }

        htmlMessage("<br/> " + border);
    },

    masspm: function (mcmd) {
        var x, mess = cut(mcmd, 0),
            mid = cli.ownId(),
            curr_name, curr;
        for (x in PLAYERS) {
            if (!isConnected()) {
                bot("Mass PM failed because you have been disconnected.");
                return;
            }

            curr = PLAYERS[x];
            if (curr == mid) {
                continue;
            }

            curr_name = client.name(curr);
            EvalID = curr;
            net.sendPM(curr, mess.replace(/<%(.*?)%>/gi, PMEval).replace(/%name/gi, curr_name));
        }

        bot("Mass PM completed. PM'd " + PLAYERS.length + " players.");
    },

    pm: function (mcmd) {
        var x, names = mcmd[0].split(", "),
            mess = cut(mcmd, 1),
            curr_id, numpms = 0,
            mid = cli.ownId();
        for (x in names) {
            if (!isConnected()) {
                bot("PMing failed because you have been disconnected.");
                return;
            }

            curr_id = id(names[x]);
            if (curr_id == -1) {
                bot("Could not PM " + names[x] + ": The client doesn't have information about him/her.");
                continue;
            }
            if (curr_id == mid) {
                continue;
            }

            EvalID = curr_id;
            net.sendPM(curr_id, mess.replace(/<%(.*?)%>/gi, PMEval).replace(/%name/gi, names[x]));
            numpms++;
        }

        bot("PMing completed. PM'd " + numpms + " players.");
    },

    flashall: function (mcmd) {
        var playerList = [],
            x, curr, chan, chanId = cli.currentChannel(),
            exceptions = [],
            currname;

        if (mcmd[1] !== undefined) {
            exceptions = mcmd[1].split(",").map(function (val) {
                return val.toLowerCase();
            });
        }

        if (mcmd[0].toLowerCase() !== "server") {
            chan = cli.channel(chanId);
            for (x in PLAYERS) {
                curr = PLAYERS[x];
                currname = cli.name(curr);
                if (chan.hasPlayer(curr) && !exceptions.has(currname.toLowerCase())) {
                    playerList.push(currname);
                }
            }
        } else if (PLAYERS.length < 61) {
            script.playerRoutine();

            for (x in PLAYERS) {
                curr = cli.name(PLAYERS[x]);
                if (!exceptions.has(curr.toLowerCase())) {
                    playerList.push(curr);
                }
            }
        }

        sendAll(playerList.join(" , ") + " FLASH", chanId);
    },

    eval: function (mcmd) {
        var code = cut(mcmd, 0);
        htmlMessage(border);
        bot("You evaluated the following code:");
        htmlMessage("<code>" + html_escape(code) + "</code>");
        htmlMessage(border);

        try {
            var now = millitime(),
                result = eval(code),
                end = millitime();

            bot(html_escape(result));

            var took = end - now,
                sec = took / 1000,
                micro = took * 1000;

            bot("Code took " + took + " milliseconds / " + sec + " seconds to run.");
        }
        catch (err) {
            var err = FormatError("", err);
            bot(err);
        }
    },

    cp: function (mcmd) {
        if (!isMod()) {
            return;
        }

        var player = id(mcmd[0]);
        if (player == -1) {
            bot("The client doesn't have data of " + mcmd[0]);
            return;
        }

        cli.controlPanel(player);

        var name = player;
        if (typeof name == "number") {
            name = client.name(player);
        }

        net.getUserInfo(name);
        net.getBanList();
    },

    id: function (mcmd) {
        var pid = cli.id(mcmd[0]);

        if (pid == -1) {
            bot("The client doesn't have data of " + mcmd[0]);
            return;
        }

        bot("The ID of " + mcmd[0] + " is " + pid + ".");
    },

    color: function (mcmd) {
        var pid = id(mcmd[0]);

        if (pid == -1) {
            bot("The client doesn't have data of " + mcmd[0]);
            return;
        }

        bot("The color of " + mcmd[0] + " is " + cli.color(pid) + ".");
    },

    ipinfo: function (mcmd) {
        var ip = mcmd[0];
        if (!/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(ip)) {
            bot("Invalid IP.");
            return;
        }

        bot("Getting ip info..");

        sys.webCall("http://ip2country.sourceforge.net/ip2c.php?ip=" + ip, function (json_code) {
            json_code = json_code.replace("ip", '"ip"'); // Fixes malformed JSON
            json_code = json_code.replace("hostname", '"hostname"');
            json_code = json_code.replace("country_code", '"country_code"');
            json_code = json_code.replace("country_name", '"country_name"');

            var code = JSON.parse(json_code);

            bot("Info of " + ip + ":");
            bot("Hostname: " + code.hostname);
            bot("Country: " + code.country_name);
        });
    },

    nohtml: function () {
        NoHTML = !NoHTML;
        saveVal("NoHTML", NoHTML);

        var mode = "on";
        if (!NoHTML) {
            mode = "off";
        }

        bot("No HTML was turned " + mode + ".");
    },

    replace: function () {
        ReplacementsOn = !ReplacementsOn;
        saveVal("ReplacementsOn", ReplacementsOn);

        var mode = "on";
        if (!ReplacementsOn) {
            mode = "off";
        }

        bot("Replacements were turned " + mode + ".");
    },

    periodicsay: function (mcmd) {
        var seconds = parseInt(mcmd[0], 10),
            channels = mcmd[1].split(","),
            cids = [],
            cid, i;

        for (i = 0; i < channels.length; ++i) {
            cid = cli.channelId(channels[i].replace(/(^\s*)|(\s*$)/g, ""));
            if (cid !== undefined) {
                cids.push(cid);
            }
        }
        if (cids.length === 0) {
            cids.push(cli.currentChannel());
        }

        var message = mcmd.slice(2).join(":");

        periodicsay_callback = function (seconds, cids, message, count) {
            if (!isConnected()) {
                return;
            }

            callcount--;
            if (endcalls) {
                bot("Periodic say of '" + message + "' has ended.");
                endcalls = false;
                callcount--;

                if (callcount < 0) {
                    callcount = 0;
                }
                return;
            }
            for (i = 0; i < cids.length; ++i) {
                cid = cids[i];
                if (cli.hasChannel(cid)) {
                    if (!script.beforeSendMessage(message, cid, true)) {
                        sendAll(message, cid);
                    }
                }
            }
            if (++count > 100) {
                bot("Periodic say of '" + message + "' has ended.");
                callcount = 0;
                return;
            }

            callcount++;
            periodictimers.push(sys.delayedCall(function () {
                periodicsay_callback(seconds, cids, message, count);
            }, seconds));
        };

        bot("Starting a new periodic say.");
        callcount++;
        periodicsay_callback(seconds, cids, message, 1);
    },

    endcalls: function (mcmd) {
        if (!callcount) {
            bot("You have no periodic calls running.");
        } else {
            bot("You have " + callcount + " call(s) running.");
        }

        var isAll = mcmd[0].toLowerCase() == "all";

        if (!isAll) {
            if (!endcalls) {
                endcalls = true;
                bot("Next periodic say called will end.");
            } else {
                endcalls = false;
                bot("Cancelled the ending of periodic say.");
            }
        } else {
            bot("Cancelled " + endCalls() + " timer(s).");
            callcount = 0;
        }
    },

    announcement: function () {
        if (!isConnected()) {
            bot("Not connected.");
            return;
        }

        if (announcement == "") {
            bot("This server doesn't have an announcement");
            return;
        }

        bot("Server Announcement: " + html_escape(announcement));
    }
};

commandaliases = {
    "controlpanel": "cp",
    "info": "ipinfo",
    "ann": "announcement"
};

if (Settings.ShowScriptCheckOK) {
    print("Script Check: OK");
}

({
    clientStartUp: function () {
        NoHTML = getVal("NoHTML", "false") == "true"; // Fix a bug with sys.getVal? & Fix with string storage
        ReplacementsOn = getVal("ReplacementsOn", "true") == "true";
    },

    onPlayerReceived: function (id) {
        if (PLAYERS.indexOf(id) != -1) {
            return;
        }
        PLAYERS.push(id);

        var name = cli.name(id).toLowerCase();
        if (Settings.AutoIgnore.indexOf(name) != -1) {
            cli.ignore(name, true);
        }
    },

    onPlayerRemoved: function (id) {
        if (PLAYERS.indexOf(id) == -1) {
            return;
        }

        PLAYERS.splice(PLAYERS.indexOf(id), 1);
    },

    playerRoutine: function () {
        var x, current;
        for (x in PLAYERS) {
            current = PLAYERS[x];
            if (cli.name(current) == "~Unknown~") {
                PLAYERS.splice(PLAYERS.indexOf(current), 1);
            }
        }
    },

    beforeSendMessage: function (message, channel, isPeriodicCall) {
        var is_connected = isConnected();

        if (hasCommandStart(message) && !hasCommandStart(message.substr(1)) && is_connected && message.length > 1) {
            var commandData = "",
                mcmd = [""],
                tar, pos = message.indexOf(' ');

            if (pos != -1) {
                command = message.substring(1, pos).toLowerCase();

                commandData = message.substr(pos + 1);
                mcmd = commandData.split(':');
            }
            else {
                command = message.substring(1).toLowerCase();
            }

            if (commandaliases[command]) {
                command = commandaliases[command];
            }

            if (commands[command]) {
                try {
                    commands[command](mcmd);
                } catch (e) {
                    bot(FormatError("The command " + command + " could not be used because of an error:", e));
                }

                if (!isPeriodicCall) {
                    sys.stopEvent();
                }

                return true; // periodic say
            }
        } else if (!is_connected) {
            bot("You are not connected.");
            return true; // periodic say
        }

        ignoreflash = true; // periodic say
        if (ReplacementsOn) {
            sys.stopEvent();

            var x, replacements = Settings.Replacements;
            for (x in replacements) {
                message = message.replace(new RegExp(x, "g"), replacements[x]);
            }

            net.sendChanMessage(channel, message);
        }
    },

    beforeChannelMessage: function (message, channel, html) {
        if (Settings.FlashOnMentioned && !ignoreflash) {
            if (!html) {
                var sendBy = message.substring(0, message.indexOf(":"));
                if (cli.isIgnored(cli.id(sendBy))) {
                    ignoreflash = false;
                    return;
                }
            }

            if (message.toLowerCase().indexOf(cli.ownName().toLowerCase()) != -1) {
                cli.channel(channel).checkFlash("a", "a"); // Flash
            }
        }

        if (NoHTML && html && !ignoreNoHtml) {
            sys.stopEvent();
            cli.printChannelMessage(message, channel, false);
        }

        ignoreflash = false;
    }
})