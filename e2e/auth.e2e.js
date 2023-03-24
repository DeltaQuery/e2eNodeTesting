const request = require("supertest")
const createApp = require("../src/app")
const { models } = require("../src/db/sequelize")
const { upSeed, downSeed } = require("./utils/umzug")

const mockSendMail = jest.fn()

jest.mock("nodemailer", () => {
    return {
        createTransport: jest.fn().mockImplementation(() => {
            return {
                sendMail: mockSendMail
            }
        })
    }
})

describe("tests for /auth path", () => {
    let app = null
    let server = null
    let api = null

    beforeAll(async () => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
        await upSeed()
    })

    describe("POST /login", () => {
        test("should return a 401", async () => {
            //Arrange
            const inputData = {
                email: "emailfake@gmail.com",
                password: "noexiste"
            }
            //Act
            const { statusCode } = await api.post(`/api/v1/auth/login`).send(inputData)
            //Assert
            expect(statusCode).toEqual(401)
            //expect(body.id).toEqual(user.id)
            //expect(body.email).toEqual(user.email)
            //expect(response.body.message).toMatch(/email/)
        })
        test("should return a 200", async () => {
            //Arrange
            const user = await models.User.findByPk("1")
            const inputData = {
                email: user.email,
                password: "admin123"
            }
            //Act
            const { statusCode, body } = await api.post(`/api/v1/auth/login`).send(inputData)
            //Assert
            expect(statusCode).toEqual(200)
            expect(body.access_token).toBeTruthy()
            expect(body.user.email).toEqual(inputData.email)
            expect(body.user.password).toBeUndefined()

            //expect(body.id).toEqual(user.id)
            //expect(body.email).toEqual(user.email)
            //expect(response.body.message).toMatch(/email/)
        })
    })

    describe("POST /recovery", () => {
        beforeAll(() => {
            mockSendMail.mockClear()
        })

        test("should return a 401", async () => {
            //Arrange
            const inputData = {
                email: "emailfake@gmail.com",
            }
            //Act
            const { statusCode } = await api.post(`/api/v1/auth/recovery`).send(inputData)
            //Assert
            expect(statusCode).toEqual(401)
        })

        test("should send mail", async () => {
            //Arrange
            const user = await models.User.findByPk("1")
            const inputData = {
                email: user.email,
            }
            //Act
            mockSendMail.mockResolvedValue(true)
            const { statusCode, body } = await api.post(`/api/v1/auth/recovery`).send(inputData)
            //Assert
            expect(statusCode).toEqual(200)
            expect(body.message).toEqual("mail sent")
            expect(mockSendMail).toHaveBeenCalled()
        })
    })

    afterAll(async () => {
        await server.close()
        await downSeed()
    })
})

