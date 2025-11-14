// import nodemailer from 'nodemailer'

// export default defineEventHandler(async (event) => {
//   const config = useRuntimeConfig()
  
//   // Validate body exists
//   let body
//   try {
//     body = await readBody(event)
//   } catch (error) {
//     throw createError({
//       statusCode: 400,
//       message: 'Invalid request body'
//     })
//   }

//   // Validate body is an object
//   if (!body || typeof body !== 'object') {
//     throw createError({
//       statusCode: 400,
//       message: 'Request body is required'
//     })
//   }

//   // Validate required fields
//   const { fullName, email, phone, practiceArea, description } = body || {}

//   // Ensure all fields are strings and not empty
//   if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
//     throw createError({
//       statusCode: 400,
//       message: 'Full name is required'
//     })
//   }
//   if (!email || typeof email !== 'string' || !email.trim()) {
//     throw createError({
//       statusCode: 400,
//       message: 'Email is required'
//     })
//   }
//   if (!phone || typeof phone !== 'string' || !phone.trim()) {
//     throw createError({
//       statusCode: 400,
//       message: 'Phone is required'
//     })
//   }
//   if (!practiceArea || typeof practiceArea !== 'string' || !practiceArea.trim()) {
//     throw createError({
//       statusCode: 400,
//       message: 'Practice area is required'
//     })
//   }
//   if (!description || typeof description !== 'string' || !description.trim()) {
//     throw createError({
//       statusCode: 400,
//       message: 'Description is required'
//     })
//   }

//   // Validate email configuration exists
//   if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) {
//     throw createError({
//       statusCode: 500,
//       message: 'Email server configuration is missing'
//     })
//   }

//   // Email configuration from environment variables
//   // Configured for Node 16 compatibility with proper TLS settings
//   const smtpPort = parseInt(config.smtpPort || '587', 10)
//   const isSecure = config.smtpSecure === 'true'
  
//   // Port 465 uses SSL/TLS directly (secure: true)
//   // Port 587 uses STARTTLS (secure: false, but uses TLS)
//   const smtpConfig: any = {
//     host: config.smtpHost,
//     port: smtpPort,
//     secure: isSecure,
//     auth: {
//       user: config.smtpUser,
//       pass: config.smtpPassword
//     }
//   }

//   // TLS configuration for Node 16 compatibility (only for non-secure connections)
//   // When secure: true (port 465), TLS is handled automatically
//   if (!isSecure) {
//     smtpConfig.tls = {
//       // Use TLSv1.2 minimum for Node 16 compatibility
//       minVersion: 'TLSv1.2' as const,
//       // Allow self-signed certificates if needed
//       rejectUnauthorized: config.smtpRejectUnauthorized !== 'false'
//     }
//   } else {
//     // For secure connections (port 465), we can still configure TLS options
//     smtpConfig.tls = {
//       minVersion: 'TLSv1.2' as const,
//       rejectUnauthorized: config.smtpRejectUnauthorized !== 'false'
//     }
//   }

//   // Recipient email (where contact form submissions should be sent)
//   const recipientEmail = config.contactEmail || config.smtpUser

//   try {
//     // Create transporter
//     const transporter = nodemailer.createTransport(smtpConfig)

//     // Email content for the business
//     const mailOptions = {
//       from: `"${fullName}" <${config.smtpUser}>`,
//       to: recipientEmail,
//       replyTo: email,
//       subject: `New Contact Form Submission - ${practiceArea}`,
//       html: `
//         <h2>New Contact Form Submission</h2>
//         <p><strong>Name:</strong> ${fullName}</p>
//         <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
//         <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
//         <p><strong>Practice Area:</strong> ${practiceArea}</p>
//         <p><strong>Description:</strong></p>
//         <p>${String(description).replace(/\n/g, '<br>')}</p>
//         <hr>
//         <p><small>This email was sent from the contact form on your website.</small></p>
//       `,
//       text: `
//         New Contact Form Submission
        
//         Name: ${fullName}
//         Email: ${email}
//         Phone: ${phone}
//         Practice Area: ${practiceArea}
//         Description: ${description}
//       `
//     }

//     // Send email
//     const info = await transporter.sendMail(mailOptions)

//     // Optional: Send confirmation email to the user
//     if (config.sendConfirmationEmail === 'true') {
//       const confirmationMailOptions = {
//         from: `"Melbourne Legal Lawyers" <${config.smtpUser}>`,
//         to: email,
//         subject: 'Thank you for contacting Melbourne Legal Lawyers',
//         html: `
//           <h2>Thank you for your inquiry</h2>
//           <p>Dear ${fullName},</p>
//           <p>We have received your contact form submission and will get back to you soon.</p>
//           <p><strong>Your inquiry details:</strong></p>
//           <ul>
//             <li>Practice Area: ${practiceArea}</li>
//             <li>Description: ${description}</li>
//           </ul>
//           <p>If you have any urgent matters, please call us at <a href="tel:+61312345678">+61 3 1234 5678</a>.</p>
//           <p>Best regards,<br>Melbourne Legal Lawyers</p>
//         `,
//         text: `
//           Thank you for your inquiry
          
//           Dear ${fullName},
          
//           We have received your contact form submission and will get back to you soon.
          
//           Your inquiry details:
//           - Practice Area: ${practiceArea}
//           - Description: ${description}
          
//           If you have any urgent matters, please call us at +61 3 1234 5678.
          
//           Best regards,
//           Melbourne Legal Lawyers
//         `
//       }

//       await transporter.sendMail(confirmationMailOptions)
//     }

//     return {
//       success: true,
//       message: 'Email sent successfully',
//       messageId: info.messageId
//     }
//   } catch (error) {
//     console.error('Email sending error:', error)
//     throw createError({
//       statusCode: 500,
//       message: 'Failed to send email. Please try again later.'
//     })
//   }
// })

