export type WaitlistEntry = {
  userId: string;
  name: string;
  requestedAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  loanedBy?: string | null;
  dueDate?: string | null;
  waitlist?: WaitlistEntry[];
};

export const initialBooks: Book[] = [
  { id: '01', title: 'Dom Casmurro', author: 'Machado de Assis', year: 1899, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '02', title: 'Mulher em Queda', author: 'Colleen Hoover', year: 2026, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '03', title: 'A Empregada', author: 'Freida McFadden', year: 2023, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '04', title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', year: 1943, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '05', title: 'A Bolsa Amarela', author: 'Lygia Bojunga', year: 1976, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '06', title: 'O Menino do Dedo Verde', author: 'Maurice Druon', year: 1957, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '07', title: 'Meu Pé de Laranja Lima', author: 'José Mauro de Vasconcelos', year: 1968, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '08', title: 'Capitães da Areia', author: 'Jorge Amado', year: 1937, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '09', title: 'O Cortiço', author: 'Aluísio Azevedo', year: 1890, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '10', title: 'Iracema', author: 'José de Alencar', year: 1865, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '11', title: 'A Hora da Estrela', author: 'Clarice Lispector', year: 1977, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '12', title: 'O Alienista', author: 'Machado de Assis', year: 1882, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '13', title: 'Vidas Secas', author: 'Graciliano Ramos', year: 1938, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '14', title: 'A Revolução dos Bichos', author: 'George Orwell', year: 1945, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '15', title: 'Harry Potter e a Pedra Filosofal', author: 'J. K. Rowling', year: 1997, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '16', title: 'A Menina que Roubava Livros', author: 'Markus Zusak', year: 2005, loanedBy: null, dueDate: null, waitlist: [] },
  { id: '17', title: 'O Diário de Anne Frank', author: 'Anne Frank', year: 1947, loanedBy: null, dueDate: null, waitlist: [] },
];
