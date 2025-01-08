require('dotenv').config();

module.exports = {
    DB_HOST: process.env.DB_HOST || 'sql2.revivenode.com',
    DB_PORT: process.env.DB_PORT || '3306',
    DB_USER: process.env.DB_USER || 'u30447_JGFL6MIpiJ',
    DB_PASSWORD: process.env.DB_PASSWORD || 'W^3KC8MHnLzWgB6O@A=DLcBu',
    DB_NAME: process.env.DB_NAME || 's30447_cenypaliwek',
    JWT_SECRET: process.env.JWT_SECRET || '8a34!FDs9j@hFkz2qM#12K$',
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '1135556960905339',
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET || 'e1e98bd95786f04422a49885fa3dd877',
    FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || 'https://www.cenypaliwek.pl/auth/facebook/callback',
};