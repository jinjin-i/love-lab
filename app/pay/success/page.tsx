'use client'
// app/pay/success/page.tsx
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function SuccessContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState('결제를 확인하고 있어요...')

  useEffect(() => {
    const paymentKey = params.get('paymentKey')
    const orderId = params.get('orderId')
    const amount = params.get('amount')

    const phone = sessionStorage.getItem('pay_phone') || ''
    const answers = JSON.parse(sessionStorage.getItem('quiz_answers') || '[]')
    const quizType = sessionStorage.getItem('quiz_type') || 'ex'

    if (!paymentKey || !orderId || !amount) {
      router.push('/')
      return
    }

    async function confirm() {
      setStatus('결제를 확인하고 있어요...')
      try {
        const res = await fetch('/api/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount), phone, answers, quizType }),
        })
        const data = await res.json()

        if (data.success) {
          setStatus('분석 결과를 준비하고 있어요...')
          sessionStorage.setItem('result_text', data.resultText)
          sessionStorage.setItem('result_type', quizType)
          sessionStorage.setItem('result_date', new Date().toISOString())
          // 임시 데이터 정리
          sessionStorage.removeItem('quiz_answers')
          sessionStorage.removeItem('pay_phone')
          sessionStorage.removeItem('pay_order_id')
          router.push('/result')
        } else {
          setStatus('결제 확인에 실패했어요. 고객센터에 문의해주세요.')
        }
      } catch {
        setStatus('오류가 발생했어요. 잠시 후 다시 시도해주세요.')
      }
    }

    confirm()
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 24, textAlign: 'center' }}>
      <div className="orb-circle">🔮</div>
      <div className="spinner" />
      <div style={{ fontSize: 14, color: 'rgba(240,234,216,0.6)', lineHeight: 1.7 }}>
        <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>{status}</em>
      </div>
    </div>
  )
}

export default function PaySuccess() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
