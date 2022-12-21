import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

//accessing environment variables
dotenv.config()

//express instance
const app = express();
//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('website'))

//empty data object
const projectData = {}

//server port
const port = process.env.port;


//weather api key
const apiKey = process.env.apiKey
app.get('/apikey', (_req, res) => {
    res.send({apiKey})
})

//route for getting user input and weather data
app.post('/userinput', async (req, _res) => {
    const data = await req.body
    projectData.temp = `${data.temp}°C`
    projectData.date = data.date
    projectData.userinput = data.userinput
    projectData.city = data.city
    projectData.feelsLike = `${data.feelsLike}°C`
    console.log('\n /userinput')
    console.log(projectData)
})

//data sending route
app.get('/data', (_req, res) => {
    res.send(projectData)
    console.log('\n /data')
    console.log(projectData)
})

// server listener
app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`)
})