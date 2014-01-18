do ->
    # Other bits
    confetti.command 'eval', ['eval [code]', "Evaluates a JavaScript Program.", 'setmsg@eval [code]'], (data) ->
        try
            res = eval(data)
            confetti.msg.html "<timestamp/><b>Eval returned:</b> #{sys.htmlEscape(res)}"
        catch ex
            confetti.msg.html "<timestamp/><b>Eval error:</b> #{ex} on line #{ex.lineNumber}"
            confetti.msg.html ex.backtrace.join('<br/>') if ex.backtrace?

    confetti.command 'imp', ['imp [name]', "Changes your name to [name]. If the name is deemed invalid, you will be kicked, so be careful!", 'setmsg@imp [name]'], (data) ->
        if data.length < 1 or data.length > 20
            confetti.msg.bot "That name is too long or too short (max 20 characters)!"
            return

        confetti.msg.bot "You are now known as #{data}!"
        Client.changeName data

    confetti.command 'flip', ["Flips a coin in virtual life.", 'send@flip'], ->
        confetti.msg.bot "The coin landed #{if Math.random() > 0.5 then 'heads' else 'tails'}!"

    confetti.command 'html', ['html [code]', "Displays some HTML [code] (for testing purposes).", 'setmsg@html [code]'], (data) ->
        confetti.msg.html data
