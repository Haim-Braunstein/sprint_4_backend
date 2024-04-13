import { logger } from '../../services/logger.service.js'
import { categoryService } from './category.service.js'

categoryService

//LIST
export async function getCategories(req, res) {
    try {
    
        logger.debug('Getting categories')
        const categories = await categoryService.query()
        res.json(categories)
    } catch (err) {
        logger.error('Failed to get categories', err)
        res.status(500).send({ err: 'Failed to get categories' })
    }
}
