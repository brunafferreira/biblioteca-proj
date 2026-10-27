'use client';

import { FormEvent, useEffect, useState } from 'react';
import { authenticateUser, users as configuredUsers, type User } from '@/lib/auth';
import { initialBooks, type Book } from '@/lib/books';
import { Button } from '@/components/button';

type AuthMode = 'login' | 'register';
const SESSION_KEY = 'scope-library-session';
const BOOKS_KEY = 'scope-library-books';
const READ_BOOKS_KEY = 'scope-library-read-books';
const REGISTERED_USERS_KEY = 'scope-library-registered-users';
const LEGACY_USERS_KEY = 'scope-library-users';
const projectHighlights = [
  { number: '01', title: 'Acervo organizado', description: 'Pesquisa de livros por título, autor ou ano para encontrar a próxima leitura.' },
  { number: '02', title: 'Empréstimos e filas', description: 'Consulta de disponibilidade, empréstimos e fila de espera em um só lugar.' },
  { number: '03', title: 'Histórico de leitura', description: 'Uma estante pessoal para registrar e revisitar os livros já lidos.' },
];
const teamMembers = [
  'Suzany Maria da Silva',
  'Maria Fernanda Pereira da Silva',
  'Josimar Lourenço da Silva Júnior',
  'Pedro Guilherme da Silva Rocha',
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [readBooksByUser, setReadBooksByUser] = useState<Record<string, string[]>>({});
  const [bookSearch, setBookSearch] = useState('');
  const [now, setNow] = useState(0);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authPasswordConfirmation, setAuthPasswordConfirmation] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [authError, setAuthError] = useState('');
  const [ready, setReady] = useState(false);
  const allUsers = [...configuredUsers, ...registeredUsers];

  useEffect(() => {
    try {
      const savedLegacyUsers = localStorage.getItem(LEGACY_USERS_KEY);
      const legacyUsers = savedLegacyUsers ? JSON.parse(savedLegacyUsers) as { id: string; email: string }[] : [];
      const savedRegisteredUsers = localStorage.getItem(REGISTERED_USERS_KEY);
      const parsedRegisteredUsers: unknown = savedRegisteredUsers ? JSON.parse(savedRegisteredUsers) : [];
      const localUsers = Array.isArray(parsedRegisteredUsers)
        ? parsedRegisteredUsers.filter((user): user is User => Boolean(user &&
          typeof user.id === 'string' && typeof user.name === 'string' &&
          typeof user.email === 'string' && typeof user.password === 'string'))
        : [];
      setRegisteredUsers(localUsers);
      const knownUsers = [...configuredUsers, ...localUsers];
      const migratedIds = new Map(legacyUsers.map((legacy) => [
        legacy.id,
        knownUsers.find((user) => user.email === legacy.email.toLowerCase())?.id,
      ]));
      const sessionId = localStorage.getItem(SESSION_KEY);
      const migratedSessionId = sessionId ? migratedIds.get(sessionId) ?? sessionId : null;
      const sessionUser = knownUsers.find((user) => user.id === migratedSessionId);
      if (sessionUser) setCurrentUser(sessionUser);
      else localStorage.removeItem(SESSION_KEY);

      const savedBooks = localStorage.getItem(BOOKS_KEY);
      const parsedBooks: unknown = savedBooks ? JSON.parse(savedBooks) : [];
      const savedCatalog = Array.isArray(parsedBooks) ? parsedBooks as Book[] : null;
      const savedById = new Map((savedCatalog ?? []).map((book) => [book.id, book]));
      const initialIds = new Set(initialBooks.map((book) => book.id));
      const catalog = [
        ...initialBooks.map((book) => ({ ...book, ...savedById.get(book.id) })),
        ...(savedCatalog ?? []).filter((book) => !initialIds.has(book.id)),
      ];
      const currentTime = Date.now();
      setBooks(catalog.map((book) => {
        const dueDate = book.dueDate ?? null;
        const expired = dueDate !== null && new Date(dueDate).getTime() <= currentTime;
        return {
          ...book,
          loanedBy: expired ? null : book.loanedBy ?? null,
          dueDate: expired ? null : dueDate,
          waitlist: book.waitlist ?? [],
        };
      }));
      const savedReadBooks = localStorage.getItem(READ_BOOKS_KEY);
      const parsedReadBooks: unknown = savedReadBooks ? JSON.parse(savedReadBooks) : {};
      if (parsedReadBooks && typeof parsedReadBooks === 'object' && !Array.isArray(parsedReadBooks)) {
        const validReadBooks = Object.fromEntries(Object.entries(parsedReadBooks)
          .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]) && entry[1].every((id) => typeof id === 'string')));
        setReadBooksByUser(validReadBooks);
      }
      localStorage.removeItem(LEGACY_USERS_KEY);
    } catch {
      setBooks(initialBooks);
      localStorage.removeItem(SESSION_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }, [books, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(READ_BOOKS_KEY, JSON.stringify(readBooksByUser));
  }, [readBooksByUser, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers, ready]);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const readBookIds = currentUser ? readBooksByUser[currentUser.id] ?? [] : [];
  const loanedBookCount = books.filter((book) => book.loanedBy === currentUser?.id && book.dueDate && new Date(book.dueDate).getTime() > now).length;
  const waitlistCount = books.filter((book) => book.waitlist?.some((entry) => entry.userId === currentUser?.id)).length;

  function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError('');
    if (authMode === 'register') {
      const name = authName.trim();
      const email = authEmail.trim().toLocaleLowerCase('pt-BR');
      if (name.length < 2) {
        setAuthError('Informe seu nome completo.');
        return;
      }
      if (allUsers.some((user) => user.email.toLocaleLowerCase('pt-BR') === email)) {
        setAuthError('Já existe uma conta com este e-mail. Entre ou use outro endereço.');
        return;
      }
      if (authPassword.length < 8) {
        setAuthError('A senha precisa ter pelo menos 8 caracteres.');
        return;
      }
      if (authPassword !== authPasswordConfirmation) {
        setAuthError('As senhas não coincidem. Confira e tente novamente.');
        return;
      }
      const newUser: User = { id: crypto.randomUUID(), name, email, password: authPassword };
      const updatedUsers = [...registeredUsers, newUser];
      try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
        localStorage.setItem(SESSION_KEY, newUser.id);
      } catch {
        setAuthError('Não foi possível salvar sua conta neste navegador. Verifique o armazenamento disponível.');
        return;
      }
      setRegisteredUsers(updatedUsers);
      setCurrentUser(newUser);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setAuthPasswordConfirmation('');
      return;
    }

    const user = authenticateUser(authEmail, authPassword, allUsers);
    if (!user) {
      setAuthError('E-mail ou senha incorretos. Verifique os dados e tente novamente.');
      return;
    }
    try {
      localStorage.setItem(SESSION_KEY, user.id);
    } catch {
      setAuthError('Não foi possível iniciar a sessão neste navegador. Verifique as permissões de armazenamento.');
      return;
    }
    setCurrentUser(user);
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthPasswordConfirmation('');
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setAuthEmail('');
    setAuthName('');
    setAuthPassword('');
    setAuthPasswordConfirmation('');
    setAuthError('');
  }

  function isBookAvailable(book: Book, currentTime = now) {
    return !book.loanedBy || !book.dueDate || new Date(book.dueDate).getTime() <= currentTime;
  }

  function loanBook(id: string) {
    if (!currentUser) return;
    setBooks((current) => current.map((book) => {
      if (book.id !== id || (book.loanedBy && book.dueDate && new Date(book.dueDate).getTime() > Date.now())) return book;
      const waitlist = book.waitlist ?? [];
      if (waitlist.length > 0 && waitlist[0].userId !== currentUser.id) return book;
      const dueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
      return { ...book, loanedBy: currentUser.id, dueDate, waitlist: waitlist.filter((entry) => entry.userId !== currentUser.id) };
    }));
  }

  function joinWaitlist(id: string) {
    if (!currentUser) return;
    setBooks((current) => current.map((book) => {
      const waitlist = book.waitlist ?? [];
      const loanIsActive = Boolean(book.loanedBy && book.dueDate && new Date(book.dueDate).getTime() > Date.now());
      if (book.id !== id || (!loanIsActive && waitlist.length === 0) || waitlist.some((entry) => entry.userId === currentUser.id)) return book;
      return { ...book, waitlist: [...waitlist, { userId: currentUser.id, name: currentUser.name, requestedAt: new Date().toISOString() }] };
    }));
  }

  function returnBook(id: string) {
    if (!currentUser) return;
    setBooks((current) => current.map((book) => book.id === id && book.loanedBy === currentUser.id
      ? { ...book, loanedBy: null, dueDate: null }
      : book));
  }

  function markBookAsRead(id: string) {
    if (!currentUser) return;
    setReadBooksByUser((current) => {
      const currentIds = current[currentUser.id] ?? [];
      const nextIds = currentIds.includes(id)
        ? currentIds.filter((bookId) => bookId !== id)
        : [...currentIds, id];
      return { ...current, [currentUser.id]: nextIds };
    });
  }

  const matchingBooks = books.filter((book) =>
    `${book.title} ${book.author} ${book.year}`.toLocaleLowerCase('pt-BR').includes(bookSearch.trim().toLocaleLowerCase('pt-BR')),
  );
  const readBooks = books.filter((book) => readBookIds.includes(book.id));
  function dateLabel(value: string) {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(value));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Refúgio Literário, início">
          <span className="brand-mark">R</span><span>Refúgio Literário<span className="brand-dot">.</span></span>
        </a>
        <a className="team-nav-link" href="#sobre-projeto">Sobre o projeto</a>
        {currentUser ? <div className="account-bar">
          <span className="user-greeting">Olá, <strong>{currentUser.name}</strong></span>
          <Button variant="subtle" type="button" onClick={logout}>Sair ↗</Button>
        </div> : <span className="topbar-note"><span className="status-dot" /> Acesso restrito</span>}
      </header>

      {!currentUser ? <section className="auth-layout" id="inicio">
        <div className="intro auth-intro">
          <div className="eyebrow"><span className="eyebrow-line" /> BIBLIOTECA ESCOLAR</div>
          <h1>A biblioteca,<br /><span>em boas mãos.</span></h1>
          <p className="intro-copy">Entre para pesquisar o acervo, acompanhar empréstimos e organizar seus livros já lidos.</p>
          <div className="intro-foot"><span className="avatar-stack"><i>✳</i><i>⌂</i><i>↗</i></span><span>Um espaço organizado para <strong>toda a equipa.</strong></span></div>
        </div>
        <div className="auth-card" aria-labelledby="auth-title">
          <div className="workspace-heading"><div><span className="section-kicker">ESPAÇO DA BIBLIOTECA</span><h2 id="auth-title">{authMode === 'login' ? 'Acesse sua conta' : 'Crie sua conta'}</h2></div><span className="live-badge"><i /> ACESSO</span></div>
          <p className="auth-description">{authMode === 'login' ? 'Entre com seu e-mail e senha cadastrados para continuar.' : 'Preencha seus dados para criar uma conta e acessar a biblioteca.'}</p>
          <form className="auth-form" onSubmit={submitAuth}>
            {authMode === 'register' && <>
              <label htmlFor="auth-name">Nome completo</label>
              <input id="auth-name" name="name" type="text" autoComplete="name" maxLength={80} value={authName} onChange={(event) => { setAuthName(event.target.value); setAuthError(''); }} placeholder="Como podemos chamar você?" required />
            </>}
            <label htmlFor="auth-email">E-mail</label>
            <input id="auth-email" name="email" type="email" inputMode="email" autoCapitalize="none" autoComplete="email" spellCheck={false} maxLength={254} aria-invalid={Boolean(authError)} aria-describedby={authError ? 'auth-error' : undefined} value={authEmail} onChange={(event) => { setAuthEmail(event.target.value); setAuthError(''); }} placeholder="nome@exemplo.com" required />
            <label htmlFor="auth-password">Senha</label>
            <input id="auth-password" name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} minLength={8} maxLength={128} aria-invalid={Boolean(authError)} aria-describedby={authError ? 'auth-error' : 'password-hint'} value={authPassword} onChange={(event) => { setAuthPassword(event.target.value); setAuthError(''); }} placeholder={authMode === 'login' ? 'Digite sua senha' : 'Crie uma senha com pelo menos 8 caracteres'} required />
            <span className="auth-hint" id="password-hint">A senha deve ter pelo menos 8 caracteres.</span>
            {authMode === 'register' && <>
              <label htmlFor="auth-password-confirmation">Confirme a senha</label>
              <input id="auth-password-confirmation" name="password-confirmation" type="password" autoComplete="new-password" minLength={8} maxLength={128} aria-invalid={Boolean(authError)} aria-describedby={authError ? 'auth-error' : undefined} value={authPasswordConfirmation} onChange={(event) => { setAuthPasswordConfirmation(event.target.value); setAuthError(''); }} placeholder="Digite a senha novamente" required />
            </>}
            {authError && <p className="auth-error" id="auth-error" role="alert">{authError}</p>}
            <Button className="auth-submit" type="submit">{authMode === 'login' ? 'Entrar na biblioteca' : 'Criar conta e entrar'} <span>↗</span></Button>
          </form>
          <div className="auth-mode-switch">
            <span>{authMode === 'login' ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}</span>
            <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); setAuthName(''); setAuthPassword(''); setAuthPasswordConfirmation(''); }}>
              {authMode === 'login' ? 'Cadastre-se' : 'Fazer login'}
            </button>
          </div>
          <p className="auth-footnote">A conta fica salva neste navegador. Não é enviado e-mail de confirmação.</p>
        </div>
      </section> : <section className="dashboard dashboard-full" id="inicio">
        <div className="intro dashboard-intro">
          <div className="eyebrow"><span className="eyebrow-line" /> BIBLIOTECA ESCOLAR</div>
          <h1>Olá, <span>{currentUser.name.split(' ')[0]}.</span></h1>
          <p className="intro-copy">Pesquise o acervo, acompanhe seus empréstimos e organize os livros que já leu.</p>
          <div className="summary-cards">
            <article className="summary-card"><span className="summary-icon">▤</span><span className="summary-label">TOTAL DE EMPRÉSTIMOS</span><strong>{loanedBookCount}</strong><small>livros com você agora</small></article>
            <article className="summary-card pending-summary"><span className="summary-icon">◷</span><span className="summary-label">FILA DE ESPERA</span><strong>{waitlistCount}</strong><small>livros aguardando disponibilidade</small></article>
            <article className="summary-card done-summary"><span className="summary-icon">✓</span><span className="summary-label">LIVROS JÁ LIDOS</span><strong>{readBooks.length}</strong><small>no seu histórico de leitura</small></article>
          </div>
        </div>

        <div className="workspace">
          <div className="workspace-heading"><div><span className="section-kicker">CONSULTA DO ACERVO</span><h2>Encontre seu próximo livro</h2></div><span className="live-badge"><i /> {books.length} LIVROS</span></div>
          <div className="book-search-panel">
            <label className="search-label" htmlFor="book-search">Pesquisar por título, autor ou ano</label>
            <input className="book-search" id="book-search" type="search" value={bookSearch} onChange={(event) => setBookSearch(event.target.value)} placeholder="Ex.: Dom Casmurro" />
            <div className="book-grid">{matchingBooks.map((book) => {
              const available = isBookAvailable(book);
              const waitlist = book.waitlist ?? [];
              const waitPosition = waitlist.findIndex((entry) => entry.userId === currentUser.id);
              const isMyLoan = book.loanedBy === currentUser.id && !available;
              const canBorrow = available && (waitlist.length === 0 || waitlist[0].userId === currentUser.id);
              const borrower = allUsers.find((user) => user.id === book.loanedBy);
              const alreadyRead = readBookIds.includes(book.id);
              return <article className="book-card" key={book.id}>
                <span className="book-cover">▤</span>
                <div className="book-details"><h3>{book.title}</h3><p>{book.author}</p><span>{book.year}</span>
                  <span className={available ? 'book-status available' : 'book-status unavailable'}>{available ? waitlist.length ? waitPosition === 0 ? 'Disponível — é a sua vez' : 'Aguardando fila' : 'Disponível' : `Emprestado até ${dateLabel(book.dueDate!)}`}</span>
                  {!available && <p className="borrower-name">Com: {borrower?.name ?? 'utilizador'}</p>}
                  {waitlist.length > 0 && <p className="waitlist-names"><strong>Fila de espera:</strong> {waitlist.map((entry) => entry.name).join(' · ')}</p>}
                  <div className="book-actions">{isMyLoan
                    ? <button className="book-action return-action" type="button" onClick={() => returnBook(book.id)}>Devolver livro</button>
                    : canBorrow
                      ? <button className="book-action" type="button" onClick={() => loanBook(book.id)}>Alugar por 15 dias</button>
                      : waitPosition >= 0
                        ? <span className="queue-position">Na fila: {waitPosition + 1}º lugar</span>
                        : <button className="book-action wait-action" type="button" onClick={() => joinWaitlist(book.id)}>Entrar na fila</button>}
                  </div>
                  <button className={alreadyRead ? 'read-book-button is-read' : 'read-book-button'} type="button" onClick={() => markBookAsRead(book.id)}>{alreadyRead ? '✓ Já li este livro' : 'Marcar como lido'}</button>
                </div>
              </article>;
            })}</div>
            {!matchingBooks.length && <p className="catalog-empty">Nenhum livro corresponde à pesquisa.</p>}
          </div>
          <footer className="workspace-footer"><span>✳ &nbsp; Refúgio Literário — biblioteca em ordem.</span><span>Empréstimos guardados neste dispositivo.</span></footer>
        </div>
      </section>}
      {currentUser && <>
        <section className="catalog-section read-books-section" aria-labelledby="read-books-title">
          <div className="catalog-heading"><div><span className="section-kicker">SUA ESTANTE</span><h2 id="read-books-title">Livros já lidos <span className="count">{readBooks.length}</span></h2></div><p>Seu histórico pessoal de leitura</p></div>
          {readBooks.length ? <div className="read-books-grid">{readBooks.map((book) => <article className="read-book-card" key={book.id}>
            <span className="book-cover">✓</span><div><h3>{book.title}</h3><p>{book.author} · {book.year}</p></div>
            <button className="read-remove-button" type="button" onClick={() => markBookAsRead(book.id)} aria-label={`Remover ${book.title} dos livros lidos`}>Remover</button>
          </article>)}</div> : <div className="read-books-empty"><span className="empty-icon">▤</span><h3>Nenhum livro marcado como lido</h3><p>Quando terminar uma leitura, marque o livro no resultado da pesquisa para adicioná-lo aqui.</p></div>}
        </section>
      </>}
      <section className="about-project" id="sobre-projeto" aria-labelledby="about-project-title">
        <div className="team-section-heading">
          <div><span className="section-kicker">REFÚGIO LITERÁRIO</span><h2 id="about-project-title">Uma biblioteca mais simples de organizar e aproveitar</h2></div>
          <p>Projeto escolar criado para aproximar os estudantes dos livros e apoiar a rotina da biblioteca.</p>
        </div>
        <div className="team-highlight-grid">
          {projectHighlights.map((item) => <article className="team-highlight" key={item.number}>
            <span>{item.number}</span><h3>{item.title}</h3><p>{item.description}</p>
          </article>)}
        </div>
        <section className="team-members-section" aria-labelledby="team-members-title">
          <div className="team-section-heading">
            <div><span className="section-kicker">QUEM CRIOU</span><h2 id="team-members-title">Nossa equipe</h2></div>
            <p>Estudantes responsáveis pelo desenvolvimento do projeto.</p>
          </div>
          <div className="team-members-grid">
            {teamMembers.map((name, index) => <article className="team-member-card" key={name}>
              <span className="team-members-icon" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{name}</h3><p>Equipe de desenvolvimento</p>
            </article>)}
          </div>
        </section>
        <footer className="about-project-footer"><span>Refúgio Literário — Gestão de Biblioteca Escolar</span><span>Feito para a comunidade escolar</span></footer>
      </section>
      <div className="page-note"><span>FEITO PARA A ROTINA DA BIBLIOTECA</span><span>01 — 01</span></div>
    </main>
  );
}



