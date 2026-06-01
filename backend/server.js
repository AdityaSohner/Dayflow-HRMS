const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger.middleware');
const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');
const connectDB = require('./config/db');

connectDB();
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
    return res.json({
        meassage: 'Daflow API Running'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\nClick: http://localhost:${PORT}`);
});