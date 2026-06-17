const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productImages = {
  'zen-scent-aromatherapy': [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
  ],
  'spa-station-grooming-tub': [
    'https://images.unsplash.com/photo-1581888227599-779811a0cfdd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
  ],
  'trekker-hiking-leash': [
    'https://images.unsplash.com/photo-1601758124096-1fd661873b95?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=1200&q=80',
  ],
  'venture-pet-backpack': [
    'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551730459-92bd2d1a09d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
  ],
  'safe-ride-pet-seatbelt': [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  ],
  'tunnel-den-play-tunnel': [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1573865526739-10644fec78e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80',
  ],
  'clean-bot-smart-litter': [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1573865526739-10644fec78e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80',
  ],
  'dent-fresh-toothbrush-kit': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
  ],
  'gut-well-probiotic-paste': [
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758124096-1fd661873b95?auto=format&fit=crop&w=1200&q=80',
  ],
  'arctic-ocean-fish-main': [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758124096-1fd661873b95?auto=format&fit=crop&w=1200&q=80',
  ],
  'arctic-pure-chicken-breast': [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1623366302587-b38b1ddaefd9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758124096-1fd661873b95?auto=format&fit=crop&w=1200&q=80',
  ],
  'spark-active-ball': [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1573865526739-10644fec78e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80',
  ],
  'voyage-luxury-carrier': [
    'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551730459-92bd2d1a09d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
  ],
  'groom-pro-kit': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
  ],
  'aqua-smart-fountain': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
  ],
  'aviator-luxury-stroller': [
    'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551730459-92bd2d1a09d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
  ],
  'nordic-oak-double-bowl': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
  ],
  'ortho-cloud-bed-velvet': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
  ],
  'zen-wooden-cat-tower': [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1573865526739-10644fec78e4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1200&q=80',
  ],
  'minimalist-smart-feeder-v2': [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19bc40da7e1?auto=format&fit=crop&w=1200&q=80',
  ],
};

async function main() {
  console.log('开始更新产品图片...');
  
  for (const [productId, images] of Object.entries(productImages)) {
    try {
      await prisma.products.update({
        where: { id: productId },
        data: { images },
      });
      console.log(`✅ ${productId}: 已更新 ${images.length} 张图片`);
    } catch (err) {
      console.error(`❌ ${productId}: 更新失败 - ${err.message}`);
    }
  }
  
  // 验证结果
  const results = await prisma.products.findMany({
    select: { id: true, name: true, images: true },
  });
  
  console.log('\n--- 验证结果 ---');
  for (const p of results) {
    console.log(`${p.id}: ${p.images?.length || 0} 张图片`);
  }
  
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
