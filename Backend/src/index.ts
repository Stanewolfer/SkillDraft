import express from 'express';
import dotenv from 'dotenv';
import router from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api', router);

app.use(cors())

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server is ready to handle requests');
});
