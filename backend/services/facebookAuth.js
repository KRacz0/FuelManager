const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../utils/db');
const config = require('../config/config');

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

                const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
                let user = users[0];

                if (user && user.is_banned) {
                    return done(null, false, { message: 'Twoje konto zostało zbanowane. Nie możesz się zalogować.' });
                }
                if (!user) {
                    const [result] = await db.execute(
                        'INSERT INTO users (email, name, role) VALUES (?, ?, ?)',
                        [email, name, 'user']
                    );

                    user = { id: result.insertId, email, name, role: 'user' };
                }

                done(null, user);
            } catch (error) {
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
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        done(null, users[0]);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
