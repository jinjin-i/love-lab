'use client'
// app/pay/page.tsx
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

declare global {
  interface Window { TossPayments: any }
}

export default function PayPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [tossReady, setTossReady] = useState(false)

  useEffect(() => {
    // 토스페이먼츠 SDK 로드
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/standard'
    script.onload = () => setTossReady(true)
    document.head.appendChild(script)
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  function formatPhone(val: string) {
    const num = val.replace(/[^0-9]/g, '')
    if (num.length <= 3) return num
    if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`
    return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`
  }

  async function startPayment() {
    const phoneNum = phone.replace(/[^0-9]/g, '')
    if (phoneNum.length < 10) {
      showToast('올바른 전화번호를 입력해주세요')
      return
    }
    if (!tossReady) {
      showToast('결제 모듈 로딩 중이에요')
      return
    }

    setLoading(true)
    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      const tossPayments = window.TossPayments(clientKey)
      const payment = tossPayments.payment({ customerKey: `user-${phoneNum}` })
      const orderId = `order-${Date.now()}-${phoneNum.slice(-4)}`

      // 전화번호와 설문 답변을 sessionStorage에 저장 (successUrl 복귀 후 사용)
      sessionStorage.setItem('pay_phone', phoneNum)
      sessionStorage.setItem('pay_order_id', orderId)

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: 1990 },
        orderId,
        orderName: '전 남자친구 관계 분석',
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/success`,
        failUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pay/fail`,
        customerMobilePhone: phoneNum,
        customerName: '회원',
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      })
    } catch (e: any) {
      setLoading(false)
      if (e.code !== 'USER_CANCEL') showToast('결제 중 오류가 발생했어요')
    }
  }

  const features = [
    { icon: '🔬', title: '그 사람의 관계 유형', desc: '어떤 패턴의 사람이었는지, 왜 그랬는지' },
    { icon: '💡', title: '이별의 진짜 원인', desc: '표면 너머 심리학적 근본 원인 분석' },
    { icon: '🌙', title: '다음 관계를 위한 지침', desc: '나에게 진짜 맞는 파트너의 특성 3가지' },
  ]

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back-btn" onClick={() => router.back()}>‹</button>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>전 남자친구 관계 분석</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과 준비 완료</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 160px', gap: 20, textAlign: 'center' }}>

        <div className="orb-circle" style={{ width: 100, height: 100, fontSize: 48 }}>🔮</div>

        <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c9a84c' }}>Premium Report</div>

        <h2 style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.45rem', fontWeight: 300, lineHeight: 1.4 }}>
          분석이 완료됐어요<br />
          <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>결과를 확인해보세요</em>
        </h2>

        <p style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', lineHeight: 1.85, fontWeight: 300 }}>
          설문 응답을 바탕으로 관계 패턴,<br />이별의 심리적 원인, 다음 연애 지침을 준비했어요
        </p>

        {/* 기능 카드 */}
        <div style={{
          width: '100%', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(201,168,76,0.25)', borderRadius: 20,
          padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left',
        }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>{f.icon}</span>
              <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.6)', lineHeight: 1.55, fontWeight: 300 }}>
                <strong style={{ color: '#f0ead8', fontWeight: 500, display: 'block', marginBottom: 1 }}>{f.title}</strong>
                {f.desc}
              </div>
            </div>
          ))}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#c9a84c' }}>₩1,990</div>
            <div style={{ fontSize: 12, color: 'rgba(240,234,216,0.3)', marginTop: 2 }}>1회 결제 · 어떤 기기에서든 열람 가능</div>
          </div>
        </div>

        {/* 전화번호 입력 */}
        <div style={{ width: '100%', textAlign: 'left' }}>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', marginBottom: 8, paddingLeft: 2 }}>
            📱 결과 열람용 전화번호 입력
          </div>
          <input
            className="phone-input"
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            maxLength={13}
          />
          <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.25)', marginTop: 6, paddingLeft: 2 }}>
            나중에 다른 기기에서도 이 번호로 결과를 열람할 수 있어요
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '12px 20px 32px',
        background: 'linear-gradient(transparent, #141428 38%)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <button className="btn-gold" onClick={startPayment} disabled={loading}>
          {loading ? '결제창 열고 있어요...' : '🔮 결제하고 분석 결과 보기'}
        </button>
        <div style={{ fontSize: 10.5, color: 'rgba(240,234,216,0.25)', lineHeight: 1.7, textAlign: 'center' }}>
          토스페이먼츠 · 카드 / 토스페이 지원 · 결제 후 즉시 열람
        </div>
        <button className="btn-ghost" onClick={() => router.push('/')}>처음으로 돌아가기</button>
      </div>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
