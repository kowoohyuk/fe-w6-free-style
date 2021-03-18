import mongoose from 'mongoose';
const memotreeSchema = new mongoose.Schema({
  title: String,
  type: String,
  author: String,
  name: String,
  border_color: String,
  color: String,
  bg_color: String,
  content: String,
  startX: Number,
  endX: Number,
  y: Number,
  childs: Array,
});
export default mongoose.model('Memotree', memotreeSchema);