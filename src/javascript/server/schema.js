const mongoose = require('mongoose');
const memotreeSchema = new mongoose.Schema({
  name: String,
  data: Object,
});
module.exports = mongoose.model('Memotree', memotreeSchema);