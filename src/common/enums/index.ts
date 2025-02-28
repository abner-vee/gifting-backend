export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class JwtPayload {
  id: number;
  email: string;
  role: Role;
}
