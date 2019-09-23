'use strict'

const fs = require('fs');

const runtimes = {'python': '.py', 'node': '.js'}

class FileManager {
  static validatePrefix(prefixPath) {
    if(prefixPath == null || prefixPath.length == 0) {
      throw new Error('Property error: Prefix is empty');
    }

    if(prefixPath[prefixPath.length-1] == '/') {
      return prefixPath.slice(0, prefixPath.length - 1);
    }

    return prefixPath
  }

  static createFolders(prefixPath) {
    let folders = prefixPath.split('/');
    
    if(!fs.existsSync(folders[0])) {
      let path = ''

      for(let folder of folders) {
        fs.mkdirSync(path + folder)
        path += folder + '/'
      }
    }
  }

  static deleteFolders(prefixPath) {
    let folders = prefixPath.split('/');
    
    for(let i = folders.length; i > 0 ; i--) {
      let folder = folders.slice(0, i).join('/')
      fs.rmdirSync(folder);
    }
  }

  static moveFilesToPath(prefixPath, runtime) {
    let fileType = FileManager.getFileType(runtime);
    let files = []

    fs.readdirSync('.').forEach(file => {
      if(file.indexOf(fileType) > -1) {
        files.push(file);
      }
    });

    for(let file of files) {
      fs.renameSync(file, prefixPath + '/' + file);
    }
  }

  static moveFilesBack(prefixPath,) {
    let files = []

    fs.readdirSync(prefixPath).forEach(file => {
      files.push(file);
    });

    for(let file of files) {
      fs.renameSync(prefixPath + '/' + file, file);
    }
  }

  static getFileType(runtime) {
    for(let runtimeType of Object.keys(runtimes)) {
      if(runtime.indexOf(runtimeType) > -1) {
        return runtimes[runtimeType];
      }
    }
  }
}

module.exports = FileManager;