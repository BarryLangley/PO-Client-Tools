# Insult plugin
do ->
    intellisult = (name) ->
        random = (container, check) ->
            len = container.length
            str = container[Math.floor(Math.random() * len)]
            while str is check
                str = container[Math.floor(Math.random() * len)]
            return str

        config = intellisult.config
        A = config.A
        B = config.B
        C = config.C
        D = config.D
        E = config.E
        F = config.F

        a = random(A, intellisult.a)
        b = random(B, intellisult.b)
        c = random(C, intellisult.c)
        d = random(D, intellisult.d)
        e = random(E, intellisult.e)
        f = random(F, intellisult.f)

        intellisult.a = a
        intellisult.b = b
        intellisult.c = c
        intellisult.d = d
        intellisult.e = e
        intellisult.f = f

        name ?= ''
        if name.trim() isnt ''
            insult = "#{name} is #{a} #{b} #{c} and a #{d} #{e} #{f}."
        else
            if config.names[0]?
                name = config.names[Math.floor(Math.random() * config.names.length)];
                insult = "#{name} is #{a} #{b} #{c} and a #{d} #{e} #{f}."
            else
                insult = "You are #{a} #{b} #{c} and a #{d} #{e} #{f}."

        return insult

    intellisult.a = intellisult.b = intellisult.c = intellisult.d = intellisult.e = intellisult.f = ''
    intellisult.config =
        names: []
        A: ['a confoundedly', 'a conspicuously', 'a cruelly', 'a deucedly', 'a devilishly', 'a dreadfully', 'a frightfully', 'a grievously', 'a lamentably', 'a miserably', 'a monstrously', 'a piteously', 'a precociously', 'a preposterously', 'a shockingly', 'a sickly', 'a wickedly', 'a woefully', 'an abominably', 'an egregiously', 'an incalculably', 'an indescribably', 'an ineffably', 'an irredeemably', 'an outrageously', 'an unconscionably', 'an unequivocally', 'an unutterably']
        B: ['appalling', 'babbling', 'backward', 'bantering', 'blabbering', 'blighted', 'boorish', 'contemptible', 'corpulent', 'cretinous', 'debauched', 'decadent', 'demented', 'depraved', 'detestable', 'dissolute', 'execrable', 'fiendish', 'foolish', 'foul', 'gluttonous', 'grotesque', 'gruesome', 'hermaphroditic', 'hideous', 'ignominious', 'ignorant', 'ill-bred', 'ill-mannered', 'incompetent', 'incorrigible', 'indecent', 'inept', 'insignificant', 'insufferable', 'insufferable', 'lascivious', 'lecherous', 'licentious', 'loathsome', 'maladjusted', 'malignant', 'minuscule', 'miserable', 'myopic', 'naive', 'narcissistic', 'nonintuitive', 'obese', 'obtuse', 'offensive', 'parasitic', 'pedestrian', 'perverted', 'petty', 'primitive', 'promiscuous', 'reprehensible', 'repugnant', 'repulsive', 'revolting', 'salacious', 'subliterate', 'sybaritic', 'uncivilized', 'uncouth', 'unseemly', 'unsightly', 'vile', 'vulgar', 'witless']
        C: ['barbarian', 'cannibal', 'coccydynia', 'cretin', 'degenerate', 'delinquent', 'derelict', 'dingleberry', 'dolt', 'dullard', 'dunce', 'fiend', 'filcher', 'glutton', 'half-wit', 'heathen', 'hemorrhoid', 'idiot', 'ignoramus', 'imbecile', 'lackey', 'lecher', 'libertine', 'loafer', 'lout', 'malefactor', 'menace', 'microphallus', 'miscreant', 'misdemeanant', 'moron', 'narcissist', 'neanderthal', 'nincompoop', 'ninny', 'nose picker', 'oaf', 'onanist', 'parasite', 'peon', 'pervert', 'pick pocket', 'plebeian', 'polisson', 'prostitute', 'rapscallion', 'reprobate', 'reprobate', 'reptile', 'rogue', 'ruffian', 'scoundrel', 'simpleton', 'slattern', 'sphincter', 'subhuman', 'swine', 'sycophant', 'sycophant', 'troglodyte', 'trollop', 'twit', 'varmint', 'vermin', 'wretch']
        D: ['belligerent', 'catatonic', 'corrupt', 'dastardly', 'debased', 'debauched', 'decadent', 'decrepit', 'degenerate', 'demented', 'deplorable', 'depraved', 'disgusting', 'fecal', 'feculent', 'fiendish', 'flaccid', 'flagitious', 'flagrant', 'frightful', 'gaudy', 'glaring', 'gluttonous', 'gross', 'grotesque', 'heinous', 'hopeless', 'horribly atrocious', 'infamous', 'loathsome', 'ludicrous', 'maladjusted', 'malingering', 'malingering', 'malodorous', 'maniacal', 'maniacal', 'masturbatory', 'miscreant', 'miserable', 'monstrous', 'myopic', 'myopic', 'naive', 'narcissistic', 'narcissistic', 'nefarious', 'nefarious', 'outrageous', 'perverse', 'perverted', 'petty', 'preposterous', 'preposterous', 'primitive', 'primitive', 'putrid', 'putrid', 'rank', 'reprehensible', 'repugnant', 'revolting', 'rotten', 'vacuous', 'vapid', 'villainous', 'wearisome'],
        E: ['acidly acrimonious', 'air-polluting', 'all-befouling', 'all-defiling', 'armpit-licking', 'blood-curdling', 'blood-freezing', 'bug-eyed', 'buttock-rimming', 'cantankerously-caterwauling', 'chromosome deficient', 'chronically flatulent', 'cold-hearted', 'coma-inducing', 'congenitally clueless', 'dandruff-eating', 'disease-ridden', 'dull-witted', 'enema-addicted', 'feces-collecting', 'feeble-minded', 'flea-infested', 'flesh-creeping', 'foul-smelling', 'gossip-mongering', 'grudge-festering', 'halitosis-infested', 'heart-sickening', 'Internet-addicted', 'irredeemably boring', 'maliciously malodorous', 'mattress-soiling', 'monotonous solitaire playing', 'mucous-eating', 'nose-picking', 'nostril-offending', 'odiously suffocating', 'one dimensional', 'orgasm faking', 'scruffy-looking', 'sheep-molesting', 'simple-minded', 'small-minded', 'snake-eyed', 'sock-sucking', 'soul-destroying', 'stench-emitting', 'thick-headed', 'toe-sucking', 'urine-reeking']
        F: ['aberration of nature', 'abomination of humanity', 'abomination to all the senses', 'abomination to all the senses', 'acrid smog of oppressively caustic oral effluvium', 'amalgamation of loathsome repulsiveness', 'arbitrary dereliction of genetics', 'assault on the ocular senses', 'blight upon society', 'buggering buttock bandit', 'cacophonous catastrophe', 'cesspool of putrid effluvium', 'cesspool of sub-human filth', 'cheap Internet loiterer', 'chromosome-deficient test tube experiment', 'conglomerate of intellectual constipation', 'conglomerate of intellectual constipation', 'delinquent who has delusions of adequacy', 'deplorable calamity of birth', 'depraved orgy of subhuman indecency', 'depravity of genetics', 'display of indecency', 'dreg of the Internet', 'derelict whose birth certificate is an apology from the condom factory', 'derelict whose birth certificate is an apology from the condom factory', 'evangelical crusader of sub-mediocrity', 'evangelical crusader of sub-mediocrity', 'excrement stain on a Sumo Wrestler\'s underpants', 'glob of grease', 'grotesque visual experience', 'grudge-festering haggard', 'gruesome vista to all eyes assaulted by the sight of you', 'hysterical mass of warbling inanity', 'lamentable mistake by your parent\'s reckless exchange of genetic material', 'leach on humanity', 'malfunctioning little twerp', 'malodorous heathen', 'malodorous marinade of sweat and fear', 'manifestation of contraceptive personality', 'mass of existential impotence', 'mass of loathsome repulsiveness', 'mass of neuroses and complexes', 'mass of neuroses and pathologies', 'mass of neuroses and pathologies', 'mean-spirited poltroon', 'mediocrity afflicted with mental retardation', 'menace to, not only society, but all living creatures', 'mental midget with the natural grace of an intoxicated beluga whale', 'molester of small furry animals', 'molester of small old men', 'moving stench of leprosy', 'mutilation of decency', 'nauseating assault on the senses', 'nauseating assault on the senses', 'nefarious vermin', 'obfuscation of all that is good', 'object of execration', 'ocular depravity to all of discrimination', 'odious leach-covered blob of quivering slime', 'odious leach-covered glob of quivering slime', 'offense to all of good taste and decency', 'oppressive orgy of perversion', 'orgy of indecency', 'orgy of indignity', 'parasite on the states resources', 'personification of vulgarity', 'piece of excrement attached to a dogs posterior', 'pitiful sideshow freak', 'plague of sighing and grief', 'plague upon humanity', 'plot-less melodrama of uneventful life', 'plot-less melodrama of uneventful life', 'practitioner of bestiality', 'proof that evolution can go in reverse', 'proof that test tube experiments can go horribly wrong', 'pulp of stultifying inanity', 'putrid waste of flesh', 'repulsive polisson', 'sadistic hippophilic necrophile', 'scourge of decency', 'sexual assaulter of barnyard animals', 'shameless exhibition of genetic deficiency', 'shameless exhibition of genetic deficiency', 'sideshow freak whose word is as valuable as an aging cow paddy', 'spawn from a lunatics rectum', 'spawn of a mad scientist and a disastrous test tube experiment', 'sub-literate simple minded mental midget', 'tainted spawn of a syphilitic swamp rat', 'tainted spawn of a syphilitic swamp hog', 'tasteless amalgam of dross', 'toll on the nerves of those with good taste and decency', 'unfortunate occurrence of unprotected intercourse', 'unspeakably offensive barbarian', 'vulgarity to all and sundry', 'wretched horror to all who encounter you']

    insultsLoaded = no
    insultList = []

    updateInsults = (cb) ->
        sys.webCall 'https://raw.github.com/TheUnknownOne/Insults/master/src/insults.json', (req) ->
            try
                insults = JSON.parse req
            catch ex
                confetti.msg.bot "Failed to load insults, check your internet connection."
                return

            unless confetti.cache.get('longinsults') is yes
                insults = (insult for insult in insults when insult.length < 550)
            insultList = insults
            cb() if cb?

    # Used for a recursive call (lazy loading).
    insult = (data, chan) ->
        if data.length is 0
            confetti.msg.bot "Specify a target!"
            return

        # If insults aren't loaded, load the list async
        unless insultsLoaded
            updateInsults ->
                insultsLoaded = yes
                insult(data, chan)
            return yes

        target = confetti.player.name(data).trim()
        insult = confetti.util.random(insultList)
            .replace(/\{name\}/g, target.toLowerCase())
            .replace(/\{Name\}/g, target)
            .replace(/\{NAME\}/g, target.toUpperCase())

        confetti.msg.notify insult, chan
        return yes

    confetti.command 'insult', ['insult [name]', 'Insults the given target for the greater good of mankind.', 'setmsg@insult [name]'], insult
    confetti.command 'intellisult', ['intellisult [name]', 'Insults the given target for the greater good of mankind, with intelligence.', 'setmsg@intellisult [name]'], (data, chan) ->
        if data.length is 0
            confetti.msg.bot "Specify a target!"
            return

        confetti.msg.notify intellisult(data), chan

    confetti.command 'updateinsults', ['Updates the insult list from the web.', 'send@updateinsults'], ->
        confetti.msg.bot "Updating insults..."
        updateInsults ->
            insultsLoaded = yes
            confetti.msg.bot "Insults have been loaded."

    confetti.command 'longinsults', ["Toggles whether if long insults (those > 500 characters) should be loaded as well.", 'send@longinsults'], ->
        confetti.cache.store('longinsults', !confetti.cache.read('longinsults')).save()
        confetti.msg.bot "Long insults are now #{if confetti.cache.read('longinsults') then 'enabled' else 'disabled'}."

    confetti.hook 'initCache', ->
        confetti.cache.store('longinsults', no, confetti.cache.once)

    confetti.hook 'commands:categories', ->
        confetti.commandList.header 'Insults', 4
        confetti.commandList.cmd 'insult'
        confetti.commandList.cmd 'intellisult'
        confetti.commandList.cmd 'updateinsults'
        confetti.commandList.cmd 'longinsults'

