import {
  app,
  BrowserWindow,
  ipcMain as ipc,
} from 'electron';
// import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';

import { Storage } from './native/storage';
import { AccountStorage } from './native/account-storage';
import { scanQRCode } from './native/scan-qr-code';

const isDevMode = process.execPath.match(/[\\/]electron/);
const configStore = new Storage('config.json', {
  isPasswordSet: false
});

configStore.load();

let mainWindow;

if (isDevMode) {
  enableLiveReload({ strategy: 'react-hmr' });
}

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Authie',
    frame: false
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  /*
   *if (isDevMode) {
   *  await installExtension(REACT_DEVELOPER_TOOLS).catch(console.error);
   *}
   */

  const accountStore = new AccountStorage(accounts => mainWindow.webContents.emit('accounts', accounts));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  ipc.on('get-settings', (event) => {
    event.sender.send('settings', {
      isPasswordSet: configStore.get('isPasswordSet', false)
    });
  });

  ipc.on('load', (event, password) => {
    accountStore.load(password);
    event.sender.send('accounts', accountStore.getAccounts());
  });

  ipc.on('add-password', (event, password) => {
    accountStore.save(password);
    configStore.set('isPasswordSet', true);
  });

  ipc.on('remove-password', (event, password) => {
    accountStore.save();
    configStore.set('isPasswordSet', false);
  });

  ipc.on('get-accounts', (event) => {
    event.sender.send('accounts', accountStore.getAccounts());
  });

  ipc.on('add-account', (event, args) => {
    accountStore.addAccount(args);
    event.sender.send('accounts', accountStore.getAccounts());
  });

  ipc.on('update-account', (event, account) => accountStore.updateAccount(account));
  ipc.on('delete-account', (event, account) => accountStore.deleteAccount(account));

	ipc.on(
    'scan-qr-code',
    event => scanQRCode(
      accountStore,
      () => mainWindow.webContents.emit('accounts', accountStore.getAccounts())
    )
  );
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

