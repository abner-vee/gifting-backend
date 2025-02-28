declare module 'cache-manager-redis-yet' {
  import { CacheStoreFactory } from '@nestjs/common';
  const redisStore: CacheStoreFactory;
  export { redisStore };
}


export interface IMailMessage {
  subject: string;
  templateName: string;
  placeHolderData: Record<string, unknown>;
  sendNow: boolean;
  receiverEmail: string;
  senderEmail: string;
}