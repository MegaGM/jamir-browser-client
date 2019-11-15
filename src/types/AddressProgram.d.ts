import AddressProgramRow from './AddressProgramRow'

export default interface AddressProgram {
  _id: string
  title: string
  editable?: boolean
  initialTitle?: string
  rows?: Array<AddressProgramRow>
  rowCount: number
}