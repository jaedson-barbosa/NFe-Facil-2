import * as nfeSchema from './data/nfe.json'

const rootNFe =
  nfeSchema['xs:schema']['xs:complexType'][0]['xs:sequence']['xs:element'][0]
export const elementosNFe =
  rootNFe['xs:complexType']['xs:sequence']['xs:element']