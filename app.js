const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const axios = require('axios');

const config = require('./backend/config/config');
const db = require('./backend/utils/db');

const authController = require('./backend/controllers/authController');
const authMiddleware = require('./backend/middlewares/authMiddleware');
const authorizeAdmin = require('./backend/middlewares/authorizeAdmin');


const app = express();

const PORT = 3001;

// Middleware
app.use(cors({ origin: '*' })); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Middleware obsługujący sesje
app.use(
    session({
        secret: '5FDGDF3DGdsvbdf23',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: false,
            secure: true, 
            maxAge: 3600000, // 1 godzina
        },
    })
);

// Ustawienia Passport.js
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

// Konfiguracja strategii Facebook
passport.use(
    new FacebookStrategy(
        {
            clientID: config.FACEBOOK_APP_ID,
            clientSecret: config.FACEBOOK_APP_SECRET,
            callbackURL: config.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = `${profile.name.givenName} ${profile.name.familyName}`;

                const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

                if (existingUser) {
                    return done(null, existingUser);
                }

                const result = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [
                    email,
                    null,
                    'user',
                ]);

                const newUser = {
                    id: result.insertId,
                    email,
                    name,
                    role: 'user',
                };

                done(null, newUser);
            } catch (error) {
                console.error('Błąd podczas logowania przez Facebook:', error.message);
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => { done(null, user.id); });
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await db.query('SELECT id, email, role FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return done(new Error('Nie znaleziono użytkownika.'));
        }
        const user = rows[0];
        done(null, user); 
    } catch (error) {
        done(error, null);
    }
});

// Endpointy globalne
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'frontend', 'index.html')));

// Endpoint wylogowania
app.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error('Błąd podczas wylogowania:', err.message);
            return res.status(500).json({ error: 'Wylogowanie nie powiodło się' });
        }
        res.clearCookie('token'); 
        res.redirect('/'); 
    });
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback po autoryzacji Facebook
app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/',
        session: false,
    }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id, email: req.user.email, role: req.user.role },
            config.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Przekierowanie do frontendu z tokenem JWT
        res.redirect(`/?token=${token}`);
    }
);


// Endpoint sprawdzania dostępu do panelu admina
app.get('/api/admin', authMiddleware.authenticate, authorizeAdmin, (req, res) => {
    console.log(`Przyznano dostęp do panelu admina użytkownikowi ${req.user.email}`);
    res.json({ message: 'Dostęp do panelu administratora przyznany.' });
});

app.get('/api/stations', async (req, res) => {
    try {
        const stations = await db.getAllStations();
        res.json(stations);
    } catch (error) {
        console.error('Błąd podczas pobierania stacji:', error.message);
        res.status(500).json({ error: 'Nie udało się pobrać danych o stacjach.' });
    }
});


app.get('/data-deletion', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'data-deletion.html'));
});


// Endpointy rejestracji i logowania
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);


// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});