import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import {
    primaryColor,
    accentColor,
    primaryBackgroundColor,
    secondaryBackgroundColor,
    secondaryColor
} from '../Utils/Colors';

// Styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#333',
        position: 'relative',
    },

    /* ---------------- Header ---------------- */
    headerSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },

    logo: {
        width: 42,
        height: 42,
        marginRight: 12,
    },

    companyBlock: {
        flexDirection: 'column',
        justifyContent: 'center',
    },

    companyNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    companyNamePrimary: {
        fontSize: 14,
        fontWeight: 'bold',
        color: primaryColor,
    },

    companyNameSecondary: {
        fontSize: 14,
        fontWeight: 'bold',
        color: secondaryColor,
        marginLeft: 3,
    },

    companyNameAccent: {
        fontSize: 14,
        fontWeight: 'bold',
        color: accentColor,
        marginLeft: 4,
    },

    companyEmail: {
        fontSize: 9,
        color: '#666',
        marginTop: 2,
    },

    divider: {
        borderBottomWidth: 1,
        borderBottomColor: primaryColor,
        marginBottom: 15,
    },

    title: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: primaryColor,
    },

    /* ---------------- Employee Info Grid ---------------- */
    infoGrid: {
        borderWidth: 1,
        borderColor: primaryColor,
        marginBottom: 15,
    },
    gridRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: primaryColor,
    },
    gridCellLabel: {
        flex: 1,
        padding: 4,
        backgroundColor: primaryBackgroundColor,
        fontWeight: 'bold',
        borderRightWidth: 1,
        borderRightColor: primaryColor,
    },
    gridCellValue: {
        flex: 1,
        padding: 4,
        borderRightWidth: 1,
        borderRightColor: primaryColor,
    },

    /* ---------------- Earnings / Deductions ---------------- */
    mainTable: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: primaryColor,
    },
    tableColumn: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: primaryColor,
    },
    tableHeader: {
        padding: 4,
        backgroundColor: secondaryBackgroundColor,
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: primaryColor,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },

    /* ---------------- Summary ---------------- */
    summarySection: {
        marginTop: 10,
        padding: 8,
        borderWidth: 1,
        borderColor: primaryColor,
    },
    netPayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    totalText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: accentColor,
    },

    /* ---------------- Leave Table ---------------- */
    leaveTable: {
        marginTop: 15,
    },
    leaveHeader: {
        flexDirection: 'row',
        backgroundColor: secondaryBackgroundColor,
        borderWidth: 1,
        borderColor: primaryColor,
    },
    leaveRow: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderLeftColor: primaryColor,
        borderRightWidth: 1,
        borderRightColor: primaryColor,
        borderBottomWidth: 1,
        borderBottomColor: primaryColor,
    },
    leaveCell: {
        flex: 1,
        padding: 4,
        textAlign: 'center',
        fontSize: 9,
    },

    /* ---------------- Stamp ---------------- */
    stamp: {
        width: 55,
        height: 55,
        position: 'absolute',
        bottom: 40,
        right: 40,
        opacity: 0.9,
    },

    /* ---------------- Footer ---------------- */
    footer: {
        marginTop: 45,
        fontSize: 8,
        color: '#666',
        textAlign: 'center',
    },
});

// Helper
const formatAmount = (value) => `${(value || 0).toLocaleString()}`;

