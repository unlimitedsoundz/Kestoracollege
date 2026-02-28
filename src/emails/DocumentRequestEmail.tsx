
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

interface DocumentRequestEmailProps {
    firstName: string;
    courseTitle: string;
    requestedDocuments: string[];
    note?: string | null;
}

export default function DocumentRequestEmail({
    firstName = 'Student',
    courseTitle = 'Applied Sciences',
    requestedDocuments = [],
    note = '',
}: DocumentRequestEmailProps) {
    const previewText = `Action Required: Additional documents requested for your application to ${courseTitle}.`;

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
                            Action Required: Documents Requested
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            The admissions team has reviewed your application for <strong>{courseTitle}</strong> and requires additional information to proceed.
                        </Text>

                        {note && (
                            <Section className="bg-[#f9f9f9] p-[20px] rounded my-[20px] border border-solid border-[#eaeaea]">
                                <Text className="text-[#666666] text-[12px] uppercase tracking-wider font-bold mb-[10px] leading-none">
                                    Message from Admissions:
                                </Text>
                                <Text className="text-black text-[14px] leading-[24px] italic m-0">
                                    "{note}"
                                </Text>
                            </Section>
                        )}

                        {requestedDocuments.length > 0 && (
                            <Section className="my-[20px]">
                                <Text className="text-black text-[14px] font-bold mb-[10px]">
                                    Required Documents:
                                </Text>
                                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                                    {requestedDocuments.map((doc) => (
                                        <li key={doc} className="text-black text-[14px] leading-[24px]">
                                            {doc.replaceAll('_', ' ')}
                                        </li>
                                    ))}
                                </ul>
                            </Section>
                        )}

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#9333ea] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://kestora.online/portal/dashboard"
                            >
                                Upload Documents
                            </Link>
                        </Section>

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
