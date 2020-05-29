import Database from './index.mjs'

var schema = new Database.Schema({
  nome: String,
  matricula: String
});

export default Database.model('Participant', schema)