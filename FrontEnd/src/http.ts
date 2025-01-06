import axios from 'axios'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') // Pobierz token z localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}` // Dodaj token do nagłówka
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      useToast().default(response.data.message)
    }
    return response
  },
  (error) => {
    if (error.response?.data?.error) {
      useToast().default(error.response.data.error)
    }
    return Promise.reject(error)
  },
)

export default http
