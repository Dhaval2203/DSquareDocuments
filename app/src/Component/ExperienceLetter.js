'use client';

import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import {
    Button, Card,
    Checkbox, Col,
    DatePicker, Form,
    Modal, Row,
    Select,
    Typography
} from 'antd';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

import {
    primaryColor, secondaryBackgroundColor,
    secondaryColor, whiteColor
} from '../Utils/Colors';
import {
    EMPLOYEE_DATA,
    negativeConcerns,
    negativeImprovements,
    positiveAchievements, positiveSkills
} from '../Utils/Const';
import { CustomCloseIcon, PreviewModalHeader, previewModalProps } from '../Utils/UIStyles/uiStyles';

import ExperienceLetterNegativeTemplate from './ExperienceLetterNegativeTemplate';
import ExperienceLetterPositiveTemplate from './ExperienceLetterPositiveTemplate';

const actionButtonStyle = {
    minWidth: 160,
    paddingInline: 20,
    height: 44,
    borderRadius: 14,
    fontWeight: 600,
};

export default function ExperienceLetter() {
    const [form] = Form.useForm();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pdfSnapshot, setPdfSnapshot] = useState(null);

    const values = Form.useWatch([], form);

    // Set default category when experienceType changes
    useEffect(() => {
        if (values?.experienceType) {
            const categories = values.experienceType === 'positive'
                ? ['Achievements', 'Skills']
                : ['Concerns', 'Improvement Areas'];
            setTimeout(() => {
                setSelectedCategory(categories[0]);
                setSelectedPoints([]);
            }, 0);
        }
    }, [values?.experienceType]);

    const isFormValid = values?.employeeId && values?.joiningDate && values?.relievingDate && values?.experienceType;

    const getCategories = () => {
        if (values?.experienceType === 'positive') return ['Achievements', 'Skills'];
        if (values?.experienceType === 'negative') return ['Concerns', 'Improvement Areas'];
        return [];
    };

    const getPointsByCategory = () => {
        if (!values?.experienceType || !selectedCategory) return [];
        if (values.experienceType === 'positive') {
            return selectedCategory === 'Achievements' ? positiveAchievements : positiveSkills;
        } else {
            return selectedCategory === 'Concerns' ? negativeConcerns : negativeImprovements;
        }
    };

    const pointsForCategory = getPointsByCategory();

    const handleSelectAll = () => {
        const newSelections = [...new Set([...selectedPoints, ...pointsForCategory])];
        setSelectedPoints(newSelections);
    };

    const handleDeselectAll = () => {
        const newSelections = selectedPoints.filter(p => !pointsForCategory.includes(p));
        setSelectedPoints(newSelections);
    };

    const handlePreview = () => {
        if (!isFormValid) return;

        const snapshot = {
            employee: EMPLOYEE_DATA.find(e => e.employeeId === values.employeeId),
            joiningDate: values.joiningDate.format('DD MMMM YYYY'),
            relievingDate: values.relievingDate.format('DD MMMM YYYY'),
            selectedPointsByCategory: getCategories().reduce((acc, cat) => {
                acc[cat] = selectedPoints.filter(p => {
                    if (values.experienceType === 'positive') {
                        return cat === 'Achievements' ? positiveAchievements.includes(p) : positiveSkills.includes(p);
                    } else {
                        return cat === 'Concerns' ? negativeConcerns.includes(p) : negativeImprovements.includes(p);
                    }
                });
                return acc;
            }, {}),
            experienceType: values.experienceType
        };

        setPdfSnapshot(snapshot);
        setPreviewVisible(true);
    };

    const getTemplate = () => {
        if (!pdfSnapshot || !pdfSnapshot.employee) return null;
        return pdfSnapshot.experienceType === 'positive'
            ? <ExperienceLetterPositiveTemplate {...pdfSnapshot} />
            : <ExperienceLetterNegativeTemplate {...pdfSnapshot} />;
    };

    return (
        <div style={{ paddingTop: typeof window !== 'undefined' && window.innerWidth < 768 ? 64 : 80, paddingInline: 16, background: '#F8FAFC', minHeight: '100vh' }}>
            <Card style={{ borderRadius: 16, background: '#F8FAFC', maxWidth: 1400, margin: '0 auto' }}>
                <Card style={{ borderRadius: 12, background: primaryColor, marginBottom: 24 }}>
                    <Title level={3} style={{ color: whiteColor, marginBottom: 0 }}>Experience Letter</Title>
                    <Text style={{ color: '#E5E7EB' }}>Generate employee experience letter</Text>
                </Card>

                <Form form={form} layout="vertical" onValuesChange={(changedValues) => {
                    if (changedValues.experienceType) setSelectedPoints([]);
                }}>
                    <Card style={{ borderRadius: 12 }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Employee" name="employeeId" rules={[{ required: true }]}>
                                    <Select showSearch placeholder="Select Employee" optionFilterProp="children"
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                                        {EMPLOYEE_DATA.map(emp => (
                                            <Select.Option key={emp.employeeId} value={emp.employeeId}>
                                                {emp.employeeId} - {emp.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Joining Date" name="joiningDate" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Relieving Date" name="relievingDate" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item label="Experience Type" name="experienceType" rules={[{ required: true }]}>
                                    <Select placeholder="Select Experience Type">
                                        <Select.Option value="positive">Positive</Select.Option>
                                        <Select.Option value="negative">Negative</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {values?.experienceType && (
                            <Form.Item label="Select Reason">
                                <Card size="small" style={{ width: '100%', padding: 16, borderRadius: 12, backgroundColor: secondaryBackgroundColor }}>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                                        {getCategories().map(cat => (
                                            <Button key={cat} size="small" type={cat === selectedCategory ? 'primary' : 'default'}
                                                onClick={() => setSelectedCategory(cat)}
                                                style={{
                                                    borderRadius: 16,
                                                    backgroundColor: cat === selectedCategory ? primaryColor : undefined,
                                                    color: cat === selectedCategory ? whiteColor : undefined
                                                }}
                                            >
                                                {cat}
                                            </Button>
                                        ))}
                                    </div>

                                    <Checkbox
                                        checked={pointsForCategory.length > 0 && pointsForCategory.every(p => selectedPoints.includes(p))}
                                        indeterminate={pointsForCategory.some(p => selectedPoints.includes(p)) && !pointsForCategory.every(p => selectedPoints.includes(p))}
                                        onChange={e => e.target.checked ? handleSelectAll() : handleDeselectAll()}
                                        style={{ fontWeight: 600 }}
                                    >
                                        Select All
                                    </Checkbox>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8, maxHeight: 300, overflowY: 'auto' }}>
                                        {pointsForCategory.map(option => (
                                            <Checkbox
                                                key={option}
                                                checked={selectedPoints.includes(option)}
                                                onChange={e =>
                                                    setSelectedPoints(prev =>
                                                        e.target.checked
                                                            ? [...prev, option]
                                                            : prev.filter(p => p !== option)
                                                    )
                                                }
                                            >
                                                {option}
                                            </Checkbox>
                                        ))}
                                    </div>
                                </Card>
                            </Form.Item>
                        )}

                        <Row style={{ marginTop: 16 }}>
                            <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
                                <Button icon={<EyeOutlined />} disabled={!isFormValid}
                                    style={{ ...actionButtonStyle, backgroundColor: primaryColor, color: whiteColor }}
                                    onClick={handlePreview}
                                >
                                    Preview PDF
                                </Button>

                                <PDFDownloadLink document={getTemplate()} fileName={`Experience_Letter_${pdfSnapshot?.employee?.name}.pdf`}>
                                    <Button icon={<DownloadOutlined />} disabled={!isFormValid}
                                        style={{ ...actionButtonStyle, backgroundColor: secondaryColor, color: whiteColor }}
                                    >
                                        Download PDF
                                    </Button>
                                </PDFDownloadLink>
                            </Col>
                        </Row>
                    </Card>
                </Form>

                <Modal open={previewVisible} onCancel={() => setPreviewVisible(false)}
                    footer={
                        <PDFDownloadLink document={getTemplate()} fileName={`Experience_Letter_${pdfSnapshot?.employee?.name}.pdf`}>
                            <Button icon={<DownloadOutlined />} style={{ ...actionButtonStyle, backgroundColor: secondaryColor, color: whiteColor }}>
                                Download PDF
                            </Button>
                        </PDFDownloadLink>
                    }
                    {...previewModalProps}
                    closeIcon={<CustomCloseIcon primaryColor={primaryColor} secondaryColor={secondaryColor} />}
                >
                    <PreviewModalHeader title="Experience Letter Preview" />
                    <PDFViewer width="100%" height="90%">
                        {getTemplate()}
                    </PDFViewer>
                </Modal>
            </Card>
        </div>
    );
}
