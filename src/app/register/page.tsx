import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import logoDiinly from "@/images/logo/logo diinly.png";
export default function Register(){return <main className="auth-shell"><section className="auth-art"><div className="brand side-brand">
  <img
    src={logoDiinly.src}
    alt="DiinLy Finance"
    className="brand-logo"
  />
</div><div className="art-copy"><span className="eyebrow">START YOUR FINANCIAL JOURNEY</span><h1>Mulai kelola uang dengan <em>lebih percaya diri.</em></h1><p>Buat akun pribadi dan nikmati ruang keuangan yang aman, rapi, dan mudah dipahami.</p></div><div className="art-foot">© 2026 DiinLy Finance</div></section><section className="auth-panel"><div className="auth-card"><div className="mobile-brand">DiinLy <b>Finance</b></div><span className="eyebrow">CREATE ACCOUNT</span><h2>Buat akun baru</h2><p className="muted">Hanya perlu beberapa detail untuk memulai.</p><AuthForm mode="register"/><div className="auth-switch">Sudah punya akun? <Link href="/login">Masuk</Link></div><div className="secure-note">⌁ Akun dan data keuangan terpisah untuk setiap pengguna.</div></div></section></main>}
