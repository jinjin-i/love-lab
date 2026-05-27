'use client'
// app/ad/page.tsx - 쿠팡파트너스 배너 광고 보고 결과 보기
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

export default function AdPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [canSkip, setCanSkip] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)

  // 카운트다운
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); setCanSkip(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 쿠팡파트너스 배너 스크립트 동적 삽입
  useEffect(() => {
    if (!adRef.current) return

    // 기존 스크립트 제거
    const oldScript = document.getElementById('coupang-script')
    if (oldScript) oldScript.remove()

    // 스크립트 로드
    const script = document.createElement('script')
    script.id = 'coupang-script'
    script.src = 'https://ads-partners.coupang.com/g.js'
    script.async = true
    script.onload = () => {
      // 스크립트 로드 후 광고 초기화
      const initScript = document.createElement('script')
      initScript.textContent = `
        new PartnersCoupang.G({
          "id": 739808,
          "trackingCode": "AF6132783",
          "subId": null,
          "template": "carousel",
          "width": "300",
          "height": "300"
        });
      `
      adRef.current?.appendChild(initScript)
    }
    document.head.appendChild(script)

    return () => {
      const s = document.getElementById('coupang-script')
      if (s) s.remove()
    }
  }, [])

  return (
    <>
      {/* 헤더 */}
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => router.push('/')}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'none', color: 'rgba(240,234,216,0.5)',
            fontSize: 21, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >‹</button>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>
            전 남자친구 관계 분석
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과 준비 완료</div>
        </div>
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', padding: '32px 24px 160px',
        gap: 20, textAlign: 'center'
      }}>

        {/* 수정구슬 */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 32%, rgba(80,60,100,0.6), #1a1830 70%)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, animation: 'float 3.5s ease-in-out infinite'
        }}>🔮</div>

        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 8 }}>
            분석 결과 준비됨
          </div>
          <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.3rem', fontWeight: 300, lineHeight: 1.45 }}>
            잠깐, 이런 책은 어때요?<br />
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>비슷한 경험을 가진 분들의 추천</em>
          </h2>
        </div>

        {/* 쿠팡파트너스 배너 광고 */}
        <div style={{
          width: '100%',
          display: 'flex', justifyContent: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '16px',
          minHeight: 320,
        }}>
          <div ref={adRef} id="coupang-ad-container" />
        </div>

        <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.2)', lineHeight: 1.6 }}>
          이 광고는 쿠팡파트너스 광고입니다<br />
          구매 시 일정 수수료가 제공될 수 있습니다
        </div>

      </div>

      {/* 하단 버튼 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 600,
        padding: '12px 20px 32px',
        background: 'linear-gradient(transparent, #141428 38%)',
      }}>
        <button
          onClick={() => router.push('/result')}
          disabled={!canSkip}
          style={{
            width: '100%', height: 56,
            background: canSkip
              ? 'linear-gradient(180deg, #d4a84c 0%, #b8892a 100%)'
              : 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: 14,
            fontSize: 16, fontWeight: 700,
            fontFamily: 'inherit',
            color: canSkip ? '#1a1410' : 'rgba(240,234,216,0.3)',
            cursor: canSkip ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            letterSpacing: '0.03em',
            boxShadow: canSkip ? '0 4px 20px rgba(180,130,30,0.35)' : 'none',
          }}
        >
          {canSkip ? '🔮 분석 결과 보기' : `${countdown}초 후 결과 보기`}
        </button>
      </div>
    </>
  )
}
