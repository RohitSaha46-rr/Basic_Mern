const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  meal: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner'] },
  feedback: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  time: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
