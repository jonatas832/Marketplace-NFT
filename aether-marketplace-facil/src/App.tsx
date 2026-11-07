/** @jsxRuntime classic */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import * as React from "react";
import { useEffect, useMemo, useState } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elementName: string]: any;
    }
  }
}

type NFT = { id: number; name: string; artist: string; category: string; price: number; image: string; edition: number };
type CartItem = { nft: NFT; qty: number };

const initialNFTs: NFT[] = [
  { id: 1, name: "Neon Dreams", artist: "Luna Studio", category: "Arte", price: 1.25, image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=85", edition: 12 },
  { id: 2, name: "Cosmic Guardian", artist: "Artemis", category: "Fantasia", price: 2.4, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=85", edition: 5 },
  { id: 3, name: "Digital Ocean", artist: "Kai", category: "Arte", price: 0.85, image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&w=900&q=85", edition: 30 },
  { id: 4, name: "Ancient Portal", artist: "Mira", category: "Fantasia", price: 3.1, image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=900&q=85", edition: 3 },
  { id: 5, name: "Chromatic City", artist: "Noah X", category: "Futurista", price: 1.7, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=85", edition: 18 },
  { id: 6, name: "Astral Bloom", artist: "Luna Studio", category: "Arte", price: 0.65, image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=900&q=85", edition: 24 }
];
const money = (n: number) => `${n.toFixed(2)} ETH`;
const read = <T,>(key: string, fallback: T): T => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
};

export default function App() {
  const [nfts] = useState(initialNFTs);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("featured");
  const [favorites, setFavorites] = useState<number[]>(() => read("aether-favs", []));
  const [cart, setCart] = useState<CartItem[]>(() => read("aether-cart", []));
  const [page, setPage] = useState<"home" | "cart" | "login" | "checkout" | "success">("home");
  const [user, setUser] = useState<string>(() => read("aether-user", ""));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [message, setMessage] = useState("");
  const [orderCode, setOrderCode] = useState("");

  useEffect(() => { localStorage.setItem("aether-favs", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("aether-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("aether-user", JSON.stringify(user)); }, [user]);

  const shown = useMemo(() => {
    let result = nfts.filter(n => (category === "Todos" || n.category === category) &&
      `${n.name} ${n.artist}`.toLowerCase().includes(search.toLowerCase()));
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [nfts, category, search, sort]);

  const subtotal = cart.reduce((sum, item) => sum + item.nft.price * item.qty, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  const add = (nft: NFT) => {
    setCart(old => old.some(i => i.nft.id === nft.id)
      ? old.map(i => i.nft.id === nft.id ? { ...i, qty: Math.min(i.qty + 1, nft.edition) } : i)
      : [...old, { nft, qty: 1 }]);
    setMessage(`${nft.name} adicionado ao carrinho.`);
    setTimeout(() => setMessage(""), 2500);
  };
  const updateQty = (id: number, qty: number) => setCart(old => old.map(i => i.nft.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.nft.edition)) } : i));
  const toggleFav = (id: number) => setFavorites((old: number[]) => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const login = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 4) { setMessage("Informe um e-mail válido e senha com pelo menos 4 caracteres."); return; }
    setUser(email); setPage("home"); setMessage("Login demonstrativo realizado!"); setTimeout(() => setMessage(""), 2500);
  };
  const checkout = () => {
    if (!user) { setPage("login"); setMessage("Entre na sua conta para continuar."); return; }
    if (!cart.length) return;
    setOrderCode(`AET-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setCart([]); setCouponApplied(false); setPage("success");
  };

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setPage("home")}><span className="brand-mark">✦</span><span>AETHER<small>NFT MARKETPLACE</small></span></button>
      <nav><button onClick={() => setPage("home")}>Explorar</button><a href="#collections">Coleções</a></nav>
      <div className="header-actions">
        <button className="icon-btn" title="Favoritos" onClick={() => { setCategory("Todos"); setSearch(""); setMessage(`Você tem ${favorites.length} favorito(s).`); }}>♡</button>
        <button className="cart-btn" onClick={() => setPage("cart")}>Sacola <b>{cart.reduce((s: number, i: CartItem) => s + i.qty, 0)}</b></button>
        {user ? <button className="user-btn" onClick={() => { setUser(""); setMessage("Você saiu da conta."); }}> {user.split("@")[0]} · Sair</button> : <button className="login-btn" onClick={() => setPage("login")}>Entrar</button>}
      </div>
    </header>

    {message && <div className="toast" role="status">{message}</div>}

    {page === "home" && <>
      <main>
        <section className="hero">
          <div className="hero-copy"><span className="eyebrow">✦ O FUTURO DA ARTE DIGITAL</span><h1>Descubra arte.<br /><em>Possua o extraordinário.</em></h1><p>Explore peças digitais únicas criadas por artistas independentes e encontre seu próximo colecionável.</p><button className="primary-btn" onClick={() => document.getElementById("market")?.scrollIntoView({ behavior: "smooth" })}>Explorar marketplace <span>↗</span></button>
            <div className="stats"><div><strong>12K+</strong><small>Obras criadas</small></div><div><strong>4.8K</strong><small>Colecionadores</small></div><div><strong>85 ETH</strong><small>Volume negociado</small></div></div>
          </div>
          <div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><img src={nfts[1].image} alt="Arte digital em destaque" /><div className="floating-card"><span>EM DESTAQUE</span><b>Cosmic Guardian</b><small>Por Artemis</small><strong>2.40 ETH</strong></div></div>
        </section>
        <section className="market-section" id="market">
          <div className="section-heading"><div><span className="eyebrow">DESCUBRA SUA PRÓXIMA PEÇA</span><h2>Marketplace <span>em destaque</span></h2></div><span className="result-count">{shown.length} obras encontradas</span></div>
          <div className="toolbar"><div className="search-box"><span>⌕</span><input value={search} onChange={(e: { target: { value: string } }) => setSearch(e.target.value)} placeholder="Buscar por obra ou artista..." /></div><div className="filters">{["Todos", "Arte", "Fantasia", "Futurista"].map(c => <button key={c} className={category === c ? "active" : ""} onClick={() => setCategory(c)}>{c}</button>)}</div><select value={sort} onChange={(e: { target: { value: string } }) => setSort(e.target.value)} aria-label="Ordenar por"><option value="featured">Em destaque</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></div>
          <div className="nft-grid">{shown.map((nft: NFT) => <article className="nft-card" key={nft.id}><div className="nft-image"><img src={nft.image} alt={nft.name} /><button className={`favorite ${favorites.includes(nft.id) ? "selected" : ""}`} onClick={() => toggleFav(nft.id)} aria-label="Favoritar">{favorites.includes(nft.id) ? "♥" : "♡"}</button><span className="edition">{nft.edition} edições</span></div><div className="nft-info"><div className="nft-title"><div><h3>{nft.name}</h3><p>por {nft.artist}</p></div><span className="category-tag">{nft.category}</span></div><div className="nft-bottom"><div><small>PREÇO ATUAL</small><strong>{money(nft.price)}</strong></div><button onClick={() => add(nft)}>Adicionar <span>+</span></button></div></div></article>)}</div>
          {!shown.length && <div className="empty"><span>⌕</span><h3>Nenhuma obra encontrada</h3><p>Tente mudar a busca ou selecionar outra categoria.</p></div>}
        </section>
        <section className="collection-strip" id="collections"><div><span className="eyebrow">COLECIONE O QUE TE INSPIRA</span><h2>Arte sem limites.<br /><em>Possibilidades infinitas.</em></h2></div><p>Uma comunidade para descobrir, apoiar e colecionar criatividade em sua forma mais livre.</p></section>
      </main>
    </>}

    {page === "cart" && <main className="subpage"><button className="back" onClick={() => setPage("home")}>← Continuar explorando</button><span className="eyebrow">SEUS ITENS SELECIONADOS</span><h1>Seu carrinho</h1>{!cart.length ? <div className="empty"><span>◇</span><h3>Sua sacola está vazia</h3><p>Explore o marketplace e adicione suas obras favoritas.</p><button className="primary-btn" onClick={() => setPage("home")}>Explorar NFTs</button></div> : <div className="cart-layout"><div className="cart-items">{cart.map((item: CartItem) => <article className="cart-item" key={item.nft.id}><img src={item.nft.image} alt={item.nft.name} /><div className="cart-item-info"><h3>{item.nft.name}</h3><p>{item.nft.artist}</p><strong>{money(item.nft.price)}</strong><div className="qty"><button onClick={() => updateQty(item.nft.id, item.qty - 1)}>−</button><span>{item.qty}</span><button onClick={() => updateQty(item.nft.id, item.qty + 1)}>+</button><button className="remove" onClick={() => setCart((old: CartItem[]) => old.filter((i: CartItem) => i.nft.id !== item.nft.id))}>Remover</button></div></div><b>{money(item.nft.price * item.qty)}</b></article>)}</div><aside className="summary"><h2>Resumo do pedido</h2><div className="coupon"><input value={coupon} onChange={(e: { target: { value: string } }) => setCoupon(e.target.value)} placeholder="Código do cupom" /><button onClick={() => { if (coupon.trim().toUpperCase() === "AETHER10") { setCouponApplied(true); setMessage("Cupom de 10% aplicado!"); } else { setCouponApplied(false); setMessage("Cupom inválido."); } }}>Aplicar</button></div><div className="summary-line"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="summary-line"><span>Desconto</span><b>{money(discount)}</b></div><div className="summary-line"><span>Taxa de rede (simulada)</span><b>0.02 ETH</b></div><div className="summary-total"><span>Total estimado</span><strong>{money(total + 0.02)}</strong></div><button className="primary-btn full" onClick={() => setPage(user ? "checkout" : "login")}>Ir para pagamento</button><small className="secure">◈ Pagamento demonstrativo e seguro</small></aside></div>}</main>}

    {page === "login" && <main className="subpage narrow"><button className="back" onClick={() => setPage("home")}>← Voltar</button><div className="auth-card"><span className="brand-mark">✦</span><span className="eyebrow">BEM-VINDO À AETHER</span><h1>Acesse sua conta</h1><p>Entre para continuar sua jornada como colecionador.</p><label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" /></label><label>Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo de 4 caracteres" /></label><button className="primary-btn full" onClick={login}>Entrar na plataforma</button><small>Conta demonstrativa: use qualquer e-mail válido e senha com 4 ou mais caracteres.</small></div></main>}

    {page === "checkout" && <main className="subpage narrow"><button className="back" onClick={() => setPage("cart")}>← Voltar ao carrinho</button><div className="auth-card"><span className="eyebrow">FINALIZAÇÃO</span><h1>Confirmar compra</h1><p>Conta: {user}</p><div className="summary-line"><span>Itens</span><b>{cart.reduce((s: number, i: CartItem) => s + i.qty, 0)}</b></div><div className="summary-line"><span>Total estimado</span><strong>{money(total + 0.02)}</strong></div><p className="notice">Esta é uma simulação local. Nenhuma carteira ou criptomoeda real será utilizada.</p><button className="primary-btn full" onClick={checkout}>Confirmar pedido</button></div></main>}

    {page === "success" && <main className="subpage narrow"><div className="success-card"><div className="success-icon">✓</div><span className="eyebrow">PEDIDO REGISTRADO</span><h1>Parabéns pela aquisição!</h1><p>Sua compra demonstrativa foi concluída.</p><div className="order-code"><small>IDENTIFICADOR DO PEDIDO</small><strong>{orderCode}</strong></div><button className="primary-btn full" onClick={() => setPage("home")}>Voltar ao marketplace</button></div></main>}

    <footer><div className="footer-brand"><span className="brand-mark">✦</span><b>AETHER</b></div><p>O extraordinário da arte digital, em um só lugar.</p><small>© 2026 Aether Marketplace · Projeto demonstrativo</small></footer>
  </div>;
}