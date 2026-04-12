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

interface InvoiceReadyEmailProps {
    firstName: string;
    courseTitle: string;
    amount: number;
    currency: string;
    invoiceType: string;
}

export default function InvoiceReadyEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    amount = 0,
    currency = 'EUR',
    invoiceType = 'TUITION DEPOSIT',
}: InvoiceReadyEmailProps) {
    const previewText = `Your ${invoiceType.toLowerCase()} invoice is ready for payment.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://kestora.online/logo-kestora.png"
                                width="40"
                                height="40"
                                alt="Kestora University"
                                className="my-0 mx-auto"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Invoice Ready for Payment
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Your {invoiceType.toLowerCase()} invoice for the <strong>{courseTitle}</strong> programme has been generated and is now ready for payment.
                        </Text>

                        <Section className="bg-neutral-50 rounded-lg p-6 my-8 border border-neutral-100">
                            <div className="flex justify-between mb-2">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Invoice Type</Text>
                                <Text className="text-black text-[14px] font-bold my-0">{invoiceType}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Amount Due</Text>
                                <Text className="text-black text-[18px] font-black my-0">{currency} {amount.toLocaleString()}</Text>
                            </div>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Please proceed to your student portal to complete the payment and secure your place in the programme.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://kestora.online/portal/application/payment"
                            >
                                Pay Tuition
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            If you have any questions, please contact our admissions team.
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Finance Department, Kestora University.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}