const express = require('express')
const app = express()
const fs = require('fs')
const pug = require('pug')
app.set('view engine', 'pug');
require('dotenv').config()
app.use(express.static('public'));
app.locals.env = process.env;
app.use(express.static('public'));
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const moment = require('moment')

app.use('/axios', express.static(__dirname + '/node_modules/axios/dist'))
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))

var data = {}

const Sequelize = require('sequelize')
const connection = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    "dialect": "mysql",
    "operatorsAliases": false
})

var Entry = connection.define('entry', {
    iObjectID: Sequelize.INTEGER,
    dEntryDate: Sequelize.DATEONLY,
    tEntryTimeFrom: Sequelize.TIME,
    tEntryTimeTo: Sequelize.TIME,
})

connection.sync()

app.get('/', (req, res) => {
    res.sendStatus(503)
})

app.get('/booking', (req, res) => {
    res.render('hello')
})

app.post('/get', async (req, res) => {
    Entry.findAll({
        where: {
            iObjectID: req.body.iObjectID,
            dEntryDate: req.body.dEntryDate
        }        
    }).then(function (entry) {
        res.json(entry)
    })
})

app.post('/set', async (req, res) => {
    var from = new Date(req.body.dEntryDate + " " + req.body.tEntryTimeFrom)
    var dEntryDate = moment(from).format('YYYY-MM-DD')
    var tEntryTimeFrom = moment(from).format('HH:mm:ss')
    var tEntryTimeTo = moment(from).add(req.body.orderHoutSelect, 'hours').format('HH:mm:ss')

    Entry.create({
        iObjectID: req.body.iObjectID,
        dEntryDate: dEntryDate,
        tEntryTimeFrom: tEntryTimeFrom,
        tEntryTimeTo: tEntryTimeTo
    }).then(function () {
        res.json(true)
    })
})

if (process.env.NODE_ENV == 'development') {
    app.listen(process.env.PORT, () => {
        console.log('Server is running...')
    })
} else {
    const options = {
        key: fs.readFileSync('encryption/privkey1.pem'),
        cert: fs.readFileSync('encryption/cert1.pem')
    }
    const https = require('https').createServer(options, app)
    https.listen(443)
}
