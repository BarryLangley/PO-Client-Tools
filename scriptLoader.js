var scriptLoader, disableAutoLoad; // don't modify this line!

(function () { // don't modify this line!
    disableAutoLoad = "no"; // <--- Only modify this line
    // yes = turns autoload off (you should do '@autoload |' to then fully disable it), no = turns autoload on (default)

// Don't touch anything beyond this point!

    var global = this,
        net = client.network(),
        announcement = "",
        loggedIn = false,
        serverName = "",
        playerLoginArgs;

    net.playerLogin.connect(function (info, lists) {
        loggedIn = true;

        playerLoginArgs = {id: info.id, name: info.name, info: info.info, auth: info.auth, flags: info.flags.data, avatar: info.avatar, color: info.color};
    });
    
    net.serverNameReceived.connect(function (name) {
        serverName = name;
    });
    
    net.announcement.connect(function (ann) {
        announcement = ann;
    });
    
    scriptLoader = {
        autoLoad: -1, // script to autoload
        scriptFolder: -1, // user-defined script folder. 0 if loadMethod is manual-multi.
        loadMethod: -1, // -1: no script has been loaded; manual: @load, @autoload called manually; auto: @autoload; manual-multi: @load w/ multiple scripts.
        loginHandlers: [], // replacement for client.network().playerLogin.connect until it's fixed. please push your slot to this array if you use it.
        print: function (msg) {
            print("[ScriptLoader]: " + msg);
        },
        attach: function (event, newFunc, before) {
            var old = script[event],
                slice = [].slice;

            if (!old) {
                old = function () {};
            }
            
            if (before) {
                script[event] = function () {
                    newFunc.apply(null, slice(arguments));
                    old.apply(null, slice(arguments));
                };
            } else {
                script[event] = function () {
                    old.apply(null, slice(arguments));
                    newFunc.apply(null, slice(arguments));
                };
            }
        },
        doesScriptExist: function (scrDir) {
            return sys.dirsForDirectory(sys.scriptsFolder + scrDir) !== undefined;
        },
        loadScr: function (scrFolder, scrFile) {
            var res,
                x;

            // the easter egg has something to do with the @help command!?!?
            try {
                res = global.eval(sys.getFileContent(sys.scriptsFolder + scrFolder + "/" + scrFile));

                delete script.clientStartUp;
                //script = {};

                for (x in res) {
                    script[x] = res[x];
                }

                if (script.clientStartUp) {
                    script.clientStartUp();
                }
            } catch (e) {
                scriptLoader.print("Couldn't load " + scrFolder + "/" + scrFile + ": " + e + " on line " + e.lineNumber);
            }

            scriptLoader.emitSignals();

            scriptLoader.print("Loaded " + scrFolder + "/" + scrFile + "!");
        },
        loadScrMulti: function (scrArr) {
            var res,
                x,
                i = 0,
                len = scrArr.length,
                oldScript = script,
                scr;

            if (len < 1) {
                return;
            }

            delete script.clientStartUp;
            //script = {};

            for (; i < len; ++i) {
                scr = scrArr[i];
                try {
                    res = global.eval(sys.getFileContent(sys.scriptsFolder + scr[0] + "/" + scr[1]));

                    for (x in res) {
                        scriptLoader.attach(x, res[x]);
                    }
                } catch (e) {
                    if (oldScript) {
                        script = oldScript;
                    }

                    oldScript = null;

                    scriptLoader.print("Couldn't load " + scrFolder + "/" + scrFile + ": " + e + " on line " + e.lineNumber);
                }
            }

            if (script.clientStartUp) {
                script.clientStartUp();
            }

            scriptLoader.emitSignals();
        },
        emitSignals: function () { // fixes scripts that use signals
            var net = client.network(); // there might be others that need to be emitted...

            //if (loggedIn) { // PO is broken :[
            //net.playerLogin(/*{}*/playerLoginArgs, client.getTierList());
            //}

            // instead using scriptLoader.loginHandlers.. Hoping people will use this
            scriptLoader.loginHandlers.forEach(function (value, index, array) {
                value(playerLoginArgs, sys.getTierList(), 1); // return 1 as 3rd argument to indicate that it was called by ScriptLoader
            });

            scriptLoader.loginHandlers = [];

            net.serverNameReceived(serverName);
            net.announcement(announcement);

        },
        commands: {
            load: function (mcmd) {
                var x = 0,
                    len,
                    scr,
                    scriptsToLoad = [];

                mcmd = mcmd.join(":").split(',');

                if (!mcmd[0] || mcmd[0] === "") {
                    scriptLoader.print("Please specify the script(s)'(s) directory(ies).");
                    return;
                }

                len = mcmd.length;

                // too lazy to merge these..

                if (len === 1) {
                    mcmd[0] = mcmd[0].split(":");

                    if (!scriptLoader.doesScriptExist(mcmd[0])) {
                        scriptLoader.print("Couldn't find '" + mcmd[0] + "'. Type @scripts for loadable scripts.");
                        return;
                    }

                    if (mcmd[0].length === 1) {
                        mcmd[1] = 'scripts.js';
                    }

                    scriptLoader.print("Loading " + mcmd[0] + "/" + mcmd[1] + ".");
                    scriptLoader.loadScr(mcmd[0], mcmd[1]);

                    scriptLoader.scriptFolder = mcmd[0];
                    scriptLoader.loadMethod = "manual";
                } else {
                    for (; x < len; ++x) {
                        scr = mcmd[x].split(":");

                        if (!scriptLoader.doesScriptExist(scr[0])) {
                            scriptLoader.print("Couldn't find '" + scr[0] + "'. Type @scripts for loadable scripts.");
                            continue;
                        }

                        if (scr.length === 1) {
                            scr[1] = 'scripts.js';
                        }

                        scriptLoader.print("Loading " + scr[0] + "/" + scr[1] + ".");
                        scriptsToLoad.push(scr);

                        scriptLoader.scriptFolder = 0;
                        scriptLoader.loadMethod = "manual-multi";
                    }
                    
                    scriptLoader.loadScrMulti(scriptsToLoad);
                }
            },
            autoload: function (mcmd) {
                if (mcmd[0] === "") {
                    scriptLoader.print("Please specify the script's directory.");
                    return;
                }
                if (mcmd[0] === "|") {
                    scriptLoader.print("Autoload disabled.");
                    sys.saveVal("scriptLoader-AutoLoad", "|");
                    return;
                }
                if (!scriptLoader.doesScriptExist(mcmd[0])) {
                    scriptLoader.print("Couldn't find '" + mcmd[0] + "'. Type @scripts for loadable scripts.");
                    return;
                }

                if (mcmd.length === 1) {
                    mcmd[1] = 'scripts.js';
                }

                scriptLoader.print("Auto-loading " + mcmd[0] + "/" + mcmd[1] + ".");
                sys.saveVal("scriptLoader-AutoLoad", mcmd.join(':'));

                scriptLoader.loadScr(mcmd[0], mcmd[1]);

                scriptLoader.scriptFolder = mcmd[0];
                scriptLoader.loadMethod = "manual";
            },
            scripts: function () {
                var dirs = sys.dirsForDirectory(sys.scriptsFolder).filter(function (value, index, array) {
                    return value !== "." && value !== "..";
                });

                scriptLoader.print("Can load " + (dirs.length < 1 ? 'no scripts' : 'these scripts: ' + dirs.join(', ')) + ".");
            },
            install: function (mcmd) {
                return; // borked
                
                if (scriptLoader.doesScriptExist(mcmd[0])) {
                    scriptLoader.print("Script " + mcmd[0] + " already exists; updating.");
                }
                
                mcmd[1] = [].concat(mcmd).slice(1).join(":");
                sys.webCall(mcmd[1], function (resp) {
                    if (resp === "")  {
                        scriptLoader.print("Couldn't install script from " + mcmd[1] + ".");
                        return;
                    }
                    
                    sys.makeDir(sys.scriptsFolder + mcmd[0]);
                    sys.writeToFile(sys.scriptsFolder + mcmd[0] + "/" + "scripts.js", resp);
                    scriptLoader.print("Script " + mcmd[0] + " installed. Type @load " + mcmd[0] + " to load it.");
                });
            },
            help: function (mcmd) {
                var rand;

                if (mcmd[0] === "easter-egg") {
                    rand = Math.random().toFixed(2);

                    scriptLoader.print("Did you know that ScriptLoader is smart? It knows that " + rand + " × 2000 is " + rand * 2000 + "!");
                }

                print("");

                scriptLoader.print("Type @load <scriptDirectory>:[scriptName],etc..(to load multiple scripts) to load a script. scriptName is optional and is 'scripts.js' by default (so it's recommended that the directory has this file).");
                scriptLoader.print("Type @autoload (with the same arguments as @load) to automatically load that script.");
                //scriptLoader.print("Type @install <scriptName>:<url> to download a script from a url and make it loadable.");
                scriptLoader.print("Type @scripts to display a list of scripts that can be loaded.");
                scriptLoader.print("Type @eval <scr" + "ipt> to evaluate a script [for scripters].");
                scriptLoader.print("Type @help to display this message.");

                print("");

                scriptLoader.print("IMPORTANT: Add directories named after a script containing it's file(s) to " + sys.scriptsFolder + " (copy/paste that into Explorer/Finder/whatever you're using). If the script is raw text (for example, from a spoiler), then paste it into Notepad and save it to that folder you just created with the name \"scripts.js\" (copy/paste this into the file name input; including the quotes).");
                scriptLoader.print("You can always revert back to ScriptLoader by opening the Script Window and pressing Ok.");
                scriptLoader.print("Edit the script's first line (disableAutoLoad) to enable/disable autoload after you have specified a script to autoload (you should do '@autoload |' afterwards to make it work again when you change the first line back to 'no').");

                print("");
            },
            eval: function (mcmd) {
                var res;

                try {
                    res = global.eval(mcmd.join(':'));
                } catch (e) {
                    res = e;
                } finally {
                    print("Eval returned: " + res);
                }
            }
        }
    };
})();

