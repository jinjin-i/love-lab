'use client'
// app/pay/fail/page.tsx
import { useRouter } from 'next/navigation'

export default function PayFail() {
  const router = useRouter()
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 48 }}>😔</div>
      <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.3rem', fontWeight: 300 }}>결제가 취소됐어요</h2>
      <p style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', lineHeight: 1.7 }}>언제든 다시 시도할 수 있어요</p>
      <button className="btn-gold" style={{ maxWidth: 280 }} onClick={() => router.push('/pay')}>다시 결제하기</button>
      <button className="btn-ghost" style={{ maxWidth: 280 }} onClick={() => router.push('/')}>처음으로</button>
    </div>
  )
}
