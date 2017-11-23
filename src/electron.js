import { app, BrowserWindow, ipcMain as ipc } from 'electron'
import { resolve } from 'path'
import AccountStorage from './native/account-storage'

const accountStore = new AccountStorage()
accountStore.load()

let win = null

app.on('ready', () => {
  win = new BrowserWindow({
    minWidth: 640,
    width: 800,
    minHeight: 480,
    height: 600,
    frame: false,
    shown: false,
  })

  win.loadURL(`file://${resolve(__dirname, 'index.html')}`)

  ipc.on('get-accounts', (event) => {
    event.sender.send('accounts', accountStore.getAccounts())
    console.log('get-accounts', accountStore.getAccounts())
  })

  ipc.on('add-account', (event, args) => {
    accountStore.addAccount(args)
    event.sender.send('accounts', accountStore.getAccounts())
  })

  win.show()
})

