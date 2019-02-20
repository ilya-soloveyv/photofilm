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
app.use('/vue-router', express.static(__dirname + '/node_modules/vue-router/dist'))
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))

if (process.env.NODE_ENV != 'development') {
    app.use(function(req, res, next) {
        if (req.secure) {
            next()
        } else {
            res.redirect(301, 'https://' + req.headers.host + req.url)
        }
    })
}

app.all('*', (req, res, next) => {
    if (req.headers.host.match(/^www/) !== null ) {
        res.redirect(301, 'https://' + req.headers.host.replace(/^www\./, '') + req.url)
    } else {
        next()
    }
})

var data = {}

const Sequelize = require('sequelize')
const connection = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    "dialect": "mysql",
    "operatorsAliases": false
})

var Place = connection.define('place', {
    iPlaceID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sPlaceTitle: Sequelize.STRING,
    createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
})

var Entry = connection.define('entry', {
    iEntryID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    iPlaceID: Sequelize.INTEGER,
    dEntryDate: Sequelize.DATEONLY,
    tEntryTimeFrom: Sequelize.TIME,
    tEntryTimeTo: Sequelize.TIME,
})

var Holiday = connection.define('holiday', {
    iHolidayID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    dHolidayDate: Sequelize.DATEONLY
})


// var Price = connection.define('price', {
//     iPriceID: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     iPlaceID: Sequelize.INTEGER,
//     sPriceCost: Sequelize.INTEGER
// })

// connection.sync()

app.get('/', (req, res) => {
    res.sendStatus(503)
})

app.get('/booking', (req, res) => {
    res.render('hello')
})

app.post('/get', async (req, res) => {
    Entry.findAll({
        where: {
            iPlaceID: req.body.iPlaceID,
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
        iPlaceID: req.body.iPlaceID,
        dEntryDate: dEntryDate,
        tEntryTimeFrom: tEntryTimeFrom,
        tEntryTimeTo: tEntryTimeTo
    }).then(function () {
        res.json(true)
    })
})















app.get('/admin', async (req, res) => {
    res.render('admin')
})
app.post('/admin/PlaceList', async (req, res) => {
    Place.findAll().then(function (data) {
        res.json(data)
    })
})
app.post('/admin/PlaceView', async (req, res) => {
    Place.findById(req.body.iPlaceID).then(function (data) {
        res.json(data)
    })
})











if (process.env.NODE_ENV != 'development') {
    const options = {
        key: fs.readFileSync('encryption/privkey1.pem'),
        cert: fs.readFileSync('encryption/cert1.pem')
    }
    const https = require('https').createServer(options, app)
    https.listen(443)
}
app.listen(process.env.PORT, () => {
    console.log('Server is running...')
})
