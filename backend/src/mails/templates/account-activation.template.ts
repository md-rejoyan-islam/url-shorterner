import { baseTemplate } from "./base.template";

// Account activation email template
export const accountActivationTemplate = (
  name: string,
  activationLink: string
) => {
  const content = `
    <div class="header">
      <h1>URL Shortener</h1>
    </div>
    <div class="content">
      <h2>Welcome, ${name}!</h2>
      <p>Thank you for registering with URL Shortener. To complete your registration and activate your account, please click the button below:</p>
      <div style="text-align: center;">
        <a href="${activationLink}" class="button">Activate Your Account</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${activationLink}</p>
      <div class="warning">
        <strong>Note:</strong> This activation link will expire in 24 hours. If you did not create an account, please ignore this email.
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} URL Shortener. All rights reserved.</p>
      <p>If you have any questions, contact us at <a href="mailto:support@urlshortener.com">support@urlshortener.com</a></p>
    </div>
  `;
  return baseTemplate(content);
};
