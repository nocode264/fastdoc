export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserService {
  private users: User[] = [];

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async createUser(name: string, email: string): Promise<User> {
    const user = { id: Date.now(), name, email };
    this.users.push(user);
    return user;
  }
}

export function calculateDiscount(price: number, rate: number): number {
  if (rate < 0 || rate > 1) throw new Error("Rate must be between 0 and 1");
  return price * (1 - rate);
}