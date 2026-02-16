
import * as React from 'react';
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Img,
    Heading,
    Text,
    Hr,
    Link,
    Tailwind,
} from '@react-email/components';

interface PaymentConfirmationEmailProps {
    firstName: string;
    courseTitle: string;
    amount: number;
    currency: string;
    transactionId: string;
}

export default function PaymentConfirmationEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    amount = 0,
    currency = 'EUR',
    transactionId = 'TXN-000000',
}: PaymentConfirmationEmailProps) {
    const previewText = `Payment Received: Your tuition for ${courseTitle} has been successfully processed.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://syklicollege.fi/logo.png"
                                width="40"
                                height="40"
                                alt="SYKLI College"
                                className="my-0 mx-auto"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Payment Confirmation
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            This is to confirm that we have successfully received your tuition payment for the <strong>{courseTitle}</strong> programme.
                        </Text>

                        <Section className="bg-neutral-50 rounded-lg p-6 my-8 border border-neutral-100">
                            <div className="flex justify-between mb-2">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Amount Paid</Text>
                                <Text className="text-black text-[14px] font-bold my-0">{currency} {amount.toLocaleString()}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Transaction ID</Text>
                                <Text className="text-black text-[10px] font-mono my-0">{transactionId}</Text>
                            </div>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Your official Admission Letter will be issued shortly once our team completes the final verification of your transaction.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://syklicollege.fi/portal/dashboard"
                            >
                                View Dashboard
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Thank you for your prompt payment.
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Finance Department, SYKLI College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
