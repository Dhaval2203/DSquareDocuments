'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
    Table,
    Typography,
    Button,
    Modal,
} from 'antd';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { pdf, PDFViewer } from '@react-pdf/renderer';
import { SalarySlipPDF } from './SalarySlipTemplate';
import {
    accentColor,
    primaryBackgroundColor,
    primaryColor,
    secondaryBackgroundColor,
    secondaryColor,
    whiteColor,
} from '../Utils/Colors';
import { EMPLOYEE_DATA, deductionsData, earningsData } from '../Utils/Const';
import numberToWords from '../Utils/UtilsFunction';
import { sendSalarySlipEmail } from '../Utils/sendSalarySlipEmail';

const { Title, Text } = Typography;
const { Option } = Select;

/* --------------------------------
   Helper: Working Days in Selected Month (Mon-Fri)
-------------------------------- */
const getWorkingDaysInMonth = (monthYear) => {
    if (!monthYear) return 0;

    const startOfMonth = dayjs(monthYear).startOf('month');
    const endOfMonth = dayjs(monthYear).endOf('month');
    let workingDays = 0;

    for (
        let date = startOfMonth;
        date.isBefore(endOfMonth) || date.isSame(endOfMonth, 'day');
        date = date.add(1, 'day')
    ) {
        const day = date.day();
        if (day !== 0 && day !== 6) workingDays++;
    }
    return workingDays;
};

