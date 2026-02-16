
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    react: React.ReactElement;
    attachments?: {
        filename: string;
        content: Buffer | string;
    }[];
}

export async function sendEmail({ to, subject, react, attachments }: SendEmailParams) {
    // If no API key is provided, log the email content (useful for dev/demo)
    if (!process.env.RESEND_API_KEY) {
        console.log('---------------------------------------------------');
        console.log(`[MOCK EMAIL SERVICE]`);
        console.log(`TO: ${to}`);
        console.log(`SUBJECT: ${subject}`);
        console.log(`ATTACHMENTS: ${attachments?.length || 0} files`);
        console.log(`BODY (React Component):`, react);
        console.log('---------------------------------------------------');
        return { success: true, id: 'mock-email-id' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'SYKLI College <admissions@syklicollege.fi>',
            to: [to],
            subject: subject,
            react: react,
            attachments: attachments,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, id: data?.id };
    } catch (error) {
        console.error('Email Send Error:', error);
        return { success: false, error };
    }
}
