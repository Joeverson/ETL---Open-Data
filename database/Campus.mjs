import Database from './index.mjs'

var schema = new Database.Schema({
  codCampus: String,
  nome: String,
  url: String
});

export default Database.model('Campus', schema)