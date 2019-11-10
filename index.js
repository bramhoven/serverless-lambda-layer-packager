'use strict';

const chalk = require('chalk');
const FileManager = require('./file-manager');

class ServerlessLambdaLayerPackager {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    
    this.layers = this.serverless.service.layers;
    this.pathPrefix = FileManager.validatePrefix(this.serverless.service.custom['serverless-lambda-layer-packager'].pathPrefix);
    this.runtime = this.serverless.service.custom['serverless-lambda-layer-packager'].runtime;

    this.commands = {};

    this.hooks = {
      'before:package:initialize': this.beforeCompilePackage.bind(this),
      'after:package:finalize': this.afterCompilePackage.bind(this),
    };
  }

  beforeCompilePackage() {
    console.log('Lambda Layer Packager: ' + chalk.blue('Found layers: ') + chalk.green(Object.keys(this.layers).join(', ')));
    for(let layer of Object.keys(this.layers)) {
      let path = FileManager.validatePrefix(this.layers[layer].path);
      let layerDir = FileManager.normalizePath(FileManager.getWorkDir() + path);
      let packagedDir = FileManager.normalizePath(FileManager.getWorkDir() + path + '/' + this.pathPrefix + '/' + layer.toLowerCase());

      console.log('Lambda Layer Packager: ' + chalk.blue('Creating new path: ') + chalk.green(packagedDir));
      FileManager.createFolders(packagedDir)
      console.log('Lambda Layer Packager: ' + chalk.blue('Path created'));
      console.log('Lambda Layer Packager: ' + chalk.blue('Moving files'));
      FileManager.moveFilesToPath(layerDir, packagedDir, this.runtime);
      console.log('Lambda Layer Packager: ' + chalk.blue('Files moved'));
    }
  }

  afterCompilePackage() {
    for(let layer of Object.keys(this.layers)) {
      let path = FileManager.validatePrefix(this.layers[layer].path);
      let layerDir = FileManager.normalizePath(FileManager.getWorkDir() + path);
      let packagedDir = FileManager.normalizePath(FileManager.getWorkDir() + path + '/' + this.pathPrefix + '/' + layer.toLowerCase());

      console.log('Lambda Layer Packager: ' + chalk.blue('Moving files back'));
      FileManager.moveFilesBack(packagedDir, layerDir);
      console.log('Lambda Layer Packager: ' + chalk.blue('Files moved'));
      console.log('Lambda Layer Packager: ' + chalk.blue('Deleting newely created path'));
      FileManager.deleteFolders(layerDir, FileManager.normalizePath(this.pathPrefix + '/' + layer.toLowerCase()));
      console.log('Lambda Layer Packager: ' + chalk.blue('Path deleted'));
    }
  }
}

module.exports = ServerlessLambdaLayerPackager;
