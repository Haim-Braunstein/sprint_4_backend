import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

async function query(filterBy = { txt: '' }, sortBy) {
  let criteria = {}

  try {
    if (filterBy.txt) {
      criteria.name = { $regex: filterBy.txt, $options: 'i' }
    }
    const collection = await dbService.getCollection('station')
    const stations = await collection.find(criteria).sort(sortBy).toArray()

    return stations
  } catch (err) {
    logger.error('cannot find stations', err)
    throw err
  }
}

async function getById(stationId) {
  try {
    const collection = await dbService.getCollection('station')
    const station = collection.findOne({ _id: new ObjectId(stationId) })
    return station
  } catch (err) {
    logger.error(`while finding station ${stationId}`, err)
    throw err
  }
}

async function remove(stationId) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.deleteOne({ _id: new ObjectId(stationId) })
  } catch (err) {
    logger.error(`cannot remove station ${stationId}`, err)
    throw err
  }
}

async function add(station) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.insertOne(station)
    return station
  } catch (err) {
    logger.error('cannot insert station', err)
    throw err
  }
}

async function update(station) {
  try {
    // const stationToSave = {
    //   name: station.name,
    //   price: station.price,
    //   inStock: station.inStock,
    //   review: station.review,
    // }

     const stationToSave = {
      songs:station.songs,
      name:station.name,
      imgUrl:station.imgUrl
    }
    const collection = await dbService.getCollection('station')
    await collection.updateOne(
      { _id: new ObjectId(station._id) },
      { $set: stationToSave }
    )
    return station
  } catch (err) {
    logger.error(`cannot update station ${station}`, err)
    throw err
  }
}

async function addStationMsg(stationId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('station')
    await collection.updateOne(
      { _id: new ObjectId(stationId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add station msg ${stationId}`, err)
    throw err
  }
}

async function removeStationMsg(stationId, msgId) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.updateOne(
      { _id: new ObjectId(stationId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add station msg ${stationId}`, err)
    throw err
  }
}

export const stationService = {
  remove,
  query,
  getById,
  add,
  update,
  addStationMsg,
  removeStationMsg,
}
