// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '전 애인이 왜 그랬는지 알고 싶어?',
  description: '나의 연애 패턴, 애착유형, 전 애인까지 — 심리학으로 읽어드립니다',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QSD55G4YTN"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QSD55G4YTN');
        `}} />
      </head>
      <body>
        <div className="app">
          {children}
        </div>
      </body>
    </html>
  )
}
