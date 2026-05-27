'use client'
// app/quiz/[type]/page.tsx
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { QUIZZES, QuizType } from '@/lib/quizData'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const type = params.type as QuizType
  const quiz = QUIZZES[type]

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!quiz) router.push('/')
    else setAnswers(new Array(quiz.qs.length).fill(''))
  }, [type])

  if (!quiz) return null

  const total = quiz.qs.length
  const q = quiz.qs[step]
  const pct = Math.round(((step + 1) / total) * 100)
  const isLast = step === total - 1

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  function setAnswer(val: string) {
    const next = [...answers]
    next[step] = val
    setAnswers(next)
    return next
  }

  function autoNext(next: string[]) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      goNext(next)
    }, 320)
  }

  function pickSingle(val: string) {
    const next = setAnswer(val)
    autoNext(next)
  }

  function pickMulti(val: string) {
    const current = answers[step] ? answers[step].split(', ') : []
    const exists = current.includes(val)
    const updated = exists ? current.filter(v => v !== val) : [...current, val]
    setAnswer(updated.join(', '))
  }

  function pickScale(val: string) {
    const next = setAnswer(val)
    autoNext(next)
  }

  function goNext(ans = answers) {
    if (q.t !== 'f' && (!ans[step] || !ans[step].trim())) {
      showToast('답변을 선택해주세요')
      return
    }
    if (step < total - 1) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      sessionStorage.setItem('quiz_answers', JSON.stringify(ans))
      sessionStorage.setItem('quiz_type', type)
      // ex 타입은 광고 페이지로, 나머지는 바로 결과로
      if (quiz.paid) {
        router.push('/ad')
      } else {
        router.push('/result')
      }
    }
  }

  function goPrev() {
    if (step > 0) { setStep(step - 1); window.scrollTo(0, 0) }
  }

  const multiSelected = q.t === 'm' && answers[step]
    ? answers[step].split(', ')
    : []

  return (
    <>
      {/* 헤더 */}
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="back-btn" onClick={() => router.push('/')}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>
            {quiz.cat}
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>{quiz.name}</div>
        </div>
      </div>

      {/* 진행바 */}
      <div style={{ padding: '14px 24px 0' }}>
        <div className="prog-bg">
          <div className="prog-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 9.5, color: 'rgba(240,234,216,0.3)' }}>{step + 1} / {total}</span>
          <span style={{ fontSize: 9.5, color: 'rgba(240,234,216,0.3)' }}>{pct}%</span>
        </div>
      </div>

      {/* 질문 */}
      <div style={{ flex: 1, padding: '32px 24px 140px', overflowY: 'auto' }} className="fade-up" key={step}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', color: 'rgba(240,234,216,0.3)', marginBottom: 10 }}>
          질문 {step + 1}
        </div>
        <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.12rem', fontWeight: 300, lineHeight: 1.65, color: '#f0ead8', marginBottom: 6 }}>
          {q.q}
        </div>
        {q.h && <div style={{ fontSize: 11.5, color: 'rgba(240,234,216,0.35)', marginBottom: 22, fontWeight: 300 }}>{q.h}</div>}
        {!q.h && <div style={{ marginBottom: 22 }} />}

        {/* 단일/복수 선택 */}
        {(q.t === 's' || q.t === 'm') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.o?.map(opt => {
              const isSel = q.t === 's' ? answers[step] === opt : multiSelected.includes(opt)
              return (
                <button
                  key={opt}
                  className={`choice-btn ${isSel ? 'sel' : ''}`}
                  onClick={() => q.t === 's' ? pickSingle(opt) : pickMulti(opt)}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* 척도 */}
        {q.t === 'sc' && (
          <>
            <div style={{ display: 'flex', gap: 8 }}>
              {q.o?.map((opt, i) => (
                <button
                  key={opt}
                  className={`scale-btn ${answers[step] === `${opt}(${i + 1}점)` ? 'sel' : ''}`}
                  onClick={() => pickScale(`${opt}(${i + 1}점)`)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ fontSize: 9.5, color: 'rgba(240,234,216,0.3)' }}>전혀 아님</span>
              <span style={{ fontSize: 9.5, color: 'rgba(240,234,216,0.3)' }}>매우 그러함</span>
            </div>
          </>
        )}

        {/* 자유 입력 */}
        {q.t === 'f' && (
          <textarea
            className="free-input"
            placeholder={q.ph}
            value={answers[step] || ''}
            onChange={e => setAnswer(e.target.value)}
          />
        )}

        {/* 수정구슬 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <div className="orb-circle">🔮</div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '12px 20px 32px',
        background: 'linear-gradient(transparent, #141428 38%)',
        display: 'flex', gap: 10,
      }}>
        <button
          style={{
            width: 50, height: 56, borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'none', color: 'rgba(240,234,216,0.45)',
            fontSize: 24, cursor: step === 0 ? 'not-allowed' : 'pointer',
            opacity: step === 0 ? 0.2 : 1, flexShrink: 0,
          }}
          onClick={goPrev}
          disabled={step === 0}
        >‹</button>
        <button className="btn-gold" onClick={() => goNext()}>
          {isLast ? '분석 완료' : '분석 계속하기'}
        </button>
      </div>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
