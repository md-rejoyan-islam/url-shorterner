import { baseTemplate } from "./base.template";

// Password reset success email template
export const passwordResetSuccessTemplate = (name: string) => {
  const content = `
    <div class="header">
      <h1>URL Shortener</h1>
    </div>
    <div class="content">
      <h2>Password Changed Successfully</h2>
      <p>Hi ${name},</p>
      <p>Your password has been successfully changed. You can now log in to your account using your new password.</p>
      <div class="warning">
        <strong>Security Notice:</strong> If you did not make this change, please contact our support team immediately and secure your account.
      </div>
      <p>For your security, all active sessions have been logged out. Please log in again with your new password.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} URL Shortener. All rights reserved.</p>
      <p>If you have any questions, contact us at <a href="mailto:support@urlshortener.com">support@urlshortener.com</a></p>
    </div>
  `;
  return baseTemplate(content);
};
