require('dotenv').config();

module.exports = {
  "development" : {
    "database" : process.env.DB_NAME,
    "username" : process.env.DB_USERNAME,
    "password" : process.env.DB_PASSWORD,
    "host" : process.env.DB_HOST,
    "dialect" : "postgres"
  },

  "test" : {
    "database" : process.env.DB_NAME,
    "username" : process.env.DB_USERNAME,
    "password" : process.env.DB_PASSWORD,
    "host" : process.env.DB_HOST,
    "dialect" : "postgres",
    "ssl": process.env.DB_SSL,
    "dialectOptions": {
      "ssl": process.env.DB_SSL
    }
  },

  "production" : {
    "database" : process.env.DB_NAME,
    "username" : process.env.DB_USERNAME,
    "password" : process.env.DB_PASSWORD,
    "host" : process.env.DB_HOST,
    "dialect" : "postgres",
    "ssl": process.env.DB_SSL,
    "dialectOptions": {
      "ssl": process.env.DB_SSL
    }
  }
}