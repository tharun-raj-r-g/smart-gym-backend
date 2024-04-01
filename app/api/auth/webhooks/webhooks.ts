// pages/api/clerk-webhooks.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const event = req.body;

    // Extract user data from the Clerk webhook payload
    const userData = event.data.user;
    
    try {
      // Save user data to your database using Prisma
      const newUser = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email
          // Add additional fields as needed
        },
      });

      res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
