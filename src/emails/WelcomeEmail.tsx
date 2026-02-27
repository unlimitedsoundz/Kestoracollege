
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

interface WelcomeEmailProps {
    firstName: string;
    studentId: string;
}

export default function WelcomeEmail({
    firstName = 'Student',
    studentId = 'SK12345678',
}: WelcomeEmailProps) {
    const previewText = `Welcome to Kestora College! Your Student ID is ${studentId}.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://kestora.fi/logo-kestora.png" // Replace with actual logo URL
                                width="40"
                                height="40"
                                alt="Kestora College"
                                className="my-0 mx-auto"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Welcome to Kestora College
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Congratulations on creating your student account at Kestora College! We are excited to have you join our academic community.
                        </Text>

                        <Section className="bg-neutral-900 rounded-lg p-6 my-8 text-center">
                            <Text className="text-white text-[10px] uppercase font-bold tracking-widest mb-2 opacity-60">
                                Your Unique Student ID
                            </Text>
                            <Text className="text-white text-[32px] font-bold tracking-tighter my-0">
                                {studentId}
                            </Text>
                            <Text className="text-white text-[10px] font-medium mt-4 opacity-80 leading-relaxed uppercase">
                                This is your official student ID.
                            </Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            You can now access your dashboard to complete your application, upload documents, and track your progress.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://kestora.fi/portal/account/login"
                            >
                                Enter Student Portal
                            </Link>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            If you have any questions or need assistance, please feel free to reach out to our Admissions Office at <Link href="mailto:admissions@kestora.fi" className="text-blue-600 no-underline font-bold">admissions@kestora.fi</Link>.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This email was sent to confirm your account registration at Kestora College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