export default function SalarySlip() {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const slipRef = useRef();

    /* --------------------------------
       Totals (Live Calculation)
    -------------------------------- */
    const totals = useMemo(() => {
        const totalEarnings =
            (values?.basic || 0) +
            (values?.hra || 0) +
            (values?.telephone || 0) +
            (values?.internet || 0) +
            (values?.cityAllowance || 0);

        const totalDeductions =
            (values?.pt || 0) +
            (values?.pf || 0) +
            (values?.esic || 0) +
            (values?.tds || 0) +
            (values?.lop || 0);

        return {
            totalEarnings,
            totalDeductions,
            netPay: totalEarnings - totalDeductions,
        };
    }, [values]);

    /* --------------------------------
       Amount Column
    -------------------------------- */
    const amountColumn = () => ({
        title: 'Amount (₹)',
        align: 'right',
        render: (_, record) => (
            <Form.Item name={record.name} style={{ marginBottom: 0 }}>
                <InputNumber
                    min={0}
                    style={{ width: '100%' }}
                    controls={false}
                    disabled={!values?.employeeId}
                    parser={(value) =>
                        value?.replace(/[₹,\s]/g, '') || '0'
                    }
                    formatter={(value) =>
                        `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                />
            </Form.Item>
        ),
    });

    /* --------------------------------
       PDF Data
    -------------------------------- */
    const salaryPDFData = {
        ...values,
        netPayInWords: numberToWords(totals.netPay),
    };

    /* --------------------------------
       Generate & Save PDF
    -------------------------------- */
    const generatePDF = async () => {
        const blob = await pdf(
            <SalarySlipPDF data={salaryPDFData} totals={totals} />
        ).toBlob();

        const monthYearText =
            values.monthYear?.format
                ? values.monthYear.format('MMM_YYYY')
                : dayjs().format('MMM_YYYY');

        saveAs(blob, `${values.name || 'Employee'}_${monthYearText}.pdf`);
    };

    return (
        <Card style={{ borderRadius: 16, background: '#F8FAFC' }}>
            <div ref={slipRef}>
                {/* Header */}
                <Card
                    style={{
                        borderRadius: 12,
                        background: primaryColor,
                        marginBottom: 24,
                    }}
                >
                    <Title level={3} style={{ color: '#fff', marginBottom: 0 }}>
                        Salary Slip
                    </Title>
                    <Text style={{ color: '#E5E7EB' }}>
                        Monthly Salary Statement
                    </Text>
                </Card>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        monthYear: dayjs(),
                        workedDays: getWorkingDaysInMonth(dayjs()),
                    }}
                    onValuesChange={(changedValues) => {
                        if (changedValues.employeeId) {
                            const emp = EMPLOYEE_DATA.find(
                                (e) => e.employeeId === changedValues.employeeId
                            );
                            if (emp) form.setFieldsValue(emp);
                        }
                        if (changedValues.monthYear) {
                            form.setFieldsValue({
                                workedDays: getWorkingDaysInMonth(
                                    changedValues.monthYear
                                ),
                            });
                        }
                    }}
                >
                    {/* Month, Employee & Working Days */}
                    <Card style={{ borderRadius: 12, marginBottom: 24 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Salary Month" name="monthYear" required>
                                    <DatePicker picker="month" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Employee" name="employeeId" required>
                                    <Select placeholder="Select Employee">
                                        {EMPLOYEE_DATA.map((emp) => (
                                            <Option key={emp.employeeId} value={emp.employeeId}>
                                                {emp.employeeId} - {emp.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Working Days" name="workedDays">
                                    <InputNumber min={0} max={31} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Employee Details */}
                    <Card title="Employee Details" style={{ borderRadius: 12, marginBottom: 24 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} lg={6}>
                                <Form.Item label="Name" name="name">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Form.Item label="Designation" name="designation">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Form.Item label="Department" name="department">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Form.Item label="Date of Joining" name="doj">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} lg={6}>
                                <Form.Item label="Bank Name" name="bankName">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Form.Item label="Bank Account No." name="bankAccount">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Earnings & Deductions */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Card title="Earnings" style={{ borderRadius: 12, background: primaryBackgroundColor }}>
                                <Table
                                    size="small"
                                    pagination={false}
                                    scroll={{ x: true }}
                                    dataSource={earningsData}
                                    columns={[
                                        { title: 'Type', dataIndex: 'label' },
                                        amountColumn(),
                                    ]}
                                    rowKey="key"
                                />
                            </Card>
                        </Col>

                        <Col xs={24} md={12}>
                            <Card title="Deductions" style={{ borderRadius: 12, background: secondaryBackgroundColor }}>
                                <Table
                                    size="small"
                                    pagination={false}
                                    scroll={{ x: true }}
                                    dataSource={deductionsData}
                                    columns={[
                                        { title: 'Type', dataIndex: 'label' },
                                        amountColumn(),
                                    ]}
                                    rowKey="key"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Net Pay */}
                    <Card
                        style={{
                            borderRadius: 14,
                            marginTop: 24,
                            background: '#F0FDF4',
                            border: `1px solid ${accentColor}`,
                        }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={8}>
                                <Text>Total Earnings</Text><br />
                                <Text strong>₹ {totals.totalEarnings.toLocaleString()}</Text>
                            </Col>
                            <Col xs={24} md={8}>
                                <Text>Total Deductions</Text><br />
                                <Text strong>₹ {totals.totalDeductions.toLocaleString()}</Text>
                            </Col>
                            <Col xs={24} md={8}>
                                <Text style={{ fontSize: 16 }}>Net Pay</Text><br />
                                <Text strong style={{ fontSize: 22, color: accentColor }}>
                                    ₹ {totals.netPay.toLocaleString()}
                                </Text>
                                <br />
                                <Text type="secondary">
                                    ({numberToWords(totals.netPay)})
                                </Text>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>

            {/* Buttons */}
            {/* Buttons */}
            <Row
                justify="end"
                gutter={[12, 12]}
                style={{ marginTop: 24 }}
            >
                <Col
                    xs={24}
                    sm="auto"
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Button
                        style={{
                            minWidth: 140,
                            paddingInline: 20,
                            backgroundColor: primaryColor,
                            color: whiteColor,
                            borderRadius: 14,
                        }}
                        onClick={() => setPreviewVisible(true)}
                    >
                        Preview PDF
                    </Button>
                </Col>

                <Col
                    xs={24}
                    sm="auto"
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    <Button
                        style={{
                            minWidth: 140,
                            paddingInline: 20,
                            backgroundColor: secondaryColor,
                            color: primaryBackgroundColor,
                            borderRadius: 14,
                        }}
                        onClick={generatePDF}
                    >
                        Download PDF
                    </Button>
                </Col>
                {/* <Button
                    style={{
                        minWidth: 160,
                        paddingInline: 20,
                        backgroundColor: accentColor,
                        color: whiteColor,
                        borderRadius: 14,
                    }}
                    onClick={async () => {
                        try {
                            const employee = EMPLOYEE_DATA.find(
                                (e) => e.employeeId === values?.employeeId
                            );

                            if (!employee) {
                                Modal.warning({
                                    title: 'Select Employee',
                                    content: 'Please select an employee first',
                                });
                                return;
                            }

                            await sendSalarySlipEmail({
                                employee,
                                salaryPDFData,
                                totals,
                            });

                            Modal.success({
                                title: 'Email Sent',
                                content: 'Salary slip emailed successfully',
                            });
                        } catch (error) {
                            Modal.error({
                                title: 'Error',
                                content: error.message,
                            });
                        }
                    }}
                >
                    Email Salary Slip
                </Button> */}
            </Row>

            {/* PDF Preview */}
            <Modal
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width="100%"
                style={{ top: 20 }}
                styles={{
                    body: {
                        height: '80vh',
                    },
                }}
                closeIcon={
                    <div
                        style={{
                            background: primaryColor + '20',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: secondaryColor,
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = primaryColor + '40';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = primaryColor + '20';
                        }}
                    >
                        ×
                    </div>
                }
            >
                <div style={{ background: whiteColor, position: 'sticky', top: 0, zIndex: 10 }}>
                    <Title
                        level={4}
                        style={{
                            fontWeight: 700,
                            letterSpacing: '0.3px',
                            lineHeight: 1.3,
                            background: `linear-gradient(
                            90deg,
                            ${primaryColor} 0%,
                            ${secondaryColor} 50%,
                            ${primaryColor} 100%
                        )`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Salary Slip Preview
                    </Title>

                    <div
                        style={{
                            height: 4,
                            width: '100%',
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${primaryColor}80, ${secondaryColor}80)`,
                            marginBottom: 8,
                        }}
                    />
                </div>
                <PDFViewer width="100%" height="100%">
                    <SalarySlipPDF data={salaryPDFData} totals={totals} />
                </PDFViewer>
            </Modal>
        </Card>
    );
}
