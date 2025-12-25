'use client';

import React, { useEffect, useState } from 'react';
import {
    Card,
    Row,
    Col,
    Form,
    Input,
    DatePicker,
    Button,
    Modal,
    Typography,
    Select,
} from 'antd';
import dayjs from 'dayjs';
import {
    EyeOutlined,
    DownloadOutlined,
    FileAddOutlined,
} from '@ant-design/icons';

import {
    PDFDownloadLink,
    PDFViewer,
} from '@react-pdf/renderer';

import OfferLetterTemplate from './OfferLetterTemplate';

import {
    accentBackgroundColor,
    accentColor,
    primaryBackgroundColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../Utils/Colors';

const { Title } = Typography;
const { Option } = Select;

/* ================= BUTTON STYLE ================= */
const actionButtonStyle = {
    minWidth: 160,
    paddingInline: 24,
    height: 44,
    borderRadius: 14,
    fontWeight: 600,
    letterSpacing: '0.3px',
    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease',
};

export default function OfferLetter() {
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);
    const initState = {
        employeeId: 'sad',
        employeeName: 'adwqed',
        joiningDate: new Date().toDateString(),
        position: 'Software Engineer',
    };
    const [pdfData, setPdfData] = useState(initState);

    useEffect(() => {
        form.setFieldsValue({
            employeeId: initState.employeeId,
            employeeName: initState.employeeName,
            joiningDate: dayjs(initState.joiningDate, 'DD MMMM YYYY'),
            position: initState.position,
        });
    }, [form]);

    /* ================= FORM SUBMIT ================= */
    const onFinish = (values) => {
        setPdfData({
            employeeId: values.employeeId,
            employeeName: values.employeeName,
            joiningDate: values.joiningDate.format('DD MMMM YYYY'),
            position: values.position, // dynamic designation
        });
    };

    return (
        <>
            {/* ================= HEADER ================= */}
            <Card
                style={{
                    borderRadius: 12,
                    background: primaryColor,
                    marginBottom: 24,
                }}
            >
                <Title level={3} style={{ color: whiteColor, marginBottom: 0 }}>
                    Offer Letter Generator
                </Title>
            </Card>

            {/* ================= FORM ================= */}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Card style={{ borderRadius: 12 }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12} lg={6}>
                            <Form.Item
                                label="Employee ID"
                                name="employeeId"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Employee ID" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Form.Item
                                label="Employee Name"
                                name="employeeName"
                                rules={[{ required: true }]}
                            >
                                <Input placeholder="Enter Employee Name" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Form.Item
                                label="Joining Date"
                                name="joiningDate"
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={6}>
                            <Form.Item
                                label="Designation / Position"
                                name="position"
                                rules={[{ required: true, message: 'Please select a position' }]}
                            >
                                <Select placeholder="Select Position">
                                    <Option value="Software Engineer">Software Engineer</Option>
                                    <Option value="Frontend Developer">Frontend Developer</Option>
                                    <Option value="Backend Developer">Backend Developer</Option>
                                    <Option value="Project Manager">Project Manager</Option>
                                    <Option value="HR Executive">HR Executive</Option>
                                    {/* Add more options as needed */}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col
                            xs={24}
                            md={12}
                            lg={6}
                            style={{ display: 'flex', alignItems: 'end' }}
                        >
                            <Button
                                htmlType="submit"
                                icon={<FileAddOutlined />}
                                style={{
                                    minWidth: '100%',
                                    height: 44,
                                    borderRadius: 14,
                                    backgroundColor: accentColor,
                                    color: whiteColor,
                                    fontWeight: 600,
                                    letterSpacing: '0.3px',
                                    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = accentBackgroundColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = accentColor;
                                }}
                            >
                                Generate Offer Letter
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Form>

            {/* ================= ACTION BUTTONS ================= */}
            {pdfData && (
                <Row justify="end" gutter={[12, 12]} style={{ marginTop: 24 }}>
                    <Col xs={24} sm="auto">
                        <Button
                            icon={<EyeOutlined />}
                            style={{
                                ...actionButtonStyle,
                                backgroundColor: primaryColor,
                                color: whiteColor,
                            }}
                            onClick={() => setPreviewVisible(true)}
                        >
                            Preview PDF
                        </Button>
                    </Col>

                    <Col xs={24} sm="auto">
                        <PDFDownloadLink
                            document={<OfferLetterTemplate {...pdfData} />}
                            fileName={`Offer_Letter_${pdfData?.employeeName}.pdf`}
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
                    </Col>
                </Row>
            )}

            {/* ================= PREVIEW MODAL ================= */}
            <Modal
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                width="100%"
                style={{ top: 20 }}
                styles={{
                    body: { height: '80vh' },
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
                        }}
                    >
                        ×
                    </div>
                }
                footer={
                    <PDFDownloadLink
                        document={<OfferLetterTemplate {...pdfData} />}
                        fileName={`Offer_Letter_${pdfData?.employeeName}.pdf`}
                    >
                        <Button
                            icon={<DownloadOutlined />}
                            style={{
                                minWidth: 140,
                                paddingInline: 20,
                                borderRadius: 14,
                                backgroundColor: secondaryColor,
                                color: whiteColor,
                            }}
                        >
                            {'Download PDF'}
                        </Button>
                    </PDFDownloadLink>
                }
            >
                <div
                    style={{
                        background: whiteColor,
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                        paddingBottom: 8,
                    }}
                >
                    <Title
                        level={4}
                        style={{
                            fontWeight: 700,
                            background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Offer Letter Preview
                    </Title>

                    <div
                        style={{
                            height: 4,
                            width: '100%',
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${primaryColor}80, ${secondaryColor}80)`,
                        }}
                    />
                </div>

                <PDFViewer width="100%" height="90%">
                    <OfferLetterTemplate {...pdfData} />
                </PDFViewer>
            </Modal>
        </>
    );
}
