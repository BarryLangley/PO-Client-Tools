(function() {
  var checkEmoji, emoji, emojiRegex, parseEmoji, parsed, url;
  emoji = {};
  parsed = false;
  url = 'http://theunknownone.github.io/PO-Client-Tools/plugins/emoji/emoji.json';
  emojiRegex = /:([a-z0-9\+\-_]+):/g;
  checkEmoji = function(verbose) {
    var content, file;
    if (verbose == null) {
      verbose = true;
    }
    if (parsed) {
      return true;
    }
    file = confetti.io.readLocal('emoji.json');
    if (file) {
      emoji = JSON.parse(file);
      parsed = true;
      return true;
    }
    confetti.msg.bot("Downloading emojis, this may take a while. [1.226 MB]");
    content = sys.synchronousWebCall(url);
    emoji = JSON.parse(content);
    parsed = true;
    confetti.io.writeLocal('emoji.json', content);
    confetti.msg.bot("Done! <img src='" + emoji.sparkles + "'>");
    return false;
  };
  parseEmoji = function(message) {
    var count, max;
    if (confetti.cache.get('emoji') !== true) {
      return message;
    }
    checkEmoji();
    count = 0;
    max = confetti.cache.get('emojimax');
    return message.replace(emojiRegex, function(name) {
      var code, emojiname;
      if (count >= max) {
        return name;
      }
      emojiname = name.substr(1, name.length - 2);
      if (emoji.hasOwnProperty(emojiname)) {
        code = emoji[emojiname];
        count += 1;
        return "<img src='" + code + "'>";
      }
      return name;
    });
  };
  if (confetti.emotes == null) {
    confetti.emotes = {};
  }
  confetti.emotes.emoji = {
    emotes: emoji,
    parse: parseEmoji,
    check: checkEmoji
  };
  confetti.command('emoji', ["Toggles whether if emojis should be shown.", 'send@emoji'], function(_, chan) {
    checkEmoji();
    confetti.cache.store('emoji', !confetti.cache.read('emoji')).save();
    return confetti.msg.bot("Emojis are now " + (confetti.cache.read('emoji') ? 'enabled' : 'disabled') + ".", chan);
  });
  confetti.command('emojimax', ["Changes how many emoji there may be in one message. Subsequent emoji won't be parsed. If no valid number is given, shows the current emoji max.", 'setmsg@emojimax [count]'], function(data, chan) {
    var count, num;
    checkEmoji();
    num = parseInt(data, 10);
    if (isNaN(num)) {
      count = confetti.cache.get('emojimax');
      confetti.msg.bot("" + count + " " + (count === 1 ? 'emoji is' : 'emojis are') + " currently allowed per message.", chan);
      return;
    }
    if (num < 0) {
      num = 0;
    }
    confetti.cache.store('emojimax', num).save();
    return confetti.msg.bot("" + num + " " + (num === 1 ? 'emoji is' : 'emojis are') + " now allowed per message.", chan);
  });
  confetti.command('emojis', ["Shows the list of emoji.", 'send@emojis'], function(_, chan) {
    checkEmoji();
    confetti.msg.bot("There are currently 872 emojis! You can look them up here:");
    return confetti.msg.bot("<a href='http://www.emoji-cheat-sheet.com/'>http://www.emoji-cheat-sheet.com/</a>", chan);
  });
  confetti.hook('initCache', function() {
    confetti.cache.store('emoji', true, confetti.cache.once);
    return confetti.cache.store('emojimax', 5, confetti.cache.once);
  });
  confetti.hook('commands:misc', function() {
    confetti.commandList.cmd('emoji');
    return confetti.commandList.cmd('emojis');
  });
  confetti.hook('manipulateChanPlayerMessage', function(from, fromId, message, playerMessage, _arg, chan, html, dirty) {
    var auth, authSymbol, color, newMessage;
    color = _arg[0], auth = _arg[1], authSymbol = _arg[2];
    newMessage = parseEmoji(playerMessage);
    if (newMessage !== playerMessage) {
      playerMessage = newMessage;
      html = true;
      dirty = true;
    }
    return [from, fromId, message, playerMessage, [color, auth, authSymbol], chan, html, dirty];
  });
  return checkEmoji();
})();
