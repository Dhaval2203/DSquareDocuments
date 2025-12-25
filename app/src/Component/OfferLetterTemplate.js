import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import {
    primaryColor, secondaryColor,
    primaryBackgroundColor, textColor
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

    header: {
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    logo: {
        width: 150,
        height: 'auto',
    },

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

    content: {
        zIndex: 1,
    },

    titleWrapper: {
        backgroundColor: primaryBackgroundColor,
        paddingVertical: 10,
        marginBottom: 20,
        borderRadius: 6,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 1.2,
        color: primaryColor,
    },

    section: {
        marginBottom: 12,
        fontSize: 11,
    },

    highlightBox: {
        backgroundColor: primaryBackgroundColor,
        padding: 12,
        borderRadius: 6,
        marginBottom: 14,
    },

    bold: {
        fontWeight: 'bold',
        color: primaryColor,
    },

    pointTitle: {
        fontWeight: 'bold',
        fontSize: 12,
        color: secondaryColor,
        marginBottom: 6,
        borderBottom: 2,
        borderBottomColor: primaryColor
    },

    divider: {
        height: 1,
        backgroundColor: primaryColor,
        opacity: 0.3,
        marginVertical: 16,
    },

    footer: {
        marginTop: 40,
    },

    signature: {
        marginTop: 20,
    },

    companyName: {
        fontWeight: 'bold',
        color: primaryColor,
    },

    iconLine: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        marginLeft: 10,
    },

    iconBox: {
        width: 12,
        height: 12,
        // borderWidth: 1,
        // borderColor: primaryColor,
        marginRight: 6,
        marginTop: 2,
    },
});

export default function OfferLetterTemplate({
    employeeId,
    employeeName,
    joiningDate,
    position,
}) {
    const today = dayjs().format('DD MMMM YYYY');

    const jobResponsibilities = [
        'Execute assigned tasks with diligence and professionalism.',
        'Collaborate with team members to deliver project objectives.',
        'Attend meetings and provide regular progress updates.',
        'Follow company policies and procedures.',
        'Maintain confidentiality of sensitive information.',
    ];

    const benefits = [
        'Health insurance coverage',
        'Paid leaves',
        'Provident fund contributions',
        'Performance bonuses (as applicable)',
        'Other benefits as per company policy',
    ];

    const termsAndConditions = [
        'Employment is subject to compliance with all company policies.',
        'Any intellectual property created during employment belongs to D Square Infotech.',
        'The company can amend policies from time to time.',
        'Termination notice period is as per company rules.',
    ];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Brand Strip */}
                <View style={styles.topBar} />

                {/* Watermark */}
                <Image src="/Logo.png" alt='Logo' style={styles.watermark} />

                <View style={styles.content}>
                    {/* Logo Header */}
                    <View style={styles.header}>
                        <Image src="/D_Square_Full_Logo.png" alt='Full Logo' style={styles.logo} />
                    </View>

                    {/* Title */}
                    <View style={styles.titleWrapper}>
                        <Text style={styles.title}>OFFER LETTER</Text>
                    </View>

                    {/* Date */}
                    <Text style={styles.section}>Date: {today}</Text>

                    {/* Employee Info */}
                    <View style={styles.highlightBox}>
                        <Text>
                            Employee Name: <Text style={styles.bold}>{employeeName}</Text>
                        </Text>
                        <Text>
                            Employee ID: <Text style={styles.bold}>{employeeId}</Text>
                        </Text>
                        <Text>
                            Joining Date: <Text style={styles.bold}>{joiningDate}</Text>
                        </Text>
                        <Text>
                            Designation / Position: <Text style={styles.bold}>{position}</Text>
                        </Text>
                    </View>

                    <Text style={styles.section}>Dear {employeeName},</Text>

                    <Text style={styles.section}>
                        We are pleased to offer you the position of{' '}
                        <Text style={styles.bold}>{position}</Text> at{' '}
                        <Text style={styles.companyName}>D Square Infotech</Text>.
                        This offer reflects our confidence in your skills, experience, and potential contribution to our team.
                    </Text>

                    {/* Job Responsibilities */}
                    <Text style={styles.pointTitle}>Job Responsibilities:</Text>
                    {renderIconList(jobResponsibilities)}

                    {/* Compensation & Benefits */}
                    <Text style={styles.pointTitle}>Compensation & Benefits:</Text>
                    {renderIconList(benefits)}

                    {/* Probation */}
                    <Text style={styles.pointTitle}>Probation Period:</Text>
                    <Text style={styles.section}>
                        You will be on a probation period of <Text style={styles.bold}>60 days</Text>.
                        Your performance will be evaluated during this period.
                    </Text>

                    {/* Terms & Conditions */}
                    <Text style={styles.pointTitle}>Terms & Conditions:</Text>
                    {renderIconList(termsAndConditions)}

                    <View style={styles.divider} />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text>Yours sincerely,</Text>
                        <View style={styles.signature}>
                            <Text style={styles.companyName}>HR Department</Text>
                            <Text>D Square Infotech</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}
