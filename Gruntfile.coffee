module.exports = (grunt) ->
    #grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

    grunt.registerTask 'confetti', 'Builds the client script source.', (data) ->
        grunt.task.run 'coffee:client'

    grunt.registerTask 'plugins', 'Builds the client script plugins.', (data) ->
        grunt.task.run 'coffee:pokedex-plugin'
        for plugin in plugins
            grunt.task.run "coffee:#{plugin}-plugin"

    grunt.registerTask 'default', ['confetti']

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
        'components/commands'

        'feature/*'

        'scripts' # Last
    ]

    clientFiles = ("src/script/#{file}.coffee" for file in clientFiles)

    gruntConfig =
        pkg: grunt.file.readJSON 'package.json'
        coffee:
            client:
                options:
                    bare: yes
                    join: yes
                files:
                    'scripts.js': clientFiles

    plugins = []

    addPlugin = (name, files=["plugins/#{name}/#{name}.coffee"]) ->
        plugins.push name
        config =
            options:
                bare: yes
                join: yes
            files: {}

        config.files["plugins/#{name}/#{name}.js"] = files
        gruntConfig.coffee["#{name}-plugin"] = config

    addPlugin 'insults'
    addPlugin 'pokedex', ['plugins/pokedex/pokedex.coffee', 'plugins/pokedex/interface.coffee', 'plugins/pokedex/commands.coffee']
    addPlugin 'aoctaunts'
    addPlugin 'emoji'
    addPlugin 'pusestats'
    addPlugin 'yeolde'
    addPlugin 'deladder'

    grunt.initConfig gruntConfig
