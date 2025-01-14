const path = require('path');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
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
app.use(express.static(path.join(__dirname, 'frontend'), {
    index: false,
    extensions: ['html'],
}));
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

// Middleware wymuszający HTTPS w trybie produkcyjnym
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.get('/data-deletion', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'data-deletion.html'));
});

// Rejestracja routingu
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/stations', stationRoutes);
app.use('/', pageRoutes);

// Endpointy globalne
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'index.html')));

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
