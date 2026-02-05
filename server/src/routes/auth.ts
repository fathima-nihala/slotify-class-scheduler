import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { config } from '../config';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Signup
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, countryCode, phone, password } = req.body;

        // Basic validation
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: `${firstName} ${lastName}`,
                phone: `${countryCode}${phone}`,
            },
        });

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: '7d',
        });

        // Return user (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        // Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: '7d',
        });

        // Return user (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

export default router;
