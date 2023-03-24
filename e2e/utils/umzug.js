const sequelize = require("./../../src/db/sequelize")
const { models } = sequelize
const { Umzug, SequelizeStorage } = require("umzug")

const umzug = new Umzug({
    migrations: { glob: "./src/db/seeders/*.js"},
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize}),
    logger: undefined
})

const upSeed = async () => {
    try {
       await sequelize.sync({ force: true })
       await umzug.up()
    } catch (e) {
        console.error(e)
    }
}

const downSeed = async () => {
    //drop tables and data
    await sequelize.drop()
}

module.exports = { upSeed, downSeed }