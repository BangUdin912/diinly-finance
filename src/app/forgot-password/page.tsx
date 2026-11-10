'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
export default function ForgotPassword() { const [email, setEmail] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState(''); async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setError(''); setMessage(''); const { error } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/reset-password` }); if (error) setError(error.message); else setMessage('Jika email terdaftar, tautan untuk mengatur ulang password akan dikirim. Periksa inbox dan folder spam.'); setBusy(false) } return <main className="auth-shell"><section className="auth-art"><div className="brand side-brand">
  <img
    src="/images//logo/logo-diinly.png"
    alt="DiinLy Finance"
    className="brand-logo"
  />
</div><div className="art-copy"><span className="eyebrow">ACCOUNT RECOVERY</span><h1>Pulihkan akses akunmu.</h1><p>Kami akan mengirimkan tautan aman untuk membuat password baru.</p></div><div className="art-foot">© 2026 DiinLy Finance</div></section><section className="auth-panel"><div className="auth-card"><span className="eyebrow">LUPA PASSWORD</span><h2>Atur ulang password</h2><p className="muted">Masukkan email yang kamu gunakan untuk masuk.</p><form className="auth-form" onSubmit={submit}><label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" placeholder="nama@email.com" /></label>{error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}<button className="primary-btn" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim tautan reset'} <span>→</span></button></form><div className="auth-switch"><Link href="/login">← Kembali ke login</Link></div></div></section></main> }
