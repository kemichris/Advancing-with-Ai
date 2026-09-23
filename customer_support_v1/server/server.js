import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';


import chatRoutes from './routes/chat.routes.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});