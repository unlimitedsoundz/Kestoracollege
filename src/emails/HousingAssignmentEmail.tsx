
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
import { formatToDDMMYYYY } from '@/utils/date';

interface HousingAssignmentEmailProps {
    firstName: string;
    buildingName: string;
    roomNumber: string;
    campusLocation: string;
    moveInDate: string;
    moveOutDate: string;
}

export default function HousingAssignmentEmail({
    firstName = 'Student',
    buildingName = 'Building A',
    roomNumber = '101',
    campusLocation = 'Main Campus',
    moveInDate = new Date().toISOString(),
    moveOutDate = new Date(new Date().setMonth(new Date().getMonth() + 5)).toISOString(),
}: HousingAssignmentEmailProps) {
    const previewText = `Housing Assigned: You have been assigned to Room ${roomNumber} in ${buildingName}.`;

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
                            Housing Assignment Confirmed
                        </Heading>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Dear {firstName},
                        </Text>

                        <Text className="text-black text-[14px] leading-[24px]">
                            We are pleased to inform you that your housing application has been approved and a room has been assigned to you.
                        </Text>

                        <Section className="bg-neutral-50 rounded-lg p-6 my-8 border border-neutral-100">
                            <div className="mb-4">
                                <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Building</Text>
                                <Text className="text-black text-[16px] font-bold my-0">{buildingName}</Text>
                                <Text className="text-neutral-500 text-[12px] my-0">{campusLocation}</Text>
                            </div>

                            <div className="flex justify-between mb-4">
                                <div>
                                    <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Room Number</Text>
                                    <Text className="text-black text-[14px] font-mono font-bold my-0">{roomNumber}</Text>
                                </div>
                            </div>

                            <Hr className="border-dashed border-neutral-200 my-4" />

                            <div className="flex justify-between">
                                <div>
                                    <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Move-In Date</Text>
                                    <Text className="text-black text-[12px] font-bold my-0">{formatToDDMMYYYY(moveInDate)}</Text>
                                </div>
                                <div className="text-right">
                                    <Text className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest my-0">Move-Out Date</Text>
                                    <Text className="text-black text-[12px] font-bold my-0">{formatToDDMMYYYY(moveOutDate)}</Text>
                                </div>
                            </div>
                        </Section>

                        <Text className="text-black text-[14px] leading-[24px]">
                            Please proceed to the Housing Portal to view your lease agreement and move-in instructions.
                        </Text>

                        <Section className="text-center mt-[32px] mb-[32px]">
                            <Link
                                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                                href="https://syklicollege.fi/portal/student/housing"
                            >
                                View Housing Portal
                            </Link>
                        </Section>

                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Student Housing Office, SYKLI College.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
