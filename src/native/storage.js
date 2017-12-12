import { app } from 'electron';
import { access, constants, readFile, writeFile } from 'fs';
import { resolve } from 'path';
import { SHA256, AES, enc } from 'crypto-js';
import mkdirp from 'mkdirp';
import deepSet from 'deep-set';

import { promisify } from './promisify';

const accessAsync = promisify(access);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export class Storage {

  constructor (fileName, defaultData) {
    this.data = defaultData || {};
    this.fileName = fileName;
    this.filePath = resolve(app.getPath('home'), '.Authie', fileName);

    mkdirp(resolve(app.getPath('home'), '.Authie'));
  }

  get (key, defaultValue) {
    const props = key.split('.');
    let current = this.data;
    let prop;

    while (props.length) {
      prop = props.shift();
      current = current[prop];
    }

    return current || defaultValue;
  }

  set (key, value) {
    this.data = deepSet(this.data, key, value);
    this.save(this.password); // password gets defined by Storage#save
  }

  load (password) {
    this.password = password;

    const hashedPassword = SHA256(password).toString();

    accessAsync(this.filePath, constants.F_OK | constants.R_OK | constants.W_OK)
      .then(() => readFileAsync(this.filePath))
      .then(c => c.toString())
      .then((content) => {
        if (password !== undefined) {
          const split = content.split(':');

          if (split[0] === hashedPassword) {
            return AES.decrypt(split[1], password).toString(enc.Utf8);
          } else throw new Error('Incorrect password');

        } else return content;
      })
      .then((content) => {
        this.data = JSON.parse(content.toString());
      })
      .catch((err) => {
        if (err.code === 'ENOENT') this.save();
        else console.error(err);
      });
  }

  save (password) {
    this.password = password;

    const dataString = JSON.stringify(this.data);
    const hashedPassword = SHA256(password).toString();

    writeFileAsync(
      this.filePath,
      password !== undefined
        ? hashedPassword + ':' + AES.encrypt(dataString, password).toString()
        : dataString
    )
      .then(() => console.debug(this.fileName + ' saved'))
      .catch(console.error);
  }

}
