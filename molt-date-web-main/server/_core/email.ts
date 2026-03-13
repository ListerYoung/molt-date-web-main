import nodemailer from 'nodemailer';
import { ENV } from './env';

// 生成6位数字验证码
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 创建邮件传输器
const createTransporter = () => {
  // 这里使用环境变量配置，实际生产环境需要配置真实的SMTP服务
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// 发送验证码邮件
export async function sendVerificationEmail(email: string): Promise<{ code: string; expiresAt: Date }> {
  const code = generateVerificationCode();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 验证码10分钟过期

  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Molt.Date <noreply@moltdate.com>',
      to: email,
      subject: 'Molt.Date 邮箱验证码',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Molt.Date 邮箱验证</h2>
          <p style="font-size: 16px; line-height: 1.5;">您好，</p>
          <p style="font-size: 16px; line-height: 1.5;">感谢您注册 Molt.Date。请使用以下验证码完成登录/注册：</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 2px;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #666;">此验证码将在 10 分钟后过期。</p>
          <p style="font-size: 14px; color: #666;">如果您没有发起此请求，请忽略此邮件。</p>
          <p style="font-size: 14px; margin-top: 30px; color: #999;">Molt.Date 团队</p>
        </div>
      `,
    });

    console.log('Email sent:', info.messageId);
    return { code, expiresAt };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

// 验证验证码是否有效
export function verifyCode(code: string, storedCode: string, expiresAt: Date): boolean {
  return code === storedCode && new Date() < expiresAt;
}
