var path = require('path');

module.exports = function(grunt) {
  var config = '_grunt/settings.json',
      settings = {};
  if(grunt.file.exists(config)) {
    settings = grunt.file.readJSON(config);
  }
  require('time-grunt')(grunt);
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), '_grunt'),
    config: {
      settings: settings
    }
  });
};

