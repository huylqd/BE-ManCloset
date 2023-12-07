
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import Auth from "../model/user"
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()
const {CUSTOMER_ID,CUSTOMER_SECRET_CODE,ACCESSTOKEN_SECRET} = process.env
passport.use(new GoogleStrategy({
    clientID: CUSTOMER_ID,
    clientSecret: CUSTOMER_SECRET_CODE,
    callbackURL: "http://localhost:8088/api/auth/google/callback",
    passReqToCallback: true
},
    async (request, accessToken, refreshToken, profile, done) => {
  
        
        const isExitUser = await Auth.findOne({
            googleId: profile.id,
            authType: "google"
        })
        if (isExitUser) {
            const token = jwt.sign({ id: isExitUser._id }, ACCESSTOKEN_SECRET, { expiresIn: "2h" });
            return done(null, { user: isExitUser, accessToken: token });
        } else {
            try {
                const newUser = new Auth({
                    authType: 'google',
                    googleId: profile.id,
                    name: profile.name.familyName,
                    email: profile.emails[0].value,
                    avatar:  profile.picture,                                      
                    password: "Không có mật khẩu",
                });
                await newUser.save();
                const token = jwt.sign({ id: newUser._id }, ACCESSTOKEN_SECRET, { expiresIn: "2h" });
                done(null, { user: newUser, accessToken: token });
            } catch (error) {
                // Xử lý lỗi chèn (trường hợp trùng lặp)
                if (error.code === 11000) {
                    return done(null, false, { message: "Tài khoản đã tồn tại" });
                } else {
                    // Xử lý các lỗi khác
                    return done(error);
                }
            }
        }
    }
));

passport.serializeUser(({ user, accessToken }, done) => {
    done(null, { user, accessToken })
});
passport.deserializeUser(({ user, accessToken }, done) => {
    done(null, { user, accessToken })
});

export const LoginWithGoogle = (req, res) => {
    const { accessToken } = req.user;
    console.log(req.user);
    res.status(302).redirect(`http://localhost:3000/?accessToken=${accessToken}`);   
    return res.status(200).json({ 
        data:req.user
    })
    
}

