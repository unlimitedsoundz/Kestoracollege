import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { formatDateToWords } from '@/utils/word-converter';

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
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 2,
    },
    metaItem: {
        flexDirection: 'column',
    },
    metaLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#999',
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
        marginBottom: 8,
    },
    gridLabel: {
        fontSize: 7,
        color: '#666',
        textTransform: 'uppercase',
        marginBottom: 1,
    },
    gridValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    highlightBox: {
        backgroundColor: '#000',
        padding: 20,
        color: '#fff',
        marginBottom: 25,
        borderRadius: 2,
    },
    highlightText: {
        fontSize: 11,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    table: {
        width: '100%',
        marginTop: 10,
        borderTop: '1pt solid #eee',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1pt solid #eee',
        paddingVertical: 8,
        backgroundColor: '#fafafa',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #eee',
        paddingVertical: 8,
    },
    tableCellLabel: {
        flex: 2,
        paddingLeft: 10,
    },
    tableCellValue: {
        flex: 1,
        textAlign: 'right',
        paddingRight: 10,
        fontWeight: 'bold',
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
    disclaimer: {
        marginTop: 30,
        fontSize: 7,
        color: '#999',
        textAlign: 'justify',
        fontStyle: 'italic',
        lineHeight: 1.4,
    }
});

interface OfferLetterProps {
    data: {
        offer_reference: string;
        full_name: string;
        student_id: string;
        date_of_birth: string;
        program: string;
        degree_level: string;
        intake: string;
        academic_year: string;
        school: string;
        course: string;
        program_length: string;
        total_ects: number;
        issue_date: string;
        expiry_date: string;
        tuition_fee?: number;
        discount_amount?: number;
        logo_path?: string;
        signature_path?: string;
    }
}

export const OfferLetterPDF = ({ data }: OfferLetterProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Area */}
            <View style={styles.header}>
                <View>
                    {data.logo_path && <Image src={data.logo_path} style={styles.logo} />}
                </View>
                <View style={styles.contactInfo}>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 10, marginBottom: 4 }}>Kestora College</Text>
                    <Text>Pohjoisesplanadi 51</Text>
                    <Text>00150 Helsinki, Finland</Text>
                    <Text>Website: https://kestora.fi</Text>
                    <Text>Email: admissions@kestora.fi</Text>
                </View>
            </View>

            {/* Title Section */}
            <Text style={styles.mainTitle}>Official Letter of Offer</Text>

            {/* Meta Data Box */}
            <View style={styles.metaSection}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Date Issued</Text>
                    <Text style={styles.metaValue}>{data.issue_date}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Unique Offer Reference Number</Text>
                    <Text style={styles.metaValue}>{data.offer_reference}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Application ID</Text>
                    <Text style={styles.metaValue}>{data.student_id}</Text>
                </View>
            </View>

            {/* Applicant & Program Info */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Applicant & Programme Details</Text>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Full Name (Passport Match)</Text>
                        <Text style={styles.gridValue}>{data.full_name}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Intake & Year</Text>
                        <Text style={styles.gridValue}>{data.intake} {data.academic_year}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Intended Programme</Text>
                        <Text style={styles.gridValue}>{data.program}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.gridLabel}>Degree Level</Text>
                        <Text style={styles.gridValue}>{data.degree_level}</Text>
                    </View>
                </View>
            </View>

            {/* Formal Offer Statement (LOCKED WORDING) */}
            <View style={styles.highlightBox}>
                <Text style={styles.highlightText}>
                    “We are pleased to inform you that you have been offered a place in the above-named programme at Kestora College, subject to the conditions outlined in this letter.”
                </Text>
            </View>

            {/* Conditions of Offer */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Conditions of Offer</Text>
                <Text style={{ fontSize: 9, marginBottom: 5 }}>This offer is conditional upon acceptance and fulfillment of all stated requirements:</Text>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 8 }}>• Formal acceptance of this offer via the student portal.</Text>
                    <Text style={{ fontSize: 8 }}>• Payment of required tuition fees by the specified deadline.</Text>
                    <Text style={{ fontSize: 8 }}>• Submission of any outstanding original documents (if applicable).</Text>
                </View>
                <Text style={{ fontSize: 8, fontStyle: 'italic', marginTop: 8 }}>
                    “This offer is conditional upon acceptance and fulfillment of all stated requirements.”
                </Text>
            </View>

            {/* Tuition Information (INFORMATIONAL ONLY) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tuition & Financial Information (Informational Only)</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCellLabel}>Standard Annual Tuition Fee</Text>
                        <Text style={styles.tableCellValue}>€{((data.tuition_fee || 0) + (data.discount_amount || 0)).toLocaleString()} EUR</Text>
                    </View>
                    {data.discount_amount ? (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCellLabel}>Early-bird Discount (First Academic Year only)</Text>
                            <Text style={[styles.tableCellValue, { color: '#059669' }]}>- €{data.discount_amount.toLocaleString()} EUR</Text>
                        </View>
                    ) : null}
                    <View style={[styles.tableRow, { backgroundColor: '#fdfdfd' }]}>
                        <Text style={[styles.tableCellLabel, { fontWeight: 'bold' }]}>Amount Due to Secure Admission</Text>
                        <Text style={[styles.tableCellValue, { fontSize: 11 }]}>€{data.tuition_fee?.toLocaleString()} EUR</Text>
                    </View>
                </View>
            </View>

            {/* Next Steps & Validity */}
            <View style={styles.grid}>
                <View style={[styles.gridItem, { width: '60%' }]}>
                    <Text style={styles.sectionTitle}>Next Steps</Text>
                    <Text style={{ fontSize: 8 }}>1. Accept offer via the student portal.</Text>
                    <Text style={{ fontSize: 8 }}>2. Proceed to tuition payment.</Text>
                    <Text style={{ fontSize: 8 }}>3. Admission letter issued after payment confirmation.</Text>
                </View>
                <View style={[styles.gridItem, { width: '40%' }]}>
                    <Text style={styles.sectionTitle}>Offer Validity</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{data.expiry_date}</Text>
                    <Text style={{ fontSize: 7, color: '#666' }}>This offer will lapse automatically if not accepted by the specified date.</Text>
                </View>
            </View>

            {/* Signature & Legal */}
            <View style={styles.footerContainer}>
                <View style={styles.signatureBlock}>
                    {data.signature_path && <Image src={data.signature_path} style={styles.signatureImage} />}
                    <Text style={styles.signatoryName}>Admissions Office</Text>
                    <Text style={styles.signatoryTitle}>Kestora College | Finland</Text>
                </View>
                <View style={{ width: '40%', textAlign: 'right' }}>
                    <Text style={{ fontSize: 7, color: '#999' }}>Verified Document ID</Text>
                    <Text style={{ fontSize: 7, color: '#000', fontFamily: 'Courier' }}>{data.offer_reference}</Text>
                </View>
            </View>

            <View style={styles.disclaimer}>
                <Text>
                    LEGAL DISCLAIMER: “This Offer Letter does not constitute confirmation of enrollment. Official admission is granted only after acceptance of the offer and confirmation of required tuition payment.”
                </Text>
            </View>
        </Page>
    </Document>
);
