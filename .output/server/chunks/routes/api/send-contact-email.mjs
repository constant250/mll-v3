import { d as defineEventHandler, r as readBody, c as createError } from '../../runtime.mjs';
import nodemailer from 'nodemailer';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import 'fs';
import 'path';
import 'vue';
import 'consola/core';
import 'ipx';

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}
const sendContactEmail = defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: "Invalid request body"
    });
  }
  if (!body || typeof body !== "object") {
    throw createError({
      statusCode: 400,
      message: "Request body is required"
    });
  }
  const { fullName, email, phone, practiceArea, description } = body || {};
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    throw createError({
      statusCode: 400,
      message: "Full name is required"
    });
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    throw createError({
      statusCode: 400,
      message: "Email is required"
    });
  }
  if (!phone || typeof phone !== "string" || !phone.trim()) {
    throw createError({
      statusCode: 400,
      message: "Phone is required"
    });
  }
  if (!practiceArea || typeof practiceArea !== "string" || !practiceArea.trim()) {
    throw createError({
      statusCode: 400,
      message: "Practice area is required"
    });
  }
  if (!description || typeof description !== "string" || !description.trim()) {
    throw createError({
      statusCode: 400,
      message: "Description is required"
    });
  }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw createError({
      statusCode: 500,
      message: "Email server configuration is missing"
    });
  }
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const isSecure = process.env.SMTP_SECURE === "true";
  const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: isSecure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  };
  if (!isSecure) {
    smtpConfig.tls = {
      // Use TLSv1.2 minimum for Node 16 compatibility
      minVersion: "TLSv1.2",
      // Allow self-signed certificates if needed
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false"
    };
  } else {
    smtpConfig.tls = {
      minVersion: "TLSv1.2",
      rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false"
    };
  }
  const recipientEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  const getBaseUrl = () => {
    var _a;
    if (process.env.BASE_URL) {
      return process.env.BASE_URL;
    }
    const headers = event.node.req.headers;
    const protocol = headers["x-forwarded-proto"] || (((_a = headers.host) == null ? void 0 : _a.includes("localhost")) ? "http" : "https");
    const host = headers.host || "yourdomain.com";
    return `${protocol}://${host}`;
  };
  const baseUrl = getBaseUrl();
  try {
    const transporter = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: `"${fullName}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: email,
      subject: `MLL - Contact Form Submission - ${practiceArea}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff;">
                  <!-- Logo Section -->
                  <tr>
                    <td align="center" style="padding-bottom: 30px;">
                      <img src="${baseUrl}/images/MLL%20-%20LOGO%20-%20WEB.png" alt="Melbourne Legal Lawyers" style="max-width: 200px; height: auto;" />
                    </td>
                  </tr>
                  
                  <!-- Heading -->
                  <tr>
                    <td align="center" style="padding-bottom: 40px;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 600; color: #333333; letter-spacing: -0.5px;">Contact Form Submission</h1>
                    </td>
                  </tr>
                  
                  <!-- Form Fields -->
                  <tr>
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <!-- Full Name -->
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <div style="margin-bottom: 8px;">
                              <span style="font-size: 12px; font-weight: 500; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">FULL NAME</span>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 4px; padding: 12px 16px; min-height: 20px;">
                              <span style="font-size: 16px; color: #000000; line-height: 1.5;">${escapeHtml(fullName)}</span>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Email -->
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <div style="margin-bottom: 8px;">
                              <span style="font-size: 12px; font-weight: 500; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">EMAIL</span>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 4px; padding: 12px 16px; min-height: 20px;">
                              <a href="mailto:${escapeHtml(email)}" style="font-size: 16px; color: #0066cc; text-decoration: none; line-height: 1.5;">${escapeHtml(email)}</a>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Phone -->
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <div style="margin-bottom: 8px;">
                              <span style="font-size: 12px; font-weight: 500; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">PHONE</span>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 4px; padding: 12px 16px; min-height: 20px;">
                              <a href="tel:${escapeHtml(phone)}" style="font-size: 16px; color: #000000; text-decoration: none; line-height: 1.5;">${escapeHtml(phone)}</a>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Practice Area -->
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <div style="margin-bottom: 8px;">
                              <span style="font-size: 12px; font-weight: 500; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">PRACTICE AREA</span>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 4px; padding: 12px 16px; min-height: 20px;">
                              <span style="font-size: 16px; color: #000000; line-height: 1.5;">${escapeHtml(practiceArea)}</span>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Description -->
                        <tr>
                          <td style="padding-bottom: 20px;">
                            <div style="margin-bottom: 8px;">
                              <span style="font-size: 12px; font-weight: 500; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">DESCRIPTION</span>
                            </div>
                            <div style="background-color: #f5f5f5; border-radius: 4px; padding: 12px 16px; min-height: 20px;">
                              <p style="margin: 0; font-size: 16px; color: #000000; line-height: 1.5; white-space: pre-wrap;">${escapeHtml(String(description).replace(/\n/g, "\n"))}</p>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 40px; border-top: 1px solid #e5e5e5;">
                      <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.5;">This email was generated by Melbourne Legal Lawyers Website</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        Contact Form Submission
        
        FULL NAME: ${fullName}
        EMAIL: ${email}
        PHONE: ${phone}
        PRACTICE AREA: ${practiceArea}
        DESCRIPTION: ${description}
        
        This email was generated by Melbourne Legal Lawyers Website
      `
    };
    const info = await transporter.sendMail(mailOptions);
    if (process.env.SEND_CONFIRMATION_EMAIL === "true") {
      const confirmationMailOptions = {
        from: `"Melbourne Legal Lawyers" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Thank you for contacting Melbourne Legal Lawyers",
        html: `
          <h2>Thank you for your inquiry</h2>
          <p>Dear ${fullName},</p>
          <p>We have received your contact form submission and will get back to you soon.</p>
          <p><strong>Your inquiry details:</strong></p>
          <ul>
            <li>Practice Area: ${practiceArea}</li>
            <li>Description: ${description}</li>
          </ul>
          <p>If you have any urgent matters, please call us at <a href="tel:+61312345678">+61 3 1234 5678</a>.</p>
          <p>Best regards,<br>Melbourne Legal Lawyers</p>
        `,
        text: `
          Thank you for your inquiry
          
          Dear ${fullName},
          
          We have received your contact form submission and will get back to you soon.
          
          Your inquiry details:
          - Practice Area: ${practiceArea}
          - Description: ${description}
          
          If you have any urgent matters, please call us at +61 3 1234 5678.
          
          Best regards,
          Melbourne Legal Lawyers
        `
      };
      await transporter.sendMail(confirmationMailOptions);
    }
    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    };
  } catch (error) {
    console.error("Email sending error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to send email. Please try again later."
    });
  }
});

export { sendContactEmail as default };
//# sourceMappingURL=send-contact-email.mjs.map
