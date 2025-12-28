// user.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { useRouter } from 'vue-router'
import router from '@/router/index'
import AuthService from '@/services/AuthService'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  // const router = useRouter()

  const language = ref(localStorage.getItem('lang') || 'en')
  const token = ref(localStorage.getItem('access_token') || '')
  const user = ref({})
  let errorMessage = ref('')
  const exp = ref(0)

  async function logIn(data) {
    try {
      const response = await AuthService.logIn(data)
      if (response.success) {
        user.value = response.data
        token.value = response.token
        localStorage.setItem('access_token', response.token)
        const decodedToken = jwtDecode(token.value)
        exp.value = decodedToken.exp
        localStorage.setItem('role', user.value.role)
        localStorage.setItem('avatar', user.value.avatar)
        localStorage.setItem('name', user.value.name)

        AuthService.setHeader(token.value)
        return true
      }
    } catch (error) {
      // alert('error.response.data.message')

      if (error.response && error.response.data && error.response.status === 404) {
        errorMessage.value = error.response.data.message
      } else {
        router.push({ name: 'NetworkError' })
        // errorMessage.value = 'An unexpected error occurred.'
      }
    }
    // router.push({ name: 'NetworkError' })
    //
  }

async function UserLogin(data) {
  try {
    const response = await AuthService.UserLogin(data)
    if (response.success) {
      user.value = response.data
      token.value = response.token
      localStorage.setItem('access_token', response.token)
      localStorage.setItem('role', 'user')  // role is set manually on frontend
      localStorage.setItem('name', user.value.name)

      const decodedToken = jwtDecode(token.value)
      exp.value = decodedToken.exp

      AuthService.setHeader(token.value)
      return true
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.status === 404) {
      errorMessage.value = error.response.data.message
    } else {
      router.push({ name: 'NetworkError' })
    }
  }
}


  function logOut() {
    token.value = ''
    user.value = {}
    AuthService.removeHeader()

    return true
  }

  function isAuthenticated() {
    return localStorage.getItem('access_token') !== ''
  }

  function expiryDate() {
    if (localStorage.getItem('access_token') || token.value) {
      const decodedToken = jwtDecode(localStorage.getItem('access_token') || token.value)
      exp.value = decodedToken.exp
      return parseInt(exp.value * 1000) < parseInt(new Date().getTime())
    } else {
      return false
    }
  }

  function userHasPermission(role) {
    return role.indexOf(user.value.role) !== -1 || role.indexOf(localStorage.getItem('role')) !== -1
  }

  return {
    user,
    token,
    language,
    logIn,
    UserLogin,
    logOut,
    isAuthenticated,
    userHasPermission,
    errorMessage,
    expiryDate
  }
})
