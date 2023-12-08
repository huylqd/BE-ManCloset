import express from 'express';
import passport from 'passport';

import {  LoginWithGoogle } from '../controller/passportController';
const routerPassport = express.Router();

routerPassport.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));
routerPassport.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: `http://localhost:8088/api/google/success`,
        failureRedirect: `http://localhost:3000/auth`
    }));

routerPassport.use('/google/success', LoginWithGoogle);
// 

export default routerPassport;