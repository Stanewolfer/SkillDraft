import jwt from 'jsonwebtoken';

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

export { generateToken };
