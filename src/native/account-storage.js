import nanoid from 'nanoid';

import { Storage } from './storage';

export class AccountStorage extends Storage {

  constructor (onUpdate) {
    super('53cr375', { accounts: [] });

    this.onUpdate = onUpdate;
  }

  getAccounts () {
    return this.get('accounts', []);
  }

  addAccount ({ id, type, name, secret, issuer }) {
    const account = { id: id || nanoid(), type, name, secret, issuer };

    this.set('accounts',
      this
        .get('accounts')
        .concat(account)
    );

    this.onUpdate(this.get('accounts'));

    console.debug(`${name} added!`);
  }

  updateAccount (account) {
    this.deleteAccount(account);
    this.addAccount(account);

    console.debug(`${account.name} updated!`);
  }

  deleteAccount ({ id }) {
    this.set('accounts',
      this
        .get('accounts')
        .filter(account => account.id !== id)
    );

    console.debug(`${id} has been removed`);
  }

}
