import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Refúgio Literário — Biblioteca Escolar',
  description: 'Organize empréstimos, devoluções, reservas e tarefas da sua biblioteca.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
