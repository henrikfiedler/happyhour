import { PRIVATE_MAIL_HOST, PRIVATE_MAIL_PASS, PRIVATE_MAIL_PORT, PRIVATE_MAIL_SECURE, PRIVATE_MAIL_USER } from '$env/static/private'
import type { User } from '$lib/types';
import SMTPTransport from 'nodemailer'

const transporter = SMTPTransport.createTransport({
    host: PRIVATE_MAIL_HOST,
    port: Number(PRIVATE_MAIL_PORT),
    secure: !!PRIVATE_MAIL_SECURE,
    auth: {
        user: PRIVATE_MAIL_USER,
        pass: PRIVATE_MAIL_PASS
    }
});


export async function sendMail({ to, subject, body }: { to: User['email'], subject: string, body: string }) {
    await transporter.sendMail({
        from: PRIVATE_MAIL_USER,
        to,
        subject,
        html: body
    });
}