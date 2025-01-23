const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');

const passport = require('./backend/middlewares/passportConfig');
const authMiddleware = require('./backend/middlewares/authMiddleware');

const adminRoutes = require('./backend/routes/adminRoutes');
const authRoutes = require('./backend/routes/authRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const pageRoutes = require('./backend/routes/pageRoutes');
const stationRoutes = require('./backend/routes/stationRoutes');


const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const frontendPath = path.join(__dirname, 'frontend/dist');
app.use(express.static(frontendPath));

app.use(
    session({
        secret: '5FDGDF3DGdsvbdf23',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: true,
            maxAge: 3600000,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Middleware wymuszający HTTPS
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

// Rejestracja routingu
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/', pageRoutes);

// Endpointy globalne
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
