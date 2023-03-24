const { PRODUCT_TABLE } = require("../models/product.model")

module.exports = {
  up: async (queryInterface) => {
    if(queryInterface.context){
      //this is for umzug to run in terminal and programatically
      queryInterface = queryInterface.context
    }
    return queryInterface.bulkInsert(PRODUCT_TABLE, [
      {
        name: "Product 1",
        image: "https://asd.com",
        description: "bla bla bla",
        price: 100,
        category_id: 1,
        created_at: new Date()
      },
      {
        name: "Product 2",
        image: "https://asd.com",
        description: "bla bla bla",
        price: 150,
        category_id: 2,
        created_at: new Date()
      }
    ])
  },
  down: (queryInterface) => {
    if(queryInterface.context){
      //this is for umzug to run in terminal and programatically
      queryInterface = queryInterface.context
    }
    return queryInterface.bulkDelete(PRODUCT_TABLE, null, {})
  }
}