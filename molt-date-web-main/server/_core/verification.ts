// 验证码存储服务
// 注意：这是一个内存存储实现，生产环境应该使用Redis或其他持久化存储

interface VerificationCode {
  code: string;
  expiresAt: Date;
  email: string;
}

class VerificationService {
  private codes: Map<string, VerificationCode> = new Map();

  // 存储验证码
  storeCode(email: string, code: string, expiresAt: Date): void {
    this.codes.set(email, { code, expiresAt, email });
    
    // 设置过期自动清理
    const expirationTime = expiresAt.getTime() - Date.now();
    setTimeout(() => {
      this.codes.delete(email);
    }, expirationTime);
  }

  // 获取验证码
  getCode(email: string): VerificationCode | undefined {
    const code = this.codes.get(email);
    if (code && new Date() < code.expiresAt) {
      return code;
    }
    // 如果验证码过期，删除它
    this.codes.delete(email);
    return undefined;
  }

  // 验证验证码
  verifyCode(email: string, code: string): boolean {
    const storedCode = this.getCode(email);
    if (!storedCode) {
      return false;
    }
    
    const isValid = storedCode.code === code && new Date() < storedCode.expiresAt;
    if (isValid) {
      // 验证成功后删除验证码，防止重复使用
      this.codes.delete(email);
    }
    return isValid;
  }

  // 清除所有验证码（用于测试）
  clear(): void {
    this.codes.clear();
  }

  // 获取存储的验证码数量（用于测试）
  size(): number {
    return this.codes.size;
  }
}

export const verificationService = new VerificationService();
