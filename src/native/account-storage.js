import { Storage } from './storage';

export class AccountStorage extends Storage {

  constructor () {
    super('53cr375');
    this.load();

    if (this.get('accounts')) {
      this.set('accounts', []);
    }
  }

  getAccounts () {
    return this.get('accounts');
  }

  addAccount ({ name, key, issuer }) {
    this.set('accounts',
      this
        .get('accounts')
        .concat({ name, key, issuer })
    );
    console.log(`${name} added!`);
  }

}
