import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getStations, getStationById, addStation, updateStation, removeStation, addStationMsg, removeStationMsg } from './station.controller.js'

export const stationRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

stationRoutes.get('/', log, getStations)
stationRoutes.get('/:id', getStationById)
stationRoutes.post('/',requireAuth, addStation)
stationRoutes.put('/:id', updateStation)
stationRoutes.delete('/:id', removeStation)

// router.delete('/:id', requireAuth, requireAdmin, removeStation)

stationRoutes.post('/:id/msg', requireAuth, addStationMsg)
stationRoutes.delete('/:id/msg/:msgId', requireAuth, removeStationMsg)