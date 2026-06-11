import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  // 测试 1: 检查 NEXTAUTH_SECRET
  results.tests.secret = {
    exists: !!process.env.NEXTAUTH_SECRET,
    length: process.env.NEXTAUTH_SECRET?.length || 0,
  };

  // 测试 2: 尝试导入 next-auth
  try {
    const NextAuth = require('next-auth');
    results.tests.nextauth_import = {
      success: true,
      type: typeof NextAuth,
    };
  } catch (err: any) {
    results.tests.nextauth_import = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 300),
    };
  }

  // 测试 3: 尝试导入 CredentialsProvider
  try {
    const CredentialsProvider = require('next-auth/providers/credentials');
    results.tests.credentials_provider = {
      success: true,
      type: typeof CredentialsProvider.default,
    };
  } catch (err: any) {
    results.tests.credentials_provider = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 300),
    };
  }

  // 测试 4: 尝试导入 lib/db
  try {
    const db = require('../../../lib/db');
    results.tests.db_import = {
      success: true,
      hasQuery: !!db.query,
    };
  } catch (err: any) {
    results.tests.db_import = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 300),
    };
  }

  // 测试 5: 尝试构建 authOptions 对象
  try {
    const CredentialsProvider = require('next-auth/providers/credentials').default;
    const { query } = require('../../../lib/db');
    const bcrypt = require('bcryptjs');

    const authOptions = {
      secret: process.env.NEXTAUTH_SECRET,
      session: { strategy: 'jwt' },
      providers: [
        CredentialsProvider({
          name: '账号密码',
          credentials: {
            email: { label: '邮箱', type: 'email' },
            password: { label: '密码', type: 'password' },
          },
          async authorize(credentials: any) {
            if (!credentials?.email || !credentials?.password) return null;
            const result = await query('SELECT * FROM "users" WHERE email = $1 LIMIT 1', [credentials.email]);
            const user = result.rows[0];
            if (!user) return null;
            const isValid = await bcrypt.compare(credentials.password, user.password_hash);
            if (!isValid) return null;
            return { id: user.id, email: user.email, name: user.name, image: user.avatar_url };
          },
        }),
      ],
      callbacks: {
        async jwt({ token, user }: any) {
          if (user) token.id = user.id;
          return token;
        },
        async session({ session, token }: any) {
          if (token && session.user) session.user.id = token.id;
          return session;
        },
      },
      pages: { signIn: '/auth/signin' },
    };

    results.tests.auth_options_build = {
      success: true,
      hasSecret: !!authOptions.secret,
    };

    // 测试 6: 尝试调用 NextAuth
    try {
      const NextAuth = require('next-auth').default;
      const handler = NextAuth(authOptions);
      results.tests.nextauth_init = {
        success: true,
        handlerType: typeof handler,
      };
    } catch (err: any) {
      results.tests.nextauth_init = {
        success: false,
        error: err.message,
        stack: err.stack?.substring(0, 300),
      };
    }
  } catch (err: any) {
    results.tests.auth_options_build = {
      success: false,
      error: err.message,
      stack: err.stack?.substring(0, 300),
    };
  }

  return res.status(200).json(results);
}
