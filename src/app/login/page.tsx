import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';
import logoDiinly from "@/images/logo/logo diinly.png";
export default function Login(){return <main className="auth-shell"><section className="auth-art">
    <div className="brand side-brand">
  <img
    src={logoDiinly.src}
    alt="DiinLy Finance"
    className="brand-logo"
  />
</div><div className="art-copy"><span className="eyebrow">YOUR MONEY, YOUR DIRECTION</span><h1>Keuangan lebih tertata. <em>Masa depan lebih terencana.</em></h1><p>Satu ruang untuk memahami arus uang, membangun kebiasaan baik, dan mencapai tujuan finansial.</p><div className="art-stats"><div><strong>01</strong><small>Kelola transaksi</small></div><div><strong>02</strong><small>Atur anggaran</small></div><div><strong>03</strong><small>Capai tujuan</small></div></div></div><div className="art-foot">© 2026 DiinLy Finance</div></section><section className="auth-panel"><div className="auth-card"><div className="mobile-brand">DiinLy <b>Finance</b></div><span className="eyebrow">WELCOME BACK</span><h2>Selamat datang kembali</h2><p className="muted">Masuk untuk melanjutkan perjalanan finansialmu.</p><AuthForm mode="login"/><div className="auth-switch">Belum punya akun? <Link href="/register">Buat akun gratis</Link></div><div className="secure-note">⌁ Data keuanganmu dilindungi dengan aman.</div></div></section></main>}
