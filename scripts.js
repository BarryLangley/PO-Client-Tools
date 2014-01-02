/*global sys, SESSION, script, print, gc, version, Config, require, module, exports, client,
  PLAYERS:true, border:true, callcount:true, endcalls:true, periodictimers:true, ignoreflash:true,
  reconnectfailed:true, announcement:true, EvalID:true, ignoreNoHtml:true, AutoIdleTimer:true,
  NoHTML:true, ReplacementsOn:true
*/

/* Settings Help:
- If the setting is in the OBJECT category, the given value must:
    follow this format: {"key1": "value1", "key2": "value2", "key3": "value3"}

- If the setting is in the ARRAY category, the given value must:
    follow this format: ["player1", "player2", "player3"]

- If the setting is in the BOOLEAN category, the given value must be one of:
    true (yes/on)
    false (no/off)

- If the setting is in the STRING category, the given value must be:
    wrapped in quotes ("text", for example)

- If the setting is in the COLOR category, the given value must be:
    wrapped in quotes (see above)
    sys.validColor must return true (i.e. it must be a valid color, such as red)
*/

var Settings = {
    // ARRAY:
    AutoIgnore: [],
    CommandStarts: ["-", "~"],

    // OBJECT:
    Replacements: {
        // [[Topic]]
        "\\[\\[(.*?)\\]\\]": "http://en.wikipedia.com/$1",
        // [Google!]
        "\\[(.*?)\\]": "http://google.com/search?q=$1",
        // >LMGTFY!
        "\\>(.*?)\\!": "http://lmgtfy.com/?q=$1",
        // {PoWiki}
        "\\{(.*?)\\}": "http://pokemon-online.eu/wiki/$1",
        // $GitHub$
        "\\$(.*?)\\$": "https://github.com/$1"
    },

    // BOOLEAN:
    AutoIdle: true,
    FlashOnPMReceived: true,
    FlashOnMentioned: true,
    ShowScriptCheckOK: false,
    ReturnToMenuOnReconnectFailure: false,
    AutoReconnect: false,

    // STRING:
    Bot: "~Client~",

    // COLOR:
    BotColor: "green",
};

// End settings //
var cli = client;
var net = cli.network();
var GLOBAL = this;

if (!sys.validColor(Settings.BotColor)) {
    Settings.BotColor = "green";
}

// connect function //
function connect(ref, func) {
    ref.connect(func);
}

function ensure(name, value) {
    if (typeof GLOBAL[name] === "undefined") {
        GLOBAL[name] = value;
    }
}

function getVal(name, defaultValue) {
    var res = sys.getVal(name);
    if (res === "") {
        return defaultValue;
    }

    return res;
}

function saveVal(name, content) {
    sys.saveVal(name, content);
}

ensure("PLAYERS", []);
ensure("border", "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>");
ensure("callcount", 0);
ensure("endcalls", false);
ensure("periodictimers", []);
ensure("ignoreflash", false);
ensure("reconnectfailed", false);
ensure("announcement", "");
ensure("EvalID", -1);
ensure("ignoreNoHtml", false);
ensure("AutoIdleTimer", -1);
ensure("NoHTML", false);
ensure("ReplacementsOn", true);

function ownChannels() {
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

function ensureChannel(channel) {
    if (ownChannels().length === 0) {
        var main = cli.defaultChannel();
        if (typeof channel !== "undefined") {
            main = channel;
        }

        cli.join(main);
        cli.activateChannel(main);
    }
}

function htmlMessage(mess, channel) {
    if (typeof channel !== "number" || !cli.hasChannel(channel)) {
        channel = cli.currentChannel();
    }

    ignoreNoHtml = true;
    cli.printChannelMessage(mess, channel, true);
    ignoreNoHtml = false;
}

function bot(mess, channel) {
    ensureChannel(channel);
    htmlMessage("<font color='" + Settings.BotColor + "'><timestamp/><b>" + Settings.Bot + ":</b></font> " + mess);
}

function white(channel) {
    htmlMessage("", channel);
}

function endCalls() {
    var x,
        timers = periodictimers.length;

    for (x in periodictimers) {
        sys.stopTimer(periodictimers[x]);
    }

    periodictimers = [];
    return timers;
}

function isConnected() {
    return cli.ownId() !== -1;
}

function id(str) {
    if (typeof str === "number") {
        return str;
    }

    return client.id(str);
}

function isMod() {
    return cli.ownAuth() > 0;
}

function hasCommandStart(msg) {
    return Settings.CommandStarts.indexOf(msg[0]) > -1;
}

function html_escape(str) {
    if (typeof str !== "string") {
        str = String(str);
    }

    return str.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/\>/g, "&gt;");
}

