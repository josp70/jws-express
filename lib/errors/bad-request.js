class BadRequest extends Error {
  constructor(message, data) {
    super();
    this.name = 'BadRequest';
    this.message = message;
    this.data = data;
    Error.captureStackTrace(this, BadRequest);
  }
}

exports.BadRequest = BadRequest;
