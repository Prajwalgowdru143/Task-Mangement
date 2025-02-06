import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://task-mangement-amber.vercel.app",  // Allow frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,  // Allow cookies with requests
}
));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});