export const SalarySlipPDF = ({ data, totals }) => {
    const monthYearText =
        typeof data.monthYear === 'string'
            ? data.monthYear
            : data.monthYear?.format
                ? data.monthYear.format('MMMM YYYY')
                : 'November 2025';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Water Mark */}
                <Image
                    src="/Logo.png"
                    alt="Watermark"
                    style={{
                        position: 'absolute',
                        top: '40%',
                        left: '40%',
                        width: 200,
                        height: 200,
                        opacity: 0.35,
                        zIndex: 0,
                        transform: 'translate(-50%, -50%)', // center the image
                    }}
                />

                {/* Header */}
                <View style={styles.headerSection}>
                    <Image src="/Logo.png" alt="Logo" style={styles.logo} />
                    <View style={styles.companyBlock}>
                        <View style={styles.companyNameRow}>
                            <Text style={styles.companyNamePrimary}>D</Text>
                            <Text style={styles.companyNameSecondary}>Square</Text>
                            <Text style={styles.companyNameAccent}>Infotech</Text>
                        </View>
                        <Text style={styles.companyEmail}>info@dsquareinfotech.com</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.title}>Salary Slip - {monthYearText}</Text>

                {/* Employee Info */}
                <View style={styles.infoGrid}>
                    <View style={styles.gridRow}>
                        <Text style={styles.gridCellLabel}>Employee Name</Text>
                        <Text style={styles.gridCellValue}>{data.name || '-'}</Text>
                        <Text style={styles.gridCellLabel}>Employee ID</Text>
                        <Text style={[styles.gridCellValue, { borderRightWidth: 0 }]}>
                            {data.employeeId || '-'}
                        </Text>
                    </View>

                    <View style={styles.gridRow}>
                        <Text style={styles.gridCellLabel}>Designation</Text>
                        <Text style={styles.gridCellValue}>{data.designation || '-'}</Text>
                        <Text style={styles.gridCellLabel}>Department</Text>
                        <Text style={[styles.gridCellValue, { borderRightWidth: 0 }]}>
                            {data.department || '-'}
                        </Text>
                    </View>

                    <View style={styles.gridRow}>
                        <Text style={styles.gridCellLabel}>Date of Joining</Text>
                        <Text style={styles.gridCellValue}>{data.doj || '-'}</Text>
                        <Text style={styles.gridCellLabel}>Worked Days</Text>
                        <Text style={[styles.gridCellValue, { borderRightWidth: 0 }]}>
                            {data.workedDays || '-'}
                        </Text>
                    </View>

                    <View style={[styles.gridRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.gridCellLabel}>Bank A/C No.</Text>
                        <Text style={styles.gridCellValue}>{data.bankAccount || '-'}</Text>
                        <Text style={styles.gridCellLabel}>Bank Name</Text>
                        <Text style={[styles.gridCellValue, { borderRightWidth: 0 }]}>
                            {data.bankName || '-'}
                        </Text>
                    </View>
                </View>

                {/* Earnings & Deductions */}
                <View style={styles.mainTable}>
                    <View style={styles.tableColumn}>
                        <Text style={styles.tableHeader}>Earnings</Text>
                        {['basic', 'hra', 'telephone', 'internet', 'cityAllowance'].map((key) => (
                            <View
                                key={key}
                                style={[styles.tableRow, { flexDirection: 'row', justifyContent: 'space-between' }]}
                            >
                                <Text>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                <Text>{formatAmount(data[key])}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={[styles.tableColumn, { borderRightWidth: 0 }]}>
                        <Text style={styles.tableHeader}>Deductions</Text>
                        {['pt', 'tds', 'pf', 'esic'].map((key) => (
                            <View
                                key={key}
                                style={[styles.tableRow, { flexDirection: 'row', justifyContent: 'space-between' }]}
                            >
                                <Text>{key.toUpperCase()}</Text>
                                <Text>{formatAmount(data[key])}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Net Pay */}
                <View style={styles.summarySection}>
                    <View style={styles.netPayRow}>
                        <Text style={styles.totalText}>Net Pay</Text>
                        <Text style={styles.totalText}>{formatAmount(totals.netPay)} /-</Text>
                    </View>
                    <Text style={{ fontSize: 9 }}>In Words: {data.netPayInWords}</Text>
                </View>

                {/* Leave Balance */}
                <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Leave Balance</Text>
                <View style={styles.leaveTable}>
                    <View style={styles.leaveHeader}>
                        {['Leave Type', 'Opening', 'Allotted', 'Availed', 'Closing'].map((h) => (
                            <Text key={h} style={styles.leaveCell}>{h}</Text>
                        ))}
                    </View>
                    <View style={styles.leaveRow}>
                        <Text style={styles.leaveCell}>CL</Text>
                        <Text style={styles.leaveCell}>2.5</Text>
                        <Text style={styles.leaveCell}>0</Text>
                        <Text style={styles.leaveCell}>0</Text>
                        <Text style={styles.leaveCell}>2.5</Text>
                    </View>
                </View>

                {/* Stamp */}
                <Image src="/D_Square_Round_Stamp.png" alt="Stamp" style={styles.stamp} />

                {/* Footer */}
                <Text style={styles.footer}>
                    This salary slip is system-generated and valid without a signature.
                </Text>
            </Page>
        </Document>
    );
};
