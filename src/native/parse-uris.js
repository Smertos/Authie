export function parseURIs (accountStore, codes) {
  const filterRegex = /^otpauth:\/\/(\w+)\/([^\s]+)\?([^=\s]+=[^=\s]+)((?:&[^=\s]+=[^=\s]+)*)$/gm;

  codes.forEach(code => {
    const matches = filterRegex.exec(code);
    if (matches && matches.length) {
      let params = [];

      matches.forEach((match, index) => {
        switch(index) {
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
    }
  });
}
