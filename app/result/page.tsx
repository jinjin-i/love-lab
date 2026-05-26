'use client'
// app/result/page.tsx
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QUIZZES, QuizType } from '@/lib/quizData'

declare global {
  interface Window { Kakao: any }
}

const QUIZ_LABELS: Record<QuizType, string> = {
  attachment: '애착유형',
  pattern: '연애 패턴',
  ideal: '이상형 궁합',
  ex: '전 남자친구 관계',
}

export default function ResultPage() {
  const router = useRouter()
  const [resultText, setResultText] = useState('')
  const [quizType, setQuizType] = useState<QuizType>('attachment')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [kakaoReady, setKakaoReady] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  // 카카오 SDK 로드
  useEffect(() => {
    if (document.getElementById('kakao-sdk')) { setKakaoReady(true); return }
    const script = document.createElement('script')
    script.id = 'kakao-sdk'
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // 카카오 JavaScript 키 입력 (카카오 개발자 콘솔에서 발급)
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY || 'YOUR_KAKAO_JS_KEY')
      }
      setKakaoReady(true)
    }
    document.head.appendChild(script)
  }, [])

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
    if (!answers.length) { router.push('/'); return }

    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizType: type, answers }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.resultText) {
          setResultText(data.resultText)
          localStorage.setItem('free_result_date', new Date().toLocaleDateString('ko-KR'))
        } else {
          showToast('분석 중 오류가 발생했어요')
        }
      })
      .catch(() => showToast('오류가 발생했어요'))
      .finally(() => setLoading(false))
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

  // 카카오톡으로 공유
  function shareKakao() {
    if (!kakaoReady || !window.Kakao?.isInitialized()) {
      showToast('카카오 공유를 불러오는 중이에요')
      return
    }

    const sections = parseResult(resultText)
    const firstSection = sections[0]
    // 첫 번째 섹션 제목과 본문 첫 줄만 미리보기로
    const previewBody = firstSection?.body?.split('\n')[0]?.slice(0, 60) || ''
    const label = QUIZ_LABELS[quizType]
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-app.vercel.app'

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `✦ 연애심리연구소 — ${label} 분석`,
        description: `${firstSection?.title}: ${previewBody}...`,
        imageUrl: `${siteUrl}/og-image.png`, // 아래에서 만들 OG 이미지
        link: {
          mobileWebUrl: siteUrl,
          webUrl: siteUrl,
        },
      },
      buttons: [
        {
          title: '나도 분석받기',
          link: {
            mobileWebUrl: siteUrl,
            webUrl: siteUrl,
          },
        },
      ],
    })
  }

  // 링크 복사 (카카오 대신 사용 가능)
  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url).then(() => {
      showToast('링크가 복사됐어요! 카톡에 붙여넣기 해보세요 🔮')
    }).catch(() => showToast('복사에 실패했어요'))
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
        {/* 헤더 카카오 공유 버튼 */}
        {!loading && (
          <button
            onClick={shareKakao}
            style={{
              background: '#FEE500', border: 'none', borderRadius: 10,
              padding: '7px 12px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 700, color: '#3C1E1E',
              fontFamily: 'inherit', flexShrink: 0,
            }}
          >
            <KakaoIcon /> 공유
          </button>
        )}
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

            {/* 카카오 공유 배너 */}
            <div style={{
              marginTop: 32,
              background: 'rgba(254,229,0,0.07)',
              border: '1px solid rgba(254,229,0,0.2)',
              borderRadius: 16,
              padding: '18px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', marginBottom: 12, lineHeight: 1.6 }}>
                분석 결과가 마음에 드셨나요?<br />
                <span style={{ color: 'rgba(240,234,216,0.7)' }}>친구에게 공유하고 같이 분석해봐요 🔮</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={shareKakao}
                  style={{
                    flex: 1, height: 46,
                    background: '#FEE500', border: 'none', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    fontSize: 14, fontWeight: 700, color: '#3C1E1E',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <KakaoIcon size={18} /> 카카오톡 공유
                </button>
                <button
                  onClick={copyLink}
                  style={{
                    width: 46, height: 46,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', fontSize: 18,
                  }}
                  title="링크 복사"
                >
                  🔗
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

// 카카오 아이콘 SVG
function KakaoIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#3C1E1E">
      <path d="M12 3C6.477 3 2 6.582 2 11c0 2.83 1.733 5.337 4.362 6.86-.193.722-.724 2.615-.83 3.02-.13.504.186.497.388.362.16-.107 2.542-1.72 3.573-2.416A11.42 11.42 0 0 0 12 19c5.523 0 10-3.582 10-8S17.523 3 12 3z" />
    </svg>
  )
}
