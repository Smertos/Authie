export const promisify =
  func =>
    (...args) => new Promise(
      (res, rej) => func(...args, (err, data) => {
        if (err) rej(err);
        else res(data);
      }),
    );
