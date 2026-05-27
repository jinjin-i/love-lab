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

            {/* 후기 섹션 */}
      <div style={{ padding: '2rem 1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', textAlign: 'center', marginBottom: '1.25rem' }}>✦ 분석 후기</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { emoji: '🪞', type: '애착유형 진단', name: '지은님', date: '5일 전', text: '불안형이라는 걸 알고는 있었는데 이렇게 정확하게 짚어줄 줄은 몰랐어요. 왜 항상 연락을 확인하게 되는지 이유를 알 것 같아서 눈물이 났어요.' },
            { emoji: '🔮', type: '전 애인 관계 분석', name: '수연님', date: '2일 전', text: '전 애인이 회피-냉각형이라고 딱 정의해주는데 소름돋았어요. 내가 왜 그 사람한테 집착했는지 이제야 이해가 돼요.' },
            { emoji: '🔁', type: '반복 연애 패턴', name: '하린님', date: '1주 전', text: '항상 차가운 사람한테 끌리는 이유를 드디어 알았어요. 구조자 패턴이래요. 읽으면서 내 얘기 같아서 캡처해서 친구한테 보냈어요 ㅋㅋ' },
            { emoji: '⚖️', type: '이상형 궁합 분석', name: '민서님', date: '3일 전', text: '이상형이랑 나랑 실제로 잘 맞는지 현실적으로 분석해줘서 좋았어요. 막연하게 생각했던 걸 정리해주는 느낌?' },
          ].map((r, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{r.emoji}</span>
                <span style={{ fontSize: 11, color: 'rgba(201,168,76,0.7)', fontWeight: 500 }}>{r.type}</span>
                <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'rgba(240,234,216,0.25)' }}>{r.date}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(240,234,216,0.65)', lineHeight: 1.7, fontWeight: 300, marginBottom: 8 }}>"{r.text}"</p>
              <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.3)' }}>— {r.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '1.5rem 1.75rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(240,234,216,0.25)', lineHeight: 1.8, fontWeight: 300 }}>
          심리학 기반 분석 · 결과는 전문 상담을 대체하지 않습니다
        </p>
      </div>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
