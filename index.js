const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Field = require('./models/field');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');


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

app.get('/fields', catchAsync(async (req, res) => {
    const fields = await Field.find({});
    res.render('fields/index', {fields});
}));

// put before get request for /fields/:id or will search new as an id
app.get('/fields/new', (req, res) => {
    res.render('fields/new');
})

app.post('/fields', catchAsync(async (req,res, next) => {
    //req.body.field takes from field[] in new.ejs
    if (!req.body.field) {throw new ExpressError('Invalid Campground Data', 400);}
    const field = await Field(req.body.field);
    await field.save();
    res.redirect(`/fields/${field._id}`);
}))


app.get('/fields/:id', catchAsync(async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/show', { field });
}));

app.get('/fields/:id/edit', catchAsync(async (req, res) => {
    const field = await Field.findById(req.params.id);
    res.render('fields/edit', { field });
}));

app.put('/fields/:id', catchAsync(async (req, res) => {
    const field = await Field.findByIdAndUpdate(req.params.id, {...req.body.field});
    res.redirect(`/fields/${field.id}`);
}));

app.delete('/fields/:id', catchAsync(async (req, res) => {
    await Field.findByIdAndDelete(req.params.id);
    res.redirect('/fields');

}));

//for every path for every request
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})

// Generic error for everything right now
app.use((err, req, res, next) => {
    const {message = 'Something went wrong!', statusCode = 500} = err;
    res.status(statusCode).send(message);
});
   
app.listen(3000, () => {
    console.log('Serving on port 3000');
});