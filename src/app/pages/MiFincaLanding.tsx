import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

export function MiFincaLanding() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.odisea-reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });

    return () => {
      io.disconnect();
    };
  }, []);

  const handleCopy = () => {
    const text = '+57 301 530 3014';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="landing-odisea-root">
      <style>{`
        .landing-odisea-root {
          --crema: #F6F2EC;
          --arena: #DAD6CF;
          --niebla: #E3E5E8;
          --salvia: #CCD1C7;
          --terracota: #BD4A1F;
          --berenjena: #4A2E3D;
          --verde: #2D3E33;
          --mostaza: #E5A84B;
          --noche: #1B263B;
          --f-display: 'Anton', 'Archivo Black', Impact, sans-serif;
          --f-body: 'Open Sans', Inter, system-ui, sans-serif;
          --wrap: 680px;
          background: var(--crema);
          color: var(--verde);
          font-family: var(--f-body);
          font-size: 17px;
          line-height: 1.65;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .landing-odisea-root * {
          box-sizing: border-box;
        }

        .landing-odisea-root h1,
        .landing-odisea-root h2,
        .landing-odisea-root h3 {
          font-family: var(--f-display);
          text-transform: uppercase;
          line-height: 1.06;
          letter-spacing: .004em;
          font-weight: 400;
          text-wrap: balance;
          margin: 0;
        }

        .landing-odisea-root p { margin: 0; }
        .landing-odisea-root ul { margin: 0; padding: 0; list-style: none; }

        @media (prefers-reduced-motion: no-preference) {
          .odisea-reveal {
            opacity: 0;
            transform: translateY(22px);
            transition: opacity .7s cubic-bezier(.22, 1, .36, 1), transform .7s cubic-bezier(.22, 1, .36, 1);
          }
          .odisea-reveal.in {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .landing-odisea-root .side {
          padding-inline: max(20px, env(safe-area-inset-left, 0px));
          padding-inline-end: max(20px, env(safe-area-inset-right, 0px));
        }
        .landing-odisea-root .wrap {
          max-width: var(--wrap);
          margin-inline: auto;
        }
        .landing-odisea-root .section {
          padding-block: clamp(56px, 10vw, 96px);
          position: relative;
          overflow: hidden;
        }

        .landing-odisea-root .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--f-body);
          font-weight: 800;
          font-size: 12.5px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--terracota);
          margin-bottom: 18px;
        }
        .landing-odisea-root .eyebrow::before {
          content: '';
          width: 26px;
          height: 3px;
          border-radius: 2px;
          background: currentColor;
          flex: none;
        }
        .landing-odisea-root .on-dark .eyebrow { color: var(--mostaza); }

        .landing-odisea-root .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-family: var(--f-body);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .03em;
          font-size: 15px;
          padding: 17px 28px;
          border-radius: 999px;
          border: 2px solid transparent;
          cursor: pointer;
          text-decoration: none;
          min-height: 52px;
          transition: transform .25s cubic-bezier(.22, 1, .36, 1), background .25s, color .25s, border-color .25s;
        }
        .landing-odisea-root .btn:hover { transform: translateY(-2px); }
        .landing-odisea-root .btn:active { transform: translateY(0); }
        .landing-odisea-root .btn-primary { background: var(--terracota); color: var(--crema); }
        .landing-odisea-root .btn-primary:hover { background: #a53e19; }
        .landing-odisea-root .btn-ghost { background: transparent; border-color: currentColor; color: inherit; }
        .landing-odisea-root .btn-ghost.on-dark { color: var(--crema); }

        /* Header */
        .landing-odisea-root header {
          position: sticky;
          top: env(safe-area-inset-top, 0px);
          z-index: 40;
          background: rgba(246, 242, 236, .88);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(45, 62, 51, .1);
        }
        .landing-odisea-root .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-block: 14px;
        }
        .landing-odisea-root .brandmark {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
        }
        .landing-odisea-root .brandmark img {
          height: 19px;
          width: auto;
          display: block;
          opacity: .85;
        }
        .landing-odisea-root .brandmark .name {
          font-family: var(--f-display);
          font-size: 20px;
          letter-spacing: .01em;
          text-transform: uppercase;
          color: var(--verde);
          line-height: 1;
          white-space: nowrap;
        }
        .landing-odisea-root .brandmark .divider {
          width: 1px;
          height: 22px;
          background: currentColor;
          opacity: .25;
          flex: none;
        }
        .landing-odisea-root .header-row .btn {
          padding: 11px 18px;
          font-size: 12.5px;
          min-height: 40px;
        }

        /* Hero */
        .landing-odisea-root .hero { padding-top: clamp(44px, 9vw, 76px); }
        .landing-odisea-root .hero-inner { position: relative; z-index: 1; }
        .landing-odisea-root .hero h1 {
          font-size: clamp(2.3rem, 8.6vw, 3.7rem);
          color: var(--verde);
          max-width: 11ch;
        }
        .landing-odisea-root .hero p.lead {
          font-size: clamp(17px, 2.6vw, 19px);
          color: var(--noche);
          max-width: 46ch;
          margin-top: 22px;
        }
        .landing-odisea-root .hero .ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 32px;
        }
        .landing-odisea-root .hero .note {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 22px;
          font-size: 14px;
          font-weight: 700;
          color: var(--verde);
        }
        .landing-odisea-root .hero .note .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--terracota);
          flex: none;
        }

        .landing-odisea-root .scene {
          margin-top: 40px;
          border-radius: 26px;
          overflow: hidden;
          aspect-ratio: 16/10;
          box-shadow: 0 30px 60px -30px rgba(27, 38, 59, .35);
        }
        .landing-odisea-root .scene img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }
        .landing-odisea-root .scene-caption {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--noche);
          opacity: .7;
        }
        .landing-odisea-root .scene-caption::before {
          content: '';
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: var(--terracota);
          flex: none;
        }

        .landing-odisea-root .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(45, 62, 51, .16);
        }
        .landing-odisea-root .stat b {
          display: block;
          font-family: var(--f-display);
          font-size: clamp(1.8rem, 6vw, 2.6rem);
          color: var(--berenjena);
          font-variant-numeric: tabular-nums;
        }
        .landing-odisea-root .stat span {
          display: block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--noche);
          margin-top: 6px;
          line-height: 1.3;
        }

        /* Antes / Despues */
        .landing-odisea-root .on-light-alt { background: var(--niebla); color: var(--noche); }
        .landing-odisea-root .compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 36px;
        }
        @media (max-width: 620px) {
          .landing-odisea-root .compare { grid-template-columns: 1fr; }
        }
        .landing-odisea-root .compare .card {
          background: var(--crema);
          border-radius: 22px;
          padding: 28px 26px;
          box-shadow: 0 24px 50px -30px rgba(27, 38, 59, .3);
        }
        .landing-odisea-root .compare .card.now { background: var(--verde); color: var(--crema); }
        .landing-odisea-root .compare h3 {
          font-size: 13px;
          letter-spacing: .1em;
          font-family: var(--f-body);
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 18px;
          color: var(--terracota);
        }
        .landing-odisea-root .compare .card.now h3 { color: var(--mostaza); }
        .landing-odisea-root .compare li {
          display: flex;
          gap: 12px;
          padding-block: 10px;
          font-size: 15.5px;
          border-top: 1px solid rgba(45, 62, 51, .12);
        }
        .landing-odisea-root .compare li:first-child { border-top: none; }
        .landing-odisea-root .compare .card.now li { border-top-color: rgba(246, 242, 236, .16); }
        .landing-odisea-root .compare li .mark {
          flex: none;
          font-family: var(--f-display);
          font-size: 14px;
          line-height: 1.5;
          color: var(--noche);
          opacity: .4;
        }
        .landing-odisea-root .compare .card.now li .mark { color: var(--mostaza); opacity: 1; }

        /* Como funciona */
        .landing-odisea-root .on-verde { background: var(--verde); color: var(--crema); }
        .landing-odisea-root .on-verde h2 { color: var(--crema); }
        .landing-odisea-root .funciona-grid {
          display: grid;
          grid-template-columns: 1fr .62fr;
          gap: 36px;
          align-items: start;
          margin-top: 40px;
        }
        @media (max-width: 860px) {
          .landing-odisea-root .funciona-grid { grid-template-columns: 1fr; }
        }
        .landing-odisea-root .funciona-photo {
          border-radius: 26px;
          overflow: hidden;
          aspect-ratio: 3/4;
          box-shadow: 0 30px 60px -28px rgba(0, 0, 0, .45);
        }
        @media (min-width: 861px) {
          .landing-odisea-root .funciona-photo {
            position: sticky;
            top: calc(env(safe-area-inset-top, 0px) + 96px);
          }
        }
        .landing-odisea-root .funciona-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .landing-odisea-root .steps { display: grid; gap: 14px; }
        .landing-odisea-root .step {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: start;
          background: rgba(246, 242, 236, .06);
          border: 1px solid rgba(246, 242, 236, .16);
          border-radius: 22px;
          padding: 24px 26px;
        }
        .landing-odisea-root .step b.num {
          font-family: var(--f-display);
          font-size: 2rem;
          color: var(--mostaza);
          line-height: 1;
        }
        .landing-odisea-root .step h3 {
          font-size: 1.05rem;
          letter-spacing: .01em;
          margin-bottom: 6px;
          color: var(--crema);
        }
        .landing-odisea-root .step p { font-size: 15px; color: var(--salvia); }

        /* Cuentas claras */
        .landing-odisea-root .feature {
          display: grid;
          grid-template-columns: 1.1fr .9fr;
          gap: 48px;
          align-items: center;
          margin-top: 40px;
        }
        @media (max-width: 760px) {
          .landing-odisea-root .feature { grid-template-columns: 1fr; gap: 36px; }
        }
        .landing-odisea-root .feature p.body {
          font-size: 17px;
          color: var(--noche);
          margin-top: 16px;
        }
        .landing-odisea-root .phone {
          background: var(--verde);
          border-radius: 30px;
          padding: 26px;
          color: var(--crema);
          box-shadow: 0 40px 70px -30px rgba(27, 38, 59, .4);
          position: relative;
          max-width: 330px;
          margin-inline: auto;
        }
        .landing-odisea-root .phone .label {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--salvia);
        }
        .landing-odisea-root .phone .amount {
          font-family: var(--f-display);
          font-size: 2.6rem;
          margin-top: 8px;
          font-variant-numeric: tabular-nums;
        }
        .landing-odisea-root .phone .row {
          display: flex;
          justify-content: space-between;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(246, 242, 236, .18);
        }
        .landing-odisea-root .phone .row div span {
          display: block;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--salvia);
        }
        .landing-odisea-root .phone .row div b {
          display: block;
          font-family: var(--f-display);
          font-size: 1.2rem;
          margin-top: 4px;
          font-variant-numeric: tabular-nums;
        }
        .landing-odisea-root .phone .tag {
          position: absolute;
          top: -14px;
          left: 26px;
          background: var(--mostaza);
          color: var(--noche);
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          padding: 7px 14px;
          border-radius: 999px;
        }

        /* CTA Final */
        .landing-odisea-root .on-terracota { background: var(--terracota); color: var(--crema); }
        .landing-odisea-root .on-terracota h2 { color: var(--crema); }
        .landing-odisea-root .on-terracota .eyebrow { color: var(--crema); opacity: .85; }
        .landing-odisea-root .cta-grid {
          display: grid;
          grid-template-columns: 1fr .62fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 820px) {
          .landing-odisea-root .cta-grid { grid-template-columns: 1fr; }
        }
        .landing-odisea-root .cta-photo {
          border-radius: 26px;
          overflow: hidden;
          aspect-ratio: 3/4;
          box-shadow: 0 30px 60px -25px rgba(27, 38, 59, .5);
          order: 2;
        }
        @media (max-width: 820px) {
          .landing-odisea-root .cta-photo {
            order: -1;
            max-width: 320px;
            margin-inline: auto;
          }
        }
        .landing-odisea-root .cta-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 15%;
          display: block;
        }
        .landing-odisea-root .cta-box p.lead {
          margin-top: 14px;
          font-size: 17px;
          max-width: 48ch;
          color: var(--crema);
          opacity: .95;
        }
        .landing-odisea-root .cta-box .ctas { margin-top: 30px; }
        .landing-odisea-root .cta-box .btn-primary { background: var(--crema); color: var(--terracota); }
        .landing-odisea-root .cta-box .btn-primary:hover { background: #fff; }
        .landing-odisea-root .whats {
          margin-top: 34px;
          background: rgba(246, 242, 236, .12);
          border-radius: 18px;
          padding: 20px 22px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 14px;
          justify-content: space-between;
        }
        .landing-odisea-root .whats p { font-size: 14.5px; }
        .landing-odisea-root .whats b {
          font-family: var(--f-display);
          font-size: 1.05rem;
          letter-spacing: .02em;
        }
        .landing-odisea-root .copybtn {
          background: transparent;
          border: 2px solid var(--crema);
          color: var(--crema);
          border-radius: 999px;
          padding: 10px 18px;
          font-weight: 800;
          font-size: 12.5px;
          text-transform: uppercase;
          letter-spacing: .04em;
          cursor: pointer;
          min-height: 44px;
          transition: background .2s, color .2s;
        }
        .landing-odisea-root .copybtn:hover {
          background: var(--crema);
          color: var(--terracota);
        }

        /* Footer */
        .landing-odisea-root footer {
          background: var(--arena);
          color: var(--verde);
          padding-block: 48px;
        }
        .landing-odisea-root .foot-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
        }
        .landing-odisea-root .signature {
          font-family: var(--f-display);
          font-size: 14px;
          letter-spacing: .02em;
          color: var(--berenjena);
          text-transform: none;
        }
        .landing-odisea-root .foot-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 14px;
          color: var(--noche);
        }
        .landing-odisea-root .legal {
          margin-top: 36px;
          padding-top: 20px;
          border-top: 1px solid rgba(45, 62, 51, .16);
          font-size: 12.5px;
          color: var(--noche);
          opacity: .75;
        }

        @media (max-width: 480px) {
          .landing-odisea-root .section { padding-block: 52px; }
          .landing-odisea-root .btn { width: 100%; justify-content: center; }
          .landing-odisea-root .hero .ctas .btn { width: auto; }
        }
      `}</style>

      {/* HEADER */}
      <header>
        <div className="side">
          <div className="wrap header-row">
            <Link to="/" className="brandmark">
              <img src="/landing-images/logo-odisea.png" alt="Odisea Café" />
              <span className="divider"></span>
              <span className="name">Mi Finca</span>
            </Link>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Link className="btn btn-ghost" to="/explorar" style={{ border: 'none' }}>
                Explorar mapa
              </Link>
              <Link className="btn btn-primary" to="/auth/login">
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="section hero">
          <div className="side">
            <div className="wrap hero-inner">
              <p className="eyebrow">Portal del productor</p>
              <h1>La plata de tu café, clara en el celular</h1>
              <p className="lead">
                Entra con tu celular o tu correo, el que tengas más a la mano. Registra tu finca, anota tu cosecha y mira cuánto te queda: lo del café y lo de la casa.
              </p>
              <div className="ctas">
                <Link className="btn btn-primary" to="/auth/register">
                  Registrar mi finca →
                </Link>
                <a className="btn btn-ghost" href="#como-funciona">
                  Ver cómo funciona ↓
                </a>
              </div>
              <p className="note">
                <span className="dot"></span> Así no haya señal, lo que anotas queda guardado en tu celular.
              </p>

              <div className="scene">
                <img
                  src="/landing-images/hero-productora.webp"
                  alt="Productora revisando el cultivo de café en su finca, celular en mano."
                />
              </div>
              <p className="scene-caption">Tu finca, en tu celular</p>

              <div className="stats">
                <div className="stat">
                  <b>+20</b>
                  <span>Familias cafeteras</span>
                </div>
                <div className="stat">
                  <b>3</b>
                  <span>Departamentos</span>
                </div>
                <div className="stat">
                  <b>60%</b>
                  <span>Liderado por mujeres</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ANTES / DESPUES */}
        <section className="section on-light-alt">
          <div className="side">
            <div className="wrap">
              <p className="eyebrow odisea-reveal">Lo que nos contaron en el campo</p>
              <h2 className="odisea-reveal" style={{ fontSize: 'clamp(1.6rem,6vw,2.3rem)', color: 'var(--berenjena)' }}>
                Antes y ahora
              </h2>

              <div className="compare">
                <div className="card odisea-reveal">
                  <h3>Antes</h3>
                  <ul>
                    <li><span className="mark">—</span> Las cuentas las llevaba en la cabeza, cuando mucho.</li>
                    <li><span className="mark">—</span> Si no había señal, tocaba esperar para anotar algo.</li>
                    <li><span className="mark">—</span> Las apps pedían correo, y uno no siempre tiene.</li>
                    <li><span className="mark">—</span> Al final del mes nunca sabía bien qué le había quedado.</li>
                  </ul>
                </div>
                <div className="card now odisea-reveal">
                  <h3>Con Mi Finca Odisea</h3>
                  <ul>
                    <li><span className="mark">✓</span> Anotas la venta o el gasto apenas pasa.</li>
                    <li><span className="mark">✓</span> No importa si hay señal: se guarda y sincroniza después.</li>
                    <li><span className="mark">✓</span> Entras con tu celular o tu correo, como prefieras.</li>
                    <li><span className="mark">✓</span> Ves clarito cuánto te quedó, del café y de la casa.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="section on-verde" id="como-funciona">
          <div className="side">
            <div className="wrap">
              <p className="eyebrow odisea-reveal">Cómo funciona</p>
              <h2 className="odisea-reveal" style={{ fontSize: 'clamp(1.6rem,6vw,2.3rem)' }}>
                Paso a paso, a tu ritmo
              </h2>

              <div className="funciona-grid">
                <div className="steps">
                  <div className="step odisea-reveal">
                    <b className="num">01</b>
                    <div>
                      <h3>Te registras</h3>
                      <p>Con tu celular o tu correo, lo que tengas más a la mano, y una contraseña.</p>
                    </div>
                  </div>
                  <div className="step odisea-reveal">
                    <b className="num">02</b>
                    <div>
                      <h3>Marcas tu finca</h3>
                      <p>Te paras en tu lote para capturar la ubicación. Funciona sin señal.</p>
                    </div>
                  </div>
                  <div className="step odisea-reveal">
                    <b className="num">03</b>
                    <div>
                      <h3>Anotas tu cosecha</h3>
                      <p>De cereza a seco a verde, vas registrando cada etapa cuando puedes.</p>
                    </div>
                  </div>
                  <div className="step odisea-reveal">
                    <b className="num">04</b>
                    <div>
                      <h3>Llevas tus cuentas</h3>
                      <p>Lo del café y lo de la casa, cada cosa por su lado.</p>
                    </div>
                  </div>
                  <div className="step odisea-reveal">
                    <b className="num">05</b>
                    <div>
                      <h3>Revisas cómo vas</h3>
                      <p>Entras cuando quieras y ves tu plata: lo que entró, lo que salió y lo que te queda.</p>
                    </div>
                  </div>
                </div>
                <div className="funciona-photo odisea-reveal">
                  <img src="/landing-images/paso-a-paso.jpg" alt="Productor recolectando café cereza a mano en su finca." />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CUENTAS CLARAS */}
        <section className="section">
          <div className="side">
            <div className="wrap">
              <div className="feature">
                <div className="odisea-reveal">
                  <p className="eyebrow">Lo que más ha llamado la atención y te puede interesar</p>
                  <h2 style={{ fontSize: 'clamp(1.6rem,6vw,2.3rem)', color: 'var(--verde)' }}>
                    Dos bolsillos, una sola verdad
                  </h2>
                  <p className="body">
                    El café y la casa casi siempre salen del mismo bolsillo, pero son cuentas distintas. Aquí las separas tú, y si quieres, ves el total junto. Así sabes, por primera vez, cuánto te queda de verdad.
                  </p>
                </div>
                <div className="odisea-reveal">
                  <div className="phone">
                    <span className="tag">Cosecha 2026</span>
                    <p className="label">Ganancia del café</p>
                    <p className="amount">.700.000</p>
                    <div className="row">
                      <div><span>Ha entrado</span><b>.500.000</b></div>
                      <div><span>Ha salido</span><b>.000</b></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="section on-terracota" id="empezar">
          <div className="side">
            <div className="wrap">
              <div className="cta-grid">
                <div className="cta-box">
                  <p className="eyebrow odisea-reveal">Empieza hoy</p>
                  <h2 className="odisea-reveal" style={{ fontSize: 'clamp(1.8rem,7vw,2.8rem)' }}>
                    Cuando quieras, empezamos
                  </h2>
                  <p className="lead odisea-reveal">
                    Registrarte no toma ni un minuto. Necesitas tu celular o tu correo, nada más.
                  </p>
                  <div className="ctas odisea-reveal">
                    <Link className="btn btn-primary" to="/auth/register">
                      Registrar mi finca →
                    </Link>
                  </div>

                  <div className="whats odisea-reveal">
                    <p>
                      ¿Prefieres que te ayudemos a entrar?<br />
                      <b id="wa-number">+57 301 530 3014</b>
                    </p>
                    <button className="copybtn" type="button" onClick={handleCopy}>
                      {copied ? '¡Copiado!' : 'Copiar número'}
                    </button>
                  </div>
                </div>
                <div className="cta-photo odisea-reveal">
                  <img
                    src="/landing-images/empieza-hoy.jpg"
                    alt="Productora de Odisea Café sonriendo con una cosecha de café recién recolectada."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="side">
          <div className="wrap">
            <div className="foot-row">
              <div className="brandmark">
                <img src="/landing-images/logo-odisea.png" alt="Odisea Café" />
                <span className="divider"></span>
                <span className="name">Mi Finca</span>
              </div>
              <p className="signature">Historias que se cultivan · Colombia</p>
              <div className="foot-links">
                <span>info@odiseacoffee.co</span>
                <span>linkedin.com/company/odiseacoffee</span>
              </div>
            </div>
            <p className="legal">
              Diseñado y desarrollado por <a href="https://datadive.tech/" target="_blank" rel="noopener noreferrer">DataDive.tech</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
