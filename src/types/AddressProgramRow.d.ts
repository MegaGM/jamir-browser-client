export default interface AddressProgramRow {
  _id: string
  city: string
  address: string
  streetName: string
  buildingBaseNumber: number

  reported: boolean
  checked: boolean
  workerId: string
  comment: string
  valid: boolean
  duplicate: boolean

  files: Array<object>
}