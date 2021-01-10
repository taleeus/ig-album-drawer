const MongoClient = require('mongodb').MongoClient

const uri = process.env.MONGO_URI

async function connectToDb(callback) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  
  try {
    await client.connect()
    const database = client.db('ig')

    return await callback(database)
  } finally {
    client.close()
  }
}

async function fetchAlbums() {
  return connectToDb(async db => {
    const albumList = await db.collection('albums').find()
    return albumList.map(it => it.uri).toArray()
  })
}

async function peekAlbums() {
  const albumList = await fetchAlbums()
  let extracted = []
  for (let index = 0; index < 3; index++) {
    extracted.push(albumList.filter(it => extracted.indexOf(it) < 0)[Math.floor((Math.random() * albumList.length))])
  }

  return extracted
}

async function removeAlbums(albumToRemoveList) {
  return connectToDb(async db => {
    const albums = db.collection('albums')
    await albums.deleteMany({ uri: { $in: albumToRemoveList }})
    
    const albumList = await albums.find()
    return albumList.map(it => it.uri).toArray()
  })
}

async function addAlbums(albumToAddList) {
  return connectToDb(async db => {
    const albums = db.collection('albums')
    await albums.insertMany(albumToAddList.map(it => ({ uri: it })))

    const albumList = await albums.find()
    return albumList.map(it => it.uri).toArray()
  })
}

module.exports = {
  fetchAlbums,
  peekAlbums,
  removeAlbums,
  addAlbums,
}