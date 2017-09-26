const { app, BrowserWindow, ipcMain } = require('electron')
const { resolve } = require('path')

let win = null

app.on('ready', () => {
  win = new BrowserWindow({
    minWidth: 640,
    width: 800,
    minHeight: 480,
    height: 600,
    frame: false,
  })

  win.loadURL(`file://${resolve(__dirname, 'index.html')}`)

  win.show()
})

