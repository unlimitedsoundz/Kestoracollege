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
    }
}

export const AdmissionLetterPDF = ({ data }: AdmissionLetterProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Area */}
            <View style={styles.header}>
                <View>
                    {data.logo_path && <Image src={data.logo_path} style={styles.logo} />}
                </View>
                <View style={styles.contactInfo}>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>SYKLI College Registrar</Text>
                    <Text>Pohjoisesplanadi 51</Text>
                    <Text>00150 Helsinki, Finland</Text>
                    <Text>Website: https://syklicollege.fi</Text>
                    <Text>Email: registrar@syklicollege.fi</Text>
                </View>
            </View>

            {/* Title Section */}
            <Text style={styles.mainTitle}>Official Admission Letter</Text>

            {/* Meta Data Box */}
            <View style={styles.metaSection}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Enrollment Date</Text>
                    <Text style={styles.metaValue}>{data.issue_date}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Admission Reference</Text>
                    <Text style={styles.metaValue}>{data.admission_reference}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Official Student ID</Text>
                    <Text style={styles.metaValue}>{data.student_id}</Text>
                </View>
            </View>

            {/* Confirmation Statement */}
            <View style={styles.confirmationBox}>
                <Text style={styles.confirmationText}>
                    On behalf of the Office of the Registrar and the Academic Board of SYKLI College of Art and Design, we are pleased to formally confirm your individual admission and subsequent official enrollment as a student for the {data.program} ({data.degree_level}) program. This decision follows a rigorous and holistic review of your academic trajectory, demonstrative excellence in your chosen field, and your potential for advanced creative contribution.
                </Text>
                <Text style={[styles.confirmationText, { marginTop: 10 }]}>
                    Your enrollment is finalized for the {data.academic_year} Academic Year, specifically for the {data.intake} intake period. This document certifies that you have successfully satisfied all required conditions of admission and that the necessary tuition requirements for the initial period of study have been processed and confirmed. As a member of our degree-seeking cohort, you are granted full access to the college's academic resources, infrastructure, and international support network. We welcome you to SYKLI College and look forward to supporting your professional development and academic success.
                </Text>
            </View>

            {/* Student & Program Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Academic Enrollment Details</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Full Legal Name</Text>
                        <Text style={styles.gridValue}>{data.full_name}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Academic Year / Intake</Text>
                        <Text style={styles.gridValue}>{data.academic_year} / {data.intake}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Program of Study</Text>
                        <Text style={styles.gridValue}>{data.program}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Degree Level</Text>
                        <Text style={styles.gridValue}>{data.degree_level}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Program Commencement</Text>
                        <Text style={styles.gridValue}>{data.program_start_date}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Enrollment Status</Text>
                        <Text style={[styles.gridValue, { color: '#000' }]}>FULLY ENROLLED (ACTIVE)</Text>
                    </View>
                </View>
            </View>

            {/* Tuition Confirmation */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tuition & Financial Confirmation</Text>
                <View style={styles.infoBlock}>
                    <Text style={{ fontSize: 9 }}>
                        The Office of the Registrar confirms that the required tuition fees for the first academic year have been received and successfully processed. This enrollment is fully secured.
                    </Text>
                </View>
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
