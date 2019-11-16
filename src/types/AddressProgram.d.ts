import AddressProgramRow from './AddressProgramRow'

export default interface AddressProgram {
  _id: string

  title: string
  initialTitle?: string

  cities: { [key: string]: number }

  rows?: Array<AddressProgramRow>
  totalRowCount: number
  queriedRowCount?: number

  editable?: boolean
}