import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path, { dirname } from 'path'
import http from 'http'
import { fileURLToPath } from 'url'
import { logger } from './services/logger.service.js'
import { setupSocketAPI } from './services/socket.service.js'
import { Server } from 'socket.io'




const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

logger.info('server.js loaded...')

const app = express()
const server = http.createServer(app)


// Express App Config
app.use(cookieParser())
app.use(express.json())
// app.use(express.static('public'))

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:8080',
            'http://localhost:8080',
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
// import { reviewRoutes } from './api/review/review.routes.js'
import { stationRoutes } from './api/station/station.routes.js'
import { categoryRoutes } from './api/category/category.routes.js'

// routes
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/station', stationRoutes)
app.use('/api/category', categoryRoutes)
setupSocketAPI(server)

// app.use('/api/review', reviewRoutes)

// Make every unmatched server-side-route fall back to index.html
// So when requesting http://localhost:3030/index.html/station/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3033

server.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})