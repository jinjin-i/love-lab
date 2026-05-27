'use client'
// app/result/page.tsx
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { QUIZZES, QuizType } from '@/lib/quizData'
import html2canvas from 'html2canvas'

export default function ResultPage() {
  const router = useRouter()
  const [resultText, setResultText] = useState('')
  const [quizType, setQuizType] = useState<QuizType>('attachment')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const captureRef = useRef<HTMLDivElement>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    const type = (sessionStorage.getItem('quiz_type') || 'attachment') as QuizType
    const stored = sessionStorage.getItem('result_text')
    setQuizType(type)

    if (stored) {
      setResultText(stored)
      setLoading(false)
      return
    }

    const answers = JSON.parse(sessionStorage.getItem('quiz_answers') || '[]')
    console.log('quiz_type:', type, 'answers:', answers)

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizType: type, answers }),
    }).then(async res => {
      if (!res.ok) { showToast('오류가 발생했어요'); setLoading(false); return }
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''
      setLoading(false)
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        fullText += chunk
        setResultText(fullText)
      }
      localStorage.setItem('free_result_date', new Date().toLocaleDateString('ko-KR'))
    }).catch(() => {
      showToast('오류가 발생했어요')
      setLoading(false)
    })
  }, [])

  function parseResult(raw: string) {
    const parts = raw.split(/\[([^\]]+)\]/g).filter(s => s.trim())
    const sections: { title: string; body: string }[] = []
    for (let i = 0; i < parts.length; i += 2) {
      const title = parts[i]?.trim()
      const body = parts[i + 1]?.trim()
      if (title && body) sections.push({ title, body })
    }
    return sections.length ? sections : [{ title: '분석 결과', body: raw }]
  }

  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url).then(() => {
      showToast('링크가 복사됐어요! 카톡에 붙여넣기 해보세요 🔮')
    }).catch(() => showToast('복사에 실패했어요'))
  }

  async function captureAndShare() {
    const el = captureRef.current
    if (!el) return
    showToast('이미지 생성 중...')
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: '#141428',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const image = canvas.toDataURL('image/png')
      if (navigator.share) {
        const blob = await (await fetch(image)).blob()
        const file = new File([blob], 'love-lab-result.png', { type: 'image/png' })
        await navigator.share({ title: '연애심리연구소 분석 결과', files: [file] })
      } else {
        const link = document.createElement('a')
        link.download = 'love-lab-result.png'
        link.href = image
        link.click()
        showToast('이미지가 저장됐어요!')
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') showToast('저장 중 오류가 발생했어요')
    }
  }

  const quiz = QUIZZES[quizType]
  const sections = parseResult(resultText)

  return (
    <>
      {/* 헤더 */}
      <div style={{
        padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14,
        position: 'sticky', top: 0, background: '#141428', zIndex: 10,
      }}>
        <button className="back-btn" onClick={() => router.push('/')}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>{quiz?.cat}</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>분석 결과</div>
        </div>
      </div>

      {/* 결과 본문 */}
      <div style={{ flex: 1, padding: '28px 24px 5rem', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 20 }}>
            <div className="spinner" />
            <div style={{ fontSize: 13.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300, textAlign: 'center', lineHeight: 1.7 }}>
              답변을 심층 분석하고 있어요<br />
              <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>잠시만 기다려주세요...</em>
            </div>
          </div>
        ) : (
          <div className="fade-up">
            <div ref={captureRef} style={{ background: '#141428', paddingBottom: 8 }}>
              {sections.map((s, i) => (
                <div key={i} className="rs-section">
                  <div className="rs-sep">
                    <span className="rs-label">분석</span>
                    <div className="rs-sep-line" />
                  </div>
                  <div className="rs-title">{s.title}</div>
                  <div className="rs-body">{s.body}</div>
                </div>
              ))}
            </div>

            {/* 친구와 공유하기 */}
            <div style={{
              marginTop: 32,
              background: 'rgba(201,168,76,0.07)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 16,
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0ead8', marginBottom: 6 }}>
                친구와 공유하기
              </div>
              <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
                나도 분석해보라고 링크를 보내봐요 🔮
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={captureAndShare}
                  style={{
                    flex: 1, height: 48,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontSize: 14, fontWeight: 500, color: 'rgba(240,234,216,0.8)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  📸 이미지 저장
                </button>
                <button
                  onClick={copyLink}
                  style={{
                    flex: 1, height: 48,
                    background: 'linear-gradient(135deg, #b8922e, #e8c96a)',
                    border: 'none', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontSize: 14, fontWeight: 700, color: '#1a1410',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  🔗 링크 복사
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      {!loading && (
        <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="btn-gold"
            style={{ height: 52, fontSize: 15 }}
            onClick={() => {
              sessionStorage.removeItem('result_text')
              sessionStorage.removeItem('quiz_answers')
              router.push(`/quiz/${quizType}`)
            }}
          >
            다시 분석하기
          </button>
          <button className="btn-ghost" onClick={() => router.push('/')}>처음으로 돌아가기</button>
        </div>
      )}

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
