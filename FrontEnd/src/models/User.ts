export default interface User {
  id: number
  email: string
  password: string
  role: string
  is_banned: number
  created_at: string
  points: number
}
