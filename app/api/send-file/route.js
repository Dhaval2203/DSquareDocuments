import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { EMPLOYEE_DATA } from "../../src/Utils/Const";
import {
    accentColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from "../../src/Utils/Colors";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        const employeeId = formData.get("employeeId");
        const monthYear = formData.get("monthYear");

        if (!file || !employeeId) {
            return NextResponse.json(
                { error: "Missing file or employee data" },
                { status: 400 }
            );
        }

        // 🔹 Get employee email details
        const employee = EMPLOYEE_DATA.find(
            (e) => e.employeeId === employeeId
        );

        if (!employee) {
            return NextResponse.json(
                { error: "Employee not found" },
                { status: 404 }
            );
        }

        const toEmail = employee.primaryEmail;
        const ccEmails = [
            employee.secondaryEmail,
            "parekhdhaval1998@gmail.com",
        ];

        // 🔹 Convert File → Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 🔹 Gmail Transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 🔹 Send Mail with Attachment
        await transporter.sendMail({
            from: `"Payroll Team" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            cc: ccEmails,
            subject: `Salary Slip - ${monthYear}`,
            html: `
<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#F8FAFC;padding:24px;font-family:Arial,sans-serif;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0"
                style="background:${whiteColor};border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                    <td style="background:${primaryColor};padding:20px 24px;">
                        <h2 style="margin:0;color:${whiteColor};font-size:22px;">
                            Salary Slip
                        </h2>
                        <p style="margin:4px 0 0;color:#E5E7EB;font-size:14px;">
                            ${monthYear.replace("_", " ")}
                        </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:24px;color:#111827;font-size:14px;line-height:1.6;">
                        <p style="margin-top:0;">
                            Dear
                            <strong style="color:${primaryColor};">
                                ${employee.name}
                            </strong>,
                        </p>

                        <p>
                            We hope you are doing well.
                        </p>

                        <p>
                            Please find attached your
                            <strong style="color:${primaryColor};">salary slip</strong>
                            for the month of
                            <strong style="color:${secondaryColor};">${monthYear.replace("_", " ")}</strong>.
                        </p>

                        <p>
                            This document provides a detailed breakdown of your
                            earnings, deductions, and net pay for the mentioned period.
                        </p>

                        <!-- Info Box -->
                        <table width="100%" cellpadding="0" cellspacing="0"
                            style="background:#F1F5F9;border-left:4px solid ${primaryColor};margin:20px 0;">
                            <tr>
                                <td style="padding:12px 16px;font-size:13px;color:#1F2937;">
                                    📎
                                    <strong style="color:${secondaryColor};">
                                        Attached:
                                    </strong>
                                    ${file.name}
                                    <br/>
                                    📅
                                    <strong style="color:${secondaryColor};">
                                        Salary Month:
                                    </strong>
                                    ${monthYear.replace("_", " ")}
                                </td>
                            </tr>
                        </table>

                        <p>
                            If you have any questions or notice any discrepancies,
                            please feel free to reach out to the HR or Payroll team.
                        </p>

                        <!-- Signature -->
                        <p style="margin-bottom:0;">
                            Best regards,<br/>
                            <strong style="color:${primaryColor};">Payroll Team</strong>
                        </p>

                        <!-- Logo -->
                        <div style="margin-top:16px;">
                            <span style="font-size:15px;font-weight:700;">
                                <span style="color:${primaryColor};">D</span>
                                <span style="color:${secondaryColor};"> Square </span>
                                <span style="color:${accentColor};">Infotech</span>
                            </span>
                        </div>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td
                        style="background:#F9FAFB;padding:14px 24px;text-align:center;font-size:12px;color:#6B7280;">
                        This is an automated email. Please do not reply directly to this message.
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>
            `,
            attachments: [
                {
                    filename: file.name,
                    content: buffer,
                    contentType: "application/pdf",
                },
            ],
        });

        return NextResponse.json({
            message: "Email sent successfully",
        });

    } catch (error) {
        console.error("EMAIL ERROR:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
