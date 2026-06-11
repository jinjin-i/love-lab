'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AdContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [adClicked, setAdClicked] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type) sessionStorage.setItem('quiz_type', type)
  }, [])

  useEffect(() => {
    if (!adRef.current) return
    // 기존 스크립트 제거
    adRef.current.innerHTML = ''
    const script1 = document.createElement('script')
    script1.src = 'https://ads-partners.coupang.com/g.js'
    script1.async = true
    script1.onload = () => {
      const script2 = document.createElement('script')
      script2.innerHTML = `new PartnersCoupang.G({"id":739808,"trackingCode":"AF6132783","subId":null,"template":"carousel","width":"300","height":"300"});`
      adRef.current?.appendChild(script2)
    }
    adRef.current.appendChild(script1)
  }, [])

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, background: '#141428', zIndex: 10 }}>
        <button className="back-btn" onClick={() => router.push('/')}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>거의 다 됐어요!</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과 열람 전 단계</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '32px 24px 5rem', display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>

        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔮</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#f0ead8', marginBottom: 8 }}>분석 결과가 준비됐어요</div>
          <div style={{ fontSize: 13.5, color: 'rgba(240,234,216,0.5)', lineHeight: 1.7 }}>
            아래 상품을 둘러보면<br />결과 보기 버튼이 활성화돼요 🔮
          </div>
        </div>

        {/* 쿠팡 파트너스 위젯 */}
        <div
          ref={adRef}
          onClick={() => setAdClicked(true)}
          style={{ width: 300, minHeight: 300, borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}
        />

        <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.2)', textAlign: 'center' }}>
          이 포스팅은 쿠팡 파트너스 활동의 일환으로<br />일정액의 수수료를 제공받습니다
        </div>

        {adClicked ? (
          <button
            onClick={() => router.push('/result')}
            style={{ width: '100%', height: 56, background: 'linear-gradient(135deg, #b8922e, #e8c96a)', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 700, color: '#1a1410', cursor: 'pointer', fontFamily: 'inherit' }}>
            🔮 분석 결과 보기
          </button>
        ) : (
          <div style={{ width: '100%', height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, color: 'rgba(240,234,216,0.25)' }}>
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
