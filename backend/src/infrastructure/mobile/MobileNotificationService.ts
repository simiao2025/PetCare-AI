export class MobileNotificationService {
  async sendPush(token: string, title: string, body: string) {
    if (!token) {
      console.warn('[MobilePush] No token provided.');
      return;
    }
    
    // Mock sending push notification via Expo/FCM
    console.log(`[MobilePush] Sending to ${token}:`);
    console.log(`  Title: ${title}`);
    console.log(`  Body: ${body}`);
  }
}
