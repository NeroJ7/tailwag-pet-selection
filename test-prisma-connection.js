// 使用 Prisma Client 测试数据库连接（Prisma 6.x 版本）
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma 数据库连接成功！');
    
    // 测试查询 - 查看所有表
    const users = await prisma.user.findMany();
    console.log('📊 users 表记录数:', users.length);
    
    const pets = await prisma.pet.findMany();
    console.log('📊 pets 表记录数:', pets.length);
    
    await prisma.$disconnect();
    console.log('✅ 连接已关闭');
    console.log('🎉 数据库表创建成功！');
  } catch (err) {
    console.error('❌ Prisma 连接失败:', err.message);
    process.exit(1);
  }
}

test();
