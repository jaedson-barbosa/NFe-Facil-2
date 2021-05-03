import * as nfeSchema from './data/nfe.json'

const rootNFe =
  nfeSchema['schema']['complexType'][0]['sequence']['element'][0]
export const elementosNFe =
  rootNFe['complexType']['sequence']['element']