'use client'
import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import {
    primaryColor,
    secondaryColor,
    primaryBackgroundColor,
    textColor,
    accentColor,
} from '../Utils/Colors';
import { renderIconList } from '../Utils/UIStyles/renderIconList';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.6,
        position: 'relative',
        color: textColor,
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 12,
        backgroundColor: primaryColor,
    },
    header: { alignItems: 'center', marginBottom: 16, marginTop: 10 },
    logo: { width: 150, height: 'auto' },
    watermark: {
        position: 'absolute',
        top: '40%',
        left: '40%',
        width: 220,
        height: 220,
        opacity: 0.12,
        zIndex: 0,
        transform: 'translate(-50%, -50%)',
    },
    content: { zIndex: 1 },
    titleWrapper: { backgroundColor: primaryBackgroundColor, paddingVertical: 10, marginBottom: 20, borderRadius: 6 },
    title: { fontSize: 18, textAlign: 'center', fontWeight: 'bold', letterSpacing: 1.2, color: primaryColor },
    section: { marginBottom: 12, fontSize: 11 },
    bold: { fontWeight: 'bold', color: primaryColor },
    divider: { height: 1, backgroundColor: primaryColor, opacity: 0.3, marginVertical: 16 },
    footer: { marginTop: 20 },
    signature: { marginTop: 20 },
    companyName: { fontWeight: 'bold', color: primaryColor },
    pointTitle: {
        fontWeight: 'bold', fontSize: 12,
        color: secondaryColor, marginBottom: 6,
        borderBottom: 2,
        borderBottomColor: primaryColor
    },
});

export default function ExperienceLetterNegativeTemplate({ employee, joiningDate, relievingDate, selectedPointsByCategory }) {
    const concerns = selectedPointsByCategory?.Concerns || [];
    const improvementAreas = selectedPointsByCategory?.['Improvement Areas'] || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.topBar} />
                <Image src="/Logo.png" alt="Watermark" style={styles.watermark} />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Image src="/D_Square_Full_Logo.png" alt="Company Logo" style={styles.logo} />
                    </View>

                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>EXPERIENCE LETTER</Text>
                    </View>

                    <Text style={styles.section}>
                        This is to certify that <Text style={styles.bold}>{employee.name} </Text>
                        <Text style={{ color: secondaryColor, fontWeight: 'bold' }}> (Employee ID: {employee.employeeId}) </Text>
                        was employed with us from <Text style={styles.bold}>{joiningDate} </Text>
                        to <Text style={styles.bold}>{relievingDate}</Text>.
                    </Text>

                    <Text style={styles.section}>
                        During their tenure, {employee.name} held the position of <Text style={styles.bold}>{employee.designation} </Text>.
                        While certain responsibilities were met, there were areas where performance required improvement.
                    </Text>

                    {concerns.length > 0 && (
                        <>
                            <Text style={styles.pointTitle}>Areas of Concern:</Text>
                            {renderIconList(concerns)}
                        </>
                    )}

                    {improvementAreas.length > 0 && (
                        <>
                            <Text style={styles.pointTitle}>Recommended Improvements:</Text>
                            {renderIconList(improvementAreas)}
                        </>
                    )}

                    <Text style={styles.section}>
                        {employee.name} will benefit from focusing on professional development and enhancing key skills
                        to succeed in future roles.
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.footer}>
                        <Text>Yours sincerely,</Text>
                        <View style={styles.signature}>
                            <Text style={styles.companyName}>HR Department</Text>
                            <Text>
                                <Text style={{ color: primaryColor, fontWeight: 'bold' }}>D</Text>
                                <Text style={{ color: secondaryColor, fontWeight: 'bold' }}> Square </Text>
                                <Text style={{ color: accentColor, fontWeight: 'bold' }}>Infotech</Text>
                            </Text>
                            <Image
                                src="/D_Square_Round_Stamp.png"
                                alt="Round Stamp"
                                style={{ width: 100, height: 100 }}
                            />
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
