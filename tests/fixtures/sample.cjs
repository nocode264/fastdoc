// CommonJS style
const db = require('./db');

function getUserById(id) {
  return db.find(id);
}

const createUser = function(name, email) {
  return db.insert({ name, email });
};

exports.getUser = function(id) {
  return getUserById(id);
};

exports.deleteUser = async function(id) {
  return db.delete(id);
};

module.exports.updateUser = (id, data) => {
  return db.update(id, data);
};