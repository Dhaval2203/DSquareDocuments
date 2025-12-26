'use client';

import {
    Button, Card, Col, DatePicker,
    Form, Input,
    InputNumber, Modal,
    Row, Select, Table,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { DownloadOutlined, EyeOutlined, MailOutlined } from '@ant-design/icons';
import {
    accentColor, primaryBackgroundColor,
    primaryColor, secondaryBackgroundColor,
    secondaryColor, whiteColor,
} from '../Utils/Colors';
import { EMPLOYEE_DATA, deductionsData, earningsData } from '../Utils/Const';
import { CustomCloseIcon, PreviewModalHeader, previewModalProps } from '../Utils/UIStyles/uiStyles';
import numberToWords from '../Utils/UtilsFunction';
import { SalarySlipPDF } from './SalarySlipTemplate';

const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);

const { Title, Text } = Typography;
const { Option } = Select;

/* --------------------------------
   Helper: Working Days
-------------------------------- */
const getWorkingDaysInMonth = (monthYear) => {
    if (!monthYear) return 0;

    const start = dayjs(monthYear).startOf('month');
    const end = dayjs(monthYear).endOf('month');
    let count = 0;

    let current = start;

    while (current.isBefore(end) || current.isSame(end, 'day')) {
        const day = current.day();
        if (day !== 0 && day !== 6) {
            count++;
        }
        current = current.add(1, 'day');
    }

    return count;
};

export default function SalarySlip() {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sending, setSending] = useState(false);

    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const slipRef = useRef(null);

    const actionButtonStyle = {
        minWidth: 160,
        height: 44,
        borderRadius: 14,
        fontWeight: 600,
    };

    /* --------------------------------
       Totals
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

    const sendPDFByEmail = async () => {
        try {
            setSending(true);

            const blob = await pdf(
                <SalarySlipPDF data={salaryPDFData} totals={totals} />
            ).toBlob();

            const monthYearText = values.monthYear?.format
                ? values.monthYear.format('MMM_YYYY')
                : dayjs().format('MMM_YYYY');

            const fileName = `${values.name}_Salary_Slip_${monthYearText}.pdf`;

            const pdfFile = new File([blob], fileName, {
                type: 'application/pdf',
            });

            const formData = new FormData();
            formData.append('file', pdfFile);
            formData.append('employeeId', values.employeeId);
            formData.append('monthYear', monthYearText);

            const res = await fetch('/api/send-file', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error);

            Modal.success({
                title: 'Email Sent',
                content: 'Salary slip has been sent successfully.',
            });
        } catch (err) {
            Modal.error({
                title: 'Error',
                content: 'Failed to send salary slip email.',
            });
        } finally {
            setSending(false);
        }
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

            {/* Action Buttons */}
            <Row justify="end" gutter={[12, 12]} style={{ marginTop: 20 }}>
                <Col>
                    <Button
                        icon={<EyeOutlined />}
                        style={{ ...actionButtonStyle, background: primaryColor, color: whiteColor }}
                        onClick={() => setPreviewVisible(true)}
                    >
                        Preview
                    </Button>
                </Col>

                <Col>
                    <Button
                        icon={<DownloadOutlined />}
                        style={{ ...actionButtonStyle, background: secondaryColor, color: whiteColor }}
                        onClick={generatePDF}
                    >
                        Download PDF
                    </Button>
                </Col>

                <Col>
                    <Button
                        icon={<MailOutlined />}
                        loading={sending}
                        disabled={sending}
                        style={{ ...actionButtonStyle, background: accentColor, color: whiteColor }}
                        onClick={sendPDFByEmail}
                    >
                        Send Email
                    </Button>
                </Col>
            </Row>


            {/* ================= PREVIEW MODAL ================= */}
            <Modal
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={
                    <PDFDownloadLink
                        document={
                            <SalarySlipPDF
                                data={salaryPDFData}
                                totals={totals}
                            />
                        }
                        fileName={`Salary_Slip_${salaryPDFData?.name || 'Employee'}_${salaryPDFData?.monthYear?.format
                            ? salaryPDFData.monthYear.format('MMM_YYYY')
                            : dayjs().format('MMM_YYYY')
                            }.pdf`}
                    >
                        <Button
                            icon={<DownloadOutlined />}
                            style={{
                                ...actionButtonStyle,
                                backgroundColor: secondaryColor,
                                color: whiteColor,
                            }}
                        >
                            Download PDF
                        </Button>
                    </PDFDownloadLink>
                }
                {...previewModalProps}
                closeIcon={
                    <CustomCloseIcon
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                    />
                }
            >
                <PreviewModalHeader title="Salary Slip Preview" />

                <PDFViewer width="100%" height="90%">
                    <SalarySlipPDF
                        data={salaryPDFData}
                        totals={totals}
                    />
                </PDFViewer>
            </Modal>
        </Card>
    );
}
