import { defineStore } from 'pinia'

function decodeJwt(token: string) {
  const base64Url = token.split('.')[1] // Wyciągamy część payload (druga część)
  const base64 = base64Url.replace('-', '+').replace('_', '/')
  const jsonPayload = atob(base64) // Dekodowanie Base64
  console.log(jsonPayload)
  return JSON.parse(jsonPayload) // Przekształcamy w obiekt JSON
}

function userFromToken(token: string) {
  const userData = decodeJwt(token)
  const user = {
    email: userData.email,
    role: userData.role,
    exp: userData.exp,
  }
  return user
}

function emptyUser() {
  const user = {
    email: '',
    role: '',
    exp: 0,
  }
  return user
}

export const useUserStore = defineStore('user', {
  state: () => {
    // Sprawdzenie, czy w localStorage są zapisane dane
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      const user = userFromToken(storedToken)
      if (user.exp > Math.floor(Date.now() / 1000)) {
        return user
      }
    }
    return emptyUser()
  },
  actions: {
    setUser(token: string) {
      const user = userFromToken(token)
      this.$state = user // Ustawienie nowego stanu
      localStorage.setItem('token', token)
    },
    clearUser() {
      this.$state = emptyUser()
      localStorage.removeItem('token')
    },
  },
})
