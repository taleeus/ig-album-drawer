require('dotenv').config()

const { expect } = require('chai')
const { fetchAlbums, addAlbums, removeAlbums } = require('../src/functions')

const testStrings = ['heeeeeeeeeeeeeeeeeeeeeeeeeeeey', 'listen']

describe('Crud operations', () => {
  it('Should add albums', async () => {
    const albumList = await fetchAlbums()
    expect(await addAlbums(testStrings)).to.have.all.members(albumList.concat(testStrings))
  })

  it('Should remove albums', async () => {
    expect(await removeAlbums(testStrings)).to.have.all.members(await fetchAlbums())
  })
})