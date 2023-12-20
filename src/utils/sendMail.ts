import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const FormMail = (name, email, description) => {
    return /*html*/ `
        <div style="margin: 5px auto 5px; padding: 5px; max-width: 600px; background: linear-gradient(to left,#7347c1,#0674ec); border: 5px solid transparent; background-repeat: no-repeat; background-origin: padding-box,border-box">
            <table cellpadding="0" cellspacing="0" border="0" align="center" style="background:white">
                <tbody>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
                        <tbody>
                            <tr>
                                <td width="100">&nbsp;</td>
                                <td width="400" align="center">
                                    <div align="left">
                                        <p>
                                            Xin chào <b style="color:#0674ec">${name}</b>
                                            <div>&nbsp;</div>
                                            Email: <b style="color:#0674ec">${email}</b>
                                            <div>&nbsp;</div>
                                        
                                        </p>
                                    </div>
                                </td>
                                <td width="100">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
                        <tbody>
                            <tr>
                                <td width="200">&nbsp;</td>
                                <td width="200" align="center" style="padding-top:25px">
                                    <table cellpadding="0" cellspacing="0" border="0" align="center" width="400" height="50">
                                        <tbody>
                                            <tr>
                                                <td bgcolor="#0674ec" align="center" style="border-radius:4px" width="200" height="50">
                                                    ${description}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td width="200">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                </tbody>
                <div>&nbsp;</div>
                <div>&nbsp;</div>
            </table>
        </div>
    `;
}
export const FormMailOrder = (name, order) => {
    const api_web = process.env.WEB_URL;
    const api_url = process.env.API_URL;
    const api_order = `${api_url}/order/export/${order._id}`;

    return /*html*/ `
     <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h1 style="color: #333;">Cảm ơn bạn đã mua hàng!</h1>
        <p style="color: #666;">Xin chào ${name},</p>
        <p style="color: #666;">Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi. Chúng tôi rất trân trọng sự ủng hộ của bạn.</p>
        <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu hỗ trợ nào, đừng ngần ngại liên hệ với chúng tôi.</p>

        <a href=${api_order} style="display: inline-block; padding: 10px 20px; text-decoration: none; color: #fff; background-color: #007bff; border-radius: 4px;">Click để xem thông tin đơn</a>
        <a href=${api_web} style="display: inline-block; padding: 10px 20px; text-decoration: none; color: #fff; background-color: #007bff; border-radius: 4px;">Truy cập trang web của chúng tôi</a>
        <p style="color: #666;">Trân trọng,</p>
        <p style="color: #666;">Man Closet</p>
    </div>
    `
}
export const FormPaid = (name, order) => {
    const api_web = process.env.WEB_URL;
    return /*html*/ `
     <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h1 style="color: #333;">Cảm ơn bạn đã thanh toán đơn hàng </h1>

        <p style="color: #666;">Mã đơn hàng: ${order._id}</p>
        <p style="color: #666;">Xin chào ${name},</p>
        <p style="color: #666;">Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi. Chúng tôi rất trân trọng sự ủng hộ của bạn.</p>
        <p style="color: #666;">Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu hỗ trợ nào, đừng ngần ngại liên hệ với chúng tôi.</p>
        <a href=${api_web} style="display: inline-block; padding: 10px 20px; text-decoration: none; color: #fff; background-color: #007bff; border-radius: 4px;">Truy cập trang web của chúng tôi</a>
        <p style="color: #666;">Trân trọng,</p>
        <p style="color: #666;">Man Closet</p>
    </div>
    `
}
console.log('mail', process.env.PASS)
export const sendMailOpen = async (name, email) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });
    const description = "Trong khoản thời gian hoạt động tôi thấy bạn có những hành vi không tính cực nhằm gây khó chịu cho trải nghiệm của mọi người nên chúng tôi quyết định khóa nich bạn 3-4 ngày chúc bạn một ngày mới vui vẻ !😀"
    let info = await transporter.sendMail({

        from: "mancloset68@gmail.com",
        to: email,
        subject: "Thư khóa nich bạn !",
        text: "Chào bạn, " + email,
        html: `${FormMail(name, email, description)}`,
    });
};
export const sendMailClose = async (name, email) => {
    const description = "Thời gian khoá 3-4 ngày đã hết chúc mừng bạn chúc bạn ngày mới tốt lành 😁"
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });

    let info = await transporter.sendMail({
        from: "mancloset68@gmail.com",
        to: email,
        subject: "Thư mở khóa nich bạn !",
        text: "Chào bạn, " + email,
        html: `${FormMail(name, email, description)}`,
    });
};
export const sendMailPaid = async (name, email, order) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });
    let info = await transporter.sendMail({

        from: "mancloset68@gmail.com",
        to: email,
        subject: "Thư cảm ơn!",
        text: "Chào bạn, " + email,
        html: `${FormMailOrder(name, order)}`,
    });
}
export const sendMailOrder = async (name, email, order) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });
    let info = await transporter.sendMail({

        from: "mancloset68@gmail.com",
        to: email,
        subject: "Thư cảm ơn!",
        text: "Chào bạn, " + email,
        html: `${FormMailOrder(name, order)}`,
    });
}
export const FormMailForgot = (name, resetToken) => {
    const api_web = process.env.WEB_URL;
    const api_url = process.env.API_URL;
    const api_resetPassword = `${api_web}/auth/reset-password`;


    return /*html*/ `   
     <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h1 style="color: #333;">Lấy lại mật khẩu</h1>
        <p style="color: #666;">Xin chào ${name},</p>
        <p style="color: #666;">Bạn vui lòng click và đường dẫn bên dưới để lấy lại mật khẩu.</p>
        <a href=${api_resetPassword} style="display: inline-block; padding: 10px 20px; text-decoration: none; color: #fff; background-color: #007bff; border-radius: 4px;">Click here</a>
        
        <p style="color: #666;">Trân trọng,</p>
        <p style="color: #666;">Man Closet</p>
    </div>
    `
}
export const sendMailForgotPassword = async (name, email, resetToken) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });
    let info = await transporter.sendMail({

        from: "mancloset68@gmail.com",
        to: email,
        subject: "Thư lấy lại mật khẩu",
        text: "Chào bạn, " + email,
        html: `${FormMailForgot(name, resetToken)}`,
    });
}




export const FormMailPasword = (name, password:string) => {
    const api_web = process.env.WEB_URL;
    const api_url = process.env.API_URL;


    return /*html*/ `   
     <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h1 style="color: #333;">Đặt lại mật khẩu thành công</h1>
        <p style="color: #666;">Xin chào ${name},</p>
        <p style="color: #666;">Đây là mật khẩu của bạn. Đừng bao giờ quên mật khẩu nữa nhé: ${password}</p>
       
        <a href=${api_web} style="display: inline-block; padding: 10px 20px; text-decoration: none; color: #fff; background-color: #007bff; border-radius: 4px;">Truy cập trang web của chúng tôi</a>
        <p style="color: #666;">Trân trọng,</p>
        <p style="color: #666;">Man Closet</p>
    </div>
    `
}
export const sendMailPassword = async (name, email, password) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
        },
    });
    let info = await transporter.sendMail({

        from: "mancloset68@gmail.com",
        to: email,
        subject: "Đổi mật khẩu thành công",
        text: "Chào bạn, " + email,
        html: `${FormMailPasword(name, password)}`,
    });
}