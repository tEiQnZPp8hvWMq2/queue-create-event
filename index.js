require('dotenv').config();
const express = require('express');
const app = express();
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const crypto = require('crypto')
const EventController = require('./controller/event.controller')

const serverAdapter = new ExpressAdapter();


const redisUrlParse = require('redis-url-parse');
const tls = process.env.REDIS_URL.includes('rediss');
const redisObject = redisUrlParse(process.env.REDIS_URL)

const restQueue = new Queue('event', {
    redis: {
      port: Number(redisObject.port), 
      host: redisObject.host, 
      password: redisObject.password, 
      tls : tls ? { servername: redisObject.host  } : null
    }
})



createBullBoard({
  queues: [
    new BullAdapter(restQueue),
  ],
  serverAdapter
})
serverAdapter.setBasePath('/admin')

app.use('/admin', serverAdapter.getRouter());

restQueue.process('create-event-transaction', parseInt(process.env.WORKER), async (job, done) => {
  try {
    const response = await EventController.calcualteEventTurnover(job.data)
    if (!response?.success) done(response)
    else  done(null, response);
  } catch (error) {
    console.log(error);
    done(error)
  }
})

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}/admin`);
});