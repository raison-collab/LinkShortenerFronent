import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [],
    currentLink: null,
    linkStats: null,
    userStats: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      totalPages: 0,
      totalLinks: 0,
    },
  }),
  
  getters: {
    getLinks: (state) => state.links,
    getCurrentLink: (state) => state.currentLink,
    getLinkStats: (state) => state.linkStats,
    getUserStats: (state) => state.userStats,
  },
  
  actions: {
    async fetchLinks(page = 1, limit = 20) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/links', {
          params: { page, limit }
        })
        this.links = response.data
        this.pagination = {
          ...this.pagination,
          page,
          limit,
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch links'
      } finally {
        this.loading = false
      }
    },
    
    async fetchLink(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get(`/links/${id}`)
        this.currentLink = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch link details'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async createLink(linkData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('/links', linkData)
        // Add the new link to the beginning of the array
        this.links = [response.data, ...this.links]
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create link'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async updateLink(id, linkData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.put(`/links/${id}`, linkData)
        
        // Update in the links array
        const index = this.links.findIndex(link => link.id === id)
        if (index !== -1) {
          this.links[index] = response.data
        }
        
        // Update current link if it's the same
        if (this.currentLink && this.currentLink.id === id) {
          this.currentLink = response.data
        }
        
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update link'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async deleteLink(id) {
      this.loading = true
      this.error = null
      
      try {
        await axios.delete(`/links/${id}`)
        
        // Remove from the links array
        this.links = this.links.filter(link => link.id !== id)
        
        // Clear current link if it's the same
        if (this.currentLink && this.currentLink.id === id) {
          this.currentLink = null
        }
        
        return true
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to delete link'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async fetchLinkStats(id, from, to) {
      this.loading = true
      this.error = null
      
      try {
        let params = {}
        if (from) params.from = from
        if (to) params.to = to
        
        const response = await axios.get(`/links/${id}/stats`, { params })
        this.linkStats = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch link statistics'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserStats() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.get('/users/me/stats')
        this.userStats = response.data
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch user statistics'
        return null
      } finally {
        this.loading = false
      }
    },
  },
}) 