function fancyJoin(array) {
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

function cut(array, entry, join) {
    if (!join) {
        join = ":";
    }

    return array.splice(entry).join(join);
}

function millitime() {
    var now = new Date().getTime();
    return (new Date()).getTime();
}

function FormatError(mess, e) {
    if (typeof mess !== "string") {
        mess = "";
    }

    var lastChar = mess[mess.length - 1],
        lineData = "";
    if (mess !== "" && lastChar !== "." && lastChar !== "!" && lastChar !== "?" && lastChar !== ":") {
        mess += ".";
    }

    if (e.lineNumber !== 1) {
        lineData = " on line " + e.lineNumber;
    }

    var name = e.name,
        msg = e.message,
        str = name + lineData + ": " + msg;

    lastChar = msg[msg.length - 1];

    if (lastChar !== "." && lastChar !== "?" && lastChar !== ":" && lastChar !== "!") {
        str += ".";
    }

    return mess + " " + str;
}

function html_strip(str) {
    return str.replace(/<\/?[^>]*>/g, "");
}

function sendAll(message, channel) {
    if (typeof channel !== "number" || !cli.hasChannel(channel)) {
        channel = cli.currentChannel();
    }
    net.sendChanMessage(channel, message);
}

function PMEval($1) {
    var ret;
    try {
        ret = eval($1.substring(2, $1.length - 3));
    } catch (e) {
        ret = "";
        print(FormatError("Error in PM:", e));
    }

    EvalID = -1;
    return ret;
}

// Commands //
var commands = {
    commands: function () {
        function cmd(comnd, args, desc, aliases) {
            var str = "<font color='green'><b>" + comnd + "</b></font>",
                x,
                arglist = {},
                current,
                next,
                part;

            desc = desc.split(" ");

            if (!!args) {
                str += " ";
            }

            for (x in args) {
                current = args[x];
                next = x + 1;

                arglist[current] = 1;
                str += "<b>" + current + "</b>:";
            }

            if (!!args) {
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
                } else {
                    str += current + " ";
                }
            }

            if (arguments.length === 4) {
                str += "<i>Aliases: " + aliases.join(", ") + "</i>";
            }

            htmlMessage(str);
        }

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
            if (curr === mid) {
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
            if (curr_id === -1) {
                bot("Could not PM " + names[x] + ": The client doesn't have information about him/her.");
                continue;
            }
            if (curr_id === mid) {
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
            x,
            curr,
            chan,
            chanId = cli.currentChannel(),
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
                if (chan.hasPlayer(curr) && exceptions.indexOf(currname.toLowerCase()) === -1) {
                    playerList.push(currname);
                }
            }
        } else if (PLAYERS.length < 61) {
            for (x in PLAYERS) {
                curr = cli.name(PLAYERS[x]);
                if (exceptions.indexOf(curr.toLowerCase()) === -1) {
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
        } catch (err) {
            var error = FormatError("", err);
            bot(error);
        }
    },

    cp: function (mcmd) {
        if (!isMod()) {
            return;
        }

        var player = id(mcmd[0]);
        if (player === -1) {
            bot("The client doesn't have data of " + mcmd[0]);
            return;
        }

        cli.controlPanel(player);

        var name = player;
        if (typeof name === "number") {
            name = client.name(player);
        }

        net.getUserInfo(name);
        net.getBanList();
    },

    id: function (mcmd) {
        var pid = cli.id(mcmd[0]);

        if (pid === -1) {
            bot("The client doesn't have data of " + mcmd[0]);
            return;
        }

        bot("The ID of " + mcmd[0] + " is " + pid + ".");
    },

    color: function (mcmd) {
        var pid = id(mcmd[0]);

        if (pid === -1) {
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
            cid,
            i;

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

        function periodicsay_callback(seconds, cids, message, count) {
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
            periodictimers.push(sys.setTimer(function () {
                periodicsay_callback(seconds, cids, message, count);
            }, seconds));
        }

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

        var isAll = mcmd[0].toLowerCase() === "all";

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

        if (announcement === "") {
            bot("This server doesn't have an announcement");
            return;
        }

        bot("Server Announcement: " + html_escape(announcement));
    }
};

var commandaliases = {
    "controlpanel": "cp",
    "info": "ipinfo",
    "ann": "announcement"
};

if (Settings.ShowScriptCheckOK) {
    print("Script Check: OK");
}

// Signal Attaching //
connect(net.playerLogin, function () {
    if (Settings.AutoIdle) {
        AutoIdleTimer = sys.setTimer(function goAway() {
            if (isConnected()) {
                if (!cli.away()) {
                    cli.goAway(true);
                }

                sys.setTimer(function () {
                    sys.stopTimer(AutoIdleTimer);
                }, 10);
            }
        }, 20, true);
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

({
    clientStartUp: function () {
        NoHTML = getVal("NoHTML", "false") === "true"; // Fix a bug with sys.getVal? & Fix with string storage
        ReplacementsOn = getVal("ReplacementsOn", "true") === "true";
    },

    onPlayerReceived: function (id) {
        var name = cli.name(id).toLowerCase();
        PLAYERS.push(id);

        if (Settings.AutoIgnore.indexOf(name) !== -1) {
            cli.ignore(name, true);
        }
    },

    onPlayerRemoved: function (id) {
        PLAYERS.splice(PLAYERS.indexOf(id), 1);
    },

    beforeSendMessage: function (message, channel, isPeriodicCall) {
        var is_connected = isConnected();

        if (hasCommandStart(message) && !hasCommandStart(message.substr(1)) && is_connected && message.length > 1) {
            var commandData = "",
                command = "",
                mcmd = [""],
                tar,
                pos = message.indexOf(' ');

            if (pos !== -1) {
                command = message.substring(1, pos).toLowerCase();

                commandData = message.substr(pos + 1);
                mcmd = commandData.split(':');
            } else {
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

            if (message.toLowerCase().indexOf(cli.ownName().toLowerCase()) !== -1) {
                cli.channel(channel).checkFlash("a", "a"); // Flash
            }
        }

        if (NoHTML && html && !ignoreNoHtml) {
            sys.stopEvent();
            cli.printChannelMessage(message, channel, false);
        }

        ignoreflash = false;
    }
});
