import { dialog } from 'electron';
import QrCode from 'qrcode-reader';
import sharp from 'sharp';
import { readFile } from 'fs';

import { promisify } from './promisify';
import { parseURI } from './parse-uri';

const readFileAsync = promisify(readFile);

export function scanQRCode (accountStore) {
  dialog.showOpenDialog({
    title: 'Select an image containing QR code',
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'gif', 'webp', 'tiff', 'svg'] }
    ]
  }, (filePaths) => {
    if (!filePaths || filePaths.length === 0) return;

    const filePath = filePaths[0];

    readFileAsync(filePath)
      .then(image => new Promise((res, rej) => {
        sharp(image).raw().toBuffer((err, buffer, info) => {
          if (err) rej(err);
          else res([buffer, info]);
        });
      }))
      .then(([buffer, info]) => new Promise((res, rej) => {
        const qr = new QrCode();

        qr.callback = (err, result) => {
          if (err) rej(err);
          else res(result);
        };

        qr.decode(info, buffer);
      }))
      .then(({ result }) => {
        console.log('QR code:', result);
        parseURI(accountStore, result);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
