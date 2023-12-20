
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import Auth from "../model/user"
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import cart from '../model/cart';
dotenv.config()
const {CUSTOMER_ID,CUSTOMER_SECRET_CODE,ACCESSTOKEN_SECRET,REFESHTOKEN_SECRET} = process.env
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
            const token = jwt.sign({ _id: isExitUser._id }, ACCESSTOKEN_SECRET, { expiresIn: "2h" });
            const refreshToken = jwt.sign({ _id: isExitUser._id }, REFESHTOKEN_SECRET , { expiresIn: "4h" })
            return done(null, { user: isExitUser, accessToken: token, refreshToken:refreshToken  });
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
                console.log(newUser);
                
                 await cart.create({
                    user_id: newUser._id,
                    products: [],
                  });
               
                const token = jwt.sign({ _id: newUser._id }, ACCESSTOKEN_SECRET, { expiresIn: "2h" });
                const refreshToken = jwt.sign({ _id: newUser._id },REFESHTOKEN_SECRET , { expiresIn: "4h" })
                await newUser.save();
                done(null, { user: newUser, accessToken: token, refreshToken:refreshToken });
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

passport.serializeUser(({ user, accessToken,refreshToken }, done) => {
    done(null, { user, accessToken,refreshToken })
});
passport.deserializeUser(({ user, accessToken,refreshToken }, done) => {
    done(null, { user, accessToken,refreshToken })
});

export const LoginWithGoogle = (req, res) => {
    const { accessToken,user,refreshToken } = req.user;

    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: false,
        secure: false,
        path: "/",
        // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
        sameSite: "strict"
    })
    res.cookie("accessToken", accessToken, {
        httpOnly: false,
        secure: false,
        path: "/",
        // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
        sameSite: "strict"
    })
   
    res.cookie("user", JSON.stringify(user), {
        httpOnly: false,
        secure: false,
        path: "/",
        // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
        sameSite: "strict"
    })
    res.status(302).redirect(`http://localhost:3000`);   
    return res.status(200).json({ 
        data:req.user
    })
    
}

