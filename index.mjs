import ETL from "./ETL.mjs"

// base to start application
(async () => {
  const dataset = "https://dados.ifpb.edu.br/dataset/029b50a4-f50a-422d-867f-b457277b5168/resource/d3b1908b-e6d6-4437-aefb-281b7b1b57ea/download/projetos-extensao.json"

  const etl = new ETL(dataset)
  await etl.processing()

})()