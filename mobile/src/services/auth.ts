import { 
  isSupported, 
  create, 
  authenticate 
} from 'react-native-passkey';
import { generateKey, deleteKey, BiometryTypes } from 'react-native-biometrics';

export class AuthService {
  private static instance: AuthService;
  
  static async getInstance(): Promise<AuthService> {
    if (!AuthService.instance) {
      const supported = await isSupported();
      AuthService.instance = new AuthService(supported);
    }
    return AuthService.instance;
  }

  private constructor(private passkeySupported: boolean) {}

  async register(userId: string, userName: string): Promise<boolean> {
    if (this.passkeySupported) {
      // WebAuthn passkey (mais seguro)
      try {
        await create({
          challenge: this.generateRandomChallenge(),
          rp: { name: 'PetCare Pro' },
          user: {
            id: userId,
            name: userName,
            displayName: userName,
          },
          authenticatorSelection: {
            userVerification: 'required',
          },
        });
        return true;
      } catch (e) {
        console.error('Passkey creation failed', e);
        return false;
      }
    } else {
      // Fallback: biometria local (Touch ID / Face ID)
      // Note: react-native-biometrics usage might slightly differ based on version
      // This is a simplified mock 
      return true;
    }
  }

  async login(): Promise<string | null> {
    if (this.passkeySupported) {
      try {
        const authentication = await authenticate({
          challenge: this.generateRandomChallenge(),
          allowCredentials: [], // Busca todas as credenciais registradas
        });
        return authentication.response.userHandle ? 
               Array.from(new Uint8Array(authentication.response.userHandle)).map(b => String.fromCharCode(b)).join('') : 
               'user-id-placeholder';
      } catch (e) {
        console.error('Passkey login failed', e);
        return null; // Fallback to password or other method
      }
    } else {
      // Mock biometric success
      return 'fallback-user-id';
    }
  }

  private generateRandomChallenge(): string {
    // In React Native, we might need a polyfill for crypto.getRandomValues
    // For this mock, we return a static string or simple random
    return 'random-challenge-string-base64'; 
  }
}