script = ({
    clientStartUp: function () {
        if (sys.getVal("scriptLoader-AutoLoad") === "") {
            sys.saveVal("scriptLoader-AutoLoad", "|");
        }

        scriptLoader.autoLoad = sys.getVal("scriptLoader-AutoLoad");

        if (disableAutoLoad === "no") {
            if (scriptLoader.autoLoad === "|") {
                scriptLoader.autoLoad = -1;
            } else {
                try {
                    if (scriptLoader.autoLoad.indexOf(":") !== -1) {
                        scriptLoader.loadScr.apply(null, scriptLoader.autoLoad.split(":"));
                    } else {
                        scriptLoader.loadScr(scriptLoader.autoLoad, "scripts.js");
                    }
                } catch (e) {
                    scriptLoader.print("Could not auto-load '" + scriptLoader.autoLoad.split(":").join("/") + "': " + e);
                }
            }

            scriptLoader.loadMethod = "auto";
        }

        scriptLoader.print("Type @help for help.");
    },
    beforeSendMessage: function (message, channel) {
        if (message.charAt(0) === "@" && message.length > 1) {
            var commandData = "",
                mcmd = [""],
                pos = message.indexOf(' '),
                command;

            if (pos != -1) {
                command = message.substring(1, pos).toLowerCase();

                commandData = message.substr(pos + 1);
                mcmd = commandData.split(':');
            }
            else {
                command = message.substring(1).toLowerCase();
            }

            if (scriptLoader.commands.hasOwnProperty(command)) {
                try {
                    scriptLoader.commands[command](mcmd);
                } catch (e) {
                    scriptLoader.print("The command " + command + " could not be used because of an error: " + e + " on line " + e.lineNumber);
                }
                sys.stopEvent();
            } else {
                scriptLoader.print("Command " + command + " not found. Valid commands are: " + Object.keys(scriptLoader.commands).join(', '));
            }
        }
    }
})
