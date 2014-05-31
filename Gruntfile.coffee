module.exports = (grunt) ->
    #grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

    grunt.registerTask 'build-client', 'Builds the client script source.', (data) ->
        grunt.task.run 'coffee:client'

    grunt.registerTask 'build-plugins', 'Builds the client script plugins.', (data) ->
        grunt.task.run 'coffee:pokedex-plugin'
        for plugin in plugins
            grunt.task.run "coffee:#{plugin}-plugin"

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
        'components/commandlist'

        'feature/*'

        'scripts' # Last
    ]

    clientFiles = ("src/script/#{file}.coffee" for file in clientFiles)
    plugins = ['insults', 'aoctaunts', 'emoji', 'pusestats']

    gruntConfig =
        pkg: grunt.file.readJSON 'package.json'
        #concat:
        #    options:
        #        separator: ''
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

    for plugin in plugins
        config =
            options:
                bare: yes
                join: yes
            files: {}
        config.files["plugins/#{plugin}/#{plugin}.js"] = "plugins/#{plugin}/#{plugin}.coffee"
        gruntConfig.coffee["#{plugin}-plugin"] = config

    grunt.initConfig gruntConfig
