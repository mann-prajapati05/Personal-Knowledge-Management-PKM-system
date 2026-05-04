import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../models/userModel.js';

const SALT_ROUNDS = 10;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, cookieOptions);
};

const clearAuthCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // check existing user
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // create user
    const user = await createUser({
      email,
      password: hashedPassword,
    });

    // create token and set as httpOnly cookie
    const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '7d' });
    setAuthCookie(res, token);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // find user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate token
    const token = jwt.sign(
      { userId: user.id },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    // set token as httpOnly cookie (frontend should use credentials: 'include')
    setAuthCookie(res, token);

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, getJwtSecret());

    return res.status(200).json({
      user: {
        id: decoded.userId,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export const logout = async (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: 'Logged out' });
};