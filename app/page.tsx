'use client'
// app/page.tsx
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [toast, setToast] = useState('')

  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url).then(() => showToast('링크가 복사됐어요! 카톡에 붙여넣기 해보세요 🔮'))
      .catch(() => showToast('복사에 실패했어요'))
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const menus = [
    { type: 'attachment', icon: '🪞', title: '애착유형 진단', sub: '회피형 · 불안형 · 안정형의 뿌리', paid: false },
    { type: 'pattern', icon: '🔁', title: '반복 연애 패턴 분석', sub: '왜 나는 항상 같은 유형을 만날까', paid: false },
    { type: 'ideal', icon: '⚖️', title: '이상형 궁합 분석', sub: '내가 원하는 사람이 나에게 맞는가', paid: false },
    { type: 'ex', icon: '🔮', title: '전 애인 관계 분석', sub: '이별의 진짜 원인과 다음 관계 통찰', paid: true },
    { type: 'crush', icon: '💌', title: '짝사랑 상대 심리 분석', sub: '그 사람 나를 좋아할까?', paid: false },
    { type: 'couple', icon: '💑', title: '커플 관계 진단', sub: '우리 관계 지금 괜찮을까?', paid: false },
    { type: 'kakao', icon: '💬', title: '카톡 대화 분석', sub: '이 사람 나를 좋아하는 걸까?', paid: false, url: '/kakao' },
  ]

  const reviews = [
    { emoji: '🪞', type: '애착유형 진단', name: '진님', date: '5일 전', text: '불안형이라는 걸 알고는 있었는데 이렇게 정확하게 짚어줄 줄은 몰랐어요. 왜 항상 연락을 확인하게 되는지 이유를 알 것 같아서 눈물이 났어요.' },
    { emoji: '🔮', type: '전 애인 관계 분석', name: '수연님', date: '2일 전', text: '전 애인이 회피-냉각형이라고 딱 정의해주는데 소름돋았어요. 내가 왜 그 사람한테 집착했는지 이제야 이해가 돼요.' },
    { emoji: '💌', type: '짝사랑 상대 심리 분석', name: '하은님', date: '3일 전', text: '그 사람이 나를 좋아하는지 너무 궁금했는데 분석 보고 용기 내서 고백했어요. 결과는 비밀 ㅋㅋ' },
    { emoji: '💑', type: '커플 관계 진단', name: '민서님', date: '1주 전', text: '남자친구랑 같이 해봤어요. 우리 관계 패턴을 이렇게 정확하게 짚어줄 줄은 몰랐어요. 대화 많이 했어요.' },
  ]

  return (
    <>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 28px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: 15, color: '#c9a84c', letterSpacing: 10, marginBottom: 16 }}>✦ ✦ ✦</div>
        <div style={{ fontSize: 12, color: 'rgba(240,234,216,0.45)', marginBottom: 20 }}>
          🔮 지금까지 <span style={{ color: '#c9a84c', fontWeight: 600 }}>1,247명</span>이 분석했어요
        </div>

        <h1 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '2.05rem', fontWeight: 300, lineHeight: 1.3, marginBottom: 8 }}>
          당신의 연애를<br />
          <em style={{ display: 'block', fontStyle: 'italic', color: '#c9a84c' }}>읽어드립니다</em>
        </h1>

        <div style={{
          fontSize: 52,
          animation: 'float 3.5s ease-in-out infinite',
          marginBottom: 8,
          marginTop: -10,
          filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.25))',
          textAlign: 'center',
        }}>🔮</div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {menus.map(m => (
            <button
              key={m.type}
              onClick={() => router.push((m as any).url || `/quiz/${m.type}`)}
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

      {/* 링크 공유 버튼 */}
      <div style={{ padding: '0 0 1.25rem' }}>
        <button
          onClick={copyLink}
          style={{
            width: '100%', height: 48,
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: 14, cursor: 'pointer',
            fontSize: 13.5, color: '#c9a84c',
            fontFamily: 'inherit', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          🔗 친구에게 링크 보내기
        </button>
      </div>

      {/* 후기 섹션 */}
      <div style={{ padding: '1.25rem 1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.6)', textAlign: 'center', marginBottom: '1.25rem' }}>✦ 분석 후기</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((r, i) => (
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
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: 9.5, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.5)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '4px 14px', fontWeight: 500 }}>JEJE COLLECTIVE</span>
        </div>
      </div>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
