const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Field = require('./models/field');


mongoose.connect('mongodb://localhost:27017/field-finder', {
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', engine);
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// need express to parse body
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/fields', async (req, res) => {
    const fields = await Field.find({});
    res.render('fields/index', {fields});
});

// put before get request for /fields/:id or will search new as an id
app.get('/fields/new', (req, res) => {
    res.render('fields/new');
})

app.post('/fields', async (req,res) => {
    //req.body.field takes from field[] in new.ejs
    const field = await Field(req.body.field);
    await field.save();
    res.redirect(`/fields/${field._id}`);
})


app.get('/fields/:id', async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/show', { field });
});

app.get('/fields/:id/edit', async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/edit', { field });
})

app.put('/fields/:id', async (req, res) => {
    const field = await Field.findByIdAndUpdate(req.params.id, {...req.body.field});
    res.redirect(`/fields/${field.id}`);
});

app.delete('/fields/:id', async (req, res) => {
    await Field.findByIdAndDelete(req.params.id);
    res.redirect('/fields');

})


app.listen(3000, () => {
    console.log('Serving on port 3000');
});