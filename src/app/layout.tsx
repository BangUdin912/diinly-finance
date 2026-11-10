import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'DiinLy Finance — Personal Finance', description: 'Kelola keuangan pribadi dengan lebih terarah.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="id"><body>{children}</body></html>; }
