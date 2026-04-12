
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
    const previewText = `Conditional Admission Offer - Kestora University Next Steps`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white dark:bg-black my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] dark:border-none rounded my-[40px] mx-auto p-[20px] w-[465px]">
                        <Section className="mt-[32px]">
                            <Img
                                src="https://kestora.online/logo-kestora.png"
                                width="64"
                                height="64"
                                alt="Kestora University"
                                className="my-0 mx-auto dark:invert"
                            />
                        </Section>
                        <Section className="mt-[16px]">
                            <Img
                                src="https://kestora.online/images/scholarships.png"
                                width="465"
                                height="150"
                                alt="Scholarships"
                                className="w-full object-cover"
                            />
                        </Section>

                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Kestora University Admission
                        </Heading>

                        <Heading className="text-black text-[18px] font-normal text-center p-0 mb-[20px] mx-0">
                            Congratulations on Your Offer!
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are delighted to inform you that you have been offered a conditional place to study at Kestora University.
                        </Text>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">Your Offer Details:</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Programme: {courseTitle}</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Intake: August 2026 (Autumn Semester)</Text>
                            <Text className="text-black text-[14px] leading-[24px]">Status: Conditional Offer</Text>
                        </Section>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">What Does a Conditional Offer Mean?</Text>
                            <Text className="text-black text-[14px] leading-[24px]">
                                A conditional offer means that you have a place reserved for you, provided you meet certain conditions. In most cases, the primary condition is the payment of your tuition fee deposit or the submission of final verified academic documents.
                            </Text>
                        </Section>

                        <Section className="my-[20px]">
                            <Text className="text-black text-[14px] font-semibold leading-[24px]">Your Next Steps</Text>
                            <Text className="text-black text-[14px] leading-[24px]">To secure your place, please complete the following steps:</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Review Your Offer Letter: Log in to your student dashboard to carefully read the terms of your conditional offer.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Accept Your Offer: Confirm your acceptance of the offer in the portal.</Text>
                            <Text className="text-black text-[14px] leading-[24px]">• Fulfill Your Conditions: Fulfill the conditions outlined in your offer letter (such as paying your tuition fee deposit). Once the conditions are met, your offer will become unconditional, and your Official Admission Letter will be issued.</Text>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Log In and View Offer
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Important Request: Please act promptly to accept your offer and fulfill the conditions, as places are limited and allocated on a first-come, first-served basis once conditions are met.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are very impressed by your application and look forward to welcoming you to our creative community in Finland.
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Warm regards,
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Admissions Office
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Kestora University
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            admissions@kestora.online
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            https://kestora.online
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
