const express = require('express')
const app = express()
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

// connection.sync().then(function(){
    // Entry.create({
    //     iObjectID: 1,
    //     dEntryDate: '2019-02-18',
    //     tEntryTimeFrom: '14:00:00',
    //     tEntryTimeTo: '18:00:00'
    // })
// })
// connection.sync().then(function(){
    // Entry.findById(2).then(function (entry) {
    //     console.log(entry.dataValues)
    // })
// })



// sequelize.sync().then(() => Entry.findAll()).then(entries => {
//     console.log(entries);
// })


// var models = require('./models');
// var Empty = models.Empty;
// var empty = Empty.build({ iObjectID: 1 });
// const Entry = require('./models/entry.model')

// Entry.findAll().then(entries => {
//     console.log(entries)
// })



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
    // data.body = req.body
    // data.entry = await Entry.getEntrys({ dEntryDate: req.body.dEntryDate})
    // data.entry = await Entry.getEntrys({ iObjectID: req.body.iObjectID, dEntryDate: req.body.dEntryDate })
    
})




// var time = new Date(0, 0, 0, req.body.dEntryTimeFrom)
// console.log(time)


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

    


    // await Entry.setEntry([ req.body.iObjectID, dEntryDate, dEntryTimeFrom, dEntryTimeTo])


    // const Entry = sequelize.define('entry', {
    //     iEntryID: Sequelize.INTEGER,
    //     iObjectID: Sequelize.INTEGER,
    //     dEntryDate: Sequelize.DATE,
    //     dEntryTimeFrom: Sequelize.TIME,
    //     dEntryTimeTo: Sequelize.TIME
    // })

    // sequelize.sync().then(() => Entry2.create({
    //     iObjectID: 1,
    //     dEntryDate: '2019-02-17',
    //     dEntryTimeFrom: '12:00:00',
    //     dEntryTimeTo: '13:00:00',
    // })).then(jane => {
    //     console.log(jane.toJSON());
    // });


    // var d = new Date(0, 0, 0, 6, 0, 0)


    // var d = new Date(0, 0, 0, 14, 0, 0)
    // var jun = moment(d).tz('Europe/Moscow');
    // console.log(jun)
    
    
    // var dEntryTimeTo = new Date(req.body.dEntryTimeFrom)
    //     dEntryTimeTo.setHour(dEntryTimeTo.getHour()+1)
    // console.log(dEntryTimeTo)
    // await Entry.getEntrys({ iObjectID: req.body.iObjectID, dEntryDate: req.body.dEntryDate })
    
})

app.listen(process.env.PORT, () => {
    console.log('Server is running...')
})