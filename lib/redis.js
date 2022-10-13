const redis = require("redis")

const redisClient = redis.createClient({
  // Redis dari docker container
  url: 'redis://localhost:3001'
})

module.exports = redisClient
