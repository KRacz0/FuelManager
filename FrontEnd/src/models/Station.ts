export default interface Station {
  id: number
  name: string
  brand: string
  address: string
  latitude: number
  longitude: number
  fuel_diesel: number | null
  fuel_gasoline: number | null
  fuel_lpg: number | null
  last_updated: string
}
