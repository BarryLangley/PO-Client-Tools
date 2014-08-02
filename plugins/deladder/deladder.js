(function() {
  var deladderFBDone, deladderFindBattle, deladderscript;
  deladderFBDone = false;
  deladderFindBattle = function() {
    deladderFBDone = true;
    return Client.findBattle(confetti.cache.get('deladderfb'));
  };
  Network.battleFinished.connect(function(battleid, desc, id1, id2) {
    var myid;
    if (confetti.cache.get('deladder') === true && deladderFBDone === true) {
      myid = Client.ownId();
      if (id1 === myid || id2 === myid) {
        return sys.setTimer(function() {
          return deladderFindBattle();
        }, 1000, false);
      }
    }
  });
  deladderscript = "({\n    onTierNotification: function () {\n        var deladder = JSON.parse(sys.getFileContent(sys.scriptsFolder + 'confetti.json')).deladder;\n        if (deladder) {\n            battle.forfeit();\n        }\n    }\n})";
  confetti.command('deladder', "Toggles whether if deladdering should be enabled.", function() {
    var deladdering;
    deladdering = !confetti.cache.read('deladder');
    confetti.cache.store('deladder', deladdering).save();
    confetti.msg.bot("Deladdering is now " + (deladdering ? 'enabled. If you haven\'t already, read the <a href=\'po:send/-deladderhelp\'>deladder help</a> first, else it won\'t work' : 'disabled') + ".");
    if (!deladdering) {
      return deladderFBDone = false;
    }
  });
  confetti.command('deladderfindbattle', "Finds a battle using the deladder battle finder. Initiates deladdering.", function() {
    if (confetti.cache.get('deladder') === false) {
      confetti.msg.bot("First enable deladdering.");
      return;
    }
    confetti.msg.bot("Starting deladdering.");
    return deladderFindBattle();
  });
  confetti.alias('deladderfb', 'deladderfindbattle');
  confetti.command('deladderhelp', "Shows help with setting up and configuring deladdering.", function(_, chan) {
    var cin;
    cin = confetti.cache.get('commandindicator');
    confetti.msg.bot("Deladdering is the opposite of laddering - instead of achieving to be the top you strive to reach the bottom. In order to start deladdering, you will first have to set up a short battle script.");
    confetti.msg.bot("In order to do so, <a href='po:send/-deladdersetup'>use the " + cin + "deladdersetup command</a> and <font size=4><b>restart your client</b></font>.");
    confetti.msg.bot("After you've done that, <a href='po:send/-deladderfindbattle'>find a battle using the deladder battle finder</a>. Your first team will be the one used to look for battles. To configurate deladdering, look below:");
    confetti.msg.html("", chan);
    confetti.msg.bot("Deladdering Options:");
    confetti.msg.html("<a href='po:send/-deladderranged'>" + cin + "deladderranged</a>: Toggles whether if the deladder battle finder will look for players in a rating range. Currently " + (confetti.cache.get('deladderfb').ranged === true ? 'enabled' : 'disabled') + ".");
    confetti.msg.html("<a href='po:setmsg/-deladderrange range'>" + cin + "deladderrange</a>: Sets your deladder range to some number. The deladder battle finder will look for players in that range from your current ladder rating (you can use this to fight other deladderers). Deladder range has to be enabled first (see above). Currently " + (confetti.cache.get('deladderfb').range) + ".");
    confetti.msg.html("", chan);
    confetti.msg.bot("To stop deladdering, disable it (see below). If you wish to stop temporarly, click on Cancel Find Battle. You can find a battle later, using the deladder battle finder (see above).");
    return confetti.msg.bot("You currently have deladdering " + (confetti.cache.get('deladder') ? 'enabled' : 'disabled') + ". Toggle it with the <a href='po:send/-deladder'>" + cin + "<b>deladder</b></a> command.");
  });
  confetti.command('deladdersetup', "Sets up the deladder battle script. You should only have to do this once (unless of course you change your battle script). This will overwrite your current battle script. Restart your client after using this command.", function() {
    confetti.io.writeLocal("battlescripts.js", deladderscript);
    return confetti.msg.bot("Done. Restart your client to see the effects. You can deladder afterwards.");
  });
  confetti.command('deladderranged', "Toggles whether if the deladder battle finder should look for players in a range (around your current rating).", function() {
    var deladderfb;
    deladderfb = confetti.cache.get('deladderfb');
    deladderfb.ranged = !deladderfb.ranged;
    confetti.cache.store('deladderfb', deladderfb).save();
    return confetti.msg.bot("The deladder battle finder " + (deladdering ? 'will look for players in a range around your rating' : 'will no longer look for players in a range around your rating') + ".");
  });
  confetti.command('deladderrange', {
    help: "Changes the range in which the deladder battle finder will look for players. To enable/disable this, use the deladderranged command.",
    args: ["range"]
  }, function(data) {
    var deladderfb, num;
    num = parseInt(data, 10);
    if (isNaN(num)) {
      confetti.msg.bot("Specify a number.");
      return;
    }
    num = Math.abs(num);
    deladderfb = confetti.cache.get('deladderfb');
    deladderfb.range = num;
    confetti.cache.store('deladderfb', deladderfb).save();
    return confetti.msg.bot("The deladder battle finder will look for players in a range of " + num + " around your rating");
  });
  confetti.command('deladdercommands', "Shows commands related to deladdering.", function() {
    return confetti.cmdlist("Deladdering", 'deladder deladderfindbattle deladderhelp deladdersetup deladderranged deladderrange', 'deladder');
  });
  confetti.hook('commands:list', function(template) {
    return template.cmd('deladdercommands');
  });
  return confetti.initFields({
    deladder: false,
    deladderfb: {
      rated: true,
      sameTier: true,
      ranged: false,
      range: 1000,
      teams: 1
    }
  });
})();
