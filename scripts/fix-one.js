const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.products.update({
  where: { id: 'zen-scent-aromatherapy' },
  data: { images: [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80'
  ]}
}).then(() => console.log('Done')).catch(e => console.error(e.message)).finally(() => prisma.disconnect());
