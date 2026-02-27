
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

interface OfferRejectionEmailProps {
    firstName: string;
    applicationId: string;
    courseName?: string;
}

export default function OfferRejectionEmail({
    firstName = 'Applicant',
    applicationId = 'APP-12345',
    courseName = 'Bachelor of Business Administration',
}: OfferRejectionEmailProps) {
    const previewText = `We have received your decision to decline our offer of admission.`;

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
                            Admission Offer Declined
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We have received your decision to decline the offer of admission to the <strong>{courseName}</strong> program at Kestora College.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Your application (ID: {applicationId}) status has been updated to <strong>OFFER_DECLINED</strong>. We appreciate you letting us know so we can offer your spot to another candidate.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            If you declined this offer by mistake, please contact our Admissions Office immediately at <Link href="mailto:admissions@kestora.fi" className="text-blue-600 no-underline">admissions@kestora.fi</Link>.
                        </Text>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            This email was intended for {firstName}. If you were not expecting this email, you can ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
