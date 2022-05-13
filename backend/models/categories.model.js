const mongoose = require('mongoose');
const {Schema } = mongoose;

const categoriesSchema = new Schema({
    name: String,
    parent_id: Number

})

const Category = mongoose.model('product_categories', categoriesSchema);

module.exports = Category;