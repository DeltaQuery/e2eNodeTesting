const request = require("supertest")
const createApp = require("./../src/app")
const { models } = require("./../src/db/sequelize")
const { upSeed, downSeed } = require("./utils/umzug")

describe("tests for /profile path", () => {
    let app = null
    let server = null
    let api = null
    let accessToken = null

    beforeAll(async () => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
        await upSeed()
    })

    describe("GET /my-user", () => {
        beforeAll(async () => {
            const user = await models.User.findByPk("1")
            const inputData = {
                email: user.email,
                password: "admin123"
            }
            //Act
            const { body: bodyLogin } = await api.post("/api/v1/auth/login").send(inputData)
            accessToken = bodyLogin.access_token
        })

        test("should return 401", async () => {
            const { statusCode } = await api.get(`/api/v1/profile/my-user`).set({
                "Authorization": `Bearer wrwer`
            })
            //Assert
            expect(statusCode).toEqual(401)
        })

        test("should return an user with valid access token", async () => {
            //Arrange
            const user = await models.User.findByPk("1")
            //Act
            const { statusCode, body } = await api.get(`/api/v1/profile/my-user`).set({
                "Authorization": `Bearer ${accessToken}`
            })
            //Assert
            expect(statusCode).toEqual(200)
            expect(body.email).toEqual(user.email)
        })
        afterAll(() => {
            accessToken = null
        })
    })

    afterAll(async () => {
        await server.close()
        await downSeed()
    })
})

