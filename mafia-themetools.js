/* Original code by IceKirby - https://github.com/IceKirby/mafia-checker */

/* Utilities */
(function () {
    Object.defineProperty(String.prototype, "isEmpty", {
        "value": function () {
            var mess = this;
            return mess == "" || mess.trim() == "";
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(String.prototype, "contains", {
        "value": function (string) {
            var str = this;
            return str.indexOf(string) > -1;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(String.prototype, "has", {
        "value": function (string) {
            return this.contains(string);
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(String.prototype, "format", {
        "value": function () {
            var str = this,
                exp, i, args = arguments.length,
                icontainer = 0;
            for (i = 0; i < args; i++) {
                icontainer++;
                exp = new RegExp("%" + icontainer, "");
                str = str.replace(exp, arguments[i]);
            }
            return str;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Boolean.prototype, "isEmpty", {
        "value": function () {
            return this === false;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Number.prototype, "isEmpty", {
        "value": function () {
            return isNaN(this) || this === 0;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "isEmpty", {
        "value": function () {
            return this.length() === 0;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "keys", {
        "value": function () {
            return Object.keys(this);
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "has", {
        "value": function (prop) {
            return typeof this[prop] !== "undefined";
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "contains", {
        "value": function (prop) {
            return this.has(prop);
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "insert", {
        "value": function (name, val) {
            this[name] = val;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "remove", {
        "value": function (name) {
            if (!this.has(name)) {
                return;
            }

            delete this[name];
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "first", {
        "value": function () {
            var x;
            for (x in this) {
                return this[x]; // Grab the first property
            }
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Object.prototype, "length", {
        "value": function () {
            return Object.keys(this).length;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Array.prototype, "has", {
        "value": function (prop) {
            var x;
            for (x in this) {
                if (this[x] == prop) {
                    return true;
                }
            }

            return false;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Array.prototype, "isEmpty", {
        "value": function () {
            return this.length === 0;
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    Object.defineProperty(Array.prototype, "contains", {
        "value": function (prop) {
            return this.has(prop);
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    pureHtml = function (msg) {
        cli.printChannelMessage(msg, cli.currentChannel(), true);
    }

    println = function (msg) {
        cli.printChannelMessage(msg, cli.currentChannel(), false);
    }

    printCommand = function (name, arg, help) {
        var args = "[" + arg + "]";
        if (Array.isArray(arg)) {
            args = arg.join("");
        }
        pureHtml("<b>" + name + " " + args + ":</b> " + help);
    }

    html = function (msg, color) {
        var send = "";
        if (msg) {
            send = "<font color='" + color + "'><timestamp/><b>~Client~:</b></font> " + msg;
        }

        pureHtml(send);
    }

    out = function (msg) {
        html(msg, "green");
    }

    minor = function (msg) {
        html(msg, "orange");
    }

    fatal = function (msg) {
        html(msg, "red");
    }

    cli = client;
    net = cli.network();

    readable = function (arr, last_delim) {
        if (!Array.isArray(arr)) {
            return arr;
        }

        if (arr.length > 1) {
            return arr.slice(0, arr.length - 1).join(", ") + " " + last_delim + " " + arr.slice(-1)[0];
        } else if (arr.length == 1) {
            return arr[0];
        } else {
            return "";
        }
    }

    isSafeScripts = function () {
        var isOn = sys.isSafeScripts();
        if (isOn) {
            fatal("Safe scripts is on. Your theme can't be downloaded.");
        }

        return isOn;
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

})();

/* Mafia Theme Checker */
(function () {
    printErrors = function (errors) {
        var errorlist = "",
            x;
        for (x in errors) {
            errorlist += "&nbsp;&nbsp;&nbsp; \u2022 " + errors[x];
        }

        pureHtml(errorlist + "<br/>");
    }

    var minorErrors = [],
        fatalErrors = [];

    addMinorError = function (msg) {
        minorErrors.push(msg);
    }

    addFatalError = function (msg) {
        fatalErrors.push(msg);
    }

    resetErrors = function () {
        minorErrors = [];
        fatalErrors = [];
    }

    Theme = function () {
        this.sides = {};
        this.roles = {};
    }

    var themeProto = Theme.prototype;
    themeProto.addSide = function (obj) {
        var side = "One of your sides";
        if (obj.has("side")) {
            side = "Your side \"" + obj.side + "\"";
        }
        checkAttributes(obj, ["side", "translation"], ["winmsg"], side);
        if (this.sides.has(obj.side)) {
            addFatalError("Your theme has a repeated side \"" + obj.side + "\".");
        }

        this.sides.insert(obj.side, obj.translation);
    }

    themeProto.addRole = function (obj) {
        var yourRole = "One of your roles",
            e;
        if (obj.has("role")) {
            yourRole = 'Your role "' + obj.role + '"';
        }

        checkAttributes(obj, ["role", "translation", "side", "help"], ["actions", "info", "winningSides", "winIfDeadRoles"], yourRole);

        if (!obj.has("actions")) {
            obj.actions = {};
        }
        if (this.roles.has(obj.role)) {
            addFatalError("Your theme has a repeated role \"" + obj.role + "\".");
        }

        this.roles.insert(obj.role, obj);

        if (typeof obj.side == "object") {
            if (obj.side.has("random")) {
                for (e in obj.side.random) {
                    if (!this.isValidSide(e)) {
                        addFatalError(yourRole + " has random side \"" + e + "\" which doesn't exist in \"sides\".");
                    }
                }
            } else {
                addFatalError(yourRole + " has an invalid object as it's side.");
            }
        } else {
            if (!this.isValidSide(obj.side)) {
                addFatalError(yourRole + " has side \"" + obj.side + "\" which doesn't exist in \"sides\".");
            }
        }
    }

    themeProto.addActions = function () {
        var r, e, i, role, action, yourRole;
        for (r in this.roles) {
            role = this.roles[r];
            yourRole = role.role;

            if (role.has("winningSides")) {
                if (Array.isArray(role.winningSides)) {
                    for (e in role.winningSides) {
                        this.checkValidSide(role.winningSides[e], "Role " + yourRole + "'s \"winningSides\"");
                    }
                } else {
                    if (role.winningSides !== "*") {
                        addFatalError("Role " + yourRole + " has an invalid value for \"winningSides\". It should be an array or \"*\"");
                    }
                }
            }
            if (role.has("winIfDeadRoles")) {
                if (Array.isArray(role.winIfDeadRoles)) {
                    for (e in role.winIfDeadRoles) {
                        this.checkValidRole(role.winIfDeadRoles[e], "Role " + yourRole + "'s \"winIfDeadRoles\"");
                    }
                } else {
                    addFatalError(yourRole + " has an invalid value for \"winIfDeadRoles\". It should be an array.");
                }
            }

            checkAttributes(role.actions, [], ["night", "standby", "hax", "standbyHax", "onDeath", "initialCondition", "avoidHax", "avoidStandbyHax", "kill", "poison", "distract", "daykill", "daykillrevengemsg", "inspect", "protect", "safeguard", "convert", "stalk", "vote", "voteshield", "startup", "onlist", "lynch"], "Role " + yourRole);

            var possibleNightActions = ["kill", "protect", "inspect", "distract", "poison", "safeguard", "stalk", "convert"],
                command, o, possibleStandbyActions = ["kill", "reveal", "expose"],
                command, c, commonMandatory, commonOptional, commandList;

            if (role.actions.has("night") && checkType(role.actions.night, ["object"], "Role " + yourRole + "'s night actions")) {

                for (e in role.actions.night) {
                    action = role.actions.night[e];
                    if (checkType(action, ["object"], "Role " + yourRole + "'s night action \"" + e + "\"")) {
                        command = e, c, commonMandatory = ["target", "common", "priority"], commonOptional = ["broadcast", "command", "limit", "msg", "failChance", "charges", "recharge", "initialrecharge", "broadcastmsg", "chargesmsg", "suicideChance", "suicidemsg", "restrict"], commandList = [];
                        if (action.has("command")) {
                            if (Array.isArray(action.command)) {
                                commandList = action.command;
                            } else if (typeof action.command == "object") {
                                for (c in action.command) {
                                    commandList.push(c);
                                }
                            } else if (typeof action.command == "string") {
                                commandList.push(action.command);
                            }
                        } else {
                            commandList.push(command);
                        }
                        if (commandList.indexOf("kill") !== -1) {
                            commonOptional = commonOptional.concat(["msg"]);
                        }
                        if (commandList.indexOf("inspect") !== -1) {
                            commonOptional = commonOptional.concat(["Sight"]);
                        }
                        if (commandList.indexOf("distract") !== -1) {
                            commonOptional = commonOptional.concat(["distractmsg", "teammsg"]);
                        }
                        if (commandList.indexOf("poison") !== -1) {
                            commonOptional = commonOptional.concat(["count", "poisonDeadMessage"]);
                        }
                        if (commandList.indexOf("convert") !== -1) {
                            commonMandatory = commonMandatory.concat(["newRole"]);
                            commonOptional = commonOptional.concat(["canConvert", "convertmsg", "usermsg", "silent"]);
                        }

                        commonNightActions(yourRole, action, e, this.roles);
                        checkAttributes(action, commonMandatory, commonOptional, "Role " + yourRole + "'s night action \"" + e + "\"");
                        for (c in commandList) {
                            command = commandList[c];
                            if (command == "kill") {
                                if (action.has("msg")) {
                                    checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for night action \"" + e + "\"");
                                }
                            } else if (command == "inspect") {
                                if (action.has("Sight")) {
                                    if (typeof action.Sight == "string") {
                                        checkValidValue(action.Sight, ["Team"], "Role " + yourRole + "'s night action \"" + e + "\" has a invalid value for \"target\": ~Value~ (~Valid~)");
                                    } else if (typeof action.Sight == "object") {
                                        for (i in action.Sight) {
                                            if (i !== "true") {
                                                this.checkValidRole(i, "role " + yourRole + "'s \"Sight\" attribute for night action \"" + e + "\"");
                                            }
                                            checkType(action.Sight[i], ["number"], "Role " + yourRole + "'s attribute \"Sight: " + i + "\" for night action \"" + e + "\"");
                                        }
                                    } else {
                                        checkType(action.Sight, ["string", "object"], "Role " + yourRole + "'s attribute \"Sight\" for night action \"" + e + "\"");
                                    }
                                }
                            } else if (command == "distract") {
                                if (action.has("distractmsg")) {
                                    checkType(action.distractmsg, ["string"], "Role " + yourRole + "'s attribute \"distractmsg\" for night action \"" + e + "\"");
                                }
                                if (action.has("teammsg")) {
                                    checkType(action.teammsg, ["string"], "Role " + yourRole + "'s attribute \"teammsg\" for night action \"" + e + "\"");
                                }
                            } else if (command == "poison") {
                                if (action.has("count")) {
                                    checkType(action.count, ["number"], "Role " + yourRole + "'s attribute \"count\" for night action \"" + e + "\"");
                                }
                                if (action.has("poisonDeadMessage")) {
                                    checkType(action.poisonDeadMessage, ["string"], "Role " + yourRole + "'s attribute \"poisonDeadMessage\" for night action \"" + e + "\"");
                                }
                            } else if (command == "convert") {
                                if (action.has("silent")) {
                                    checkValidValue(action.silent, [true, false], "Role " + yourRole + "'s night action \"" + e + "\" has a invalid value for \"silent\": ~Value~ (~Valid~)");
                                }
                                if (action.has("newRole")) {
                                    if (typeof action.newRole == "string") {
                                        this.checkValidRole(action.newRole, "role " + yourRole + "'s \"newRole\" attribute for night action \"" + e + "\"");
                                    } else if (typeof action.newRole == "object") {
                                        for (i in action.newRole) {
                                            this.checkValidRole(i, "role " + yourRole + "'s \"newRole: " + i + "\" attribute for night action \"" + e + "\"");
                                            if (checkType(action.newRole[i], ["array"], "Role " + yourRole + "'s attribute \"newRole: " + i + "\" for night action \"" + e + "\"")) {
                                                for (o in action.newRole[i]) {
                                                    this.checkValidRole(action.newRole[i][o], "role " + yourRole + "'s \"newRole: " + i + "\" attribute for night action \"" + e + "\"");
                                                }
                                            }
                                        }
                                    }
                                }
                                if (action.has("canConvert")) {
                                    if (typeof action.canConvert == "string") {
                                        checkValidValue(action.canConvert, ["*"], "Role " + yourRole + "'s night action \"" + e + "\" has a invalid value for \"canConvert\": ~Value~ (~Valid~)");
                                    } else if (checkType(action.canConvert, ["array"], "Role " + yourRole + "'s attribute \"canConvert\" for night action \"" + e + "\"")) {
                                        for (i in action.canConvert) {
                                            this.checkValidRole(action.canConvert[i], "role " + yourRole + "'s \"canConvert\" attribute for night action \"" + e + "\"");
                                        }
                                    }
                                }
                                if (action.has("convertmsg")) {
                                    checkType(action.convertmsg, ["string"], "Role " + yourRole + "'s attribute \"convertmsg\" for night action \"" + e + "\"");
                                }
                                if (action.has("usermsg")) {
                                    checkType(action.usermsg, ["string"], "Role " + yourRole + "'s attribute \"usermsg\" for night action \"" + e + "\"");
                                }
                            }
                        }
                    }
                }

                if (role.actions.has("standby") && checkType(role.actions.standby, ["object"], "Role " + yourRole + "'s standby actions")) {
                    for (e in role.actions.standby) {
                        action = role.actions.standby[e];
                        if (checkType(action, ["object"], "Role " + yourRole + "'s standby action \"" + e + "\"")) {
                            command = e;
                            if (action.command) {
                                command = action.command;
                            }
                            if (command == "kill") {
                                checkAttributes(action, ["target"], ["command", "limit", "msg", "killmsg", "revealChance", "revealmsg", "recharge", "initialrecharge"], "Role " + yourRole + "'s standby action \"" + e + "\"");
                                if (action.has("target")) {
                                    checkValidValue(action.target, ["Any", "Self", "AnyButTeam", "AnyButRole", "AnyButSelf"], "Role " + yourRole + "'s standby action \"" + e + "\" has a invalid value for \"target\": %1 (%2)");
                                }
                                if (action.has("limit")) {
                                    checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for standby action \"" + command + "\"");
                                }
                                if (action.has("msg")) {
                                    checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("killmsg")) {
                                    checkType(action.killmsg, ["string"], "Role " + yourRole + "'s attribute \"killmsg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("revealChance")) {
                                    checkType(action.revealChance, ["number"], "Role " + yourRole + "'s attribute \"revealChance\" for standby action \"" + command + "\"");
                                }
                                if (action.has("revealmsg")) {
                                    checkType(action.revealmsg, ["string"], "Role " + yourRole + "'s attribute \"revealmsg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("recharge")) {
                                    checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for standby action \"" + command + "\"");
                                }
                                if (action.has("initialrecharge")) {
                                    checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for standby action \"" + command + "\"");
                                }
                            } else if (command == "expose") {
                                checkAttributes(action, ["target"], ["command", "limit", "msg", "exposemsg", "revealChance", "revealmsg", "recharge", "initialrecharge"], "Role " + yourRole + "'s standby action \"" + e + "\"");
                                if (action.has("target")) {
                                    checkValidValue(action.target, ["Any", "Self", "AnyButTeam", "AnyButRole", "AnyButSelf"], "Role " + yourRole + "'s standby action \"" + e + "\" has a invalid value for \"target\": %1 (%2)");
                                }
                                if (action.has("limit")) {
                                    checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for standby action \"" + command + "\"");
                                }
                                if (action.has("msg")) {
                                    checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("exposemsg")) {
                                    checkType(action.exposemsg, ["string"], "Role " + yourRole + "'s attribute \"exposemsg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("revealChance")) {
                                    checkType(action.revealChance, ["number"], "Role " + yourRole + "'s attribute \"revealChance\" for standby action \"" + command + "\"");
                                }
                                if (action.has("revealmsg")) {
                                    checkType(action.revealmsg, ["string"], "Role " + yourRole + "'s attribute \"revealmsg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("recharge")) {
                                    checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for standby action \"" + command + "\"");
                                }
                                if (action.has("initialrecharge")) {
                                    checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for standby action \"" + command + "\"");
                                }
                            } else if (command == "reveal") {
                                checkAttributes(action, [], ["command", "limit", "msg", "revealmsg", "recharge", "initialrecharge"], "Role " + yourRole + "'s standby action \"" + e + "\"");
                                if (action.has("limit")) {
                                    checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for standby action \"" + command + "\"");
                                }
                                if (action.has("msg")) {
                                    checkType(action.msg, ["string"], "Role " + yourRole + "'s attribute \"msg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("revealmsg")) {
                                    checkType(action.revealmsg, ["string"], "Role " + yourRole + "'s attribute \"revealmsg\" for standby action \"" + command + "\"");
                                }
                                if (action.has("recharge")) {
                                    checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for standby action \"" + command + "\"");
                                }
                                if (action.has("initialrecharge")) {
                                    checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for standby action \"" + command + "\"");
                                }
                            } else {
                                addMinorError("Role " + yourRole + "'s standby action \"" + command + "\" is not a valid action (Valid standby actions are " + readable(possibleStandbyActions, "and") + ")");
                            }
                        }
                    }
                }
                if (role.actions.has("hax") && checkType(role.actions.hax, ["object"], "Role " + yourRole + "'s hax")) {
                    for (e in role.actions.hax) {
                        checkAttributes(role.actions.hax[e], [], ["revealTeam", "revealPlayer", "revealRole"], "Role " + yourRole + "'s hax on \"" + e + "\"");
                        if (typeof role.actions.hax[e] == "object") {
                            if (role.actions.hax[e].has("revealTeam")) {
                                checkType(role.actions.hax[e].revealTeam, ["number"], "Role " + yourRole + "s hax on " + e + " (revealTeam)");
                            }
                            if (role.actions.hax[e].has("revealPlayer")) {
                                checkType(role.actions.hax[e].revealPlayer, ["number"], "Role " + yourRole + "s hax on " + e + " (revealPlayer)");
                            }
                            if (role.actions.hax[e].has("revealRole")) {
                                checkType(role.actions.hax[e].revealRole, ["number"], "Role " + yourRole + "s hax on " + e + " (revealRole)");
                            }
                        }
                    }
                }
                if (role.actions.has("standbyHax") && checkType(role.actions.standbyHax, ["object"], "Role " + yourRole + "'s standbyHax")) {
                    for (e in role.actions.standbyHax) {
                        checkAttributes(role.actions.standbyHax[e], [], ["revealTeam", "revealPlayer", "revealRole"], "Role " + yourRole + "'s standbyHax on \"" + e + "\"");
                        if (typeof role.actions.standbyHax[e] == "object") {
                            if (role.actions.standbyHax[e].has("revealTeam")) {
                                checkType(role.actions.standbyHax[e].revealTeam, ["number"], "Role " + yourRole + "s standbyHax on " + e + " (revealTeam)");
                            }
                            if (role.actions.standbyHax[e].has("revealPlayer")) {
                                checkType(role.actions.standbyHax[e].revealPlayer, ["number"], "Role " + yourRole + "s standbyHax on " + e + " (revealPlayer)");
                            }
                            if (role.actions.standbyHax[e].has("revealRole")) {
                                checkType(role.actions.standbyHax[e].revealRole, ["number"], "Role " + yourRole + "s standbyHax on " + e + " (revealRole)");
                            }
                        }
                    }
                }
                if (role.actions.has("onDeath") && checkType(role.actions.onDeath, ["object"], "Role " + yourRole + "'s onDeath")) {
                    action = role.actions.onDeath;
                    checkAttributes(action, [], ["killRoles", "poisonRoles", "convertRoles", "exposeRoles", "killmsg", "convertmsg", "poisonmsg", "poisonDeadMessage", "exposemsg"], "Role " + yourRole + "'s onDeath");
                    if (action.has("killRoles") && checkType(action.killRoles, ["array"], "Role " + yourRole + "s onDeath: killRoles")) {
                        for (e in action.killRoles) {
                            this.checkValidRole(action.killRoles[e], "Role " + yourRole + "'s \"onDeath: killRoles\"");
                        }
                    }
                    if (action.has("killmsg")) {
                        checkType(action.killmsg, ["string"], "Role " + yourRole + "'s onDeath: killmsg");
                    }
                    if (action.has("poisonRoles") && checkType(action.poisonRoles, ["object"], "Role " + yourRole + "s onDeath: poisonRoles")) {
                        for (e in action.poisonRoles) {
                            this.checkValidRole(e, "Role " + yourRole + "'s \"onDeath: poisonRoles\"");
                            checkType(action.poisonRoles[e], ["number"], "Role " + yourRole + "s onDeath: poisonRoles: " + e);
                        }
                    }
                    if (action.has("poisonmsg")) {
                        checkType(action.poisonmsg, ["string"], "Role " + yourRole + "'s onDeath: poisonmsg");
                    }
                    if (action.has("convertRoles") && checkType(action.convertRoles, ["object"], "Role " + yourRole + "s onDeath: convertRoles")) {
                        for (e in action.convertRoles) {
                            this.checkValidRole(e, "Role " + yourRole + "'s \"onDeath: convertRoles\"");
                            this.checkValidRole(action.convertRoles[e], "role " + yourRole + "'s \"onDeath: convertRoles\"");
                        }
                    }
                    if (action.has("convertmsg")) {
                        checkType(action.convertmsg, ["string"], "Role " + yourRole + "'s onDeath: convertmsg");
                    }
                    if (action.has("exposeRoles") && checkType(action.exposeRoles, ["array"], "Role " + yourRole + "s onDeath: exposeRoles")) {
                        for (e in action.exposeRoles) {
                            this.checkValidRole(action.exposeRoles[e], "role " + yourRole + "'s \"onDeath: exposeRoles\"");
                        }
                    }
                    if (action.has("exposemsg")) {
                        checkType(action.exposemsg, ["string"], "Role " + yourRole + "'s onDeath: exposemsg");
                    }
                }
                if (role.actions.has("vote")) {
                    checkType(role.actions.vote, ["number"], "Role " + yourRole + "s vote");
                }
                if (role.actions.has("voteshield")) {
                    checkType(role.actions.voteshield, ["number"], "Role " + yourRole + "'s voteshield");
                }
                for (e in possibleNightActions) {
                    if (role.actions.has(possibleNightActions[e])) {
                        command = possibleNightActions[e];
                        action = role.actions[command];
                        if (command == "inspect") {
                            checkAttributes(action, [], ["mode", "revealSide", "revealAs", "msg", "targetmsg", "hookermsg", "count", "poisonDeadMessage", "silent"], "Role " + yourRole + "'s " + command + " mode");
                            if (action.has("revealSide")) {
                                checkValidValue(action.revealSide, [true, false], "Role " + yourRole + " has an \"inspect\" action with an invalid \"revealSide\" value: ~Value~ (~Valid~).");
                            }
                            if (action.has("revealAs")) {
                                if (typeof action.revealAs == "string") {
                                    if (action.revealAs !== "*") {
                                        this.checkValidRole(action.revealAs, "role " + yourRole + "'s \"inspect: revealAs\"");
                                    }
                                } else if (Array.isArray(action.revealAs)) {
                                    for (e in action.revealAs) {
                                        this.checkValidRole(action.revealAs[e], "role " + yourRole + "'s \"inspect: revealAs\"");
                                    }
                                }
                            }
                        } else {
                            checkAttributes(action, [], ["mode", "msg", "targetmsg", "hookermsg", "count", "poisonDeadMessage", "silent"], "Role " + yourRole + "'s " + command + " mode");
                        }
                        if (action.has("mode")) {
                            var mode = action.mode;
                            checkType(action.mode, ["string", "object"], "Role " + yourRole + "'s mode for \"" + command + "\"");
                            if (typeof mode == "string") {
                                checkValidValue(mode, ["ignore", "ChangeTarget", "killattacker", "killattackerevenifprotected", "poisonattacker", "poisonattackerevenifprotected", "identify", "die"], "Role " + yourRole + "'s " + command + "'s mode has an invalid value: ~Value~ (~Valid~)");
                            } else if (typeof mode == "object") {
                                if (mode.has("evadeChance")) {
                                    checkType(mode.evadeChance, ["number"], "Role " + yourRole + "'s \"evadeChance\" for \"" + command + "\"");
                                }
                                if (mode.has("ignore")) {
                                    if (checkType(mode.ignore, ["array"], "Role " + yourRole + "'s \"ignore\" for \"" + command + "\" mode")) {
                                        for (e in mode.ignore) {
                                            this.checkValidRole(mode.ignore[e], "Role " + yourRole + "'s \"" + command + ": ignore\"");
                                        }
                                    }
                                }
                                if (mode.has("killif")) {
                                    if (checkType(mode.killif, ["array"], "Role " + yourRole + "'s \"mode: killif\" for \"" + command + "\"")) {
                                        for (e in mode.killif) {
                                            this.checkValidRole(mode.killif[e], "Role " + yourRole + "'s \"" + command + ": killif\"");
                                        }
                                    }
                                }
                            }
                        }
                        if (action.has("msg")) {
                            checkType(action.msg, ["string"], "Role " + yourRole + "'s msg for " + command + "'s mode");
                        }
                        if (action.has("hookermsg")) {
                            checkType(action.hookermsg, ["string"], "Role " + yourRole + "'s hookermsg for " + command + "'s mode");
                        }
                        if (action.has("targetmsg")) {
                            checkType(action.targetmsg, ["string"], "Role " + yourRole + "'s targetmsg for " + command + "'s mode");
                        }
                        if (action.has("poisonDeadMessage")) {
                            checkType(action.poisonDeadMessage, ["string"], "Role " + yourRole + "'s poisonDeadMessage for " + command + "'s mode");
                        }
                        if (action.has("count")) {
                            checkType(action.count, ["number"], "Role " + yourRole + "'s count for " + command + "'s mode");
                        }
                        if (action.has("silent")) {
                            checkValidValue(action.silent, [true, false], "Role " + yourRole + " has an \"" + command + "\" mode with an invalid \"silent\" value: ~Value~ (~Valid~).");
                        }
                    }
                }
                if (role.actions.has("daykill") && checkType(role.actions.daykill, ["object", "string"], "Role " + yourRole + "'s daykill attribute")) {
                    action = role.actions.daykill;
                    checkType(action, ["string", "object"], "Role " + yourRole + "'s \"daykill\" mode");
                    if (typeof action == "string") {
                        checkValidValue(action, ["evade", "revenge", "bomb", "revealkiller"], "Role " + yourRole + " has a \"daykill\" action with invalid value: ~Value~ (~Valid~).");
                    } else if (typeof action == "object") {
                        checkAttributes(action, ["mode"], [], "Role " + yourRole + "'s \"daykill\" action");
                        if (action.has("mode") && checkType(action.mode, ["object"], "Role " + yourRole + "'s \"daykill\" mode")) {
                            if (action.mode.has("evadeChance")) {
                                checkType(action.mode.evadeChance, ["number"], "Role " + yourRole + "'s \"evadeChance\" for \"daykill\"");
                            }
                        }
                    }
                }
                if (role.actions.has("daykillrevengemsg") && checkType(role.actions.daykillrevengemsg, ["string"], "Role " + yourRole + "'s daykillrevengemsg attribute")) {
                    if (!role.actions.has("daykill")) {
                        addMinorError("Role " + yourRole + " has a \"daykillrevengemsg\" attribute, but no \"daykill\" attribute.");
                    } else {
                        checkType(role.actions.daykillrevengemsg, ["string"], "Role " + yourRole + "'s daykillrevengemsg attribute");
                    }
                }
                if (role.actions.has("avoidHax") && checkType(role.actions.avoidHax, ["array"], "Role " + yourRole + "'s avoidHax")) {
                    action = role.actions.avoidHax;
                    checkType(action, ["array"], "Role " + yourRole + "'s avoidHax action");
                    if (Array.isArray(action)) {
                        for (e in action) {
                            checkType(action[e], ["string"], "Role " + yourRole + "'s \"avoidHax on " + action[e] + "\"");
                        }
                    }
                }
                if (role.actions.has("avoidStandbyHax") && checkType(role.actions.avoidStandbyHax, ["array"], "Role " + yourRole + "'s avoidStandbyHax")) {
                    action = role.actions.avoidStandbyHax;
                    checkType(action, ["array"], "Role " + yourRole + "'s avoidStandbyHax action");
                    if (Array.isArray(action)) {
                        for (e in action) {
                            checkType(action[e], ["string"], "Role " + yourRole + "'s \"avoidStandbyHax on " + action[e] + "\"");
                        }
                    }
                }
                if (role.actions.has("initialCondition") && checkType(role.actions.initialCondition, ["object"], "Role " + yourRole + "'s initialCondition attribute")) {
                    action = role.actions.initialCondition;
                    checkAttributes(action, [], ["poison", "clearPoison"], "Role " + yourRole + "'s \"initialCondition\" action");
                    if (action.has("poison")) {
                        checkAttributes(action.poison, [], ["count", "poisonDeadMessage"], "Role " + yourRole + "'s \"initialCondition: poison\" action");
                        if (action.poison.has("count")) {
                            checkType(action.poison.count, ["number"], "Role " + yourRole + "'s \"initialCondition: poison\" action");
                        }
                        if (action.poison.has("poisonDeadMessage")) {
                            checkType(action.poison.poisonDeadMessage, ["string"], "Role " + yourRole + "'s \"initialCondition: poison\" action");
                        }
                    }
                    if (action.has("clearPoison")) {
                        checkValidValue(action.clearPoison, [true, false], "Role " + yourRole + "'s \"initialCondition\" action has a invalid value for \"clearPoison\": ~Value~ (~Valid~)");
                    }
                }
                if (role.actions.has("startup") && checkType(role.actions.startup, ["string", "object"], "Role " + yourRole + "'s startup attribute")) {
                    action = role.actions.startup;
                    if (typeof action == "string") {
                        checkValidValue(action, ["team-reveal", "role-reveal", "team-reveal-with-roles"], "Role " + yourRole + " has \"startup\" action with invalid value: ~Value~ (~Valid~).");
                    } else if (typeof action == "object") {
                        checkAttributes(action, [], ["revealRole", "team-revealif", "revealAs"], "Role " + yourRole + "'s startup attribute");
                        if (action.has("revealAs")) {
                            if (checkType(action.revealAs, ["string"], "Role " + yourRole + "'s \"revealAs\" attribute for \"startup\"")) {
                                this.checkValidRole(action.revealAs, "Role " + yourRole + "'s \"startup: revealAs\"");
                            }
                        }
                        if (action.has("revealRole")) {
                            checkType(action.revealRole, ["string", "array"], "Role " + yourRole + "'s \"revealRole\" attribute for \"startup\"");
                            if (typeof action.revealRole == "string") {
                                this.checkValidRole(action.revealRole, "role " + yourRole + "'s \"startup: revealRole\"");
                            } else if (!Array.isArray(action.revealRole)) {
                                for (e in action.revealRole) {
                                    this.checkValidRole(action.revealRole[e], "Role " + yourRole + "'s \"startup: revealRole\"");
                                }
                            }
                        }
                        if (action.has("team-revealif")) {
                            checkType(action["team-revealif"], ["array"], "Role " + yourRole + "'s \"team-revealif\" attribute for \"startup\"");
                            if (Array.isArray(action["team-revealif"])) {
                                for (e in action["team-revealif"]) {
                                    this.checkValidSide(action["team-revealif"][e], "Role " + yourRole + " \"startup: team-revealif\" action");
                                }
                            }
                        }
                    }
                }
                if (role.actions.has("onlist") && checkType(role.actions.onlist, ["string"], "Role " + yourRole + "'s onlist attribute")) {
                    this.checkValidRole(role.actions.onlist, yourRole + "'s \"onlist\" action");
                }
                if (role.actions.has("lynch") && checkType(role.actions.lynch, ["object"], "Role " + yourRole + "'s lynch attribute")) {
                    checkAttributes(role.actions.lynch, [], ["revealAs", "convertTo", "convertmsg"], "Role " + yourRole + "s \"lynch\" action");
                    if (role.actions.lynch.has("revealAs")) {
                        this.checkValidRole(role.actions.lynch.revealAs, "Role " + yourRole + " \"lynch: revealAs\" action");
                    }
                    if (role.actions.lynch.has("convertTo")) {
                        this.checkValidRole(role.actions.lynch.convertTo, "Role " + yourRole + " \"lynch: convertTo\" action");
                        if (role.actions.lynch.has("convertmsg")) {
                            checkType(role.actions.lynch.convertmsg, ["string"], "Role " + yourRole + "'s \"convertmsg\" attribute for \"lynch\"");
                        }
                    }
                }
            }
        };

        themeProto.checkActions = function () {
            var r, e, i, role, action, night = [],
                day = [],
                roles = this.roles;

            for (r in roles) {
                role = roles[r].actions;
                if (role.has("night")) {
                    for (e in role.night) {
                        if (!night.has(e)) {
                            night.push(e);
                        }
                    }
                }
                if (role.has("standby")) {
                    for (e in role.standby) {
                        if (!day.has(e)) {
                            day.push(e);
                        }
                    }
                }
            }

            for (r in roles) {
                role = roles[r].actions;
                if (role.has("hax")) {
                    for (e in role.hax) {
                        if (!night.has(e)) {
                            addMinorError("Your role \"" + r + "\" gets hax on an inexistent " + e + " action.");
                        }
                    }
                }
                if (role.has("avoidHax")) {
                    for (e in role.avoidHax) {
                        if (!night.has(role.avoidHax[e])) {
                            addMinorError("Your role \"" + r + "\" avoids hax from an inexistent " + role.avoidHax[e] + " action.");
                        }
                    }
                }
                if (role.has("standbyHax")) {
                    for (e in role.standbyHax) {
                        if (!day.has(e)) {
                            addMinorError("Your role \"" + r + "\" gets standby hax on an inexistent " + e + " action.");
                        }
                    }
                }
                if (role.has("avoidStandbyHax")) {
                    for (e in role.avoidStandbyHax) {
                        if (!day.has(role.avoidStandbyHax[e])) {
                            addMinorError("Your role \"" + r + "\" avoids standby hax from an inexistent " + role.avoidStandbyHax[e] + " action.");
                        }
                    }
                }
            }
        }

        themeProto.isValidSide = function (side) {
            return this.sides.has(side);
        }

        themeProto.isValidRole = function (role) {
            return this.roles.has(role);
        }

        themeProto.checkValidSide = function (side, what) {
            if (!this.isValidSide(side)) {
                addFatalError("An invalid side \"" + side + "\" was found in " + what + ". ");
            }
        }

        themeProto.checkValidRole = function (role, what) {
            if (!this.isValidRole(role)) {
                addFatalError("An invalid role \"" + role + "\" was found in " + what + ". ");
            }
        }

        checkValidValue = function (attr, valid, msg) {
            if (!valid.has(attr)) {
                addMinorError(msg.format(attr, "Valid values are " + valid.join(", ")));
            }
        }

        checkType = function (atr, types, what) {
            if (types.has(typeof atr)) {
                return true;
            }
            if (types.has("array") && Array.isArray(atr)) {
                return true;
            }

            addFatalError(what + " must be a(n) " + readable(types, "or") + ".");
            return false;
        }

        checkAttributes = function (obj, mandatory, optional, what, mainObject) {
            var x, curr;
            if (typeof obj == "object") {
                for (x in mandatory) {
                    curr = mandatory[x];
                    if (!obj.has(curr)) {
                        addFatalError(what + ' is missing the attribute "' + curr + '".');
                    }
                }
                for (e in obj) {
                    if (!mandatory.has(e) && !optional.has(e)) {
                        if (!(e.contains("roles") && mainObject)) { // Roles
                            addMinorError(what + ' has an extra attribute "' + e + '".');
                        }
                    }
                }
            } else {
                addFatalError(what + ' is not an object.');
            }
        }

        commonNightActions = function (yourRole, action, command, roles) {
            if (action.has("target")) {
                checkValidValue(action.target, ["Any", "Self", "AnyButTeam", "AnyButRole", "AnyButSelf", "OnlySelf"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"target\": %1 (%2)");
            }
            if (action.has("common")) {
                checkValidValue(action.common, ["Self", "Team", "Role"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"common\": %1 (%2)");
            }
            if (action.has("priority")) {
                checkType(action.priority, ["number"], "Role " + yourRole + "'s attribute \"priority\" for night action \"" + command + "\"");
            }
            if (action.has("broadcast")) {
                if (typeof action.broadcast === "string") {
                    checkValidValue(action.broadcast.toLowerCase(), ["none", "team", "role"], "Role " + yourRole + "'s night action \"" + command + "\" has a invalid value for \"broadcast\": %1 (%2)");
                } else if (Array.isArray(action.broadcast)) {
                    var x, curr, b = action.broadcast,
                        roleList = [];
                    for (x in roles) {
                        roleList.push(roles[x].role);
                    }

                    for (x in b) {
                        curr = b[x];
                        if (!roles.has(curr)) {
                            addMinorError("Your role " + yourRole + "'s attribute \"broadcast\" has an inexistant role \"" + curr + "\"");
                        }
                    }

                } else {
                    checkType(action.broadcast, ["number"], /* w/e */ "Role " + yourRole + "'s attribute \"broadcast\" for night action \"" + command + "\"");
                }
            }
            if (action.has("limit")) {
                checkType(action.limit, ["number"], "Role " + yourRole + "'s attribute \"limit\" for night action \"" + command + "\"");
            }
            if (action.has("failChance")) {
                checkType(action.failChance, ["number"], "Role " + yourRole + "'s attribute \"failChance\" for night action \"" + command + "\"");
            }
            if (action.has("recharge")) {
                checkType(action.recharge, ["number"], "Role " + yourRole + "'s attribute \"recharge\" for night action \"" + command + "\"");
            }
            if (action.has("initialrecharge")) {
                checkType(action.initialrecharge, ["number"], "Role " + yourRole + "'s attribute \"initialrecharge\" for night action \"" + command + "\"");
            }
            if (action.has("broadcastmsg")) {
                checkType(action.broadcastmsg, ["string"], "Role " + yourRole + "'s attribute \"broadcastmsg\" for night action \"" + command + "\"");
            }
        }

        loadTheme = function (content) {
            var json, x, y, roleList, cantLose, errorsFound = false,
                theme;
            try {
                json = JSON.parse(content);
            } catch (err) {
                fatal("Could not parse JSON.");
                out("You might want to hone your syntax with <a href='http://jsonlint.com'>JSONLint</a>");
                return;
            }
            theme = new Theme();

            try {
                checkAttributes(json, ["name", "sides", "roles", /*"roles1"*/ ], ["ticks", "minplayers", "votesniping", "nolynch", "villageCantLoseRoles", "author", "summary", "border", "killmsg", "killusermsg", "lynchmsg", "drawmsg"], "Your theme", true);


                checkType(json.name, ["string"], "Your theme's \"name\" attribute");
                checkType(json.sides, ["array"], "Your theme's \"sides\" attribute");
                checkType(json.roles, ["array"], "Your theme's \"roles\" attribute");

                if (json.has("author")) {
                    checkType(json.author, ["string", "array"], "Your theme's \"author\" attribute");
                    if (Array.isArray(json.author)) {
                        for (i in json.author) {
                            checkType(json.author[i], ["string"], "Every theme author between []");
                        }
                    }
                }
                if (json.has("summary")) {
                    checkType(json.summary, ["string"], "Your theme's \"summary\" attribute");
                }
                if (json.has("border")) {
                    checkType(json.border, ["string"], "Your theme's \"border\" attribute");
                }
                if (json.has("killmsg")) {
                    checkType(json.killmsg, ["string"], "Your theme's \"killmsg\" attribute");
                }
                if (json.has("killusermsg")) {
                    checkType(json.killusermsg, ["string"], "Your theme's \"killusermsg\" attribute");
                }
                if (json.has("lynchmsg")) {
                    checkType(json.lynchmsg, ["string"], "Your theme's \"lynchmsg\" attribute");
                }
                if (json.has("drawmsg")) {
                    checkType(json.drawmsg, ["string"], "Your theme's \"drawmsg\" attribute");
                }
                if (json.has("minplayers")) {
                    checkType(json.minplayers, ["number"], "Your theme's \"minplayers\" attribute");
                }
                if (json.has("nolynch")) {
                    checkValidValue(json.nolynch, [true, false], "Your theme has a invalid value for \"nolynch\": ~Value~ (~Valid~)");
                }
                if (json.has("votesniping")) {
                    checkValidValue(json.votesniping, [true, false], "Your theme has a invalid value for \"votesniping\": ~Value~ (~Valid~)");
                }
                if (json.has("ticks")) {
                    var ticks = json.ticks;
                    checkAttributes(ticks, [], ["night", "standby"], "Your theme's tick attribute");
                    if (checkType(ticks, ["object"], "Your theme's \"ticks\" attribute")) {
                        if (ticks.has("night")) {
                            checkType(ticks.night, ["number"], "Your theme's \"ticks: night\" attribute");
                        }
                        if (ticks.has("standby")) {
                            checkType(ticks.standby, ["number"], "Your theme's \"ticks: standby\" attribute");
                        }
                    }
                }

                // Init from the theme
                for (x in json.sides) {
                    theme.addSide(json.sides[x]);
                }
                for (x in json.roles) {
                    theme.addRole(json.roles[x]);
                }

                x = 1;
                while (json.has("roles" + x)) {
                    roleList = json["roles" + x];
                    for (y in roleList) {
                        if (!theme.isValidRole(roleList[y])) {
                            addFatalError("Your \"roles" + i + "\" list has an invalid role \"" + roleList[y] + "\".");
                        }
                    }
                    x++;
                }

                if (!json.roles1) {
                    addFatalError("This theme has no roles1, it can not be played.");
                }

                if (json.has("villageCantLoseRoles")) {
                    cantLose = json.villageCantLoseRoles;
                    for (x in cantLose) {
                        if (!theme.isValidRole(cantLose[x])) {
                            addFatalError("Your \"villageCantLoseRoles\" list contains an invalid role \"" + cantLose[x] + "\".");
                        }
                    }
                } else {
                    if (theme.sides.has("village")) {
                        addFatalError("Your theme needs (an empty) \"villageCantLoseRoles\", because you have a side 'village'.");
                    }
                }

                theme.addActions();
                theme.checkActions();
            } catch (err) {
                fatal("Couldn't check the entire code. The following error has occured: " + err);
            }

            out("");
            if (!fatalErrors.isEmpty()) {
                errorsFound = true;
                out("Fatal errors found in your theme:");

                printErrors(fatalErrors);
            }
            else {
                out("No fatal errors found in your theme. Good job!");
            }

            out("");
            if (!minorErrors.isEmpty()) {
                errorsFound = true;
                out("Minor errors found in your theme:");

                printErrors(minorErrors);
            } else {
                out("No minor errors found in your theme. Good job!");
            }

            if (!errorsFound) {
                out("");
                out("No errors found! Your theme should work.");
            }

            resetErrors();

            out("");
        }

        checkTheme = function (url) {
            out("Downloading your theme.");

            sys.webCall(url, function (resp) {
                if (resp === "") {
                    fatal("The page didn't exist or there was an error with retrieving the content of the page.");
                    return;
                }

                try {
                    loadTheme(resp);
                } catch (e) {
                    fatal("Couldn't check your theme: " + e);
                }

            });
        }

    })();

/* Role List Preview */ (function () {
    function MafiaTheme() {}

    MafiaTheme.prototype.getBorder = function () {
        if (this.has("border")) {
            return this.border;
        }

        return "*** *********************************************************************** ***";
    }

    MafiaTheme.prototype.addSide = function (obj) {
        this.sideTranslations[obj.side] = obj.translation;
    };

    MafiaTheme.prototype.addRole = function (obj) {
        this.roles[obj.role] = obj;

/* // Reserved: /priority
        var i, action;
        if ("night" in obj.actions) {
            for (i in obj.actions.night) {
                var priority = obj.actions.night[i].priority;
                action = i;
                var role = obj.role;
                this.nightPriority.push({
                    'priority': priority,
                    'action': action,
                    'role': role
                });
            }
            this.nightPriority.sort(function (a, b) {
                return a.priority - b.priority;
            });
        }
		*/
    };

    MafiaTheme.prototype.generateRoleInfo = function () {
        var sep = this.getBorder(),
            roles = [sep],
            role, role_i = null,
            role_order = this.roles.keys(),
            this_roles = this.roles,
            r, abilities, a, ability;

        role_order.sort(function (a, b) {
            var tra = this_roles[a].translation,
                trb = this_roles[b].translation;

            if (tra == trb) {
                return 0;
            }

            else if (tra < trb) {
                return -1;
            }

            return 1;
        });

        function trrole(s) {
            return this.trrole(s);
        }

        function trside(s) {
            return this.trside(s);
        }

        for (r = 0; r < role_order.length; ++r) {
            try {
                role = this.roles[role_order[r]];
                roles.push("±Role: " + role.translation);

                // check which abilities the role has
                abilities = "";
                if ("info" in role) {
                    abilities = role.info;
                } else {
                    if (role.actions.night) {
                        for (a in role.actions.night) {
                            ability = role.actions.night[a];
                            abilities += "Can " + a + " " + ("limit" in ability ? ability.limit + " persons" : "one person") + " during the night. ";
                            if ("avoidHax" in role.actions && role.actions.avoidHax.indexOf(a) != -1) {
                                abilities += "(Can't be detected by spies.) ";
                            }
                        }
                    }
                    if (role.actions.standby) {
                        for (a in role.actions.standby) {
                            ability = role.actions.standby[a];
                            abilities += "Can " + a + " " + ("limit" in ability ? ability.limit + " persons" : "one person") + " during the standby. ";
                        }
                    }
                    if ("vote" in role.actions) {
                        abilities += "Vote counts as " + role.actions.vote + ". ";
                    }
                    if ("voteshield" in role.actions) {
                        abilities += "Receives " + role.actions.voteshield + " extra votes if voted for at all. ";
                    }
                    if ("kill" in role.actions) {
                        if (role.actions.kill.mode == "ignore") {
                            abilities += "Can't be nightkilled. ";
                        }
                        else if (role.actions.kill.mode == "killattackerevenifprotected") {
                            abilities += "Revenges nightkills (even when protected). ";
                        }
                        else if (role.actions.kill.mode == "killattacker") {
                            abilities += "Revenges nightkills. ";
                        }
                        else if (role.actions.kill.mode == "poisonattacker" || role.actions.kill.mode == "poisonattackerevenifprotected") {
                            abilities += "Poison attacker when killed. ";
                        }
                        else if (typeof role.actions.kill.mode == "object") {
                            if ("ignore" in role.actions.kill.mode) {
                                var ignoreRoles = role.actions.kill.mode.ignore.map(trrole, this);
                                abilities += "Can't be nightkilled by " + readable(ignoreRoles, "and") + ". ";
                            }
                            if ("evadeChance" in role.actions.kill.mode && role.actions.kill.mode.evadeChance > 0) {
                                abilities += "Has a " + Math.floor(role.actions.kill.mode.evadeChance * 100) + "% chance of evading nightkills. ";
                            }
                        }
                    }
                    if ("daykill" in role.actions) {
                        if (role.actions.daykill == "evade") {
                            abilities += "Can't be daykilled. ";
                        }
                        else if (role.actions.daykill == "revenge") {
                            abilities += "Counter daykills. ";
                        }
                        else if (role.actions.daykill == "bomb") {
                            abilities += "Revenges daykills. ";
                        }
                        else if (typeof role.actions.daykill == "object" && typeof role.actions.daykill.mode == "object" && role.actions.daykill.mode.evadeChance > 0) {
                            abilities += "Has a " + Math.floor(role.actions.daykill.mode.evadeChance * 100) + "% chance of evading daykills. ";
                        }
                        else if (role.actions.daykill == "revealkiller") {
                            abilities += "Reveals killer when daykilled. ";
                        }
                    }
                    if ("poison" in role.actions) {
                        if (role.actions.poison.mode == "ignore") {
                            abilities += "Can't be poisoned. ";
                        }
                        else if (typeof role.actions.poison.mode == "object" && role.actions.poison.mode.evadeChance > 0) {
                            abilities += "Has a " + Math.floor(role.actions.poison.mode.evadeChance * 100) + "% chance of evading poison. ";
                        }
                    }
                    if ("hax" in role.actions && Object.keys) {
                        var haxy = Object.keys(role.actions.hax);
                        abilities += "Gets hax on " + readable(haxy, "and") + ". ";
                    }
                    if ("inspect" in role.actions) {
                        if (Array.isArray(role.actions.inspect.revealAs)) {
                            var revealAs = role.actions.inspect.revealAs.map(trrole, this);
                            abilities += "Reveals as " + readable(revealAs, "or") + " when inspected. ";
                        } else if (role.actions.inspect.revealAs == "*") {
                            abilities += "Reveals as a random role when inspected. ";
                        } else {
                            abilities += "Reveals as " + this.roles[role.actions.inspect.revealAs].translation + " when inspected. ";
                        }
                    }
                    if ("distract" in role.actions) {
                        if (role.actions.distract.mode == "ChangeTarget") abilities += "Kills any distractors. ";
                        if (role.actions.distract.mode == "ignore") abilities += "Ignores any distractors. ";
                    }
                    if ("initialCondition" in role.actions) {
                        if ("poison" in role.actions.initialCondition) {
                            abilities += "Dies at the end of night " + (role.actions.initialCondition.poison.count || 2) + ". ";
                        }
                    }
                    if (typeof role.side == "string") {
                        abilities += "Sided with " + this.trside(role.side) + ". ";
                    } else if (typeof role.side == "object") {
                        var plop = Object.keys(role.side.random);
                        var tran = [];
                        for (var p = 0; p < plop.length; ++p) {
                            tran.push(this.trside(plop[p]));
                        }
                        abilities += "Sided with " + readable(tran, "or") + ". ";
                    }
                    if (role.hasOwnProperty("winningSides")) {
                        if (role.winningSides == "*") {
                            abilities += "Wins the game in any case. ";
                        } else if (Array.isArray(role.winningSides)) {
                            abilities += "Wins the game with " + readable(role.winningSides.map(trside, this), "or");
                        }
                    }
                }
                roles.push("±Ability: " + abilities);

                // check on which player counts the role appears
                var parts = [];
                var end = 0;
                for (var i = 1; i <= this.roleLists; ++i) {
                    role_i = "roles" + i;
                    var start = this[role_i].indexOf(role.role);
                    var last = end;
                    end = this[role_i].length;
                    if (start >= 0) {
                        ++start;
                        start = start > last ? start : 1 + last;
                        if (parts.length > 0 && parts[parts.length - 1][1] == start - 1) {
                            parts[parts.length - 1][1] = end;
                        } else {
                            parts.push([start, end]);
                            if (parts.length > 1) {
                                parts[parts.length - 2] = parts[parts.length - 2][0] < parts[parts.length - 2][1] ? parts[parts.length - 2].join("-") : parts[parts.length - 2][1];
                            }
                        }
                    }
                }
                if (parts.length > 0) {
                    parts[parts.length - 1] = parts[parts.length - 1][0] < parts[parts.length - 1][1] ? parts[parts.length - 1].join("-") : parts[parts.length - 1][1];
                }
                roles.push("±Game: " + parts.join(", ") + " Players");

                roles.push(sep);
            } catch (err) {
                if (role_i === null) {
                    out("Error adding role " + role.translation + "(" + role.role + ") to /roles");
                }
                else {
                    out("Error making rolelist with role id: " + role_i);
                }
                throw err;
            }
        }

        this.roleInfo = roles;
    };

    /* Theme Loading and Storing */
    MafiaTheme.prototype.trside = function (side) {
        return this.sideTranslations[side];
    };
    MafiaTheme.prototype.trrole = function (role) {
        return this.roles[role].translation;
    };

    MafiaTheme.prototype.printInfo = function () {
        var info = this.roleInfo,
            x;
        for (x in info) {
            println(info[x]);
        }
    }

    loadThemeRoles = function (json) {
        var theme = new MafiaTheme();
        try {
            theme.sideTranslations = {};
            theme.roles = {};
            theme.nightPriority = [];

            // Init from the theme
            var i;
            for (i in json.sides) {
                theme.addSide(json.sides[i]);
            }
            for (i in json.roles) {
                theme.addRole(json.roles[i]);
            }

            theme.roles1 = json.roles1;
            i = 2;
            while (json.has("roles" + i)) {
                theme["roles" + i] = json["roles" + i];
                ++i;
            }
            theme.roleLists = i - 1;
            if (theme.roleLists === 0) {
                throw "Couldn't parse theme " + json.name + ": No role lists.";
            }

            theme.border = json.border;
            theme.generateRoleInfo();
            theme.printInfo();
        } catch (err) {
            out("Couldn't parse theme " + json.name + ": " + err + ".");
        }
    }
    displayThemeRoles = function (url) {
        out("Downloading your theme.");

        sys.webCall(url, function (resp) {
            if (resp === "") {
                fatal("The page didn't exist or there was an error with retrieving the content of the page.");
                return;
            }

            try {
                loadThemeRoles(JSON.parse(resp));
            } catch (e) {
                fatal("Couldn't load your theme: " + e);
            }

        });
    }
})();

/* Theme Summary */ 
(function () {
    Object.defineProperty(Array.prototype, "list", {
        "value": function () {
            return this.join(", ");
        },

        writable: true,
        enumerable: false,
        configurable: true
    });


    Object.defineProperty(Object.prototype, "list", {
        "value": function () {
            var obj = this,
                x, ret = [];
            for (x in obj) {
                ret.push(x + ": " + obj);
            }

            return ret.list();
        },

        writable: true,
        enumerable: false,
        configurable: true
    });

    property = function (prop, type, msg, list) {
        if (typeof type === "array") {
            var x, curr;

            for (x in type) {
                curr = type[x];

                if (type === "array" && Array.isArray(prop)) {
                    if (!list) {
                        return prop;
                    }

                    return prop.list();
                }

                if (typeof prop === curr) {
                    if (!list) {
                        return prop;
                    }

                    return prop.list();
                }
            }

            return msg;
        }

        if (typeof prop === type) {
            if (!list) {
                return prop;
            }

            return prop.list();
        }

        if (type === "array" && Array.isArray(prop)) {
            if (!list) {
                return prop;
            }

            return prop.list();
        }

        if ((type === "all" || type === "any") && prop !== undefined && prop !== null) {
            if (!list) {
                return prop;
            }

            return prop.list();
        }

        return msg;
    }

    template = function (json, type) {
        this.stack = [];
        this.code = json;
        this.object = "";
        this.subObjects = [];
        this.noObjectSplice = false;
        this.listType = "ul";

        this.type = type;
        this.typeCount = 0;

        this.indent = 0;
        this.gaveIndent = false;
    }

    template.prototype.header = function (msg, depth, objectName, listType, noIndent) {
        if (objectName) {
            this.object = objectName;
        }

        if (listType) {
            this.listType = listType;
        }

        var separator = "<" + this.listType + ">",
            indentToDo = this.indent,
            toAdd = "";

        if (this.type === 2) {
            while (indentToDo != 0) {
                toAdd += "&nbsp;";
                indentToDo--;
            }

            this.stack.push("<br/>" + toAdd + "<font size='" + this.getDepth(depth) + "'><b>" + msg + "</b></font><br/>", "");
        }
        else {
            this.stack.push("<h" + depth + ">" + msg + "</h" + depth + ">", separator);
        }

        if (!noIndent) {
            this.indent += 10;
            this.gaveIndent = true;
        }
    }

    template.prototype.subHeader = function (msg, depth, objectName) {
        var separator = "<" + this.listType + ">",
            indentToDo = this.indent,
            toAdd = "";

        if (this.type === 2) {
            while (indentToDo != 0) {
                toAdd += "&nbsp;";
                indentToDo--;
            }

            this.stack.push("<br/>" + toAdd + "<font size='" + this.getDepth(depth) + "'><b>" + msg + "</b></font><br/><br/>", "");
        } else {
            this.stack.push("<h" + depth + ">" + msg + "</h" + depth + ">", separator);
        }


        if (objectName) {
            this.subObjects.push(objectName);
        }
        else {
            this.noObjectSplice = true;
        }

        this.indent += 10;
        this.gaveIndent = true;
    }

    template.prototype.endHeader = function () {
        if (this.type !== 2) {
            this.stack.push("</" + this.listType + ">");
        }

        this.object = "";
        this.listType = "ul";
        this.typeCount = 0;

        if (this.gaveIndent) {
            this.indent -= 10;

            if (this.indent < 0) {
                this.indent = 0;
            }
        } else {
            this.gaveIndent = false;
        }
    }

    template.prototype.endSubHeader = function () {
        if (this.type !== 2) {
            this.stack.push("</" + this.listType + ">");
        }

        if (!this.noObjectSplice) {
            this.subObjects.splice(this.subObjects.length - 1, 1);
        } else {
            this.noObjectSplice = false;
        }

        this.typeCount = 0;

        if (this.gaveIndent) {
            this.indent -= 10;

            if (this.indent < 0) {
                this.indent = 0;
            }
        } else {
            this.gaveIndent = false;
        }
    }

    template.prototype.add = function (msg) {
        this.stack.push(msg);
    }

    template.prototype.li = function (msg) {
        var wrapper = ["<li>", "</li>"],
            indentToDo = this.indent,
            toAdd = "";

        this.typeCount++;

        if (this.type === 2) {
            if (this.listType === "ul") {
                wrapper = ["\u2022 ", "<br/>"];
            } else {
                wrapper = [this.typeCount + ". ", "<br/>"];
            }

            while (indentToDo != 0) {
                toAdd += "&nbsp;";
                indentToDo--;
            }

            wrapper[0] = toAdd + wrapper[0];
        }

        this.stack.push(wrapper[0] + msg + wrapper[1]);
    }

    template.prototype.printAll = function () {
        pureHtml(this.stack.join(""));
    }

    template.prototype.getObject = function () {
        var object = this.object;
        if (object.isEmpty()) {
            return "";
        }

        return object + ".";
    }

    template.prototype.getSubObjects = function () {
        var object = this.subObjects;
        if (object.isEmpty()) {
            return "";
        }

        return object.join(".") + ".";
    }


    template.prototype.getDepth = function (depth) {
        return {
            "1": "6",
            "2": "5",
            "3": "4",
            "4": "3",
            "5": "2",
            "6": "1"
        }[depth];
    }

    template.prototype.addProperty = function (name, propname, types, list, nameAsArray, isFloat) {
        var code = this.code,
            prop = eval("code." + this.getObject() + this.getSubObjects() + propname),
            res = property(prop, types, "", list),
            title = "<b>" + name + ":</b>";

        if (nameAsArray && Array.isArray(prop)) {
            title = "<b>" + nameAsArray + ":</b>";
        }

        if (!name) {
            title = "";
        }

        if (isFloat) {
            res = (res * 100) + "%";
        }

        if (res !== "") {
            this.li(title + " " + res);
        }
    }

    template.prototype.addNumberProperty = function (name, propname, minimum, maximum) {
        var prop = this.code[propname];

        if (typeof prop !== "number") {
            return;
        }

        if (minimum != undefined && minimum > prop) {
            return;
        }

        if (maximum != undefined && prop > maximum) {
            return;
        }

        this.li(name.bold() + ": " + prop);
    }

    template.prototype.propertyType = function (propname) {
        var code = this.code,
            prop = eval("code." + this.getObject() + this.getSubObjects() + propname),
            type;

        if (Array.isArray(prop)) {
            type = "array";
        } else if (prop === null) {
            type = "null";
        } else {
            type = typeof prop;
        }

        return type;
    }

    Flags = {
        "list": true,
        "noList": null,
        "noNameAsArray": null,
        "isFloat": true,
        "noListType": null,
        "noIndent": true
    };

    printThemeSummary = function (json, type) {
        if (type !== "copyable") {
            type = 1;
        } else {
            type = 2;
        }
        try {
            var t = new template(json, type),
                x, y, z, i, sides = json.sides,
                roles = json.roles,
                roleTranslations = {};

            t.header("Theme summary of " + json.name + ":<br/>", 1);

            t.addProperty("Name", "name", "string");
            t.addProperty("Author", "author", ["string", "array"], Flags.list, "Authors");
            t.addProperty("Summary", "summary", "string");

            t.addProperty("Border", "border", "string");
            t.addProperty("Kill Message", "killmsg", "string");
            t.addProperty("Kill User Message", "killusermsg", "string");
            t.addProperty("Lynch Message", "lynchmsg", "string");
            t.addProperty("Draw Message", "drawmsg", "string");

            t.addNumberProperty("Minimum Players", "minplayers", 3);

            t.addProperty("No Lynching", "nolynch", "any");
            t.addProperty("Vote Sniping", "votesniping", "any");

            t.addProperty("Village Can't Lose Roles", "villageCantLoseRoles", "array", Flags.list);

            if (t.propertyType("ticks") === "object") {
                t.subHeader("Ticks:", 4, "ticks");
                
                t.addProperty("Night", "night", "boolean");
                t.addProperty("Standby", "standby", "boolean");
                
                t.endSubHeader();
            }
            
            t.header("Sides:", 2);

            for (x in sides) {
                z = sides[x];
                t.header(z.translation + ":", 3, "sides[" + x + "]");

                y = t.propertyType("side");

                if (y === "string") {
                    t.addProperty("Proto Side", "side", "string");
                } else if (y === "object") {
                    t.subHeader("Possible Proto Sides:", 4);

                    y = z.side.random;
                    for (x in y) {
                        t.li("<b>" + x + ":</b> " + (x[y] * 100) + "%");
                    }

                    t.endSubHeader();
                }

                t.addProperty("Side Translation", "translation", "string");

                t.addProperty("Win Message", "winmsg", "string");
                t.endHeader();
            }

            t.endHeader();

            t.header("Roles:", 2);

            for (x in roles) {
                z = roles[x];
                t.header(z.translation + ":", 3, "roles[" + x + "]");

                roleTranslations[z.role] = z.translation;

                t.addProperty("Proto Role", "role", "string");
                t.addProperty("Role Translation", "translation", "string");
                t.addProperty("Side", "side", "string");
                t.addProperty("Help", "help", "string");
                t.addProperty("Info", "info", "string");
                t.addProperty("Winning Side", "winningSides", ["array", "string"], Flags.list, "Winning Sides");
                t.addProperty("Win If Dead Roles", "winningSides", "array", Flags.list);

                t.subHeader("Actions:", 4, "actions");

                y = t.propertyType("mode");
                if (y === "string") {
                    t.addProperty("Mode", "mode", "string");
                } else if (y === "object") {
                    t.subHeader("Mode:", 5, "mode");

                    t.endSubHeader();
                }

                t.addProperty("Avoid Hax", "avoidHax", "array", Flags.list);
                t.addProperty("Avoid Standby Hax", "avoidHax", "array", Flags.list);

                if (t.propertyType("initialCondition") === "object") {
                    t.subHeader("Initial Condition", 5, "initialCondition");

                    t.addProperty("Clear Poison", "clearPoison", "boolean");

                    if (t.propertyType("poison") === "object") {
                        t.subHeader("Poison", 6, "poison");

                        t.addProperty("Count", "count", "number");
                        t.addProperty("Poison Dead Message", "poisonDeadMessage", "string");

                        t.endSubHeader();
                    }

                    t.endSubHeader();
                }

                y = t.propertyType("daykill");
                if (y === "string") {
                    t.addProperty("Daykill", "daykill", "string");
                } else if (y === "object") {
                    t.subHeader("Daykill:", 5, "daykill");

                    t.subHeader("Mode:", 6, "mode");

                    t.addProperty("Evade Chance", "evadeChance", "number", Flags.noList, Flags.noNameAsArray, Flags.isFloat);

                    t.endSubHeader();

                    t.endSubHeader();
                }

                t.addProperty("Daykill Revenge Message", "daykillrevengemsg", "string");
                t.addProperty("Vote", "vote", "number");
                t.addProperty("Voteshield", "voteshield", "number");
                t.addProperty("Onlist", "onlist", "string");

                if (t.propertyType("lynch") === "object") {
                    t.subHeader("Lynch:", 5, "lynch");

                    t.addProperty("Reveal As", "revealAs", "string");
                    t.addProperty("Convert To", "convertTo", "string");
                    t.addProperty("Convert Message", "convertmsg", "string");

                    t.endSubHeader();
                }

                t.endSubHeader();

                t.endHeader();
            }

            t.endHeader();

            i = 1;

            while (json.has("roles" + i)) {
                t.header("Roles " + i + ":", 3, "roles" + i, "ol");

                z = json["roles" + i];
                for (y in z) {
                    curr = z[y];
                    t.li(curr.bold() + "<b>:</b> " + roleTranslations[curr]);
                }

                t.endHeader();
                i++;
            }

            t.endHeader();

            t.printAll();
        } catch (e) {
            fatal("Couldn't generate a summary: " + FormatError("", e));
        }
    }

    displayThemeSummary = function (url) {
        out("Downloading your theme.");

        sys.webCall(url[0], function (resp) {
            if (resp === "") {
                fatal("The page didn't exist or there was an error with retrieving the content of the page.");
                return;
            }

            try {
                println("");
                printThemeSummary(JSON.parse(resp), url[1]);
                println("");
            } catch (e) {
                fatal("Couldn't load your theme: " + FormatError("", e));
            }

        });
    }
})();

/* Core */ ({
    beforeSendMessage: function (message, channel) {
        if ((message[0] == "~" || message[0] == "-") && message.length > 1) {
            var commandData = "",
                pos = message.indexOf(' ');
            sys.stopEvent();

            if (pos != -1) {
                command = message.substring(1, pos).toLowerCase();
                commandData = message.substr(pos + 1);
            }
            else {
                command = message.substring(1).toLowerCase();
            }

            if (command == "commands") {
                pureHtml("<font size='4'><b>Commands</b></font><br/>Start with '~' or '-' along with the command name to use these:<br/>");
                printCommand("checktheme", "URL", "Checks the theme from <b>URL</b>. Safe scripts has to be off.");
                printCommand("roles", "URL", "For a preview of /roles from the theme at <b>URL</b>. Make sure the theme works. Safe scripts has to be off.");
                printCommand("summary", ["[URL]", "*", "{Type}"], "For a summary of a theme. Make sure the theme works. Safe scripts has to be off. Type can be 'html' or 'copyable'.");
                printCommand("eval", "code", "Evaluates <b>code</b>.");
                out("");
                return;
            }

            if (command == "checktheme") {
                if (isSafeScripts()) {
                    return;
                }

                checkTheme(commandData);
                return;
            }

            if (command == "roles") {
                if (isSafeScripts()) {
                    return;
                }

                displayThemeRoles(commandData);
                return;
            }

            if (command == "summary") {
                if (isSafeScripts()) {
                    return;
                }

                displayThemeSummary(commandData.split("*"));
                return;
            }

            if (command == "eval") {
                out("Result:");
                println(eval(commandData));
                return;
            }
        }
    },
})