import nodemailer from "nodemailer";
import dotenv from "dotenv";

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
        subject: "Thư khóa nich bạn !",
        text: "Chào bạn, " + email,
        html: `${FormMail(name, email, description)}`,
    });
};
