const { CATEGORY_TABLE } = require("../models/category.model")

module.exports = {
    up: async (queryInterface) => {
      if(queryInterface.context){
        //this is for umzug to run in terminal and programatically
        queryInterface = queryInterface.context
      }
      return queryInterface.bulkInsert(CATEGORY_TABLE, [
        {
          name: "Category 1",
          image: "https://anyurl.com",
          created_at: new Date()
      },
      {
          name: "Category 2",
          image: "https://anyurl.com",
          created_at: new Date()
      }
      ])
    },
    down: (queryInterface) => {
      if(queryInterface.context){
        //this is for umzug to run in terminal and programatically
        queryInterface = queryInterface.context
      }
      return queryInterface.bulkDelete(CATEGORY_TABLE, null, {})
    }
  }