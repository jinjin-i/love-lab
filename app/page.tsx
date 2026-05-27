'use client'
// app/page.tsx
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const [toast, setToast] = useState('')



  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }



  const menus = [
    { type: 'attachment', icon: '🪞', title: '애착유형 진단', sub: '회피형 · 불안형 · 안정형의 뿌리', paid: false },
    { type: 'pattern', icon: '🔁', title: '반복 연애 패턴 분석', sub: '왜 나는 항상 같은 유형을 만날까', paid: false },
    { type: 'ideal', icon: '⚖️', title: '이상형 궁합 분석', sub: '내가 원하는 사람이 나에게 맞는가', paid: false },
    { type: 'ex', icon: '🔮', title: '전 애인 관계 분석', sub: '이별의 진짜 원인과 다음 관계 통찰', paid: true },
  ]

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 28px 140px', textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: '#c9a84c', letterSpacing: 10, marginBottom: 22 }}>✦ ✦ ✦</div>
        <div style={{ border: '1px solid rgba(201,168,76,0.45)', borderRadius: 40, padding: '7px 24px', fontSize: 12.5, letterSpacing: '0.08em', color: 'rgba(240,234,216,0.7)', marginBottom: 28 }}>
          연애심리연구소
        </div>
        <h1 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '2.05rem', fontWeight: 300, lineHeight: 1.3, marginBottom: 48 }}>
          당신의 연애를<br />
          <em style={{ display: 'block', fontStyle: 'italic', color: '#c9a84c' }}>읽어드립니다</em>
        </h1>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {menus.map(m => (
            <button
              key={m.type}
              onClick={() => router.push(`/quiz/${m.type}`)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit', transition: 'background 0.18s',
                color: '#f0ead8',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{m.title}</div>
                <div style={{ fontSize: 11.5, color: 'rgba(240,234,216,0.4)', fontWeight: 300 }}>{m.sub}</div>
              </div>
              <span style={{ fontSize: 18, color: 'rgba(240,234,216,0.25)' }}>›</span>
            </button>
          ))}


        </div>
      </div>

      <div style={{ padding: '1.5rem 1.75rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ fontSize: 11, color: 'rgba(240,234,216,0.25)', lineHeight: 1.8, fontWeight: 300 }}>
          심리학 기반 분석 · 결과는 전문 상담을 대체하지 않습니다
        </p>
      </div>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
