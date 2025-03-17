import { jwtVerify, SignJWT, JWTPayload } from 'jose';
import { randomBytes } from 'crypto';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
const tokenExpiration = '15m'; // Short-lived access token

export interface TokenPayload extends JWTPayload {
  sub: string; // Subject (user ID)
  jti: string; // JWT ID (unique token identifier)
}

export async function createToken(userId: string): Promise<string> {
  // Generate a unique token ID
  const jti = randomBytes(16).toString('hex');
  
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setJti(jti) // Unique token identifier
    .setSubject(userId) // User ID as subject
    .setIssuedAt()
    .setExpirationTime(tokenExpiration)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.sub && payload.jti) {
      return payload as TokenPayload;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
} 