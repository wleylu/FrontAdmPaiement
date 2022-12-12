import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  init() {
    Storage.prototype._setItem = Storage.prototype.setItem;
    Storage.prototype._getItem = Storage.prototype.getItem;

    Storage.prototype.setItem = function (key, value) {
      this._setItem(key, CryptoJS.AES.encrypt(value, 'privatekey').toString());
    };

    Storage.prototype.getItem = function (key) {
      let value = this._getItem(key);
      if (value) {
        return CryptoJS.AES.decrypt(value, 'privatekey').toString(
          CryptoJS.enc.Utf8
        );
      } else {
        return null;
      }
    };
  }
}
