
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

interface OfferLetterEmailProps {
    firstName: string;
    courseTitle: string;
}

export default function OfferLetterEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
}: OfferLetterEmailProps) {
    const previewText = `Congratulations! You have been offered admission to ${courseTitle} at Kestora College.`;

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
                                alt="Kestora College"
                                className="my-0 mx-auto"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Offer of Admission
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are delighted to inform you that you have been offered admission to the <strong>{courseTitle}</strong> programme at Kestora College.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Please find your official <strong>Offer Letter</strong> attached to this email. You can also view and accept this offer through your student portal.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://kestora.online/portal/application/letter"
                            >
                                View & Accept Offer
                            </Link>
                        </Section>

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Note: Accessing the link above requires logging into your account.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Office of Admissions, Kestora College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
