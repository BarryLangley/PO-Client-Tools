module.exports = (grunt) ->
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

    grunt.registerTask 'build-client', 'Builds the client script source.', (data) ->
        grunt.log.ok 'The following modules will be built:', clientFiles.join(', ').replace(/.js/gi, '')
        grunt.task.run 'coffee:client'

    grunt.registerTask 'build-plugins', 'Builds the client script plugins.', (data) ->
        grunt.log.ok 'Building plugin: Insults'
        grunt.task.run 'coffee:insult-plugin'

        grunt.log.ok 'Building plugin: Pokédex'
        grunt.task.run 'coffee:pokedex-plugin'

        grunt.log.ok 'Building plugin: AoC Taunts'
        grunt.task.run 'coffee:aoctaunts-plugin'

        grunt.log.ok 'Building plugin: Emoji'
        grunt.task.run 'coffee:emoji-plugin'

        grunt.log.ok 'Building plugin: Pokémon Usage Statistics'
        grunt.task.run 'coffee:pusestats-plugin'

    grunt.registerTask 'default', ['build-client']

    # Add files to build here. Keep them in order.
    clientFiles = [
        'globals' # First

        'components/util'
        'components/io'
        'components/cache'
        'components/player'
        'components/channel'
        'components/message'
        'components/confetti'

        'feature/*'

        'scripts' # Last
    ]

    clientFiles = ("src/script/#{file}.coffee" for file in clientFiles)

    gruntConfig =
        pkg: grunt.file.readJSON 'package.json'
        # grunt-contrib-concat
        concat:
            options:
                separator: ''
        # grunt-contrib-coffee
        coffee:
            client:
                options:
                    bare: yes
                    join: yes
                files:
                    'scripts.js': clientFiles
            'insult-plugin':
                options:
                    bare: yes
                    join: yes
                files:
                    'plugins/insults/insults.js': 'plugins/insults/insults.coffee'
            'pokedex-plugin':
                options:
                    bare: yes
                    join: yes
                files:
                    'plugins/pokedex/pokedex.js': ['plugins/pokedex/pokedex.coffee', 'plugins/pokedex/interface.coffee', 'plugins/pokedex/commands.coffee']
            'aoctaunts-plugin':
                options:
                    bare: yes
                    join: yes
                files:
                    'plugins/aoctaunts/aoctaunts.js': 'plugins/aoctaunts/aoctaunts.coffee'
            'emoji-plugin':
                options:
                    bare: yes
                    join: yes
                files:
                    'plugins/emoji/emoji.js': 'plugins/emoji/emoji.coffee'
            'pusestats-plugin':
                options:
                    bare: yes
                    join: yes
                files:
                    'plugins/pusestats/pusestats.js': 'plugins/pusestats/pusestats.coffee'

    grunt.initConfig gruntConfig
