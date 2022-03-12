const request = require('supertest')

const app = require('../../app.js')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
})

describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: 'USSR Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'January 20, 2025'
    }

    const launchDataWithoutDate = {
        mission: 'USSR Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f'
    }

    const launchDataWithInvalidDate = {
        mission: 'USSR Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-186 f',
        launchDate: 'zoott'
    }

    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .post('/launches')
            .send(completeLaunchData)
            .expect('Content-Type', /json/)
            .expect(201)

        const requestDate = new Date(completeLaunchData.launchDate).valueOf()
        const responseDate = new Date(response.body.launchDate).valueOf()
        expect(responseDate).toBe(requestDate)

        expect(response.body).toMatchObject(launchDataWithoutDate)
    })

    test('It should catch missing required properties', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Missing required launch proterty'
            })
    })

    test('It should catch invalid dates', async () => {
        const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Invalid launch date'
            })
    })
})