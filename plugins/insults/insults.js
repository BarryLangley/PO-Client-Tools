(function() {
  var getInsult, insult, insultList, insultp, insultpm, insultsLoaded, intellisult, updateInsults;
  intellisult = function(name) {
    var a, b, c, d, e, f, insult, random;
    if (name == null) {
      name = '';
    }
    random = function(container, check) {
      var len, str;
      len = container.length;
      str = container[Math.floor(Math.random() * len)];
      while (str === intellisult[check]) {
        str = container[Math.floor(Math.random() * len)];
      }
      intellisult[check] = str;
      return str;
    };
    a = random(intellisult.config.A, 'a');
    b = random(intellisult.config.B, 'b');
    c = random(intellisult.config.C, 'c');
    d = random(intellisult.config.D, 'd');
    e = random(intellisult.config.E, 'e');
    f = random(intellisult.config.F, 'f');
    insult = '';
    if (name.trim() !== '') {
      insult = "" + name + " is " + a + " " + b + " " + c + " and a " + d + " " + e + " " + f + ".";
    }
    return insult;
  };
  intellisult.a = intellisult.b = intellisult.c = intellisult.d = intellisult.e = intellisult.f = '';
  intellisult.config = {
    names: [],
    A: ['a confoundedly', 'a conspicuously', 'a cruelly', 'a deucedly', 'a devilishly', 'a dreadfully', 'a frightfully', 'a grievously', 'a lamentably', 'a miserably', 'a monstrously', 'a piteously', 'a precociously', 'a preposterously', 'a shockingly', 'a sickly', 'a wickedly', 'a woefully', 'an abominably', 'an egregiously', 'an incalculably', 'an indescribably', 'an ineffably', 'an irredeemably', 'an outrageously', 'an unconscionably', 'an unequivocally', 'an unutterably'],
    B: ['appalling', 'babbling', 'backward', 'bantering', 'blabbering', 'blighted', 'boorish', 'contemptible', 'corpulent', 'cretinous', 'debauched', 'decadent', 'demented', 'depraved', 'detestable', 'dissolute', 'execrable', 'fiendish', 'foolish', 'foul', 'gluttonous', 'grotesque', 'gruesome', 'hermaphroditic', 'hideous', 'ignominious', 'ignorant', 'ill-bred', 'ill-mannered', 'incompetent', 'incorrigible', 'indecent', 'inept', 'insignificant', 'insufferable', 'insufferable', 'lascivious', 'lecherous', 'licentious', 'loathsome', 'maladjusted', 'malignant', 'minuscule', 'miserable', 'myopic', 'naive', 'narcissistic', 'nonintuitive', 'obese', 'obtuse', 'offensive', 'parasitic', 'pedestrian', 'perverted', 'petty', 'primitive', 'promiscuous', 'reprehensible', 'repugnant', 'repulsive', 'revolting', 'salacious', 'subliterate', 'sybaritic', 'uncivilized', 'uncouth', 'unseemly', 'unsightly', 'vile', 'vulgar', 'witless'],
    C: ['barbarian', 'cannibal', 'coccydynia', 'cretin', 'degenerate', 'delinquent', 'derelict', 'dingleberry', 'dolt', 'dullard', 'dunce', 'fiend', 'filcher', 'glutton', 'half-wit', 'heathen', 'hemorrhoid', 'idiot', 'ignoramus', 'imbecile', 'lackey', 'lecher', 'libertine', 'loafer', 'lout', 'malefactor', 'menace', 'microphallus', 'miscreant', 'misdemeanant', 'moron', 'narcissist', 'neanderthal', 'nincompoop', 'ninny', 'nose picker', 'oaf', 'onanist', 'parasite', 'peon', 'pervert', 'pick pocket', 'plebeian', 'polisson', 'prostitute', 'rapscallion', 'reprobate', 'reprobate', 'reptile', 'rogue', 'ruffian', 'scoundrel', 'simpleton', 'slattern', 'sphincter', 'subhuman', 'swine', 'sycophant', 'sycophant', 'troglodyte', 'trollop', 'twit', 'varmint', 'vermin', 'wretch'],
    D: ['belligerent', 'catatonic', 'corrupt', 'dastardly', 'debased', 'debauched', 'decadent', 'decrepit', 'degenerate', 'demented', 'deplorable', 'depraved', 'disgusting', 'fecal', 'feculent', 'fiendish', 'flaccid', 'flagitious', 'flagrant', 'frightful', 'gaudy', 'glaring', 'gluttonous', 'gross', 'grotesque', 'heinous', 'hopeless', 'horribly atrocious', 'infamous', 'loathsome', 'ludicrous', 'maladjusted', 'malingering', 'malingering', 'malodorous', 'maniacal', 'maniacal', 'masturbatory', 'miscreant', 'miserable', 'monstrous', 'myopic', 'myopic', 'naive', 'narcissistic', 'narcissistic', 'nefarious', 'nefarious', 'outrageous', 'perverse', 'perverted', 'petty', 'preposterous', 'preposterous', 'primitive', 'primitive', 'putrid', 'putrid', 'rank', 'reprehensible', 'repugnant', 'revolting', 'rotten', 'vacuous', 'vapid', 'villainous', 'wearisome'],
    E: ['acidly acrimonious', 'air-polluting', 'all-befouling', 'all-defiling', 'armpit-licking', 'blood-curdling', 'blood-freezing', 'bug-eyed', 'buttock-rimming', 'cantankerously-caterwauling', 'chromosome deficient', 'chronically flatulent', 'cold-hearted', 'coma-inducing', 'congenitally clueless', 'dandruff-eating', 'disease-ridden', 'dull-witted', 'enema-addicted', 'feces-collecting', 'feeble-minded', 'flea-infested', 'flesh-creeping', 'foul-smelling', 'gossip-mongering', 'grudge-festering', 'halitosis-infested', 'heart-sickening', 'Internet-addicted', 'irredeemably boring', 'maliciously malodorous', 'mattress-soiling', 'monotonous solitaire playing', 'mucous-eating', 'nose-picking', 'nostril-offending', 'odiously suffocating', 'one dimensional', 'orgasm faking', 'scruffy-looking', 'sheep-molesting', 'simple-minded', 'small-minded', 'snake-eyed', 'sock-sucking', 'soul-destroying', 'stench-emitting', 'thick-headed', 'toe-sucking', 'urine-reeking'],
    F: ['aberration of nature', 'abomination of humanity', 'abomination to all the senses', 'abomination to all the senses', 'acrid smog of oppressively caustic oral effluvium', 'amalgamation of loathsome repulsiveness', 'arbitrary dereliction of genetics', 'assault on the ocular senses', 'blight upon society', 'buggering buttock bandit', 'cacophonous catastrophe', 'cesspool of putrid effluvium', 'cesspool of sub-human filth', 'cheap Internet loiterer', 'chromosome-deficient test tube experiment', 'conglomerate of intellectual constipation', 'conglomerate of intellectual constipation', 'delinquent who has delusions of adequacy', 'deplorable calamity of birth', 'depraved orgy of subhuman indecency', 'depravity of genetics', 'display of indecency', 'dreg of the Internet', 'derelict whose birth certificate is an apology from the condom factory', 'derelict whose birth certificate is an apology from the condom factory', 'evangelical crusader of sub-mediocrity', 'evangelical crusader of sub-mediocrity', 'excrement stain on a Sumo Wrestler\'s underpants', 'glob of grease', 'grotesque visual experience', 'grudge-festering haggard', 'gruesome vista to all eyes assaulted by the sight of you', 'hysterical mass of warbling inanity', 'lamentable mistake by your parent\'s reckless exchange of genetic material', 'leach on humanity', 'malfunctioning little twerp', 'malodorous heathen', 'malodorous marinade of sweat and fear', 'manifestation of contraceptive personality', 'mass of existential impotence', 'mass of loathsome repulsiveness', 'mass of neuroses and complexes', 'mass of neuroses and pathologies', 'mass of neuroses and pathologies', 'mean-spirited poltroon', 'mediocrity afflicted with mental retardation', 'menace to, not only society, but all living creatures', 'mental midget with the natural grace of an intoxicated beluga whale', 'molester of small furry animals', 'molester of small old men', 'moving stench of leprosy', 'mutilation of decency', 'nauseating assault on the senses', 'nauseating assault on the senses', 'nefarious vermin', 'obfuscation of all that is good', 'object of execration', 'ocular depravity to all of discrimination', 'odious leach-covered blob of quivering slime', 'odious leach-covered glob of quivering slime', 'offense to all of good taste and decency', 'oppressive orgy of perversion', 'orgy of indecency', 'orgy of indignity', 'parasite on the states resources', 'personification of vulgarity', 'piece of excrement attached to a dogs posterior', 'pitiful sideshow freak', 'plague of sighing and grief', 'plague upon humanity', 'plot-less melodrama of uneventful life', 'plot-less melodrama of uneventful life', 'practitioner of bestiality', 'proof that evolution can go in reverse', 'proof that test tube experiments can go horribly wrong', 'pulp of stultifying inanity', 'putrid waste of flesh', 'repulsive polisson', 'sadistic hippophilic necrophile', 'scourge of decency', 'sexual assaulter of barnyard animals', 'shameless exhibition of genetic deficiency', 'shameless exhibition of genetic deficiency', 'sideshow freak whose word is as valuable as an aging cow paddy', 'spawn from a lunatics rectum', 'spawn of a mad scientist and a disastrous test tube experiment', 'sub-literate simple minded mental midget', 'tainted spawn of a syphilitic swamp rat', 'tainted spawn of a syphilitic swamp hog', 'tasteless amalgam of dross', 'toll on the nerves of those with good taste and decency', 'unfortunate occurrence of unprotected intercourse', 'unspeakably offensive barbarian', 'vulgarity to all and sundry', 'wretched horror to all who encounter you']
  };
  insultsLoaded = false;
  insultList = [];
  updateInsults = function(cb) {
    return sys.webCall('https://theunknownone.github.io/Insults/src/insults.txt', function(req) {
      var ex, insult, insults;
      try {
        insults = req.split('\n');
        if (insults[insults.length - 1] === '') {
          insults = insults.slice(0, -1);
        }
      } catch (_error) {
        ex = _error;
        return confetti.msg.bot("Failed to load insults, check your internet connection.");
      }
      if (confetti.cache.get('shortinsults') === true) {
        insults = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = insults.length; _i < _len; _i++) {
            insult = insults[_i];
            if (insult.length < 150) {
              _results.push(insult);
            }
          }
          return _results;
        })();
      } else if (confetti.cache.get('longinsults') === false) {
        insults = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = insults.length; _i < _len; _i++) {
            insult = insults[_i];
            if (insult.length < 400) {
              _results.push(insult);
            }
          }
          return _results;
        })();
      }
      insultList = insults;
      insultsLoaded = true;
      if (cb != null) {
        return cb();
      }
    });
  };
  getInsult = function(target) {
    return confetti.util.random(insultList).replace(/\{name\}/g, target.toLowerCase()).replace(/\{Name\}/g, target).replace(/\{NAME\}/g, target.toUpperCase());
  };
  insult = function(data, chan) {
    var msg, target;
    if (!data) {
      return confetti.msg.bot("Specify a target!");
    }
    if (!insultsLoaded) {
      updateInsults(function() {
        return insult(data, chan);
      });
      return;
    }
    target = confetti.player.name(data).trim();
    msg = getInsult(target);
    return confetti.msg.notify(msg, chan);
  };
  insultpm = function(data) {
    var id, msg, target;
    id = Client.id(data);
    if (!data || id === -1) {
      return confetti.msg.bot("Specify a target!");
    }
    if (!insultsLoaded) {
      updateInsults(function() {
        return insultpm(data);
      });
      return;
    }
    target = confetti.player.name(data).trim();
    msg = getInsult(target);
    confetti.msg.pm(id, msg);
    return confetti.msg.bot("Insult: <a href=\"po:setmsg/" + msg + "\"><b>" + msg + "</b></a> <small>(click to copy to line edit)</small>");
  };
  insultp = function(data, chan) {
    var msg, target;
    if (!data) {
      return confetti.msg.bot("Specify a target!");
    }
    if (!insultsLoaded) {
      updateInsults(function() {
        return insultp(data, chan);
      });
      return;
    }
    target = confetti.player.name(data).trim();
    msg = getInsult(target);
    return confetti.msg.html("<a href=\"po:setmsg/" + msg + "\"><b>" + msg + "</b></a> <small>(click to copy to line edit)</small>", chan);
  };
  confetti.updateInsults = updateInsults;
  confetti.command('insult', ['insult [name]', 'Insults the given target for the greater good of mankind.', 'setmsg@insult [name]'], insult);
  confetti.command('insultp', ['insultp [name]', 'Like insult, but prints the insult with a clickable copy link instead of sending it.', 'setmsg@insultp [name]'], insultp);
  confetti.command('insultpm', ['insultpm [name]', 'Like insult, but pms it to someone. You will not see the insult.', 'setmsg@insultpm [name]'], insultpm);
  confetti.command('intellisult', ['intellisult [name]', 'Insults the given target for the greater good of mankind, with intelligence.', 'setmsg@intellisult [name]'], function(data, chan) {
    if (!data) {
      return confetti.msg.bot("Specify a target!");
    }
    return confetti.msg.notify(intellisult(data), chan);
  });
  confetti.command('updateinsults', ['Updates the insult list from the web.', 'send@updateinsults'], function() {
    return updateInsults(function() {
      insultsLoaded = true;
      return confetti.msg.bot("Insults have been updated.");
    });
  });
  confetti.command('longinsults', ["Toggles whether if long insults (those > 400 characters) will be used in the insult commands.", 'send@longinsults'], function() {
    confetti.cache.store('longinsults', !confetti.cache.read('longinsults')).save();
    return confetti.msg.bot("Long insults are now " + (confetti.cache.read('longinsults') ? 'enabled' : 'disabled') + ".");
  });
  confetti.command('shortinsults', ["Toggles whether if only short insults (those < 150 characters) will in used in the insult commands.", 'send@shortinsults'], function() {
    confetti.cache.store('shortinsults', !confetti.cache.read('shortinsults')).save();
    return confetti.msg.bot("From now on " + (confetti.cache.read('shortinsults') ? 'only short insults will be used' : 'longer insults will also be used') + ".");
  });
  confetti.hook('initCache', function() {
    var once;
    once = confetti.cache.once;
    return confetti.cache.store('longinsults', false, once).store('shortinsults', false, once);
  });
  confetti.command('insultcommands', ['Shows various commands related to insults.', 'send@insultcommands'], function() {
    return new confetti.CommandList("Insult Commands").cmds('insult insultp insultpm intellisult updateinsults longinsults').hooks('insult').render();
  });
  return confetti.hook('commands:list', function(template) {
    return template.cmd('insultcommands');
  });
})();
