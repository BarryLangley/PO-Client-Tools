/*jslint continue: true, es5: true, evil: true, forin: true, plusplus: true, sloppy: true, vars: true, regexp: true, newcap: true*/
/*global sys, script: true, Qt, print: true, client, gc, version*/

var scriptLoader,
    globalEval = this.eval,
    Global = this,
    Client = client,
    Network = Client.network(),
    printCopy = print;

(function () {
    // signals/slots stuff
    var announcement = "",
        loggedIn = false,
        serverName = "",
        playerInfo;
    
    var arraySlice = [].slice;

    Network.playerLogin.connect(function (info, tiers) {
        if (loggedIn) {
            return;
        }
        
        loggedIn = true;
        
        playerInfo = {id: info.id, name: info.name, info: info.info, auth: info.auth, flags: info.flags.data, avatar: info.avatar, color: info.color};
        
        if (!serverName) {
            serverName = Client.windowTitle;
        }
    });
    
    Network.serverNameReceived.connect(function (name) {
        if (serverName) {
            return;
        }
        
        serverName = name;
    });
    
    Network.announcement.connect(function (ann) {
        if (announcement) {
            return;
        }
        
        announcement = ann;
    });
    
    scriptLoader = {
        // Script to autoload.
        autoLoad: -1,
        
        // User-defined script folder.
        // 0 if loadMethod is manual-multi
        scriptFolder: -1,
        
        // Method used to load a script.
        // -1: No script has been loaded (yet).
        // manual: By @load or @autoload for the first time.
        // auto: By @autoload.
        // manual-multi: By @load or @autoload (for the first time), multiple scripts passed.
        // manual-auto: By @autoload, multiple scripts passed.
        loadMethod: -1,
        
        // Hooks added by attach.
        hooks: {},
        
        // Prints a scriptloader message.
        print: function (msg) {
            print("[ScriptLoader]: " + msg);
        },
        
        // Attaches a function to a script event.
        attach: function (event, func) {
            if (!scriptLoader.hooks[event]) {
                scriptLoader.hooks[event] = [];
            }
            
            scriptLoader.hooks[event].push(func);
        },
        
        // Calls an event's hooks.
        callHooks: function (evt, evtArgs) {
            var args = arraySlice.call(arguments, 1),
                shouldStopEvent = false,
                sysStopEvent = sys.stopEvent,
                len,
                i;
            
            sys.stopEvent = function () {
                shouldStopEvent = true;
            };
            
            if (scriptLoader.hooks[evt]) {
                for (i = 0, len = scriptLoader.hooks[evt].length; i < len; i += 1) {
                    try {
                        scriptLoader.hooks[evt][i].apply(script, args);
                    } catch (e) {
                        scriptLoader.print("Error in event hooks for '" + evt + "': " + e);
                    }
                }
            }
            
            sys.stopEvent = sysStopEvent;
            return shouldStopEvent;
        },
        
        // Creates a compatbility function.
        createCompatibilityFunction: function (name) {
            return function (a, b, c, d, e, f, g) {
                var args = arraySlice.call(arguments, 1);
            
                if (scriptLoader.callHooks(name, a, b, c, d, e, f, g)) {
                    sys.stopEvent();
                }
            };
        },
        
        // If there are scripts in that directory.
        doesScriptExist: function (scrDir) {
            return sys.dirsForDirectory(sys.scriptsFolder + scrDir) !== undefined;
        },
        
        // Loads a script.
        loadScript: function (dir, file) {
            var scriptResult,
                i;

            // Delete the old clientStartUp.
            if (script.clientStartUp && script.clientStartUp.isScriptLoader) {
                delete script.clientStartUp;
            }
            
            try {
                scriptResult = globalEval(sys.getFileContent(sys.scriptsFolder + dir + "/" + file));

                for (i in scriptResult) {
                    // Attach beforeSendMessage to keep the @... commands.
                    if (i === "beforeSendMessage") {
                        scriptLoader.attach(i, scriptResult[i]);
                    } else {
                        script[i] = scriptResult[i];
                    }
                }

                if (script.clientStartUp) {
                    script.clientStartUp();
                }
                
                scriptLoader.emitSignals();
    
                scriptLoader.print("Loaded " + dir + "/" + file + "!");
            } catch (e) {
                scriptLoader.print("Couldn't load " + dir + "/" + file + ": " + e + " on line " + e.lineNumber);
            }
            
            print = printCopy;
        },
        
        // Loads multiple scripts.
        // scripts is an array: [["dir", "file"], ["dir2", "file2"]]
        loadScripts: function (scripts) {
            var scriptResult,
                scr,
                len = scripts.length,
                i,
                j;

            if (len < 1) {
                return;
            }
            
            for (i = 0; i < len; i += 1) {
                scr = scripts[i];
                
                try {
                    scriptResult = globalEval(sys.getFileContent(sys.scriptsFolder + scr[0] + "/" + scr[1]));
    
                    for (j in scriptResult) {
                        scriptLoader.attach(j, scriptResult[j]);
                    }
        
                    scriptLoader.print("Loaded " + scr[0] + "/" + scr[1] + "!");
                } catch (e) {
                    scriptLoader.print("Couldn't load " + scr[0] + "/" + scr[1] + ": " + e + " on line " + e.lineNumber);
                }
            }
            
            if (script.clientStartUp) {
                script.clientStartUp(true);
            }
            
            scriptLoader.emitSignals();
            
            print = printCopy;
        },
        // Fix for scripts that use signals.
        emitSignals: function () {
            if (loggedIn) { // true is for a special argument 'ignore', that makes it way easier/possible to make this working.
                Network.playerLogin(playerInfo, Client.getTierList(), true);
            }

            if (serverName) {
                Network.serverNameReceived(serverName);
            }
            
            if (announcement) {
                Network.announcement(announcement);
            }
        },
        commands: {
            load: function (mcmd) {
                mcmd = mcmd.join(":").split(",");
                
                var scriptsToLoad = [],
                    len = mcmd.length,
                    scr,
                    i;
                
                if (len < 1) {
                    scriptLoader.print("Please specify the script's directory.");
                    return;
                }
                
                for (i = 0; i < len; i += 1) {
                    scr = mcmd[i].split(":");
                    
                    if (!scriptLoader.doesScriptExist(scr[0])) {
                        scriptLoader.print("Couldn't find '" + scr[0] + "'. Type @scripts for loadable scripts.");
                        continue;
                    }
                    
                    if (!scr[1]) {
                        scr[1] = "scripts.js";
                    }
                    
                    scriptsToLoad.push([scr[0], scr[1]]);
                    
                    scriptLoader.print("Loading " + scr[0] + "/" + scr[1] + ".");
    
                    if (len === 1) {
                        scriptLoader.loadScript(scr[0], scr[1]);
    
                        scriptLoader.scriptFolder = mcmd[0];
                        scriptLoader.loadMethod = "manual";
                    }
                }

                if (len !== 1) {
                    scriptLoader.loadScripts(scriptsToLoad);
                    scriptLoader.scriptFolder = 0;
                    scriptLoader.loadMethod = "manual-multi";
                }
            },
            autoload: function (mcmd, commandData) {
                mcmd = mcmd.join(":").split(",");
                
                var scriptsToLoad = [],
                    len = mcmd.length,
                    scr,
                    i;
                
                if (commandData === "|") {
                    scriptLoader.print("Autoload disabled.");
                    sys.saveVal("scriptLoader-AutoLoad", "|");
                    return;
                }
                
                if (len < 1) {
                    scriptLoader.print("Please specify the script's directory.");
                    return;
                }
                
                for (i = 0; i < len; i += 1) {
                    scr = mcmd[i].split(":");
                    
                    if (!scriptLoader.doesScriptExist(scr[0])) {
                        scriptLoader.print("Couldn't find '" + scr[0] + "'. Type @scripts for loadable scripts.");
                        continue;
                    }
                    
                    if (!scr[1]) {
                        scr[1] = "scripts.js";
                    }
                    
                    scriptsToLoad.push([scr[0], scr[1]]);
                    
                    scriptLoader.print("Auto-loading " + scr[0] + "/" + scr[1] + ".");
    
                    if (len === 1) {
                        scriptLoader.loadScript(scr[0], scr[1]);
    
                        scriptLoader.scriptFolder = mcmd[0];
                        scriptLoader.loadMethod = "manual";
                    }
                }

                if (len !== 1) {
                    scriptLoader.loadScripts(scriptsToLoad);
                    scriptLoader.scriptFolder = 0;
                    scriptLoader.loadMethod = "manual-multi";
                }
                
                sys.saveVal("scriptLoader-AutoLoad", scriptsToLoad.map(function (dir) {
                    return dir[0] + ":" + dir[1];
                }).join(","));
            },
            scripts: function () {
                var dirs = sys.dirsForDirectory(sys.scriptsFolder).filter(function (value, index, array) {
                    return value !== "." && value !== "..";
                });

                scriptLoader.print("Can load " + (dirs.length < 1 ? 'no scripts' : 'these scripts: ' + dirs.join(', ')) + ".");
            },
            install: function (mcmd) {
                if (sys.isSafeScripts()) {
                    scriptLoader.print("Safe scripts must be off.");
                    return;
                }
                
                if (scriptLoader.doesScriptExist(mcmd[0])) {
                    scriptLoader.print("Script " + mcmd[0] + " already exists; updating.");
                }
                
                mcmd[1] = [].concat(mcmd).slice(1).join(":");
                sys.webCall(mcmd[1], function (resp) {
                    if (resp === "") {
                        scriptLoader.print("Couldn't install script from " + mcmd[1] + ".");
                        return;
                    }
                    
                    sys.makeDir(sys.scriptsFolder + mcmd[0]);
                    sys.writeToFile(sys.scriptsFolder + mcmd[0] + "/" + "scripts.js", resp);
                    scriptLoader.print("Script " + mcmd[0] + " installed. Type @load " + mcmd[0] + " to load it.");
                });
            },
            help: function (mcmd) {
                print("");

                scriptLoader.print("Type @load <scriptDirectory>:[scriptName],etc..(to load multiple scripts) to load a script. scriptName is optional and is 'scripts.js' by default (so it's recommended that the directory has this file).");
                scriptLoader.print("Type @autoload (with the same arguments as @load) to automatically load one or multiple scripts.");
                scriptLoader.print("Type @install <scriptName>:<url> to download a script from a url and make it loadable.");
                scriptLoader.print("Type @scripts to display a list of scripts that can be loaded.");
                scriptLoader.print("Type @eval <script> to evaluate a script [for scripters].");
                scriptLoader.print("Type @help to display this message.");

                print("");

                scriptLoader.print("IMPORTANT: Add directories named after a script containing it's file(s) to " + sys.scriptsFolder + " (copy/paste that into Explorer/Finder/whatever you're using). If the script is raw text (for example, from a spoiler), then paste it into Notepad and save it to that folder you just created with the name \"scripts.js\" (copy/paste this into the file name input; including the quotes).");
                scriptLoader.print("You can always revert back to ScriptLoader by opening the Script Window and pressing Ok.");

                print("");
            },
            eval: function (mcmd) {
                var res;

                try {
                    res = globalEval(mcmd.join(':'));
                } catch (e) {
                    res = e;
                } finally {
                    print("Eval returned: " + res);
                }
            }
        }
    };
}());

