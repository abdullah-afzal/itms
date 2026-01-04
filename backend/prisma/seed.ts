import prisma from '../src/prisma/client.js';
import bcrypt from 'bcryptjs';

async function main() {
    const adminEmail = "admin@example.com";

    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                name: "Admin User",
                password: hashedPassword,
                role: "ADMIN",
                tasks: {
                    create: [
                        { title: "First Task", description: "This was created via seed", status: "PENDING" },
                        { title: "Review Code", description: "Check the authentication logic", status: "COMPLETED" }
                    ]
                }
            },
        });

        console.log(`
Seed successful!
-----------------------------------------
Admin User Created:
Email:    admin@example.com
Password: admin123
-----------------------------------------
Initial tasks have been populated.
`);
    } else {
        console.log("Seed skipped: User already exists");
    }
}

main()
    .catch((e) => {
        process.exit(1);
    })