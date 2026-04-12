
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
    Link,
    Hr,
    Tailwind,
} from '@react-email/components';

interface NewsletterEmailProps {
    firstName?: string;
}

export default function NewsletterEmail({
    firstName = 'Student',
}: NewsletterEmailProps) {
    const previewText = `Important updates regarding your journey to Kestora University.`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-[#f8f9fa] my-auto mx-auto font-sans text-[#1a1a1a]">
                    <Container className="bg-white border border-solid border-[#eeeeee] rounded my-[40px] mx-auto overflow-hidden w-[600px] shadow-sm">
                        
                        {/* Header */}
                        <Section className="bg-white p-[30px] text-center border-b border-solid border-[#eeeeee]">
                            <Img
                                src="https://kestora.online/logo-kestora.png"
                                width="160"
                                alt="Kestora University"
                                className="my-0 mx-auto"
                            />
                        </Section>

                        {/* Hero Image */}
                        <Section className="p-0">
                            <Img
                                src="https://kestora.online/images/international-students.png"
                                width="600"
                                alt="International Students"
                                className="w-full h-auto block"
                            />
                        </Section>

                        {/* Content */}
                        <Section className="px-[40px] pt-[40px] pb-[20px]">
                            <Heading className="text-[26px] font-semibold text-black leading-[1.2] m-0 mb-[20px]">
                                Your Journey to Study in Finland Starts Here
                            </Heading>
                            <Text className="text-[16px] leading-[1.6] color-[#444444]">
                                Dear {firstName},
                            </Text>
                            <Text className="text-[16px] leading-[1.6] color-[#444444]">
                                We are pleased to welcome you to the Kestora University community. This newsletter provides you with critical updates, upcoming deadlines, and the necessary next steps for your official admission process.
                            </Text>
                        </Section>

                        {/* Important Update */}
                        <Section className="px-[40px] py-[30px] bg-[#fafafa] border-l-[4px] border-solid border-black">
                            <Heading as="h3" className="text-[18px] uppercase tracking-[1px] text-black m-0 mb-[10px]">
                                Important Update
                            </Heading>
                            <Text className="text-[15px] leading-[1.5] text-[#333333] m-0">
                                The August 2026 intake is approaching capacity and will be closing shortly. To ensure your placement, please complete your application, formally accept your offer, and finalize your tuition payment.
                            </Text>
                        </Section>

                        {/* Dashboard CTA */}
                        <Section className="text-center py-[40px]">
                            <Link
                                href="https://kestora.online/portal"
                                className="bg-black text-white text-[14px] font-bold no-underline text-center px-[35px] py-[16px] inline-block uppercase tracking-[1px] rounded-[2px]"
                            >
                                Access Your Dashboard
                            </Link>
                        </Section>

                        {/* Student Community */}
                        <Section className="px-[40px] pb-[40px] text-center">
                            <Heading as="h3" className="text-[18px] text-black m-0 mb-[10px]">
                                Official Student Community
                            </Heading>
                            <Text className="text-[15px] leading-[1.6] text-[#444444] mb-[20px]">
                                Engage with fellow students and ambassadors through our dedicated communication platform for real-time support and peer networking.
                            </Text>
                            <Link 
                                href="https://students.kestora.online/" 
                                className="bg-black text-white text-[14px] font-bold no-underline text-center px-[35px] py-[16px] inline-block uppercase tracking-[1px] rounded-[2px]"
                            >
                                Student Community
                            </Link>
                        </Section>

                        {/* Next Steps List */}
                        <Section className="bg-black p-[40px] text-white">
                            <Heading as="h3" className="text-[18px] uppercase tracking-[1px] m-0 mb-[20px]">
                                Required Actions
                            </Heading>
                            <Text className="text-[15px] leading-[2] m-0">
                                &bull; Review and accept your formal admission offer<br />
                                &bull; Finalize the required tuition deposit<br />
                                &bull; Download your official admission and visa support letters<br />
                                &bull; Initiate the Finnish residence permit application process
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="p-[40px] text-center">
                            <Text className="m-0 font-bold text-[#333333] uppercase tracking-[1px] text-[12px]">
                                Kestora University
                            </Text>
                            <Text className="text-[12px] text-[#888888] my-[10px]">
                                Admissions Office: admissions@kestora.online
                            </Text>
                            <Hr className="border-t border-solid border-[#eeeeee] my-[20px]" />
                            <Section className="text-center">
                                <Link href="https://kestora.online" className="text-[#333333] no-underline mx-[10px] text-[12px]">Website</Link>
                                <span className="text-[#dddddd]">|</span>
                                <a href="https://kestora.online/privacy" className="text-[#333333] no-underline mx-[10px] text-[12px]">Privacy Policy</a>
                            </Section>
                            <Text className="text-[12px] text-[#888888] mt-[20px] mb-0">
                                &copy; 2026 Kestora University. All rights reserved.
                            </Text>
                        </Section>

                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
