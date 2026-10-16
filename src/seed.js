const prisma = require("./db");

async function seed() {
  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Post" RESTART IDENTITY CASCADE;`);

    const user = await prisma.user.create({
      data: {
        username: "riya_travels",
        email: "riya@example.com",
        fullname: "Riya Sharma",
        bio: null,
        isPrivate: false,
      },
    });

    const post = await prisma.post.create({
      data: {
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        caption: "Sunset at the beach",
        location: "Goa",
      },
    });

    console.log("Database reset and seeded successfully:");
    console.log("User (id: 1):", user);
    console.log("Post (id: 1):", post);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
