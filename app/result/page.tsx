'use client'
// app/result/page.tsx
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { QUIZZES } from '@/lib/quizData'
import html2canvas from 'html2canvas'

export default function ResultPage() {
  const router = useRouter()
  const [resultText, setResultText] = useState('')
  const [quizType, setQuizType] = useState<string>('attachment')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const shareCardRef = useRef<HTMLDivElement>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  useEffect(() => {
    const type = sessionStorage.getItem('quiz_type') || 'attachment'
    const stored = sessionStorage.getItem('result_text')
    setQuizType(type)

    if (stored) {
      setResultText(stored)
      setLoading(false)
      return
    }

    const answers = JSON.parse(sessionStorage.getItem('quiz_answers') || '[]')

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
        fullText += decoder.decode(value)
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

  // 유형명 추출 — "당신은 XXX형입니다" 또는 "당신의 전 애인은 XXX형입니다" 패턴
  function extractTypeName(text: string): string {
    if (!text) return ''
    const patterns = [
      /당신은\s+([^\s]+형|[^\s]+-[^\s]+형)/,
      /당신의 전 애인은\s+([^\s]+형|[^\s]+-[^\s]+형)/,
      /당신의 이상형은\s+([^\s]+형|[^\s]+-[^\s]+형)/,
      /그 사람은\s+([^\s]+형|[^\s]+-[^\s]+형)/,
      /우리 관계는\s+([^\s]+형|[^\s]+-[^\s]+형)/,
    ]
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) return match[1]
    }
    // 첫 줄에서 "형"으로 끝나는 단어 찾기
    const firstLine = text.split('\n')[0]
    const typeMatch = firstLine.match(/([가-힣]+-[가-힣]+형|[가-힣]+형)/)
    return typeMatch ? typeMatch[1] : ''
  }

  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url).then(() => {
      showToast('링크가 복사됐어요! 카톡에 붙여넣기 해보세요 🔮')
    }).catch(() => showToast('복사에 실패했어요'))
  }

  async function captureShareCard() {
    const el = shareCardRef.current
    if (!el) return
    showToast('카드 생성 중...')
    try {
      const canvas = await html2canvas(el, {
        backgroundColor: '#141428',
        scale: 3,
        useCORS: true,
        logging: false,
      })
      const image = canvas.toDataURL('image/png')
      if (navigator.share) {
        const blob = await (await fetch(image)).blob()
        const file = new File([blob], 'love-lab-card.png', { type: 'image/png' })
        await navigator.share({ title: '연애 심리 분석 결과', files: [file] })
      } else {
        const link = document.createElement('a')
        link.download = 'love-lab-card.png'
        link.href = image
        link.click()
        showToast('카드가 저장됐어요!')
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') showToast('저장 중 오류가 발생했어요')
    }
  }

  const quiz = QUIZZES[quizType]
  const sections = parseResult(resultText)
  const typeName = extractTypeName(resultText)

  const typeConfig: Record<string, { emoji: string; color: string; illustration: string }> = {
    attachment: { emoji: '🪞', color: '#c9a84c', illustration: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="45" r="22" fill="none" stroke="#c9a84c" stroke-width="2.5" opacity="0.9"/><circle cx="60" cy="45" r="13" fill="#c9a84c" opacity="0.15"/><path d="M38 95 Q60 72 82 95" fill="none" stroke="#c9a84c" stroke-width="2.5" stroke-linecap="round"/><circle cx="60" cy="45" r="5" fill="#c9a84c" opacity="0.7"/><path d="M48 38 Q60 30 72 38" fill="none" stroke="#c9a84c" stroke-width="1.5" opacity="0.4"/></svg>` },
    pattern: { emoji: '🔁', color: '#a084cc', illustration: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M25 60 Q40 30 60 45 Q80 60 95 30" fill="none" stroke="#a084cc" stroke-width="2.5" stroke-linecap="round"/><path d="M25 80 Q40 50 60 65 Q80 80 95 50" fill="none" stroke="#a084cc" stroke-width="2" stroke-linecap="round" opacity="0.5"/><circle cx="25" cy="60" r="5" fill="#a084cc" opacity="0.8"/><circle cx="95" cy="30" r="5" fill="#a084cc" opacity="0.8"/><path d="M88 22 L95 30 L100 22" fill="none" stroke="#a084cc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
    ideal: { emoji: '⚖️', color: '#84b4cc', illustration: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><line x1="60" y1="25" x2="60" y2="95" stroke="#84b4cc" stroke-width="2.5"/><line x1="30" y1="40" x2="90" y2="40" stroke="#84b4cc" stroke-width="2.5"/><circle cx="30" cy="55" r="12" fill="none" stroke="#84b4cc" stroke-width="2"/><circle cx="30" cy="55" r="6" fill="#84b4cc" opacity="0.3"/><circle cx="90" cy="62" r="12" fill="none" stroke="#84b4cc" stroke-width="2"/><circle cx="90" cy="62" r="6" fill="#84b4cc" opacity="0.3"/><path d="M30 40 L30 43" stroke="#84b4cc" stroke-width="2"/><path d="M90 40 L90 50" stroke="#84b4cc" stroke-width="2"/></svg>` },
    ex: { emoji: '🔮', color: '#cc84a0', illustration: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="55" r="28" fill="none" stroke="#cc84a0" stroke-width="2.5"/><circle cx="60" cy="55" r="20" fill="#cc84a0" opacity="0.08"/><path d="M45 48 Q60 38 75 48" fill="none" stroke="#cc84a0" stroke-width="2" opacity="0.6"/><path d="M48 62 Q60 72 72 62" fill="none" stroke="#cc84a0" stroke-width="2" opacity="0.4"/><circle cx="52" cy="52" r="3" fill="#cc84a0" opacity="0.7"/><circle cx="68" cy="52" r="3" fill="#cc84a0" opacity="0.7"/><path d="M44 83 L60 75 L76 83" fill="none" stroke="#cc84a0" stroke-width="2" stroke-linecap="round"/></svg>` },
    crush: { emoji: '💌', color: '#cc9084', illustration: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M25 40 L60 65 L95 40 L95 85 L25 85 Z" fill="none" stroke="#cc9084" stroke-width="2.5" stroke-linejoin="round"/><path d="M25 40 L95 40" stroke="#cc9084" stroke-width="2.5"/><path d="M60 52 L60 52" stroke="none"/><path d="M48 57 Q60 47 72 57 Q72 67 60 74 Q48 67 48 57Z" fill="#cc9084" opacity="0.4"/></svg>` },
    couple: { emoji: '💑', color: '#84cca4', illustration: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="42" cy="42" r="16" fill="none" stroke="#84cca4" stroke-width="2.5"/><circle cx="78" cy="42" r="16" fill="none" stroke="#84cca4" stroke-width="2.5"/><path d="M26 85 Q42 68 58 75" fill="none" stroke="#84cca4" stroke-width="2.5" stroke-linecap="round"/><path d="M62 75 Q78 68 94 85" fill="none" stroke="#84cca4" stroke-width="2.5" stroke-linecap="round"/><path d="M55 42 Q60 37 65 42" fill="none" stroke="#84cca4" stroke-width="2" opacity="0.6"/></svg>` },
  }

  const tc = typeConfig[quizType] || typeConfig['attachment']

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

      <div style={{ flex: 1, padding: '20px 24px 5rem', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 20 }}>
            <div className="spinner" />
            <div style={{ fontSize: 13.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300, textAlign: 'center', lineHeight: 1.7 }}>
              답변을 분석하고 있어요<br />
              <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>잠시만 기다려주세요...</em>
            </div>
          </div>
        ) : (
          <div className="fade-up">

            {/* 유형 카드 */}
            {typeName && (
              <div ref={shareCardRef} style={{
                background: 'linear-gradient(145deg, #1c1a35 0%, #141428 100%)',
                border: `1px solid ${tc.color}40`,
                borderRadius: 20,
                padding: '28px 24px 24px',
                textAlign: 'center',
                marginBottom: 28,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* 배경 글로우 */}
                <div style={{
                  position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
                  width: 200, height: 200,
                  background: `radial-gradient(circle, ${tc.color}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* 카테고리 배지 */}
                <div style={{
                  display: 'inline-block',
                  fontSize: 10, letterSpacing: '0.15em',
                  color: `${tc.color}cc`,
                  border: `1px solid ${tc.color}40`,
                  borderRadius: 20, padding: '3px 12px',
                  marginBottom: 20,
                }}>
                  {quiz?.cat?.toUpperCase()}
                </div>

                {/* SVG 일러스트 */}
                <div style={{ width: 100, height: 100, margin: '0 auto 16px' }}
                  dangerouslySetInnerHTML={{ __html: tc.illustration }} />

                {/* 유형 이름 */}
                <div style={{
                  fontFamily: 'Noto Serif KR, serif',
                  fontSize: '1.7rem',
                  fontWeight: 600,
                  color: '#f0ead8',
                  letterSpacing: '0.02em',
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}>
                  {typeName}
                </div>

                {/* 구분선 */}
                <div style={{ width: 32, height: 2, background: `${tc.color}80`, margin: '0 auto 20px', borderRadius: 2 }} />

                {/* 공유 카드 버튼 */}
                <button
                  onClick={captureShareCard}
                  style={{
                    background: `${tc.color}20`,
                    border: `1px solid ${tc.color}50`,
                    borderRadius: 10, padding: '8px 20px',
                    fontSize: 12, color: `${tc.color}ee`,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  ✨ 카드 저장하기
                </button>

                {/* 브랜드 */}
                <div style={{ fontSize: 9, color: 'rgba(240,234,216,0.2)', marginTop: 16, letterSpacing: '0.1em' }}>
                  love-lab.kr
                </div>
              </div>
            )}

            {/* 분석 본문 */}
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

            {/* 공유 섹션 */}
            <div style={{
              marginTop: 32,
              background: 'rgba(201,168,76,0.07)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 16, padding: '20px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0ead8', marginBottom: 6 }}>친구와 공유하기</div>
              <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', marginBottom: 16, lineHeight: 1.6 }}>
                나도 분석해보라고 링크를 보내봐요 🔮
              </div>
              <button
                onClick={copyLink}
                style={{
                  width: '100%', height: 48,
                  background: 'linear-gradient(135deg, #b8922e, #e8c96a)',
                  border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 700, color: '#1a1410',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                🔗 링크 복사하기
              </button>
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
