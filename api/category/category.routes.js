import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getCategories } from './category.controller.js'
import { getCategoryById } from './category.controller.js'

export const categoryRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

categoryRoutes.get('/', log, getCategories)
categoryRoutes.get('/:id', getCategoryById)


// router.delete('/:id', requireAuth, requireAdmin, removeStation)
