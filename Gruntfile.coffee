module.exports = (grunt) ->
    # Tasks.
    grunt.loadNpmTasks 'grunt-contrib-concat'

    grunt.registerTask 'build-battle', 'Builds the battle script source.', (data) ->
        grunt.log.ok 'The following modules will be built:', files.join(', ').replace(/.js/gi, '')
        grunt.task.run 'concat:battle'

    grunt.registerTask 'default', ['build-battle']

    # Add files to build here. Keep them in order.
    files = [
        'calc/base'
        'calc/pokedex'
        'calc/setdex'
        'calc/data'
        'calc/damage'
        'calc/ap_calc'
    ]

    files = ("battle/#{file}.js" for file in files)
    gruntConfig =
        pkg: grunt.file.readJSON 'package.json'
        # grunt-contrib-concat
        concat:
            options:
                separator: ''
            battle:
                files:
                    'battlescripts.js': [files]

    grunt.initConfig gruntConfig
