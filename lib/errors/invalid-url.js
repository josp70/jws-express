class InvalidUrl extends Error {
  constructor(message) {
    super();
    this.name = 'InvalidUrl';
    this.message = message;
    Error.captureStackTrace(this, InvalidUrl);
  }
}

exports.InvalidUrl = InvalidUrl;
