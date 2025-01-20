const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../utils/db');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

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

module.exports = passport;
