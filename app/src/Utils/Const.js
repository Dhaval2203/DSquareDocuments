export const comapnyName = "D Square Infotech";
export const companyEmail = "info@dsquareinfotech.com";
export const companyPhone = "+91 98765 43210";

export const menuItems = [
    { key: "salarySleep", label: "Salary Sleep" },
    { key: "offerLetter", label: "Offer Letter" },
]

/* ----------------------------------
 Mock Employee Data
----------------------------------- */
export const EMPLOYEE_DATA = [
    {
        employeeId: 'EMP001',
        name: 'Parag Parekh',
        designation: 'Software Engineer',
        department: 'Engineering',
        doj: '12-Jan-2022',
        bankName: 'HDFC Bank',
        bankAccount: '502134789654',
        primaryEmail: 'parag.parekh1512@gmail.com',
        secondaryEmail: 'parekhdhaval2203@gmail.com'
    },
    {
        employeeId: 'EMP002',
        name: 'Anjali Patel',
        designation: 'UI/UX Designer',
        department: 'Design',
        doj: '05-Mar-2021',
        bankName: 'ICICI Bank',
        bankAccount: '438912670845',
        primaryEmail: 'parekhdhaval2203@gmail.com',
        secondaryEmail: 'parekhdhaval1998@gmail.com'
    },
];

export const earningsData = [
    { key: 'basic', label: 'Basic', name: 'basic' },
    { key: 'hra', label: 'HRA', name: 'hra' },
    { key: 'telephone', label: 'Telephone', name: 'telephone' },
    { key: 'internet', label: 'Internet', name: 'internet' },
    { key: 'cityAllowance', label: 'City Allowance', name: 'cityAllowance' },
];

export const deductionsData = [
    { key: 'pt', label: 'PT', name: 'pt' },
    { key: 'pf', label: 'PF', name: 'pf' },
    { key: 'esic', label: 'ESIC', name: 'esic' },
    { key: 'tds', label: 'TDS', name: 'tds' },
    { key: 'lop', label: 'LOP', name: 'lop' },
];

export function DSquareIcon() {
    return (
        <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="6"
                y="6"
                width="52"
                height="52"
                rx="10"
                fill="none"
                stroke="#0ea5a4"
                stroke-width="4"
            />

            <rect
                x="18"
                y="18"
                width="28"
                height="28"
                rx="6"
                fill="none"
                stroke="#ef4444"
                stroke-width="3"
            />

            <text
                x="32"
                y="40"
                text-anchor="middle"
                font-size="22"
                font-weight="700"
                fill="#0ea5a4"
                font-family="Arial, Helvetica, sans-serif"
            >
                D
            </text>
        </svg >
    )
}

export function DSquareIconForCareerPage() {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="6"
                y="6"
                width="52"
                height="52"
                rx="10"
                fill="none"
                stroke="#0ea5a4"
                strokeWidth="4"
            />

            <rect
                x="18"
                y="18"
                width="28"
                height="28"
                rx="6"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3"
            />
        </svg>
    );
}
