class InvalidKeyStore extends Error {
  constructor(message, data) {
    super();
    this.name = 'InvalidKeyStore';
    this.message = message;
    this.data = data;
    Error.captureStackTrace(this, InvalidKeyStore);
  }
}

exports.InvalidKeyStore = InvalidKeyStore;
