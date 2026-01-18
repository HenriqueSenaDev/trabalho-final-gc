import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Limpar dados existentes
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Ursos' },
    }),
    prisma.category.create({
      data: { name: 'Coelhos' },
    }),
    prisma.category.create({
      data: { name: 'Unicórnios' },
    }),
    prisma.category.create({
      data: { name: 'Dinossauros' },
    }),
    prisma.category.create({
      data: { name: 'Gatos' },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Criar produtos
  const products = await Promise.all([
    // Ursos
    prisma.product.create({
      data: {
        name: 'Urso Ted',
        price: 45.99,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2QCtupU-ftdbVHLOAnbTfACzqjcRtFum1Sg&s',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Urso Panda',
        price: 52.99,
        imageUrl: 'https://cdn.awsli.com.br/800x800/31/31885/produto/157869150/4fbe139852.jpg',
        categoryId: categories[0].id,
      },
    }),
    // Coelhos
    prisma.product.create({
      data: {
        name: 'Coelho Fofinho',
        price: 42.50,
        imageUrl: 'https://cdn.awsli.com.br/800x800/31/31885/produto/234916689/coelho-branco-cenoura-t55b9rpyxa.jpg',
        categoryId: categories[1].id,
      },
    }),
    // Unicórnios
    prisma.product.create({
      data: {
        name: 'Unicórnio Arco-íris',
        price: 55.00,
        imageUrl: 'https://m.media-amazon.com/images/I/41j2Xsme8cL.jpg',
        categoryId: categories[2].id,
      },
    }),
    // Dinossauros
    prisma.product.create({
      data: {
        name: 'T-Rex Laranja',
        price: 48.50,
        imageUrl: 'https://toymania.vtexassets.com/arquivos/ids/962426/Jurassic-World-Dino-Scape-Pelucia-T-Rex---Mattel---1.jpg?v=637732058093670000',
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Triceratops Verde',
        price: 46.99,
        imageUrl: 'https://brincamundo.com.br/wp-content/uploads/2023/10/pelucia-dinossauro-triceratops-verde.jpg',
        categoryId: categories[3].id,
      },
    }),
    // Gatos
    prisma.product.create({
      data: {
        name: 'Gatinho Fofo',
        price: 39.99,
        imageUrl: 'https://cdn.awsli.com.br/600x450/31/31885/produto/188897335/4bef5bb5e4.jpg',
        categoryId: categories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gato Persa',
        price: 44.50,
        imageUrl: 'https://imgs.casasbahia.com.br/1561870870/1xg.jpg?imwidth=1000',
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
