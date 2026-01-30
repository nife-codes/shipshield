const express = require('express');
const router = express.Router();
const { auth, db } = require('../services/firebase');

// Sign Up
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || 'Anonymous'
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName: displayName || 'Anonymous',
      createdAt: new Date()
    });

    res.json({ message: 'User created', uid: userRecord.uid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Sign In
/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const fetch = require('node-fetch');
    const apiKey = process.env.FIREBASE_WEB_API_KEY; // from Firebase project settings
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    res.json({
      message: 'Sign in successful',
      uid: data.localId,
      token: data.idToken,
      refreshToken: data.refreshToken
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
