import nodemailer from 'nodemailer';
import { env } from '@/config/env';

/**
 * Enterprise service wrapping SMPT outbound networking protocols providing abstract generic logic
 * executing automated HTML communication campaigns via authenticated relay systems.
 * 
 * @class EmailService
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  /**
   * Bootstraps dedicated network channels integrating environmental credentials aligning localized instances
   * with external communication proxies securely validating outbound message origination.
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  /**
   * Executes programmatic HTML generation structuring localized cryptographic parameters within DOM hyperlinks
   * initiating onboarding identity evaluation checks assuring validity of underlying registrations.
   * 
   * @param {string} email - Deterministic indicator addressing inbound mailbox endpoints.
   * @param {string} token - Cryptographic key string required during subsequent programmatic authentication verifications.
   * @returns {Promise<void>} Emits asynchronous conclusion state completing underlying communication pipeline tasks.
   */
  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

    await this.send({
      to: email,
      subject: 'Verify Your Email — Job Search Assistant',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#6366f1;">Welcome to Job Search Assistant! 🚀</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" style="
            display:inline-block;
            background:#6366f1;
            color:white;
            padding:12px 32px;
            text-decoration:none;
            border-radius:8px;
            margin:16px 0;
          ">Verify Email</a>
          <p style="color:#666;">If the button doesn't work, copy and paste this link:<br>
          <a href="${verifyUrl}">${verifyUrl}</a></p>
        </div>
      `,
    });
  }

  /**
   * Synthesizes isolated DOM blocks delivering secured restoration pathways enabling user identities 
   * to safely recover isolated scopes independent of typical login sequences.
   * 
   * @param {string} email - Translates target user parameters facilitating outbound routing directionality.
   * @param {string} token - Dynamic randomized digest parameter securing restoration actions temporally.
   * @returns {Promise<void>} Finalizes asynchronous relay operations resolving operation lifecycle graphs.
   */
  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    await this.send({
      to: email,
      subject: 'Reset Your Password — Job Search Assistant',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#6366f1;">Password Reset</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" style="
            display:inline-block;
            background:#6366f1;
            color:white;
            padding:12px 32px;
            text-decoration:none;
            border-radius:8px;
            margin:16px 0;
          ">Reset Password</a>
          <p style="color:#666;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  }

  /**
   * Implements array mapping routines condensing high-volume recommendation metadata sets into streamlined visual grids
   * ensuring optimal digestion of systemic alerting methodologies targeting end users.
   * 
   * @param {string} email - Dictates addressing endpoints facilitating chronological mapping distributions.
   * @param {string} alertName - Identifies parameterized logical queries binding resulting subsets to unique profiles.
   * @param {any[]} jobs - Complete arrays denoting disparate recommendation subsets filtered via background processes.
   * @returns {Promise<void>} Awaits completion verifying physical reception endpoints within SMTP infrastructures.
   */
  async sendJobAlertEmail(email: string, alertName: string, jobs: any[]) {
    const jobsHtml = jobs
      .slice(0, 5)
      .map(
        (j) => `
        <div style="border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:8px 0;">
          <h3 style="margin:0;color:#1f2937;">${j.title}</h3>
          <p style="margin:4px 0;color:#6b7280;">${j.company} · ${j.location}</p>
          ${j.salaryMin ? `<p style="margin:4px 0;color:#059669;">₹${(j.salaryMin / 100000).toFixed(1)}L - ₹${((j.salaryMax || j.salaryMin) / 100000).toFixed(1)}L</p>` : ''}
          <a href="${j.applyUrl}" style="color:#6366f1;">View Job →</a>
        </div>
      `
      )
      .join('');

    await this.send({
      to: email,
      subject: `Job Alert: ${alertName} — ${jobs.length} new matches`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#6366f1;">📬 New Job Matches</h2>
          <p>We found <strong>${jobs.length}</strong> new jobs matching your "${alertName}" alert!</p>
          ${jobsHtml}
          ${jobs.length > 5 ? `<p style="color:#6b7280;">...and ${jobs.length - 5} more. <a href="${env.FRONTEND_URL}/jobs">View all →</a></p>` : ''}
        </div>
      `,
    });
  }

  /**
   * Internal abstraction layer managing precise SMTP interaction logistics wrapping NodeMailer boundaries 
   * avoiding redundancy and mitigating localized faults averting entire application interruptions.
   * 
   * @param {Object} options - Consists of recipient variables, thematic subjects, and fully rendered HTML matrices.
   * @returns {Promise<void>} Resolves quietly guaranteeing operations continue uninterrupted following transport limitations.
   */
  private async send(options: { to: string; subject: string; html: string }) {
    try {
      await this.transporter.sendMail({
        from: `"Job Search Assistant" <${env.EMAIL_FROM}>`,
        ...options,
      });
    } catch (error: any) {
      console.warn('⚠️ Email send failed:', error.message);
    }
  }
}

export const emailService = new EmailService();
