const express = require('express');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const controller = require('../controllers/controller');
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '931638414558-j7n73fhlap5mo2euigehbuguo40vka0j.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


const router = express.Router();

function authenticateToken(req, res, next) {
    const authHeader = req.cookies['JWT'];
    const token = authHeader
    if (token == null) return res.redirect('/login');


    // Verifies token and assigns decrypted email to user.email
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("User not logged in, redirecting");
            res.redirect('/login');
        }

        // If no error, assign user to req.user
        req.email = decoded.email;
        next();
    })
}

// GET requests
router.get('/', controller.index_get);
router.get('/login', controller.login_get);
router.get('/signin', controller.signin_get);
router.get('/logout', controller.logout_get);

router.get('/profile', authenticateToken, controller.profile_get);


// POST requests
router.post('/login', controller.login_post);

//404 (Final route)
router.use((req, res) => { res.status(404).render('404', { title: '404' }); });

module.exports = router;