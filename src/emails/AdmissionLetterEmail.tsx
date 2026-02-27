
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

interface AdmissionLetterEmailProps {
    firstName: string;
    courseTitle: string;
}

export default function AdmissionLetterEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
}: AdmissionLetterEmailProps) {
    const previewText = `Welcome to Kestora College! Your admission to ${courseTitle} is now finalized.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://kestora.fi/logo-kestora.png"
                                width="40"
                                height="40"
                                alt="Kestora College"
                                className="my-0 mx-auto"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Admission Finalized
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Congratulations! Your enrollment in the <strong>{courseTitle}</strong> programme at Kestora College is now official.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Please find your <strong>Official Admission Letter</strong> attached to this email. This document confirms your place and can be used for visa applications or other official purposes.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://kestora.fi/portal/student"
                            >
                                Enter student Portal
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            We look forward to seeing you on campus!
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Office of Admissions, Kestora College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
