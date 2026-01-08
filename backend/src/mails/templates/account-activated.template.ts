import { baseTemplate } from "./base.template";

// Account activation success email template
export const accountActivatedTemplate = (name: string, loginLink: string) => {
  const content = `
    <div class="header">
      <h1>URL Shortener</h1>
    </div>
    <div class="content">
      <h2>Account Activated!</h2>
      <p>Hi ${name},</p>
      <p>Congratulations! Your account has been successfully activated. You can now enjoy all the features of URL Shortener.</p>
      <div style="text-align: center;">
        <a href="${loginLink}" class="button">Go to Login</a>
      </div>
      <p>Start shortening your URLs and tracking their performance today!</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} URL Shortener. All rights reserved.</p>
      <p>If you have any questions, contact us at <a href="mailto:support@urlshortener.com">support@urlshortener.com</a></p>
    </div>
  `;
  return baseTemplate(content);
};
