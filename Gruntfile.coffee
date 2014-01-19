module.exports = (grunt) ->
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-coffee'

    grunt.registerTask 'build-client', 'Builds the client script source.', (data) ->
        grunt.log.ok 'The following modules will be built:', clientFiles.join(', ').replace(/.js/gi, '')
        grunt.task.run 'coffee:client'

    grunt.registerTask 'build-plugins', 'Builds the client script plugins.', (data) ->
        grunt.log.ok 'Building plugins...'

        grunt.log.ok 'Building plugin: Insults'
        grunt.task.run 'coffee:insult-plugin'

    grunt.registerTask 'build-battle', 'Builds the battle script source.', (data) ->
        grunt.log.ok 'The following modules will be built:', battleFiles.join(', ').replace(/.js/gi, '')
        grunt.task.run 'concat:battle'

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

    # Add files to build here. Keep them in order.
    battleFiles = [
    ]

    clientFiles = ("src/script/#{file}.coffee" for file in clientFiles)
    battleFiles = ("battle/#{file}.js" for file in battleFiles)

    gruntConfig =
        pkg: grunt.file.readJSON 'package.json'
        # grunt-contrib-concat
        concat:
            options:
                separator: ''
            battle:
                files:
                    'battlescripts.js': battleFiles
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

    grunt.initConfig gruntConfig
