/* Settings Help:
- If the next line is BOOLEAN, the given value must be:
true (yes/on)
false (no/off)

- If the next line is STRING, the given value must be:
wrapped in quotes ("text", for example)

- If the next line is COLOR, the given value must be:
wrapped in quotes
sys.validColor must return true

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
    Bot: "~Client~",
    // STRING
    BotColor: "green",
    // COLOR 
    AutoIgnore: [],
    // ARRAY
    CommandStarts: ["-", "~"],
    // ARRAY
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


ensure("PLAYERS", []);
ensure("border", "<font color='mediumblue'><b>\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB\xBB</font>");
ensure("callcount", 0);
ensure("endcalls", false);
ensure("ignoreflash", false);

// Signal Attaching //
connect(net.playerLogin, function () {
    if (Settings.AutoIdle) {
        cli.goAway(true);
    }
});

connect(net.disconnected, function () {
    PLAYERS = [];
    callcount = 0;
    endcalls = false;
	ignoreflash = false;
});

connect(net.PMReceived, function (id, message) {
    if (Settings.FlashOnPMReceived) {
        cli.channel(cli.currentChannel()).checkFlash("a", "a"); // Flash
    }
});

// Utilities //
html = function (mess, channel) {
    if (typeof channel != "number" || !cli.hasChannel(channel)) {
        channel = cli.currentChannel();
    }
    cli.printChannelMessage(mess, channel, true);
}

bot = function (mess, channel) {
    html("<font color='" + Settings.BotColor + "'><timestamp/><b>" + Settings.Bot + ":</b></font> " + mess);
}

ensureChannel = function () {
    if (ownChannels().length == 0) {
        var main = cli.defaultChannel();
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
			retstr += " or " + array[x];

			return retstr;
		}

		retstr += array[x] + ", ";
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
    var str = "<font color='green'><b>" + cmd + "</b></font> ",
        x, arglist = {},
        current, next, part;
    desc = desc.split(" ");

    for (x in args) {
        current = args[x];
        next = x + 1;

        arglist[current] = 1;
        str += "<b>" + current + "</b>:";
    }
	
	str += " ";

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

    html(str);
}

// Commands //
commands = {
    commands: function () {
        html(border + " <br/>");
        html("<h2>Commands</h2>");
        html("Use " + fancyJoin(Config.CommandStarts) + " before the following commands in order to use them:< <br/>");

        cmd("masspm", ["message"], "Sends a PM to everyone containing message. Don't use this on big servers as you will go overactive.");
        cmd("pm", ["players", "message"], "Sends a PM to players (use , and a space to seperate them) containing message.");

        cmd("id", ["name"], "Shows the id of name.");
        cmd("eval", ["code"], "Evaluates code and returns the result.");
        cmd("ipinfo", ["ip"], "Displays the hostname and country of ip.");

        cmd("periodicsay", ["seconds", "channels", "message"], "Sends message every seconds in channels. Seconds must be a number and cannot be under 15. Seperate channels with \"<b>,</b>\". The current channel will be used if no channels are specified.");
        cmd("endcalls", [""], "Ends all running periodic says.");

        if (isMod()) {
            cmd("cp", ["player"], "Opens a CP of player.", ["controlpanel"]);
        }

        html("<br/> " + border);
    },

    masspm: function (mcmd) {
        var x, mess = cut(mcmd, 0);
        for (x in PLAYERS) {
            if (!isConnected()) {
                bot("Mass PM failed because you have been disconnected.");
                return;
            }

            net.sendPM(PLAYERS[x], mess);
            bot("PM'd " + client.name(PLAYERS[x]));
        }

        bot("Mass PM completed. PM'd " + PLAYERS.length + " players.");
    },

    pm: function (mcmd) {
        var x, names = mcmd[0].split(", "),
            mess = cut(mcmd, 1),
            curr_id, numpms = 0;
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

            net.sendPM(curr_id, mess);
            bot("PM'd " + names[x]);
            numpms++;
        }

        bot("PMing completed. PM'd " + numpms + " players.");
    },

    eval: function (mcmd) {
        var code = cut(mcmd, 0);
        html(border);
        bot("You evaluated the following code:");
        html("<code>" + html_escape(code) + "</code>");
        html(border);

        try {
            var now = millitime();
            var result = eval(code);
            var end = millitime();

            bot(result);

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

    periodicsay: function (mcmd) {
        var seconds = parseInt(mcmd[0], 10);
        if (seconds < 15) {
            return;
        }

        var channels = mcmd[1].split(","),
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

        var what = mcmd.slice(2).join(":");

        periodicsay_callback = function (seconds, cids, what, count) {
            if (!isConnected()) {
                return;
            }

            callcount--;
            if (endcalls) {
                // bot("Periodic say of '" + what + "' has ended.");
                endcalls = false;
                callcount = 0;
                return;
            }
            for (i = 0; i < cids.length; ++i) {
                cid = cids[i];
                if (cli.hasChannel(cid)) {
                    sendAll(what, cid);
                }
            }
            if (++count > 100) {
				bot("Periodic say of '" + what + "' has ended.");
                callcount = 0;
                return;
            }
			
            callcount++;
            sys.delayedCall(function () {
                periodicsay_callback(seconds, cids, what, count);
            }, seconds);
        };

        bot("Starting a new periodicsay.");
        callcount++;
        periodicsay_callback(seconds, cids, what, 1);
    },

    endcalls: function () {
        if (callcount) {
            bot("You have no periodic calls running.");
        } else {
            bot("You have " + callcount + " call(s) running.");
        }
        if (!endcalls) {
            endcalls = true;
            bot("Next periodic say called will end.");
        } else {
            endcalls = false;
            bot("Cancelled the ending of periodic say.");
        }
    },
};

commandaliases = {
    "controlpanel": "cp",
    "ip": "ipinfo"
};

if (Settings.ShowScriptCheckOK) {
    print("Script Check: OK");
}

({
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

    beforeSendMessage: function (message) {
        var is_connected = isConnected();

        if (hasCommandStart(message) && is_connected && message.length > 1) {
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

                sys.stopEvent();
				return;
            }
        } else if (!is_connected) {
            bot("You are not connected.");
			return;
        }

		ignoreflash = true; // periodicsays
    },

    beforeChannelMessage: function (message, channel, html) {
        if (Settings.FlashOnMentioned && !ignoreflash) {
            if (message.toLowerCase().indexOf(cli.ownName().toLowerCase()) != -1) {
                cli.channel(channel).checkFlash("a", "a"); // Flash
            }
        }
		
		ignoreflash = false;
    },

})