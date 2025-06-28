import { PRIVATE_MAIL_HOST, PRIVATE_MAIL_PASS, PRIVATE_MAIL_PORT, PRIVATE_MAIL_SECURE, PRIVATE_MAIL_USER } from '$env/static/private'
import type { User } from '$lib/types';
import SMTPTransport from 'nodemailer'

const options = {
    host: PRIVATE_MAIL_HOST,
    port: Number(PRIVATE_MAIL_PORT),
    secure: Number(PRIVATE_MAIL_SECURE) === 1,
    auth: {
        user: PRIVATE_MAIL_USER,
        pass: PRIVATE_MAIL_PASS
    }
}
console.log("🚀 ~ options:", options)

const transporter = SMTPTransport.createTransport({
    host: PRIVATE_MAIL_HOST,
    port: Number(PRIVATE_MAIL_PORT),
    // secure: Number(PRIVATE_MAIL_SECURE) === 1,
    auth: {
        user: PRIVATE_MAIL_USER,
        pass: PRIVATE_MAIL_PASS
    }
});


export async function sendMail({ to, subject, body }: { to: User['email'], subject: string, body: string }) {
    await transporter.sendMail({
        from: `"HappyHour" <${PRIVATE_MAIL_USER}>`,
        to,
        subject,
        html: body
    });
}