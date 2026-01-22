
import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js'
import adminRoutes from './routes/adminRoutes.js'


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ella-tronics-client.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server & Postman
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ella-tronics';
mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


// Routes
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    // Handle multer file size errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File size too large. Maximum size is 3MB'
        });
    }

    // Handle multer file type errors
    if (err.message.includes('Only images are allowed')) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});




const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);
