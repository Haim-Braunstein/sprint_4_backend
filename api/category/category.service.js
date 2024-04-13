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

  export const categoryService = {
    query,
  
  }
  