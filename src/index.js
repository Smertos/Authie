import {
  app,
  BrowserWindow,
  ipcMain as ipc
} from 'electron';
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import { AccountStorage } from './native/account-storage';
import { scanQRCode } from './native/scan-qr-code';

const isDevMode = process.execPath.match(/[\\/]electron/);
const accountStore = new AccountStorage();

accountStore.load();

let mainWindow;

if (isDevMode) {
  enableLiveReload({ strategy: 'react-hmr' });
}

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (isDevMode) {
    // await installExtension(REACT_DEVELOPER_TOOLS).catch(console.error);
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipc.on('get-accounts', (event) => {
    event.sender.send('accounts', accountStore.getAccounts());
  });

  ipc.on('add-account', (event, args) => {
    accountStore.addAccount(args);
    event.sender.send('accounts', accountStore.getAccounts());
  });

  ipc.on('scan-qr-code', scanQRCode);
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

