// pages/api/csrf.ts
// 获取 CSRF Token 的 API 端点
import { createCsrfTokenHandler } from '../../lib/csrf';

export default createCsrfTokenHandler();
