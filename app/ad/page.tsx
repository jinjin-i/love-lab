'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useState, useEffect } from 'react'

function AdContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    const type = searchParams.get('type')
    if (type) sessionStorage.setItem('quiz_type', type)
  }, [])
  const [adClicked, setAdClicked] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    if (!adClicked) return
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); setCanSkip(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [adClicked])

  useEffect(() => {
    const container = document.getElementById('coupang-ad')
    if (!container) return
    container.innerHTML = ''
    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'width:300px;height:300px;border:none;display:block;margin:0 auto;'
    iframe.scrolling = 'no'
    container.appendChild(iframe)
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return
    doc.open()
    doc.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;}body{background:transparent;}</style></head><body><script src="https://ads-partners.coupang.com/g.js"><\/script><script>new PartnersCoupang.G({"id":739808,"trackingCode":"AF6132783","subId":null,"template":"carousel","width":"300","height":"300"});<\/script></body></html>`)
    doc.close()
    const checkClick = setInterval(() => {
      try {
        if (document.activeElement === iframe) {
          setAdClicked(true)
          clearInterval(checkClick)
        }
      } catch(e) {}
    }, 300)
    return () => {
      clearInterval(checkClick)
      container.innerHTML = ''
    }
  }, [])

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={() => router.push('/')} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'rgba(240,234,216,0.5)', fontSize: 21, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>전 애인 관계 분석</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과 준비 완료</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 24px 160px', gap: 20, textAlign: 'center' }}>

        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle at 38% 32%, rgba(80,60,100,0.6), #1a1830 70%)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, animation: 'float 3.5s ease-in-out infinite' }}>🔮</div>

        <div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 8 }}>분석 결과 준비됨</div>
          <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.3rem', fontWeight: 300, lineHeight: 1.45 }}>
            아래 쿠팡 화면을 클릭하면<br />
            <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>분석 결과 버튼이 나타납니다</em>
          </h2>
        </div>

        <div style={{ background: adClicked ? 'rgba(100,200,100,0.1)' : 'rgba(201,168,76,0.08)', border: adClicked ? '1px solid rgba(100,200,100,0.3)' : '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '10px 18px', fontSize: 13, color: adClicked ? '#7ec87e' : 'rgba(240,234,216,0.6)', transition: 'all 0.3s', width: '100%' }}>
          {adClicked ? (canSkip ? '✅ 아래 버튼을 눌러주세요!' : `✅ 클릭 완료! ${countdown}초 후 버튼이 나타납니다`) : '👆 아래 쿠팡 광고를 클릭해주세요'}
        </div>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', minHeight: 300 }}>
          <div id="coupang-ad" />
        </div>

        <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.2)', lineHeight: 1.6 }}>
          이 광고는 쿠팡파트너스 광고입니다<br />구매 시 일정 수수료가 제공될 수 있습니다
        </div>

      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 600, padding: '12px 20px 32px', background: 'linear-gradient(transparent, #141428 38%)' }}>
        {canSkip && (
          <button onClick={() => router.push('/result')} style={{ width: '100%', height: 56, background: 'linear-gradient(180deg, #d4a84c 0%, #b8892a 100%)', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, fontFamily: 'inherit', color: '#1a1410', cursor: 'pointer', letterSpacing: '0.03em', boxShadow: '0 4px 20px rgba(180,130,30,0.35)', animation: 'fadeUp 0.4s ease' }}>
            🔮 분석 결과 보기
          </button>
        )}
        {!canSkip && adClicked && (
          <div style={{ width: '100%', height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(240,234,216,0.4)' }}>
            {countdown}초 후 버튼이 나타납니다...
          </div>
        )}
        {!adClicked && (
          <div style={{ width: '100%', height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'rgba(240,234,216,0.25)' }}>
            광고를 클릭하면 버튼이 생성됩니다
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
