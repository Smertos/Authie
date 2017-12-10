import { app } from 'electron';
import { access, constants, readFile, writeFile } from 'fs';
import { resolve } from 'path';
import mkdirp from 'mkdirp';
import deepSet from 'deep-set';

import { promisify } from './promisify';

const accessAsync = promisify(access);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export class Storage {

  constructor (filePath) {
    this.data = {};
    this.filePath = resolve(app.getPath('home'), '.Authie', filePath);

    mkdirp(resolve(app.getPath('home'), '.Authie'));
  }

  get (key) {
    const props = key.split('.');
    let current = this.data;
    let prop;

    while (props.length) {
      prop = props.shift();
      current = current[prop];
    }

    return current;
  }

  set (key, value) {
    this.data = deepSet(this.data, key, value);
    this.save();
  }

  load () {
    accessAsync(this.filePath, constants.F_OK | constants.R_OK | constants.W_OK)
      .then(() =>
        readFileAsync(this.filePath)
          .then((content) => {
            this.data = JSON.parse(content);
          })
      )
      .catch(console.error);
  }

  save () {
    writeFileAsync(this.filePath, JSON.stringify(this.data))
      .then(() => console.log('Accounts saved'))
      .catch(console.error);
  }

}
