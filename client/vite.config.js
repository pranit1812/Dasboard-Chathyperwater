import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { feedbackStore } from './api/data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    // Configure a middleware to handle API requests in development
    middlewares: [
      (req, res, next) => {
        // Only handle API requests
        if (req.url.startsWith('/api/')) {
          // Add CORS headers
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          
          // Handle OPTIONS (preflight) requests
          if (req.method === 'OPTIONS') {
            res.statusCode = 204
            res.end()
            return
          }
          
          // Handle GET /api/feedback
          if (req.url === '/api/feedback' && req.method === 'GET') {
            const { projectName, sentiment, searchMethod } = req.query || {}
            
            // Filter data based on query parameters
            let filteredData = [...feedbackStore]
            
            if (projectName) {
              filteredData = filteredData.filter(item => item.projectName === projectName)
            }
            
            if (sentiment) {
              filteredData = filteredData.filter(item => item.sentiment === sentiment)
            }
            
            if (searchMethod) {
              filteredData = filteredData.filter(item => item.searchMethod === searchMethod)
            }
            
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(filteredData))
            return
          }
          
          // Handle POST /api/feedback
          if (req.url === '/api/feedback' && req.method === 'POST') {
            let body = ''
            
            req.on('data', chunk => {
              body += chunk.toString()
            })
            
            req.on('end', () => {
              try {
                const feedback = JSON.parse(body)
                
                // Validate required fields
                if (!feedback.id || !feedback.projectName || !feedback.sentiment) {
                  res.statusCode = 400
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({
                    success: false,
                    message: 'Missing required fields: id, projectName, sentiment'
                  }))
                  return
                }
                
                // Add to store
                feedbackStore.push(feedback)
                
                res.statusCode = 201
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true }))
              } catch {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({
                  success: false,
                  message: 'Invalid JSON payload'
                }))
              }
            })
            
            return
          }
          
          // Handle unknown API routes
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Not found' }))
          return
        }
        
        // Pass through non-API requests
        next()
      }
    ]
  }
})
