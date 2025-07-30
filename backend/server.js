require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Feedback = require('./models/feedback');
const app = express();

// MODIFIED: Added specific CORS options
const corsOptions = {
  origin: [
    'https://prismatic-gaufre-54d167.netlify.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],         // Allowed methods
  allowedHeaders: ['Content-Type'],                  // Allowed headers
  credentials: true ,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.options('*', cors(corsOptions))
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
// Add this before your routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://brilliant-empanada-6fb34a.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// Routes
// Add this before other routes
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.post('/feedbacks', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save feedback.' });
  }
});

app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedbacks.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0',() => console.log(`🚀 Server running on port ${PORT}`));
