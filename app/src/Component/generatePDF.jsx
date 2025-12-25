'use client';
import React from 'react';
import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer';

export const generatePDFDocument = (salaryData) => {
    const styles = StyleSheet.create({
        page: { padding: 24, fontSize: 12, fontFamily: 'Helvetica' },
        header: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
        table: { display: 'table', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', marginBottom: 12 },
        tableRow: { flexDirection: 'row' },
        tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', padding: 4 },
        tableCell: { fontSize: 12 },
        seal: { width: 60, height: 60, marginTop: 12 }
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Company Logo */}
                {<Image src={'./public/D_Square_Full_Logo.png'} alt='Not Found' style={{ width: 120, marginBottom: 12 }} />}
                <Text style={styles.header}>Salary Slip – {salaryData.month}</Text>

                {/* Employee Details */}
                <View style={styles.table}>
                    {Object.entries(salaryData.employeeDetails).map(([key, value]) => (
                        <View style={styles.tableRow} key={key}>
                            <Text style={styles.tableCol}>{key}</Text>
                            <Text style={styles.tableCol}>{value}</Text>
                        </View>
                    ))}
                </View>

                {/* Earnings & Deductions */}
                <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                    <View style={{ flex: 1, marginRight: 6 }}>
                        <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Earnings</Text>
                        <View style={styles.table}>
                            {salaryData.earnings.map((item) => (
                                <View style={styles.tableRow} key={item.label}>
                                    <Text style={styles.tableCol}>{item.label}</Text>
                                    <Text style={styles.tableCol}>₹ {item.amount.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ flex: 1, marginLeft: 6 }}>
                        <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Deductions</Text>
                        <View style={styles.table}>
                            {salaryData.deductions.map((item) => (
                                <View style={styles.tableRow} key={item.label}>
                                    <Text style={styles.tableCol}>{item.label}</Text>
                                    <Text style={styles.tableCol}>₹ {item.amount.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Net Pay */}
                <Text style={{ marginBottom: 6 }}>Net Pay: ₹ {salaryData.netPay.toLocaleString()}</Text>
                <Text>In Words: {salaryData.netPayInWords}</Text>

                {/* Leave Balance */}
                <Text style={{ marginTop: 12, marginBottom: 6, fontWeight: 'bold' }}>Leave Balance</Text>
                <View style={styles.table}>
                    {salaryData.leaveBalance.map((leave) => (
                        <View style={styles.tableRow} key={leave.type}>
                            {Object.values(leave).map((val, idx) => (
                                <Text style={styles.tableCol} key={idx}>{val}</Text>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Seal */}
                {<Image src={'./public/D_Square_Round_Stamp.png'} style={styles.seal} alt='Seal' />}
            </Page>
        </Document>
    );
};