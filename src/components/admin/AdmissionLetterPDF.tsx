import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 60,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.6,
        color: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40,
        borderBottom: '1pt solid #e5e5e5',
        paddingBottom: 20,
    },
    logo: {
        width: 140,
        height: 48,
        objectFit: 'contain',
    },
    contactInfo: {
        textAlign: 'right',
        fontSize: 8,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
        textTransform: 'uppercase',
        letterSpacing: 3,
        textAlign: 'center',
        color: '#000',
    },
    metaSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        paddingVertical: 15,
        borderTop: '1pt solid #000',
        borderBottom: '1pt solid #000',
    },
    metaItem: {
        flexDirection: 'column',
    },
    metaLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: '#000',
        marginBottom: 10,
        borderBottom: '0.5pt solid #eee',
        paddingBottom: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    gridItem: {
        width: '50%',
        marginBottom: 12,
    },
    gridLabel: {
        fontSize: 7,
        color: '#666',
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    gridValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    confirmationBox: {
        paddingVertical: 20,
        marginBottom: 25,
    },
    confirmationText: {
        fontSize: 11,
        textAlign: 'left',
        fontWeight: 'bold',
        color: '#000',
        lineHeight: 1.4,
    },

    infoBlock: {
        paddingVertical: 15,
        marginBottom: 20,
        borderLeft: '2pt solid #000',
        paddingLeft: 15,
    },
    footerContainer: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    signatureBlock: {
        width: 200,
    },
    signatureImage: {
        width: 140,
        marginBottom: 5,
    },
    signatoryName: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    signatoryTitle: {
        fontSize: 7,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    officialStatement: {
        marginTop: 30,
        padding: 10,
        borderTop: '0.5pt solid #eee',
        borderBottom: '0.5pt solid #eee',
        fontSize: 8,
        color: '#444',
        textAlign: 'center',
        fontStyle: 'italic',
    }
});

interface AdmissionLetterProps {
    data: {
        admission_reference: string;
        full_name: string;
        student_id: string;
        program: string;
        degree_level: string;
        academic_year: string;
        intake: string;
        issue_date: string;
        program_start_date: string;
        logo_path?: string;
        signature_path?: string;
        payment_reference?: string;
    }
}

export const AdmissionLetterPDF = ({ data }: AdmissionLetterProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* ... existing code ... */}
            {/* Tuition Confirmation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tuition Confirmation</Text>
                <View style={styles.infoBlock}>
                    <Text style={{ fontSize: 9 }}>
                        The required tuition fees for the first academic year have been received and confirmed.
                    </Text>
                    {data.payment_reference && (
                        <Text style={{ fontSize: 8, marginTop: 4, color: '#666' }}>
                            Official Receipt Reference: {data.payment_reference}
                        </Text>
                    )}
                </View>
            </View>

            {/* Rights & Access */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Rights & Access Statement</Text>
                <Text style={{ fontSize: 9, marginBottom: 5 }}>
                    As an enrolled student, you are entitled to access academic systems, student services, and institutional resources in accordance with college regulations.
                </Text>
            </View>

            {/* Next Steps */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Next Steps</Text>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 9, marginBottom: 2 }}>• Student email activation</Text>
                    <Text style={{ fontSize: 9, marginBottom: 2 }}>• LMS access</Text>
                    <Text style={{ fontSize: 9, marginBottom: 2 }}>• Course registration</Text>
                    <Text style={{ fontSize: 9, marginBottom: 2 }}>• Orientation details</Text>
                </View>
            </View>

            {/* Refund Policy */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Refund Policy</Text>
                <Text style={{ fontSize: 9 }}>
                    For refund policy details, please visit: https://syklicollege.fi/refund-withdrawal-policy/
                </Text>
            </View>

            {/* Official Use Statement */}
            <View style={styles.officialStatement}>
                <Text>
                    "This letter serves as official confirmation of admission and enrollment for institutional, banking, and immigration residency purposes."
                </Text>
            </View>

            {/* Signature Area */}
            <View style={styles.footerContainer}>
                <View style={styles.signatureBlock}>
                    {data.signature_path && <Image src={data.signature_path} style={styles.signatureImage} />}
                    <Text style={styles.signatoryName}>Office of the Registrar</Text>
                    <Text style={styles.signatoryTitle}>SYKLI College | Helsinki</Text>
                </View>
                <View style={{ width: '40%', textAlign: 'right' }}>
                    <Text style={{ fontSize: 8, color: '#666' }}>Institutional Stamp & Seal</Text>
                    <Text style={{ fontSize: 7, color: '#999', marginTop: 4 }}>Digital Verification Code: {data.admission_reference}</Text>
                </View>
            </View>
        </Page>
    </Document>
);
