'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function KakaoPage() {
  const router = useRouter()
  const [conversation, setConversation] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [step, setStep] = useState<'input' | 'ad' | 'result'>('input')
  const [adClicked, setAdClicked] = useState(false)
  const [usedCount, setUsedCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)

  useEffect(() => {
    const today = new Date().toLocaleDateString('ko-KR')
    const stored = localStorage.getItem('kakao_analysis_date')
    const count = parseInt(localStorage.getItem('kakao_analysis_count') || '0')
    if (stored === today) {
      setUsedCount(count)
      if (count >= 3) setLimitReached(true)
    } else {
      localStorage.setItem('kakao_analysis_date', today)
      localStorage.setItem('kakao_analysis_count', '0')
    }
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

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

  function handleAnalyzeClick() {
    if (!conversation.trim() || loading || limitReached) return
    setStep('ad')
    setAdClicked(false)
  }

  async function startAnalysis() {
    setStep('result')
    setLoading(true)
    setResult('')

    // 사용 횟수 업데이트
    const today = new Date().toLocaleDateString('ko-KR')
    const newCount = usedCount + 1
    localStorage.setItem('kakao_analysis_date', today)
    localStorage.setItem('kakao_analysis_count', String(newCount))
    setUsedCount(newCount)
    if (newCount >= 3) setLimitReached(true)

    try {
      const res = await fetch('/api/kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation }),
      })
      if (!res.ok) { showToast('오류가 발생했어요'); setLoading(false); return }
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value)
        setResult(full)
      }
    } catch {
      showToast('오류가 발생했어요')
    }
    setLoading(false)
  }

  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url).then(() => showToast('링크가 복사됐어요! 🔮'))
  }

  const sections = parseResult(result)
  const remaining = Math.max(0, 3 - usedCount)

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, background: '#141428', zIndex: 10 }}>
        <button className="back-btn" onClick={() => router.push('/')}>‹</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 2 }}>카카오톡 대화 분석</div>
          <div style={{ fontSize: 12.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300 }}>이 사람 나를 좋아하는 걸까?</div>
        </div>
        {/* 남은 횟수 */}
        <div style={{ fontSize: 11, color: remaining > 0 ? 'rgba(201,168,76,0.7)' : 'rgba(240,234,216,0.3)', background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '4px 10px' }}>
          오늘 {remaining}회 남음
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 24px 5rem', overflowY: 'auto' }}>

        {/* 입력 화면 */}
        {step === 'input' && (
          <>
            {limitReached ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>😴</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f0ead8', marginBottom: 10 }}>오늘 분석을 다 썼어요</div>
                <div style={{ fontSize: 13.5, color: 'rgba(240,234,216,0.5)', lineHeight: 1.7, marginBottom: 24 }}>
                  하루 3번까지 분석할 수 있어요.<br />내일 다시 와주세요 🔮
                </div>
                <button onClick={() => router.push('/')} className="btn-ghost" style={{ width: '100%', height: 48 }}>
                  다른 분석 해보기
                </button>
              </div>
            ) : (
              <>
                <div style={{ background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.7)', lineHeight: 1.7, fontWeight: 300 }}>
                    💡 상대방과의 카톡 대화를 복사해서 붙여넣으세요.<br />
                    <span style={{ color: 'rgba(240,234,216,0.45)', fontSize: 12 }}>이름은 지워도 되고, 그냥 붙여넣어도 돼요.</span>
                  </div>
                </div>

                <button onClick={() => setConversation(`나: 오늘 뭐해?\n상대: 그냥 집에 있어\n나: 나 오늘 근처 왔는데 ㅋㅋ\n상대: 아 그래?\n나: 같이 밥 먹을래?\n상대: 오늘은 좀 피곤해서..\n나: 아 그렇구나 다음에 보자\n상대: ㅇㅇ`)}
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12.5, color: 'rgba(240,234,216,0.45)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', marginBottom: 12 }}>
                  📋 예시 대화 불러오기
                </button>

                <textarea
                  value={conversation}
                  onChange={e => setConversation(e.target.value)}
                  placeholder={`나: 오늘 뭐해?\n상대: 그냥 집에 있어\n나: 같이 밥 먹을래?\n...`}
                  style={{ width: '100%', minHeight: 220, padding: '16px', marginBottom: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, fontSize: 13.5, color: '#f0ead8', fontFamily: 'inherit', lineHeight: 1.7, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
                />

                <button onClick={handleAnalyzeClick} disabled={!conversation.trim()}
                  style={{ width: '100%', height: 52, background: conversation.trim() ? 'linear-gradient(135deg, #b8922e, #e8c96a)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: conversation.trim() ? '#1a1410' : 'rgba(240,234,216,0.3)', cursor: conversation.trim() ? 'pointer' : 'default', fontFamily: 'inherit' }}>
                  🔍 대화 분석하기
                </button>
              </>
            )}
          </>
        )}

        {/* 광고 화면 */}
        {step === 'ad' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0ead8', marginBottom: 6 }}>분석 준비 완료!</div>
              <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', lineHeight: 1.6 }}>
                아래 광고를 클릭하면<br />분석 결과를 볼 수 있어요 🔮
              </div>
            </div>

            {/* 쿠팡 광고 배너 */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => setAdClicked(true)}>
              <iframe
                src="https://coupa.ng/cgTsq3"
                width="100%"
                height="120"
                frameBorder="0"
                scrolling="no"
                referrerPolicy="unsafe-url"
                style={{ display: 'block' }}
              />
            </div>

            <div style={{ fontSize: 11, color: 'rgba(240,234,216,0.25)', textAlign: 'center' }}>
              이 포스팅은 쿠팡 파트너스 활동의 일환으로 수수료를 제공받습니다
            </div>

            {/* 결과 보기 버튼 */}
            {adClicked ? (
              <button onClick={startAnalysis}
                style={{ width: '100%', height: 52, background: 'linear-gradient(135deg, #b8922e, #e8c96a)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700, color: '#1a1410', cursor: 'pointer', fontFamily: 'inherit' }}>
                🔍 분석 결과 보기
              </button>
            ) : (
              <div style={{ width: '100%', height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'rgba(240,234,216,0.3)' }}>
                광고를 클릭하면 버튼이 나타납니다
              </div>
            )}

            <button onClick={() => setStep('input')} className="btn-ghost" style={{ height: 40, fontSize: 13 }}>
              돌아가기
            </button>
          </div>
        )}

        {/* 결과 화면 */}
        {step === 'result' && (
          <div className="fade-up">
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 20 }}>
                <div className="spinner" />
                <div style={{ fontSize: 13.5, color: 'rgba(240,234,216,0.5)', fontWeight: 300, textAlign: 'center', lineHeight: 1.7 }}>
                  대화를 분석하고 있어요<br />
                  <em style={{ color: '#c9a84c', fontStyle: 'italic' }}>잠시만 기다려주세요...</em>
                </div>
              </div>
            )}

            {result && (
              <>
                <div style={{ background: 'linear-gradient(160deg, #1e1b38 0%, #141428 100%)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '20px', marginBottom: 24 }}>
                  <div style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(201,168,76,0.7)', textAlign: 'center', marginBottom: 16 }}>✦ 카톡 대화 분석 결과</div>
                  {sections.map((s, i) => (
                    <div key={i} className="rs-section">
                      <div className="rs-sep"><span className="rs-label">분석</span><div className="rs-sep-line" /></div>
                      <div className="rs-title">{s.title}</div>
                      <div className="rs-body">{s.body}</div>
                    </div>
                  ))}
                </div>

                {!limitReached && (
                  <button onClick={() => { setStep('input'); setResult(''); setConversation('') }}
                    className="btn-gold" style={{ width: '100%', height: 52, fontSize: 15, marginBottom: 10 }}>
                    다른 대화 분석하기 ({remaining}회 남음)
                  </button>
                )}

                {limitReached && (
                  <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, marginBottom: 10, fontSize: 13, color: 'rgba(240,234,216,0.45)' }}>
                    오늘 분석을 모두 사용했어요. 내일 다시 올게요 🌙
                  </div>
                )}

                <button onClick={copyLink} style={{ width: '100%', height: 44, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, fontSize: 13, color: '#c9a84c', cursor: 'pointer', fontFamily: 'inherit' }}>
                  🔗 친구에게 링크 보내기
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