script = ({
    clientStartUp: function (hooksOnly) {
        var scriptsToLoad,
            len;
        
        if (hooksOnly) {
            scriptLoader.callHooks("clientStartUp");
            return;
        }
        
        script.clientStartUp.isScriptLoader = true;
        
        if (sys.getVal("scriptLoader-AutoLoad") === "") {
            sys.saveVal("scriptLoader-AutoLoad", "|");
        }

        scriptLoader.autoLoad = sys.getVal("scriptLoader-AutoLoad");

        if (scriptLoader.autoLoad === "|") {
            scriptLoader.autoLoad = -1;
        } else {
            scriptsToLoad = scriptLoader.autoLoad.split(",");
            len = scriptsToLoad.length;
            
            if (len < 1) {
                scriptLoader.print("Type @help for help.");
                return;
            } else if (len === 1) {
                scriptsToLoad[0] = scriptsToLoad[0].split(":");
                
                scriptLoader.loadScript(scriptsToLoad[0][0], scriptsToLoad[0][1]);
                scriptLoader.loadMethod = "auto";
            } else {
                scriptLoader.loadScripts(scriptsToLoad);
                scriptLoader.loadMethod = "auto-multi";
            }
        }

        scriptLoader.print("Type @help for help.");
    },
    beforeSendMessage: function (message, channel) {
        // Give ScriptLoader priority over hooks.
        if (message.charAt(0) === "@" && message.length > 1) {
            var commandData = "",
                mcmd = [""],
                pos = message.indexOf(' '),
                command;

            if (pos !== -1) {
                command = message.substring(1, pos).toLowerCase();

                commandData = message.substr(pos + 1);
                mcmd = commandData.split(':');
            } else {
                command = message.substring(1).toLowerCase();
            }

            if (scriptLoader.commands.hasOwnProperty(command)) {
                try {
                    scriptLoader.commands[command](mcmd, commandData);
                } catch (e) {
                    scriptLoader.print("The command " + command + " could not be used because of an error: " + e + " on line " + e.lineNumber);
                }
                sys.stopEvent();
            } else {
                scriptLoader.print("Command " + command + " not found. Valid commands are: " + Object.keys(scriptLoader.commands).join(', '));
            }
        }
        
        if (scriptLoader.callHooks("beforeSendMessage", message, channel)) {
            sys.stopEvent();
        }
    },
    // Any events after this are just for scriptLoader multiload compatibility.
    stepEvent: scriptLoader.createCompatibilityFunction("stepEvent"),
    clientShutDown: scriptLoader.createCompatibilityFunction("clientShutDown"),
    onPlayerReceived: scriptLoader.createCompatibilityFunction("onPlayerReceived"),
    onPlayerRemoved: scriptLoader.createCompatibilityFunction("onPlayerRemoved"),
    onPlayerJoinChan: scriptLoader.createCompatibilityFunction("onPlayerJoinChan"),
    onPlayerLeaveChan: scriptLoader.createCompatibilityFunction("onPlayerLeaveChan"),
    afterSendMessage: scriptLoader.createCompatibilityFunction("afterSendMessage"),
    beforeChannelMessage: scriptLoader.createCompatibilityFunction("beforeChannelMessage"),
    afterChannelMessage: scriptLoader.createCompatibilityFunction("afterChannelMessage"),
    beforeNewMessage: scriptLoader.createCompatibilityFunction("beforeNewMessage"),
    afterNewMessage: scriptLoader.createCompatibilityFunction("afterNewMessage"),
    beforePMReceived: scriptLoader.createCompatibilityFunction("beforePMReceived"),
    afterPMReceived: scriptLoader.createCompatibilityFunction("afterPMReceived"),
    beforeChallengeReceived: scriptLoader.createCompatibilityFunction("beforeChallengeReceived"),
    afterChallengeReceived: scriptLoader.createCompatibilityFunction("afterChallengeReceived")
});
