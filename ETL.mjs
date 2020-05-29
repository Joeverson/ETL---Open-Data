import fetch from 'node-fetch'
import CampusModel from './database/Campus.mjs'
import ExtensionProjectModel from './database/ExtensionProject.mjs'
import ParticipantModel from './database/Participant.mjs'

/**
 * Class to do ETL in dataset
 * **/
class ETL {
  constructor(url) {
    this.url = url || ""
    this.campus = []
    this.extensionProject = []
    this.participants = []

    console.log('---------------------\n\n Start the ETL \n\n--------------------------')
  }

  // capture the data
  async getData() {
    console.log('\nGetting data... \n')
    try {
      const result = await fetch(this.url)
      console.log('Done! Getting data...\n')
      return result.json()
    } catch (err) {
      throw "\n\n-----------------------\nERROR001 - Error to access dataset\n--------------------------\n\n"
    }
  }

  // prepare the data to converter
  async processing() {
    const data = await this.getData()
    console.log('Organize data to save in mongoDB \n')

    data.forEach(async itemDataset => {
      // get data campus
      const campus = {
        codCampus: itemDataset.uo.uuid,
        nome: itemDataset.uo.nome,
        url: itemDataset.uo.url,
      }

      const resultCampus = await CampusModel.create(campus)
      this.campus.push(campus)

      // get data of participants
      const participants = []

      itemDataset.participantes.forEach(participant => {
        participants.push({
          nome: participant.nome,
          matricula: participant.uuid,
        })
      })

      this.participants.push(...participants)
      const resultParticipants = await ParticipantModel.create(participants)

      // get data of project extension
      const extensionProject = {
        codProjeto: itemDataset.uuid,
        titulo: itemDataset.titulo,
        url: itemDataset.url,
        dataExecucao: itemDataset.inicio_execucao,
        dataFimEsxecucao: itemDataset.fim_execucao,
        resumo: itemDataset.resumo,
        justificativa: itemDataset.justificativa,
        valorExecuçao: itemDataset.valor_total_executado,
        statusDeAprovacao: itemDataset.aprovado,
        resultados: itemDataset.resultados_esperados,
        focoTecnologicoo: itemDataset.foco_tecnologico,
        areaConhecimento: itemDataset.area_conhecimento,
        campus: resultCampus._id,
        participantes: resultParticipants.map(m => m._id.toString())
      }

      await ExtensionProjectModel.create(extensionProject)
      this.extensionProject.push(extensionProject)
    });

    console.log('---------------------\n\n Done!! ready!! \n\n--------------------------')
    return this
  }

}

export default ETL