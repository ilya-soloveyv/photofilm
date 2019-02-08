const express = require('express')
const app = express()
const pug = require('pug')
app.set('view engine', 'pug');
require('dotenv').config()
app.use(express.static('public'));
app.locals.env = process.env;
app.use(express.static('public'));

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'))
app.use('/vue', express.static(__dirname + '/node_modules/vue/dist'))

app.get('/', (req, res) => {
    res.sendStatus(503)
})

app.get('/booking', (req, res) => {
    res.render('hello')
})

app.listen(process.env.PORT, () => {
    console.log('Server is running...')
})