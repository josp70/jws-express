class WrongArguments extends Error {
  constructor(message) {
    super();
    this.name = 'WrongArguments';
    this.message = message;
    Error.captureStackTrace(this, WrongArguments);
  }
}

exports.WrongArguments = WrongArguments;
