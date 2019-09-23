'use strict';

const chalk = require('chalk');
const FileManager = require('./file-manager');

class ServerlessLambdaLayerPackager {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.pathPrefix = FileManager.validatePrefix(this.serverless.service.custom.serverlessLambdaLayerPackager.pathPrefix);
    this.runtime = this.serverless.service.custom.serverlessLambdaLayerPackager.runtime;

    this.commands = {};

    this.hooks = {
      'before:package:initialize': this.beforeCompilePackage.bind(this),
      'after:package:finalize': this.afterCompilePackage.bind(this),
    };
  }

  beforeCompilePackage() {
    console.log('Lambda Layer Packager: ' + chalk.blue('Creating new path: ') + chalk.green(this.pathPrefix));
    FileManager.createFolders(this.pathPrefix)
    console.log('Lambda Layer Packager: ' + chalk.blue('Path created'));
    console.log('Lambda Layer Packager: ' + chalk.blue('Moving files'));
    FileManager.moveFilesToPath(this.pathPrefix, this.runtime);
    console.log('Lambda Layer Packager: ' + chalk.blue('Files moved'));
  }

  afterCompilePackage() {
    console.log('Lambda Layer Packager: ' + chalk.blue('Moving files back'));
    FileManager.moveFilesBack(this.pathPrefix);
    console.log('Lambda Layer Packager: ' + chalk.blue('Files moved'));
    console.log('Lambda Layer Packager: ' + chalk.blue('Deleting newely created path'));
    FileManager.deleteFolders(this.pathPrefix);
    console.log('Lambda Layer Packager: ' + chalk.blue('Path deleted'));
  }
}

module.exports = ServerlessLambdaLayerPackager;
