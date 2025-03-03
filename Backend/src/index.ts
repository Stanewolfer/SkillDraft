import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './modules/user/routes/user.routes';
import { errorHandler } from './core/middleware/error.middleware';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
