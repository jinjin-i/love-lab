// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '연애심리연구소',
  description: '심리학 기반 연애 패턴 분석',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="app">
          {children}
        </div>
      </body>
    </html>
  )
}
