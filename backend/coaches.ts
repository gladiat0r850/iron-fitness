import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
const cors = require('cors')
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/test');

// Define the Schema and Model
const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  additional_notes: { type: String },
  schedule_date: { type: Date, required: true },
  request_date: { type: Date, required: true },
  training_type: { type: String, required: true },
  time: { type: String, required: true }
});

const Session = db.model('sessions', sessionSchema);

app.post('/sessions', async (req: Request, res: Response) => {
  const { name, email, phone_number, additional_notes, schedule_date, request_date, training_type, time } = req.body;

  try {
    const newSession = new Session({
      name,
      email,
      phone_number,
      additional_notes,
      schedule_date,
      request_date,
      training_type,
      time,
    });
    await newSession.save()
    return res.status(201).json({ message: 'Session created successfully', session: newSession });
  } catch (error) {
    console.error('Error saving session:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

