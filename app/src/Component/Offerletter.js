'use client';

import {
    DownloadOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import {
    PDFDownloadLink,
    PDFViewer,
} from '@react-pdf/renderer';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Typography,
} from 'antd';
import { useState } from 'react';

import OfferLetterTemplate from './OfferLetterTemplate';

import {
    accentColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from '../Utils/Colors';
import {
    CustomCloseIcon,
    PreviewModalHeader,
    previewModalProps,
} from '../Utils/UIStyles/uiStyles';

const { Title, Text } = Typography;
const { Option } = Select;

/* ================= ACTION BUTTON STYLE ================= */
const actionButtonStyle = {
    minWidth: 160,
    paddingInline: 20,
    height: 44,
    borderRadius: 14,
    fontWeight: 600,
};

export default function OfferLetter() {
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);

    /* ================= LIVE FORM VALUES ================= */
    const values = Form.useWatch([], form);

    const isFormValid =
        values?.employeeId &&
        values?.employeeName &&
        values?.joiningDate &&
        values?.position;

    const pdfData = isFormValid
        ? {
            employeeId: values.employeeId,
            employeeName: values.employeeName,
            joiningDate: values.joiningDate.format('DD MMMM YYYY'),
            position: values.position,
        }
        : null;

    return (
        <div
            style={{
                paddingTop:
                    typeof window !== 'undefined' && window.innerWidth < 768
                        ? 64
                        : 80,
                paddingInline: 16,
                background: '#F8FAFC',
                minHeight: '100vh',
            }}
        >
            <Card
                style={{
                    borderRadius: 16,
                    background: '#F8FAFC',
                    maxWidth: 1400,
                    margin: '0 auto',
                }}
            >
                {/* ================= HEADER ================= */}
                <Card
                    style={{
                        borderRadius: 12,
                        background: primaryColor,
                        marginBottom: 24,
                    }}
                >
                    <Title level={3} style={{ color: whiteColor, marginBottom: 0 }}>
                        Offer Letter
                    </Title>
                    <Text style={{ color: whiteColor }}>
                        Generate employee offer letter
                    </Text>
                </Card>

                {/* ================= FORM ================= */}
                <Form form={form} layout="vertical">
                    <Card style={{ borderRadius: 12 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    label="Employee ID"
                                    name="employeeId"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    label="Employee Name"
                                    name="employeeName"
                                    rules={[{ required: true }]}
                                >
                                    <Input />
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
                                    label="Designation"
                                    name="position"
                                    rules={[{ required: true }]}
                                >
                                    <Select placeholder="Select Designation">
                                        <Option value="Software Engineer">
                                            Software Engineer
                                        </Option>
                                        <Option value="Frontend Developer">
                                            Frontend Developer
                                        </Option>
                                        <Option value="Backend Developer">
                                            Backend Developer
                                        </Option>
                                        <Option value="Project Manager">
                                            Project Manager
                                        </Option>
                                        <Option value="HR Executive">
                                            HR Executive
                                        </Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* ================= ACTION BUTTONS (RIGHT ALIGNED) ================= */}
                        <Row style={{ marginTop: 16 }}>
                            <Col
                                xs={24}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Button
                                    icon={<EyeOutlined />}
                                    disabled={!isFormValid}
                                    style={{
                                        ...actionButtonStyle,
                                        backgroundColor: primaryColor,
                                        color: whiteColor,
                                    }}
                                    onClick={() => setPreviewVisible(true)}
                                >
                                    Preview PDF
                                </Button>

                                <PDFDownloadLink
                                    document={<OfferLetterTemplate {...pdfData} />}
                                    fileName={`Offer_Letter_${pdfData?.employeeName}.pdf`}
                                >
                                    <Button
                                        icon={<DownloadOutlined />}
                                        disabled={!isFormValid}
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

                    </Card>
                </Form>

                {/* ================= PREVIEW MODAL ================= */}
                <Modal
                    open={previewVisible}
                    onCancel={() => setPreviewVisible(false)}
                    footer={
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
                    }
                    {...previewModalProps}
                    closeIcon={
                        <CustomCloseIcon
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                        />
                    }
                >
                    <PreviewModalHeader title="Offer Letter Preview" />

                    <PDFViewer width="100%" height="90%">
                        <OfferLetterTemplate {...pdfData} />
                    </PDFViewer>
                </Modal>
            </Card>
        </div>
    );
}
