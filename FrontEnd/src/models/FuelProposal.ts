export default interface FuelProposal {
  id: number
  station_id: number
  fuel_type: String
  new_price: number
  user_id: number
  created_at: Date
  status: String
  image_path: String
}
