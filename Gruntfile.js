var _ = require("underscore");

module.exports = function(grunt){
    'use strict';

    var browserWwwDir = 'platforms/browser/www/';

    // Project configuration.
    grunt.initConfig({

        phonegap : 'node_modules/.bin/phonegap',
        pkg: grunt.file.readJSON('package.json'),
        appDir : '<%= pkg.name %>',
        generatedAppDir : 'temp-app',

        clean: {
            project: [
                'src/resources/css/*.css',
                'src/resources/sass/_app.scss',
                'src/resources/fonts/glyphicons-halflings-regular.ttf',
                'src/<%= pkg.bundle %>.jst.min.js',
                'src/<%= pkg.bundle %>.min.js',
                'src/app/version.js'
            ],
            www : ['www/'],
            libs : ['src/libs'],
            fonts : ['src/resources/fonts'],
            css : ['src/resources/css'],
            jst : ['src/jst.min.js'],
            index : ['src/index.html'],
            browser:[ 'platforms/browser', 'plugins/browser.json'],
            ios:[ 'platforms/ios', 'plugins/ios.json'],
            android:[ 'platforms/android', 'plugins/android.json'],
            'phonegap-generated' : [
                '.cordova',
                'hooks',
                'platforms',
                'plugins'
            ],
            'phonegap-generated-app' : [ '<%= generatedAppDir %>']
        },

        copy: {
            'phonegap-generated' : {
                files: [
                    {
                        expand: true,
                        cwd: '<%= generatedAppDir %>',
                        src : [
                            'plugins/**/*',
                            'hooks/**/*',
                            'platforms/**/*'
                        ],
                        dest: '.'
                    }
                ]
            },
            bootstrap: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/libs/bootstrap/dist/css',
                        src: [
                            'bootstrap.css',
                            'bootstrap.css.map',
                        ],
                        dest: 'src/resources/css/'
                    },
                    {
                        expand: true,
                        cwd: 'src/libs/bootstrap/dist/fonts',
                        src: [
                            '*'
                        ],
                        dest: 'src/resources/fonts/'
                    }
                ]
            },
            fontawesome: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/libs/fontawesome/css',
                        src: [
                            'font-awesome.css'
                        ],
                        dest: 'src/resources/css/'
                    },
                    {
                        expand: true,
                        cwd: 'src/libs/fontawesome/fonts',
                        src: [
                            '*'
                        ],
                        dest: 'src/resources/fonts/'
                    }
                ]
            },
            'to-www-index': {
                files: [
                    {
                        src : 'src/index.html',
                        dest: 'www/index.html'
                    }
                ]
            },
            'to-www-js': {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src : '**/*.js',
                        dest: 'www/js/'
                    },
                    {
                        expand: true,
                        cwd: 'src/libs',
                        src : '**/*.js',
                        dest: 'www/js/libs/'
                    }
                ]
            },
            'to-www-templates': {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src : 'jst.min.js',
                        dest: 'www/js/'
                    }
                ]
            },
            'to-www-css': {
                files: [
                    {
                        expand: true,
                        cwd: 'src/resources/',
                        src: ['css/*.css'],
                        dest: 'www/'
                    }
                ]
            },
            'to-www-fonts': {
                files: [
                    {
                        expand: true,
                        cwd: 'src/resources/fonts',
                        src : '**/*',
                        dest: 'www/fonts/'
                    }
                ]
            },
            'www-to-browser-index' : {
                files: [
                    {
                        src : 'www/index.html',
                        dest: browserWwwDir + 'index.html'
                    }
                ]
            },
            'www-to-browser-js' : {
                files: [
                    {
                        expand: true,
                        cwd: 'www/js',
                        src : ['**/*.js'],
                        dest: browserWwwDir + 'js/'
                    }
                ]
            },
            'www-to-browser-templates' : {
                files: [
                    {
                        expand: true,
                        cwd: 'src/', // intended source
                        src : 'jst.min.js',
                        dest: browserWwwDir + 'js/'
                    }
                ]
            },
            'www-to-browser-css' : {
                files : [
                    {
                        expand: true,
                        cwd: 'www/css/',
                        src: ['**/*'],
                        dest: browserWwwDir + 'css/'
                    }
                ]
            },
            'www-to-browser-fonts' : {
                files: [
                    {
                        expand: true,
                        cwd: 'www/fonts',
                        src : ['**/*'],
                        dest: browserWwwDir + 'fonts/'
                    }
                ]
            }
        },

        exec: {
            'create-app' : {
                cwd: '.',
                command: '<%= phonegap %> create <%= generatedAppDir %> <%= pkg.bundle %> <%= appName %>'
            },
            'add-platform-ios' : {
                cwd : '.',
                command : '<%= phonegap %> platform add ios'
            },
            'add-platform-android' : {
                cwd : '.',
                command : '<%= phonegap %> platform add android'
            },
            'add-platform-browser' : { // for testing
                cwd : '.',
                command : '<%=phonegap %> platform add browser'
            },
            'build-ios' : {
                cwd: '.',
                command: '<%= phonegap %> build ios'
            },
            'build-android' : {
                cwd: '.',
                command: '<%= phonegap %> build android'
            },
            'build-browser' : {
                cwd : '.',
                command: '<%= phonegap %> build browser'
            },
            'serve-browser' : {
                cwd : '.',
                command: '<%= phonegap %> run browser'
            },
            'plugin-console' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-console@1.0.1'
            },
            'plugin-contentsync' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add phonegap-plugin-contentsync'
            },
            'plugin-whitelist' : {
                cwd : '.',
                command : '<%= phonegap %> plugin add cordova-plugin-whitelist@1.2.1'
            },
        },

        jshint: { //TODO: review
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                globals: {
                    exports: true,
                    zepto: true,
                    $: true,
                    _: true,
                    xit: true,
                    //document
                    window: false,
                    document: false,
                    // require.js
                    define: false,
                    // plug-ins
                    gaPlugin: false,
                    JREngage: false,
                    ExtractZipFile : false,
                    LocalFileSystem : false,
                    google : false,
                    // mocha testing
                    mochaPhantomJS : false
                }
            },
            src: 'src/js/**/*.js'
        },

        jst: {
            compile: {
                options: {
                    namespace: "JST",
                    amd : true,
                    processName: function (filename) {
                        //remove the 'src' prefix for the app
                        return filename.split('/').slice(2).join('/');
                    }
                },
                files: {
                    'src/jst.min.js' : [
                        "src/resources/templates/**/*.html"
                    ]
                }
            }
        },

        compass: {
            dev: {
                options :{
                    sassDir: 'src/resources/sass',
                    cssDir: 'src/resources/css',
                    outputStyle: 'expanded',
                    relativeAssets: true,
                    imagesDir: 'src/resources/img',
                    fontsDir: 'src/resources/fonts'
                }
            }
        },

        generate : {
            'index' : {
                template : 'src/resources/index-template.html',
                dest : 'src/index.html',
                config : {
                }
            }
        },

        watch: {
            index : {
                files : ['src/resources/index-template.html'],
                tasks: ['generate:index', 'copy:to-www-index', 'copy:www-to-browser-index']
            },
            css : {
                files: ['src/resources/sass/**/*.scss'],
                tasks: ['compass:dev', 'copy:to-www-css', 'copy:www-to-browser-css']
            },
            fonts : {
                files: ['src/resources/fonts/**/*.scss'],
                tasks: ['copy:to-www-fonts', 'copy:www-to-browser-fonts']
            },
            templates: {
                files: ['src/resources/templates/**/*.html'],
                tasks: ['jst:compile', 'copy:to-www-templates', 'copy:www-to-browser-templates']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint', 'copy:to-www-js', 'copy:www-to-browser-js']
            }
        },

        replace : {
            'app-manifest' : {
                options: {
                    patterns: [
                        {
                            match: /android:icon="@drawable\/icon"/,
                            replacement : ''
                        }
                    ]
                },
                files: [
                    {
                        src: ["platforms/android/AndroidManifest.xml"],
                        dest: "platforms/android/AndroidManifest.xml"
                    }
                ]
            }
        },

        compress : {
            'content': {
                options: {
                    archive: 'content-srv/public/content.zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'content-test',
                        src: [
                            '**/*',
                        ],
                        dest: '.'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jst');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-finebrain-tools');

    grunt.registerTask(
        'create-www-config-js',
        'generates config.js in build dir with inserion of package version in the baseUrl path',
        function(){
            var version = grunt.config.get('pkg.version');
            var data = grunt.file.read('src/js/config.js');
            // console.log(version);
            var filePath = 'www/js/config.js';
            grunt.file.write(filePath, data);
            grunt.log.ok('generated: ' + filePath);
        }
    );

    grunt.registerTask('copy-to-www', [
        'copy:to-www-index',
        'copy:to-www-js',
        'copy:to-www-css',
        'copy:to-www-fonts',
        'copy:to-www-templates'
    ]);

    grunt.registerTask('build', [
        'clean:project',
        'jst:compile',
        //'version',
        'copy:bootstrap',
        'copy:fontawesome',
        'jshint',
        'compass:dev',
        //'requirejs:compile',
        'generate:index',
        'clean:www',
        'copy-to-www',
        'create-www-config-js',
    ]);

    grunt.registerTask('install-plugins', [
        'exec:plugin-console',
        'exec:plugin-contentsync'
    ]);

    grunt.registerTask('install-plugins-android', [
        'exec:plugin-contentsync',
        'exec:plugin-whitelist'
    ]);

    grunt.registerTask('build-browser',
        'create phonegap app for browser',
        [
            'clean:browser',
            'clean:phonegap-generated-app',
            'clean:phonegap-generated',
            'exec:create-app',
            'copy:phonegap-generated',
            'clean:phonegap-generated-app',
            'build',
            'exec:add-platform-browser',
            'install-plugins'
        ]
    );

    grunt.registerTask(
        'serve-browser',
        'run app in web browser',
        [
            'exec:serve-browser'
        ]
    );

    grunt.registerTask(
        'watch-browser',
        'update changed files for served web browser',
        [
            'watch'
        ]
    );

    grunt.registerTask('build-ios', [
        'clean:ios',
        'clean:phonegap-generated-app',
        'clean:phonegap-generated',
        'exec:create-app',
        'copy:phonegap-generated',
        'clean:phonegap-generated-app',
        'build',
        'exec:add-platform-ios',
        'install-plugins',
        'exec:build-ios'
    ]);

    grunt.registerTask('build-android', [
        'clean:android',
        'clean:phonegap-generated-app',
        'clean:phonegap-generated',
        'exec:create-app',
        'copy:phonegap-generated',
        'clean:phonegap-generated-app',
        'build',
        'exec:add-platform-android',
        'install-plugins-android',
        'replace',
        'exec:build-android'
    ]);

    grunt.registerTask('build-content', [
        'compress:content',
        'content-status'
    ]);

    grunt.registerTask(
        "content-status",
        "generates content status json",
        function(){
            var version = grunt.file.read('content-test/version.txt');
            var statusFile = 'content-srv/public/status';
            grunt.file.write(statusFile, JSON.stringify(
                {
                    contentVersion : version
                }
            ));
            grunt.log.ok('created status file: ' + statusFile);
        }
    );
};
