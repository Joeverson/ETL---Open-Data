import Database from './index.mjs'

var schema = new Database.Schema({
  codProjeto: String,
  titulo: String,
  url: String,
  dataExecucao: String,
  dataFimEsxecucao: String,
  resumo: String,
  justificativa: String,
  valorExecuçao: Number,
  statusDeAprovacao: Boolean,
  resultados: String,
  focoTecnologicoo: String,
  areaConhecimento: String,
  campus: {
    type: Database.Schema.Types.ObjectId,
    ref: 'Campus'
  },
  participantes: [
    {
      type: Database.Schema.Types.ObjectId,
      ref: 'Participants'
    }
  ]
});

export default Database.model('ExtensionProject', schema)