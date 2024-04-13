import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
import { authService } from '../auth/auth.service.js'
const { ObjectId } = mongodb

async function query(filterBy = {}) {

  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('review')
    var reviews = await collection
      .aggregate([
        {
          $match: criteria,
        },
        // This stage performs a left outer join ($lookup) with the 'users' collection. 
        // It matches documents from the 'review' collection with documents from the 'users'
        // collection where the byUserId field in the 'review' collection matches the _id field 
        // in the 'users' collection. The result is added to the byUser array.
        {
          $lookup: {
            localField: 'byUserId',
            from: 'user',
            foreignField: '_id',
            as: 'byUser',
          },
        },
        // This stage deconstructs the byUser array created by the $lookup stage, 
        // creating a new document for each element in the array. It effectively flattens the array, 
        // and each document now represents a combination of the original 'review' document 
        // and the corresponding 'users' document.
        {
          $unwind: '$byUser',
        },
        {
          $lookup: {
            localField: 'aboutToyId',
            from: 'toy',
            foreignField: '_id',
            as: 'aboutToy',
          },
        },
        {
          $unwind: '$aboutToy',
        },
        {
          $project: {
            _id: true,
            txt: 1,
            byUser: { _id: 1, fullname: 1 },
            aboutToy: { _id: 1, name: 1,price:1 },
          },
        },
      ])
      .toArray()

    // reviews = reviews.map(review => {
    //     review.user = { _id: review.user._id, fullname: review.user.fullname }
    //     review.toy = { _id: review.toy._id, name: review.toy.name, price: review.toy.price }
    //     delete review.userId
    //     delete review.toyId
    //     return review
    // })

    return reviews
  } catch (err) {
    logger.error('cannot find reviews', err)
    throw err
  }
}

async function remove(reviewId) {
  try {

    const { loggedinUser } = asyncLocalStorage.getStore()
    const collection = await dbService.getCollection('review')
    // remove only if user is owner/admin
    const criteria = { _id: new ObjectId(reviewId) }
    if (!loggedinUser.isAdmin) criteria.byUserId = new ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

async function add(review) {
  // check
  try {
    const reviewToAdd = {
      byUserId: new ObjectId(review.byUserId),
      aboutToyId: new ObjectId(review.aboutToyId),
      txt: review.txt,
    }
    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)
    return reviewToAdd
  } catch (err) {
    logger.error('cannot insert review', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.byUserId) criteria.byUserId = new ObjectId(filterBy.byUserId)
  if (filterBy.aboutToyId)
    criteria.aboutToyId = new ObjectId(filterBy.aboutToyId)
  return criteria
}

export const reviewService = {
  query,
  remove,
  add,
}
