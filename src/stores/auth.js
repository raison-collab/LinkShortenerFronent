import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => {
    let storedUser = null;
    try {
      const userItem = localStorage.getItem('user');
      storedUser = userItem ? JSON.parse(userItem) : null;
    } catch (error) {
      console.warn('Failed to parse user from localStorage:', error);
      localStorage.removeItem('user');
    }

    return {
      user: storedUser,
      token: localStorage.getItem('auth_token') || null,
      loading: false,
      error: null,
    };
  },
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  
  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/auth/login', { email, password })
        this.user = response.data.user
        this.token = response.data.token
        
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'An error occurred during login'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async register(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/auth/register', { email, password })
        this.user = response.data.user
        this.token = response.data.token
        
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'An error occurred during registration'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserProfile() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/users/me')
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch user profile'
      } finally {
        this.loading = false
      }
    },
    
    async updateProfile(data) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put('/users/me', data)
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update profile'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async changePassword(oldPassword, newPassword) {
      this.loading = true
      this.error = null
      
      try {
        await axios.put('/users/me/password', { old_password: oldPassword, new_password: newPassword })
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to change password'
        return false
      } finally {
        this.loading = false
      }
    },
    
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },
  },
}) 