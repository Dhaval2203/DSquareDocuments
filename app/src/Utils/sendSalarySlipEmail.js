import { pdf } from '@react-pdf/renderer';
import { SalarySlipPDF } from '../Component/SalarySlipTemplate';

/**
 * Send salary slip email
 */
export const sendSalarySlipEmail = async ({
    employee,
    salaryPDFData,
    totals,
}) => {
    if (!employee?.primaryEmail) {
        throw new Error('Primary email is missing');
    }

    // 1️⃣ Generate PDF
    const pdfBlob = await pdf(
        <SalarySlipPDF data={salaryPDFData} totals={totals} />
    ).toBlob();

    // 2️⃣ Convert PDF to Base64
    const base64Pdf = await blobToBase64(pdfBlob);

    // 3️⃣ Send to backend API
    const res = await fetch('/api/send-salary-slip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to: employee.primaryEmail,
            cc: employee.secondaryEmail || '',
            employeeName: employee.name,
            pdfBase64: base64Pdf,
            fileName: `${employee.name}_SalarySlip.pdf`,
        }),
    });

    if (!res.ok) {
        throw new Error('Email sending failed');
    }

    return true;
};

// 🔹 Helper
const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () =>
            resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
