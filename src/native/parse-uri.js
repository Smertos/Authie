const filterRegex = /^otpauth:\/\/(\w+)\/([^\s]+)\?([^=\s]+=[^=\s]+)((?:&[^=\s]+=[^=\s]+)*)$/gm;

export function parseURI (accountStore, uri) {
  const matches = filterRegex.exec(uri);

  if (matches && matches.length) {
    const params = [];

    matches.forEach((match, index) => {
      switch (index) {
        case 0:
          return;

        case 1:
          params.push('type=' + match);
          break;

        case 2:
          params.push('name=' + match);
          break;

        case 3:
          params.push(match);
          break;

        default:
          params.push(match.slice(1));
      }
    });

    const account = params.reduce((obj, param) => {
      const [name, value] = param.split('=');

      return Object.assign(obj, { [name]: value });
    }, {});

    accountStore.addAccount(account);
  } else console.error('Couldn\'t find any accounts in given string');
}
