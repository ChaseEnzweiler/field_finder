const mongoose = require('mongoose');
const Field = require('../models/field');
const { adj, noun } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/field-finder', {
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)]

// seedDB returns a promise because it is an async function
const seedDB = async () => {
    await Field.deleteMany({});
    for (let i = 0; i < 20; i++){
        // 1000 cities in cities.js, pick a random one
        const random1000 = Math.floor(Math.random() * 1000);

        const place = new Field({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(adj)} ${sample(noun)}`,
            image: 'https://source.unsplash.com/collection/483251'
        })
        await place.save();
    }
    
}

seedDB().then(() => {
    db.close();
});