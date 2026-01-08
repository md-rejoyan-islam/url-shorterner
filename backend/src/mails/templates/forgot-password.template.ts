import { baseTemplate } from "./base.template";

// Forgot password email template
export const forgotPasswordTemplate = (name: string, resetLink: string) => {
  const content = `
    <div class="header">
      <h1>URL Shortener</h1>
    </div>
    <div class="content">
      <h2>Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
      <div class="warning">
        <strong>Important:</strong> This link will expire in 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} URL Shortener. All rights reserved.</p>
      <p>If you have any questions, contact us at <a href="mailto:support@urlshortener.com">support@urlshortener.com</a></p>
    </div>
  `;
  return baseTemplate(content);
};
