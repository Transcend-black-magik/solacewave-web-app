const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const crypto = require("crypto");

// --- Square SDK Setup ---
let Square, Client, Environment;

try {
  Square = require("square");
  ({ Client, Environment } = Square);
  console.log("✅ Square SDK loaded successfully");
} catch (e) {
  console.error("❌ Failed to import Square SDK:", e);
  Square = {};
}

// Set Firebase defaults
setGlobalOptions({
  region: "us-central1",
  maxInstances: 10,
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// --- Square Client Setup ---
const squareClient = Client
  ? new Client({
      environment:
        process.env.SQUARE_ENV === "sandbox"
          ? Environment.Sandbox
          : Environment.Production,
      accessToken: process.env.SQUARE_ACCESS_TOKEN || "",
    })
  : null;

  if (!squareClient) {
  console.error("❌ Square SDK not initialized. Payment routes will fail until fixed.");
}

const locationId = process.env.SQUARE_LOCATION_ID || "LXXXXXXXXXXXX";

if (!process.env.SQUARE_ACCESS_TOKEN) {
  console.warn("⚠️ SQUARE_ACCESS_TOKEN not set in environment!");
}

const paymentsApi = squareClient.paymentsApi;




// --- Brevo Setup ---
const brevoApiKey = defineSecret("BREVO_API_KEY");
const getBrevoClient = () => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = brevoApiKey.value();
  return new SibApiV3Sdk.TransactionalEmailsApi();
};

// --- CORS Headers ---
const setCorsHeaders = (res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// --- Validation ---
const validateBody = (body) => {
  if (!body.sourceId) return "Missing sourceId (card token).";
  if (!body.amountCents || isNaN(body.amountCents))
    return "Missing or invalid amountCents.";
  if (!body.currency) return "Missing currency.";
  return null;
};

// --- Square Create Payment Endpoint ---
app.post("/", async (req, res) => {
  try {
    const { sourceId, amountCents, currency = "USD", name, email, metadata } =
      req.body;

    const validationError = validateBody({ sourceId, amountCents, currency });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const idempotencyKey = crypto.randomBytes(16).toString("hex");

    const body = {
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: Number(amountCents),
        currency: currency.toUpperCase(),
      },
      note: `Payment by ${name || "customer"} ${
        email ? `(${email})` : ""
      } via Web`,
      buyerEmailAddress: email || undefined,
      referenceId: metadata ? JSON.stringify(metadata) : undefined,
    };

    const response = await paymentsApi.createPayment(body);
    const payment = response.result?.payment;

    return res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("❌ Square createPayment error:", error);
    const safeMessage =
      error?.response?.body?.errors
        ?.map((e) => e.detail || e.message)
        .join(" ") || error.message || "Payment failed";
    return res.status(500).json({ success: false, message: safeMessage });
  }
});


// Newsletter subscription function
exports.subscribeNewsletter = onRequest(
  {
    secrets: [brevoApiKey],
    cors: true, // Enable CORS at function level
    invoker: 'public', // Allow unauthenticated access
  },
  async (req, res) => {
    try {
      // Set CORS headers for all responses
      setCorsHeaders(res);

      // Handle preflight request
      if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request');
        return res.status(200).send('');
      }

      console.log(`Received ${req.method} request to subscribeNewsletter`);

      if (req.method !== 'POST') {
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed. Only POST requests are accepted.' 
        });
      }

      const { email, firstName, lastName } = req.body;
      console.log('Newsletter subscription request:', { email, firstName });

      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Valid email address is required'
        });
      }

      const apiInstance = getBrevoClient();

      // Send welcome email
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      
      sendSmtpEmail.subject = "Welcome to Solace Wave Therapy 🌊";
      sendSmtpEmail.to = [{ email: email, name: firstName || '' }];
      sendSmtpEmail.sender = { 
        name: "Solace Wave Therapy", 
        email: "solacewavetherapy@gmail.com" 
      };
      
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #87431D 0%, #C17A4A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Solace Wave Therapy</h1>
            <div style="font-size: 40px; margin: 10px 0;">🌊</div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
              Hi ${firstName || 'there'},
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Welcome to <strong>Solace Wave Therapy</strong> — we're so glad you're here.
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Your mental health journey begins now. Our mission is to support you with <strong>personalized therapy</strong> from <strong>licensed professionals</strong>, all within a <strong>safe and confidential online space</strong>.
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Stay tuned for helpful tips, mental wellness insights, and updates on how Solace Wave can support you every step of the way.
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px;">
              We're honored to be part of your path toward healing and growth.
            </p>
            
            <p style="font-size: 16px; color: #87431D; font-weight: bold; margin-bottom: 10px;">
              Warmly,
            </p>
            <p style="font-size: 16px; color: #87431D; font-weight: bold;">
              <strong>The Solace Wave Therapy Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
            <p>Follow us on social media for daily mental health tips</p>
            <div style="margin: 10px 0;">
              <a href="https://www.instagram.com/solace_wave_therapy_africa" style="color: #87431D; text-decoration: none; margin: 0 10px;">Instagram</a>
              <a href="https://facebook.com" style="color: #87431D; text-decoration: none; margin: 0 10px;">Facebook</a>
              <a href="https://linkedin.com" style="color: #87431D; text-decoration: none; margin: 0 10px;">LinkedIn</a>
            </div>
            <p>11 Koforidua street, off mambolo, Wuse Zone 2, Abuja, NG</p>
          </div>
        </div>
      `;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Welcome email sent successfully');
      
      // Optionally add to contact list
      try {
        const contactsApi = new SibApiV3Sdk.ContactsApi();
        const createContact = new SibApiV3Sdk.CreateContact();
        
        createContact.email = email;
        createContact.attributes = {
          FIRSTNAME: firstName || '',
          LASTNAME: lastName || '',
          SUBSCRIPTION_DATE: new Date().toISOString(),
          SOURCE: 'Website Newsletter'
        };
        createContact.listIds = [1]; // Your newsletter list ID from Brevo
        
        await contactsApi.createContact(createContact);
        console.log('Contact added to list');
      } catch (listError) {
        console.log('Contact might already exist:', listError.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Successfully subscribed! Check your email for a welcome message.'
      });

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setCorsHeaders(res); // Ensure CORS headers are set even on error
      return res.status(500).json({
        success: false,
        message: 'Failed to subscribe. Please try again.'
      });
    }
  }
);

// Contact form submission function
exports.submitContactForm = onRequest(
  {
    secrets: [brevoApiKey],
    cors: true, // Enable CORS at function level
    invoker: 'public', // Allow unauthenticated access
  },
  async (req, res) => {
    try {
      // Set CORS headers for all responses
      setCorsHeaders(res);

      // Handle preflight request
      if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request for contact form');
        return res.status(200).send('');
      }

      console.log(`Received ${req.method} request to submitContactForm`);

      if (req.method !== 'POST') {
        return res.status(405).json({ 
          success: false, 
          message: 'Method not allowed. Only POST requests are accepted.' 
        });
      }

      const { name, email, phone, subject, message } = req.body;
      console.log('Contact form submission:', { name, email, subject });

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and message are required'
        });
      }

      if (!email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Valid email address is required'
        });
      }

      const apiInstance = getBrevoClient();

      // Send notification to admin
      const adminEmail = new SibApiV3Sdk.SendSmtpEmail();
      adminEmail.subject = `New Contact Form Submission: ${subject}`;
      adminEmail.to = [{ email: "solacewavetherapy@gmail.com", name: "Solace Wave Support" }];
      adminEmail.sender = { name: "Website Contact Form", email: "noreply@solacewavetherapy.com" };
      adminEmail.replyTo = { email: email, name: name };
      
      adminEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #87431D; border-bottom: 2px solid #87431D; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h3 style="color: #87431D; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { 
                timeZone: 'Africa/Lagos',
                dateStyle: 'full',
                timeStyle: 'short'
              })} WAT
            </p>
          </div>
        </div>
      `;

      // Send auto-reply to customer
      const autoReply = new SibApiV3Sdk.SendSmtpEmail();
      autoReply.subject = "Thank you for contacting Solace Wave Therapy";
      autoReply.to = [{ email: email, name: name }];
      autoReply.sender = { name: "Solace Wave Therapy", email: "solacewavetherapy@gmail.com" };
      
      autoReply.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #87431D 0%, #C17A4A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Reaching Out</h1>
            <div style="font-size: 30px; margin: 10px 0;">💬</div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
              Hi ${name},
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for contacting <strong>Solace Wave Therapy</strong>. We've received your message regarding "<strong>${subject}</strong>" and appreciate you taking the time to reach out.
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Our support team will review your message and get back to you within <strong>24-48 hours</strong> during business hours (Monday-Friday, 9am-6pm WAT).
            </p>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #87431D;">
              <h3 style="color: #87431D; margin-top: 0;">Need Immediate Support?</h3>
              <p style="margin-bottom: 10px; color: #555;">If you're experiencing a mental health crisis:</p>
              <ul style="color: #555; line-height: 1.6;">
                <li>Call our support line: <strong>(234) 7033343596</strong></li>
                <li>Visit your local emergency room</li>
                <li>Contact emergency services: <strong>199 or 911</strong></li>
              </ul>
            </div>
            
            <p style="font-size: 16px; color: #87431D; font-weight: bold; margin-bottom: 10px;">
              Best regards,
            </p>
            <p style="font-size: 16px; color: #87431D; font-weight: bold;">
              <strong>The Solace Wave Therapy Team</strong>
            </p>
          </div>
        </div>
      `;

      // Send both emails
      await Promise.all([
        apiInstance.sendTransacEmail(adminEmail),
        apiInstance.sendTransacEmail(autoReply)
      ]);

      console.log('Contact form emails sent successfully');

      return res.status(200).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.'
      });

    } catch (error) {
      console.error('Contact form submission error:', error);
      setCorsHeaders(res); // Ensure CORS headers are set even on error
      return res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again.'
      });
    }
  }
);  

// Account deletion request function
exports.requestAccountDeletion = onRequest(
  {
    secrets: [brevoApiKey],
    cors: true,
    invoker: 'public', // Allow unauthenticated access
  },
  async (req, res) => {
    try {
      // Set CORS headers for all responses
      setCorsHeaders(res);

      // Handle preflight request
      if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight request for account deletion');
        return res.status(200).send('');
      }

      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
      }

      const { email, reason, feedback, userAgent, timestamp, userId } = req.body;

      if (!email || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Email and reason are required'
        });
      }

      if (!email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Valid email address is required'
        });
      }

      // Initialize Firestore
      const admin = require('firebase-admin');
      if (!admin.apps.length) {
        admin.initializeApp();
      }
      const db = admin.firestore();

      // Generate a unique deletion request ID
      const deletionRequestId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Save deletion request to Firestore
      const deletionData = {
        id: deletionRequestId,
        email: email,
        reason: reason,
        feedback: feedback || '',
        userId: userId || null,
        userAgent: userAgent || '',
        requestedAt: admin.firestore.Timestamp.fromDate(new Date(timestamp)),
        status: 'pending',
        processedAt: null,
        processedBy: null,
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('accountDeletionRequests').doc(deletionRequestId).set(deletionData);
      console.log('Account deletion request saved to Firestore:', deletionRequestId);

      const apiInstance = getBrevoClient();

      // Send notification to admin
      const adminEmail = new SibApiV3Sdk.SendSmtpEmail();
      adminEmail.subject = `🚨 Account Deletion Request - ${email}`;
      adminEmail.to = [{ 
        email: "solacewavetherapy@gmail.com", 
        name: "Solace Wave Admin" 
      }];
      adminEmail.sender = { 
        name: "Solace Wave System", 
        email: "noreply@solacewavetherapy.com" 
      };
      
      adminEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🚨 Account Deletion Request</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-weight: 600;">
                ⚠️ A user has requested to delete their account. This requires immediate attention.
              </p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #87431D; margin-top: 0;">Request Details</h3>
              <p><strong>Request ID:</strong> ${deletionRequestId}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>User ID:</strong> ${userId || 'Not provided (guest request)'}</p>
              <p><strong>Reason:</strong> ${reason}</p>
              <p><strong>Requested At:</strong> ${new Date(timestamp).toLocaleString('en-US', { 
                timeZone: 'Africa/Lagos',
                dateStyle: 'full',
                timeStyle: 'long'
              })} WAT</p>
            </div>
            
            ${feedback ? `
            <div style="background: white; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #87431D; margin-top: 0;">Additional Feedback:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #495057;">${feedback}</p>
            </div>
            ` : ''}
            
            <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #004085; margin-top: 0;">Required Actions:</h3>
              <ol style="color: #004085; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Verify the user's identity and account ownership</li>
                <li>Review any active subscriptions or sessions</li>
                <li>Process the account deletion within 30 days as per GDPR/CCPA</li>
                <li>Notify the user once deletion is complete</li>
                <li>Update the request status in Firestore</li>
              </ol>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-size: 12px; color: #6c757d;">
                <strong>Technical Details:</strong><br>
                User Agent: ${userAgent || 'Not provided'}<br>
                IP Address: ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown'}<br>
                Request stored in Firestore collection: accountDeletionRequests
              </p>
            </div>
          </div>
        </div>
      `;

      // Send confirmation email to user
      const userEmail = new SibApiV3Sdk.SendSmtpEmail();
      userEmail.subject = "Account Deletion Request Received - Solace Wave Therapy";
      userEmail.to = [{ email: email, name: email.split('@')[0] }];
      userEmail.sender = { 
        name: "Solace Wave Therapy", 
        email: "solacewavetherapy@gmail.com" 
      };
      
      userEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #87431D 0%, #C17A4A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Account Deletion Request Received</h1>
            <div style="font-size: 30px; margin: 10px 0;">🔒</div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Hello,
            </p>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              We have received your request to delete your Solace Wave Therapy account associated with this email address.
            </p>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin-top: 0;">Important Information:</h3>
              <ul style="color: #856404; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li><strong>Request ID:</strong> ${deletionRequestId}</li>
                <li><strong>Processing Time:</strong> Up to 30 days</li>
                <li><strong>Data Retention:</strong> Some data may be retained for legal compliance</li>
                <li><strong>Irreversible:</strong> This action cannot be undone</li>
              </ul>
            </div>
            
            <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #bee5eb;">
              <h3 style="color: #0c5460; margin-top: 0;">What Happens Next?</h3>
              <ol style="color: #0c5460; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Our team will review your request within 2-3 business days</li>
                <li>We may contact you to verify your identity</li>
                <li>Your account and data will be scheduled for deletion</li>
                <li>You'll receive a final confirmation once deletion is complete</li>
              </ol>
            </div>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #87431D;">
              <h3 style="color: #87431D; margin-top: 0;">Changed Your Mind?</h3>
              <p style="color: #555; line-height: 1.6; margin-bottom: 10px;">
                If you want to cancel this deletion request, please contact our support team immediately:
              </p>
              <p style="color: #555; margin: 0;">
                📧 Email: <a href="mailto:solacewavetherapy@gmail.com" style="color: #87431D;">solacewavetherapy@gmail.com</a><br>
                📞 Phone: <a href="tel:+2348064427513" style="color: #87431D;">(234) 8064427513</a><br>
                💬 Reference ID: <strong>${deletionRequestId}</strong>
              </p>
            </div>
            
            <p style="font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for being part of the Solace Wave Therapy community. We're sorry to see you go and hope our service was helpful during your time with us.
            </p>
            
            <p style="font-size: 16px; color: #87431D; font-weight: bold; margin-bottom: 10px;">
              Best regards,
            </p>
            <p style="font-size: 16px; color: #87431D; font-weight: bold;">
              <strong>The Solace Wave Therapy Team</strong>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>11 Koforidua street, off mambolo, Wuse Zone 2, Abuja, NG</p>
          </div>
        </div>
      `;

      // Send both emails
      await Promise.all([
        apiInstance.sendTransacEmail(adminEmail),
        apiInstance.sendTransacEmail(userEmail)
      ]);

      console.log('Account deletion emails sent successfully');

      return res.status(200).json({
        success: true,
        message: 'Your account deletion request has been submitted successfully. You will receive a confirmation email shortly, and our team will process your request within 30 days.',
        requestId: deletionRequestId
      });

    } catch (error) {
      console.error('Account deletion request error:', error);
      setCorsHeaders(res); // Ensure CORS headers are set even on error
      return res.status(500).json({
        success: false,
        message: 'Failed to process account deletion request. Please try again or contact support.'
      });
    }
  }
);

app.get("/api/rates", async (req, res) => {
  try {
    const resp = await fetch("https://api.exchangerate.host/latest?base=NGN&symbols=USD,EUR,CAD");
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

// Export payment endpoint
exports.createSquarePayment = onRequest(
  { cors: true, invoker: 'public' }, // optional config
  app
);
