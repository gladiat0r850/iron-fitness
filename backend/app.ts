import { Request, Response } from "express";
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// Schema for schedule
const dataSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone_number: String,
    additional_notes: {
        type: String,
        required: false
    },
    time: {request_date: Date, schedule: Date},
    training_type: {
        type: String,
        required: true
    }
});

// Create a model from the schema
const ObjectModel = mongoose.model('schedules', dataSchema);

// Establish the MongoDB connection once when the app starts
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err: Error) => console.log('Error connecting to MongoDB:', err));

// Get all schedule entries
app.get('/schedule', async (req: Request, res: Response) => {
    try {
        const documents = await ObjectModel.find();  // Find all schedules
        res.json(documents);
    } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).send('Error fetching data');
    }
});

// Create a new schedule entry
app.post('/schedule', async (req: Request, res: Response) => {
    const { name, phone_number, training_type, additional_notes, email } = req.body;

    if (!name || !phone_number || !training_type || !email) {
        return res.status(400).send('Missing required fields');
    }

    const newObject = new ObjectModel({
        name, phone_number, training_type, additional_notes, email
    });

    try {
        const savedInformation = await newObject.save();  // Save the new entry
        res.send(savedInformation);
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data');
    }
});

// Start the server
app.listen(4500, (error: Error) => {
    if (error) {
        throw new Error();
    }
    console.log('Listening on port 4500');
});
