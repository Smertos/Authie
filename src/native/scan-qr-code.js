import { dialog } from 'electron';
import { decode } from 'node-quirc';
import sharp from 'sharp';
import { readFile } from 'fs';

import { promisify } from './promisify';
import { parseURIs } from './parse-uris';

const readFileAsync = promisify(readFile);
const decodeAsync = promisify(decode);

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
    const fileExt = filePath.split('.').slice(-1)[0];

    readFileAsync(filePaths[0])
      .then(image => sharp(image).png().toBuffer())
      .then(decodeAsync)
      .then(codes => {
        const parsedCodes = codes.filter(code => code && code.data);
        parseURIs(accountStore, parsedCodes);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}
