import { app } from 'electron'
import { access, constants, readFile, writeFile } from 'fs'
import { resolve } from 'path'
import mkdirp from 'mkdirp'

const promisify = 
  func =>
    (...args) => new Promise(
      (resolve, reject) => func(...args, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    )

const accessAsync    = promisify(access),
      readFileAsync  = promisify(readFile),
      writeFileAsync = promisify(writeFile)

export default class Storage {

  constructor (filePath) {
    this.data = {}
    this.filePath = resolve(app.getPath('home'), '.Authie', filePath)

    mkdirp(resolve(app.getPath('home'), '.Authie'))
  }

  get = (key) => {
    let props = key.split('.'),
      current = this.data,
      prop
    
    while (props.length) {
      prop = props.shift()
      current = current[prop]
    }

    return current;
  }

  set = (key, value) => {
    this.data = deepSet(this.data, key, value)
    this.save()
  }

  load = () => {
    accessAsync(this.filePath, constants.F_OK | constants.R_OK | constants.W_OK)
      .then(() =>
        readFileAsync(this.filePath)
          .then(content => {
            this.data = JSON.parse(content)
          })
      )
      .catch(console.error)
  }

  save = () => {
    writeFileAsync(this.filePath, JSON.stringify(this.data))
      .then(() => console.log('Accounts saved'))
      .catch(console.error)
  }

}

// TODO: Replace with module 'deep-set'
function deepSet (obj, path, value) {
  let properties = path.split('.'),
      currentObj = obj,
      property

  while (properties.length) {
    property = properties.shift()

    if (!currentObj) break

    if (!isObject(currentObj[property])) {
      currentObj[property]= {}
    }

    if (!properties.length) {
      currentObj[property] = value
    }

    currentObj = currentObj[properties]
  }

  return obj
}

function isObject (obj) {
  return typeof obj === 'object' && obj !== null
}

