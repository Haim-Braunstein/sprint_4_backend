import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from "../../services/db.service.js"
import { logger } from "../../services/logger.service.js"

async function query() {

  try {
    const collection = await dbService.getCollection('category')
    const categories = await collection.find().toArray()

    return categories
  } catch (err) {
    logger.error('cannot find categories', err)
    throw err
  }
}

async function getById(categoryId) {
  console.log("🚀 ~ getById ~ categoryId:", categoryId)

  try {
    const collection = await dbService.getCollection('category')
    const category = collection.findOne({ _id: new ObjectId(categoryId) })
    console.log("🚀 ~ getById ~ category:", category)

    return category
  } catch (err) {
    logger.error(`while finding category ${categoryId}`, err)
    throw err
  }
}

export const categoryService = {
  query,
  getById,
}
