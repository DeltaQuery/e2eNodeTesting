const sequelize = require("./../../src/db/sequelize")
const { models } = sequelize
const bcrypt = require("bcrypt")

const upSeed = async () => {
    try {
        //create tables
        await sequelize.sync({ force: true })
        const password = "admin123"
        const hash = await bcrypt.hash(password, 10)
        await models.User.create({
            email: "admin@mail.com",
            password: hash,
            role: "admin"
        })
        await models.Category.bulkCreate([
            {
                name: "Category 1",
                image: "https://anyurl.com"
            },
            {
                name: "Category 2",
                image: "https://anyurl.com"
            }
        ])
    } catch (e) {
        console.error(e)
    }
}

const downSeed = async () => {
    //drop tables and data
    await sequelize.drop()
}

module.exports = { upSeed, downSeed }