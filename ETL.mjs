import fetch from 'node-fetch'
import CampusModel from './database/Campus.mjs'
import ExtensionProjectModel from './database/ExtensionProject.mjs'
import ParticipantModel from './database/Participant.mjs'
import _ from 'lodash'

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
    const uniq = {
      campus: _.uniqBy(data.map(m => ({
        codCampus: m.uo.uuid,
        nome: m.uo.nome,
        url: m.uo.url,
      })), 'codCampus'),
      participant: []
    }

    data.forEach(m => {
      uniq.participant.push(...m.participantes.map(mm => ({
        nome: mm.nome,
        matricula: mm.uuid,
      })))
    })

    uniq.participant = _.uniqBy(uniq.participant, 'matricula')

    console.log('Organize data to save in mongoDB \n')

    // save campus
    const campus = await CampusModel.create(uniq.campus)

    // save participants
    const participants = await ParticipantModel.create(uniq.participant)

    await Promise.all(data.map(async itemDataset => {
      const participantes = []

      itemDataset.participantes.forEach(participant => {
        const data = participants.find(f => f.matricula === participant.uuid)

        if (data) {
          participantes.push(data._id.toString())
        }
      })

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
        campus: campus.find(f => f.codCampus === itemDataset.uo.uuid)._id,
        participantes
      }

      await ExtensionProjectModel.create(extensionProject)
      this.extensionProject.push(extensionProject)
    }))

    console.log('---------------------\n\n Done!! ready!! \n\n--------------------------')
    return this
  }

}

export default ETL