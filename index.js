const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const field = require('./models/field');


mongoose.connect('mongodb://localhost:27017/field-finder', {
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views')) 


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makefield', async (req, res) => {
    const arena = new field({name:'WG', description:'the stomping ground!' });
    await arena.save();
    res.send(arena);
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})