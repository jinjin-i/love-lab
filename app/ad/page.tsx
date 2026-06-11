'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AdContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [adClicked, setAdClicked] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) sessionStorage.setItem('quiz_type', type)
  }, [])

  const products = [
    { emoji: '💄', name: '오늘의 뷰티 추천', desc: '연애할 때 빛나는 아이템' },
    { emoji: '👗', name: '패션 트렌드 모음', desc: '첫 만남에 딱인 코디' },
    { emoji: '🌹', name: '데이트 선물 추천', desc: '마음을 전하는 선물' },
    { emoji: '☕', name: '카페 데이트템', desc: '분위기 좋은 데이트 준비' },
  ]

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, background: '#141428', zIndex: 10 }}>
        <button className="back-btn" onClick={() => router.push('/')}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>거의 다 됐어요!</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과 열람 전 단계</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '28px 24px 5rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>🔮</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#f0ead8', marginBottom: 6 }}>분석 결과가 준비됐어요</div>
          <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', lineHeight: 1.7 }}>
            아래 상품 중 하나를 클릭하면<br />결과를 바로 볼 수 있어요 🔮
          </div>
        </div>

        {/* 상품 링크 카드들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {products.map((p, i) => (
            <a
              key={i}
              href="https://coupa.ng/cgTsq3"
              target="_blank"
              rel="noreferrer"
              onClick={() => setAdClicked(true)}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div style={{
                borderRadius: 16,
                border: `1px solid rgba(201,168,76,${adClicked ? '0.15' : '0.25'})`,
                background: 'linear-gradient(135deg, #1e1a10 0%, #2a2210 100%)',
                padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#f0ead8', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(240,234,216,0.4)' }}>{p.desc}</div>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#c9a84c', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>
                  보러가기
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.2)', textAlign: 'center', marginTop: -4 }}>
          이 포스팅은 쿠팡 파트너스 활동의 일환으로<br />일정액의 수수료를 제공받습니다
        </div>

        {/* 결과 보기 버튼 */}
        {adClicked ? (
          <button
            onClick={() => router.push('/result')}
            style={{ width: '100%', height: 56, background: 'linear-gradient(135deg, #b8922e, #e8c96a)', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, color: '#1a1410', cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
            🔮 분석 결과 보기
          </button>
        ) : (
          <div style={{ width: '100%', height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, color: 'rgba(240,234,216,0.25)', marginTop: 4 }}>
            상품을 클릭하면 버튼이 나타납니다
          </div>
        )}
      </div>
    </>
  )
}

export default function AdPage() {
  return (
    <Suspense fallback={null}>
      <AdContent />
    </Suspense>
  )
}
