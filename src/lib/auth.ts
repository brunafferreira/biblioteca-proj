export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const users: User[] = [
  { id: '01', name: 'suzany', email: 'suzany@gmail.com', password: '12345678' },
  { id: '02', name: 'maria', email: 'maria@gmail.com', password: '13457609' },
];

export function authenticateUser(email: string, password: string, availableUsers: User[] = users): User | null {
  const normalizedEmail = email.trim().toLocaleLowerCase('pt-BR');
  return availableUsers.find((user) => user.email === normalizedEmail && user.password === password) ?? null;
}
