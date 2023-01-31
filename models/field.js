const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema ({
    name:String,
    image: String,
    public:Boolean,
    description:String,
    location:String
});

module.exports = mongoose.model('Field', fieldSchema);