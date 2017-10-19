const express = require('express');
const exphbs = require('express-handlebars');
const {listUsers} = require('../src/users');
const {listChannels} = require('../src/channels');
const {commands} = require('../src/commands');

const viewsPath = __dirname + '/public/views/';
const app = express();
app.set('views', viewsPath);
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: viewsPath + 'layouts/',
}));
app.set('view engine', '.hbs');


/** Routes */
app.get('/', (req, res) => {
    res.render('home', {
        users: listUsers(),
        channels: listChannels(),
        commands
    })
    ;
});

/** Static Files */
app.use('/', express.static(__dirname + '/public'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log('listening on port: %s', port); // eslint-disable-line no-console
});

module.exports = server;
