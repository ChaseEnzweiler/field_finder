const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema ({
    name:String,
    public:Boolean,
    description:String,
    location:String
});

module.exports = mongoose.model('field', fieldSchema);