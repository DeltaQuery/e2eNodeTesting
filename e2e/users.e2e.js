const request = require("supertest")
const createApp = require("./../src/app")
const { models } = require("./../src/db/sequelize")
const { upSeed, downSeed } = require("./utils/umzug")

describe("tests for /users path", () => {
    let app = null
    let server = null
    let api = null

    beforeAll(async () => {
        app = createApp()
        server = app.listen(9000)
        api = request(app)
        await upSeed()
    })

    describe("GET /users/{id}", () => {
        test("should return a user", async () => {
            //Arrange
            const user = await models.User.findByPk("1")
            //Act
            const { statusCode, body } = await api.get(`/api/v1/users/${user.id}`)
            //Assert
            expect(statusCode).toEqual(200)
            expect(body.id).toEqual(user.id)
            expect(body.email).toEqual(user.email)
            //expect(response.body.message).toMatch(/email/)
        })
    })

    describe("POST /users", () => {
        test("should return a 400 Bad Request with invalid password", async () => {
            //Arrange
            const inputData = {
                email: "delta@gmail.com",
                password: "-----"
            }
            //Act
            const response = await api.post("/api/v1/users").send(inputData)
            //Assert
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toMatch(/password/)
        })

        test("should return a 400 Bad Request with invalid email", async () => {
            //Arrange
            const inputData = {
                email: "------",
                password: "validpassword"
            }
            //Act
            const response = await api.post("/api/v1/users").send(inputData)
            //Assert
            expect(response.statusCode).toBe(400)
            expect(response.body.message).toMatch(/email/)
        })

        //test with valid data
        test("should return a new user", async () => {
            //Arrange
            const inputData = {
                email: "pepito@mail.com",
                password: "pepito123"
            }
            //Act
            const { statusCode, body } = await api.post("/api/v1/users").send(inputData)
            expect(statusCode).toBe(201)
            //Assert
            const user = await models.User.findByPk(body.id)
            console.log(user)
            expect(user).toBeTruthy()
            expect(user.role).toEqual("admin")
            expect(user.email).toEqual(inputData.email)
        })
    })

    describe("PUT /users", () => {
        //tests for /users
        test("should return", () => {
            
        })
    })

    describe("DELETE /users", () => {
        //tests for /users
    })

    afterAll(async () => {
        await server.close()
        await downSeed()
    })
})

