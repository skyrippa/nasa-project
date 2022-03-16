const { mongoDBInstance } = require('../../server.js')

afterAll(async () => {
    await mongoDBInstance.connection.close()
})