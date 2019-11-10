'use strict'

const fs = require('fs');
const path = require('path');

const runtimes = {'python': '.py', 'node': '.js'}

class FileManager {
  static validatePrefix(prefixPath) {
    if(prefixPath == null || prefixPath.length == 0) {
      throw new Error('Property error: Prefix is empty');
    }

    if(prefixPath[prefixPath.length-1] != '/') {
      return prefixPath + '/';
    }

    return prefixPath
  }

  static getWorkDir() {
    return this.validatePrefix(process.cwd());
  }

  static normalizePath(normalizablePath) {
    return path.normalize(normalizablePath);
  }

  static createFolders(prefixPath) {
    let folders = prefixPath.split('/');
    
    let path = ''

    for(let folder of folders) {
      path += folder + '/'
      if(!fs.existsSync(path)) {
        fs.mkdirSync(path)
      }
    }
  }

  static deleteFolders(path, removablePath) {
    let folders = removablePath.split('/');
    
    for(let i = folders.length; i > 0 ; i--) {
      let folder = folders.slice(0, i).join('/')
      fs.rmdirSync(path + folder);
    }
  }

  static moveFilesToPath(pathFrom, pathTo, runtime) {
    let fileTypes = FileManager.getFileTypes(runtime);
    let files = []

    fs.readdirSync(pathFrom).forEach(file => {
      for(let type of fileTypes) {
        if(file.indexOf(type) > -1) {
          files.push(file);
        }
      }
    });

    for(let file of files) {
      fs.renameSync(pathFrom + '/' + file, pathTo + '/' + file);
    }
  }

  static moveFilesBack(pathFrom, pathTo) {
    let files = []

    fs.readdirSync(pathFrom).forEach(file => {
      files.push(file);
    });

    for(let file of files) {
      fs.renameSync(pathFrom + '/' + file, pathTo + '/' + file);
    }
  }

  static getFileTypes(runtime) {
    let fileTypes = []
    for(let runtimeType of Object.keys(runtimes)) {
      if(runtime.indexOf(runtimeType) > -1) {
        fileTypes.push(runtimes[runtimeType]);
      }
    }
    return fileTypes;
  }
}

module.exports = FileManager;