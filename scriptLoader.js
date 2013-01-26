disableAutoLoad = "no"; // yes = turns autoload off (you should do '@autoload |' to then fully disable it), no = turns autoload on (default)

// Don't touch anything beyond this point!

var global = this;

scriptLoader = {
    autoLoad: -1,
    scriptFolder: -1,
    loadMethod: -1,
    print: function (msg) {
        print("[ScriptLoader]: " + msg);
    },
    loadScr: function (scrFolder, scrFile) {
        var res,
            x;

        // the easter egg has something to do with the @help command!?!?
        try {
            res = global.eval(sys.getFileContent(sys.scriptsFolder + scrFolder + "/" + scrFile));
                
            for (x in res) {
                script[x] = res[x];
            }
            
            if (script.clientStartUp) {
                script.clientStartUp();
            }
        } catch (e) {
            scriptLoader.print("Couldn't load " + scrFolder + "/" + scrFile + ": " + e + " on line " + e.lineNumber);
        }
    },
    doesScriptExist: function (scrDir) {
        return sys.dirsForDirectory(sys.scriptsFolder + scrDir) === undefined;
    },
    commands: {
        load: function (mcmd) {
            if (mcmd[0] === "") {
                scriptLoader.print("Please specify the script's directory.");
                return;
            }
            if (!scriptLoader.doesScriptExist(mcmd[0])) {
                scriptLoader.print("Couldn't find '" + mcmd[0] + "'. Type @scripts for loadable scripts.");
                return;
            }
            
            if (mcmd.length === 1) {
                mcmd[1] = 'scripts.js';
            }
            
            scriptLoader.print("Loading " + mcmd[0] + "/" + mcmd[1] + ".");
            scriptLoader.loadScr(mcmd[0], mcmd[1]);

            scriptLoader.scriptFolder = mcmd[0];
            scriptLoader.loadMethod = "manual";
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
        help: function (mcmd) {
            var rand;
            
            if (mcmd[0] === "easter-egg") {
                rand = Math.random().toFixed(2);
                
                scriptLoader.print("Did you know ScriptLoader is smart? It knows that " + rand + " × 2000 is " + rand * 2000 + "!");
            }
            
            print("");
            
            scriptLoader.print("Type @load <scriptDirectory>:[scriptName] to load a script. scriptName is optional and is 'scripts.js' by default (so it's recommended that the directory has this file).");
            scriptLoader.print("Type @autoload (with the same arguments as @load) to automatically load that script.");
            scriptLoader.print("Type @scripts to display a list of scripts that can be loaded.");
            scriptLoader.print("Type @eval <scr" + "ipt> to evaluate a script [for scripters].");
            scriptLoader.print("Type @help to display this message.");
            
            print("");

            scriptLoader.print("IMPORTANT: Add directories named after a script containing it's file(s) to " + sys.scriptsFolder + " (copy/paste that into Explorer/Finder/whatever you're using). If the script is raw text (for example, from a spoiler), then paste it into Notepad and save it to that folder you just created with the name \"scripts.js\" (copy/paste this into the file name input).");
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
                print("Eval returned: " + e);
            }
        }
    }
};

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
