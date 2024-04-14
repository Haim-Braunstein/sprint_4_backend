import { logger } from '../../services/logger.service.js'
import { categoryService } from './category.service.js'

categoryService

//LIST
export async function getCategories(req, res) {
    console.log("🚀 ~ getCategories ~ req.query:", req.query)

    try {
        logger.debug('Getting categories')
        const categories = await categoryService.query()
        res.json(categories)
    } catch (err) {
        logger.error('Failed to get categories', err)
        res.status(500).send({ err: 'Failed to get categories' })
    }
}

export async function getCategoryById(req, res) {
    console.log("🚀 ~ getCategoryById ~ req.params:", req.params)

    try {
        const categoryId = req.params.id
        const category = await categoryService.getById(categoryId)
        res.json(category)
    } catch (err) {
        logger.error('Failed to get category', err)
        res.status(500).send({ err: 'Failed to get category' })
    }
}

