'use client';
import Link from 'next/link';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@/lib/supabase/client';
import logoDiinly from "@/images/logo/logo diinly.png";
export default function ResetPassword(){const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const [error,setError]=useState('');const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const router=useRouter();async function submit(e:React.FormEvent){e.preventDefault();setError('');setMessage('');if(password.length<8){setError('Password minimal 8 karakter.');return}if(password!==confirm){setError('Konfirmasi password tidak sama.');return}setBusy(true);const {error}=await createClient().auth.updateUser({password});if(error)setError(error.message);else{setMessage('Password berhasil diperbarui. Silakan masuk kembali.');setTimeout(()=>router.push('/login'),1400)}setBusy(false)}return <main className="auth-shell"><section className="auth-art"><div className="brand side-brand">
  <img
    src={logoDiinly.src}
    alt="DiinLy Finance"
    className="brand-logo"
  />
</div><div className="art-copy"><span className="eyebrow">NEW PASSWORD</span><h1>Amankan kembali akunmu.</h1><p>Buat password baru yang kuat dan tidak digunakan di tempat lain.</p></div><div className="art-foot">© 2026 DiinLy Finance</div></section><section className="auth-panel"><div className="auth-card"><span className="eyebrow">PASSWORD BARU</span><h2>Buat password baru</h2><p className="muted">Masukkan password baru untuk akunmu.</p><form className="auth-form" onSubmit={submit}><label>Password baru<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required autoComplete="new-password"/></label><label>Konfirmasi password<input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} minLength={8} required autoComplete="new-password"/></label>{error&&<div className="alert error">{error}</div>}{message&&<div className="alert success">{message}</div>}<button className="primary-btn" disabled={busy}>{busy?'Menyimpan…':'Simpan password'} <span>→</span></button></form><div className="auth-switch"><Link href="/login">Kembali ke login</Link></div></div></section></main>}
