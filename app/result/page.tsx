'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { QUIZZES } from '@/lib/quizData'
import html2canvas from 'html2canvas'

const CAT_SVGS: Record<string, string> = {
  attachment: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M72 60 Q80 35 90 55" fill="none" stroke="#c9a84c" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="60" cy="105" rx="32" ry="28" fill="#e8d48a"/>
    <ellipse cx="38" cy="128" rx="11" ry="8" fill="#e8d48a"/>
    <ellipse cx="82" cy="128" rx="11" ry="8" fill="#e8d48a"/>
    <circle cx="60" cy="68" r="34" fill="#f5e4a0"/>
    <polygon points="30,48 38,18 50,45" fill="#f5e4a0"/>
    <polygon points="70,45 82,18 90,48" fill="#f5e4a0"/>
    <polygon points="33,47 39,24 47,45" fill="#e8b4a0"/>
    <polygon points="73,45 81,24 88,47" fill="#e8b4a0"/>
    <ellipse cx="48" cy="66" rx="10" ry="12" fill="white"/>
    <ellipse cx="72" cy="66" rx="10" ry="12" fill="white"/>
    <circle cx="48" cy="68" r="6" fill="#3a2800"/>
    <circle cx="72" cy="68" r="6" fill="#3a2800"/>
    <circle cx="51" cy="64" r="2.5" fill="white"/>
    <circle cx="75" cy="64" r="2.5" fill="white"/>
    <path d="M39 54 Q48 49 55 54" fill="none" stroke="#8a6200" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M65 54 Q72 49 81 54" fill="none" stroke="#8a6200" stroke-width="1.8" stroke-linecap="round"/>
    <ellipse cx="60" cy="79" rx="3.5" ry="2.5" fill="#e8907a"/>
    <path d="M53 85 Q60 82 67 85" fill="none" stroke="#8a6200" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="35" cy="74" rx="8" ry="5" fill="#f5a0a0" opacity="0.45"/>
    <ellipse cx="85" cy="74" rx="8" ry="5" fill="#f5a0a0" opacity="0.45"/>
    <line x1="18" y1="77" x2="42" y2="80" stroke="#8a6200" stroke-width="1" opacity="0.5"/>
    <line x1="18" y1="83" x2="42" y2="83" stroke="#8a6200" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="80" x2="102" y2="77" stroke="#8a6200" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="83" x2="102" y2="83" stroke="#8a6200" stroke-width="1" opacity="0.5"/>
    <rect x="14" y="100" width="16" height="22" rx="3" fill="#2a2a3a" stroke="#c9a84c" stroke-width="1.5"/>
    <rect x="16" y="103" width="12" height="15" rx="2" fill="#5a9fd4" opacity="0.8"/>
    <ellipse cx="8" cy="88" rx="13" ry="10" fill="#c9a84c"/>
    <path d="M14 95 L18 103 L8 98" fill="#c9a84c"/>
    <text x="8" y="93" text-anchor="middle" font-size="11" font-weight="900" fill="#1e1b38">?</text>
  </svg>`,

  pattern: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M75 62 Q95 48 88 32 Q81 18 70 26" fill="none" stroke="#a084cc" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="58" cy="105" rx="32" ry="28" fill="#c8a8f0"/>
    <ellipse cx="36" cy="128" rx="11" ry="8" fill="#c8a8f0"/>
    <ellipse cx="80" cy="128" rx="11" ry="8" fill="#c8a8f0"/>
    <circle cx="58" cy="68" r="34" fill="#dcc8f8"/>
    <polygon points="28,48 36,18 48,45" fill="#dcc8f8"/>
    <polygon points="68,45 80,18 88,48" fill="#dcc8f8"/>
    <polygon points="31,47 37,24 45,45" fill="#c8a0e8"/>
    <polygon points="71,45 79,24 86,47" fill="#c8a0e8"/>
    <ellipse cx="46" cy="66" rx="10" ry="12" fill="white"/>
    <ellipse cx="70" cy="66" rx="10" ry="12" fill="white"/>
    <line x1="40" y1="60" x2="52" y2="72" stroke="#5030a0" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="52" y1="60" x2="40" y2="72" stroke="#5030a0" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="64" y1="60" x2="76" y2="72" stroke="#5030a0" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="76" y1="60" x2="64" y2="72" stroke="#5030a0" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="58" cy="79" rx="3.5" ry="2.5" fill="#c87aaa"/>
    <path d="M51 86 Q58 91 65 86" fill="none" stroke="#5030a0" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="33" cy="74" rx="8" ry="5" fill="#d0a0f0" opacity="0.5"/>
    <ellipse cx="83" cy="74" rx="8" ry="5" fill="#d0a0f0" opacity="0.5"/>
    <line x1="16" y1="77" x2="40" y2="80" stroke="#7050a0" stroke-width="1" opacity="0.5"/>
    <line x1="16" y1="83" x2="40" y2="83" stroke="#7050a0" stroke-width="1" opacity="0.5"/>
    <line x1="76" y1="80" x2="100" y2="77" stroke="#7050a0" stroke-width="1" opacity="0.5"/>
    <line x1="76" y1="83" x2="100" y2="83" stroke="#7050a0" stroke-width="1" opacity="0.5"/>
    <path d="M88 22 L90 16 L92 22 L98 20 L93 25 L95 31 L90 27 L85 31 L87 25 L82 20 Z" fill="#c8a8f0"/>
    <path d="M18 28 L20 22 L22 28 L27 26 L23 30 L25 36 L20 32 L15 36 L17 30 L12 26 Z" fill="#c8a8f0" opacity="0.7"/>
  </svg>`,

  ideal: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M74 62 Q95 52 91 36 Q87 22 76 28" fill="none" stroke="#84b4cc" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="60" cy="105" rx="32" ry="28" fill="#a0c8e0"/>
    <ellipse cx="38" cy="128" rx="11" ry="8" fill="#a0c8e0"/>
    <ellipse cx="82" cy="128" rx="11" ry="8" fill="#a0c8e0"/>
    <circle cx="60" cy="68" r="34" fill="#c8e4f4"/>
    <polygon points="30,48 38,18 50,45" fill="#c8e4f4"/>
    <polygon points="70,45 82,18 90,48" fill="#c8e4f4"/>
    <polygon points="33,47 39,24 47,45" fill="#a8c8e0"/>
    <polygon points="73,45 81,24 88,47" fill="#a8c8e0"/>
    <ellipse cx="48" cy="66" rx="10" ry="12" fill="white"/>
    <ellipse cx="72" cy="66" rx="10" ry="12" fill="white"/>
    <circle cx="48" cy="68" r="6" fill="#2a5a7a"/>
    <circle cx="72" cy="68" r="6" fill="#2a5a7a"/>
    <circle cx="51" cy="63" r="3" fill="white"/>
    <circle cx="75" cy="63" r="3" fill="white"/>
    <circle cx="46" cy="69" r="1.5" fill="white"/>
    <circle cx="70" cy="69" r="1.5" fill="white"/>
    <ellipse cx="60" cy="79" rx="3.5" ry="2.5" fill="#7ab0cc"/>
    <path d="M53 86 Q60 92 67 86" fill="none" stroke="#2a5a7a" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="35" cy="74" rx="8" ry="5" fill="#90c8e0" opacity="0.45"/>
    <ellipse cx="85" cy="74" rx="8" ry="5" fill="#90c8e0" opacity="0.45"/>
    <line x1="18" y1="77" x2="42" y2="80" stroke="#3a6a8a" stroke-width="1" opacity="0.5"/>
    <line x1="18" y1="83" x2="42" y2="83" stroke="#3a6a8a" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="80" x2="102" y2="77" stroke="#3a6a8a" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="83" x2="102" y2="83" stroke="#3a6a8a" stroke-width="1" opacity="0.5"/>
    <line x1="22" y1="112" x2="22" y2="96" stroke="#84b4cc" stroke-width="2"/>
    <line x1="14" y1="96" x2="30" y2="96" stroke="#84b4cc" stroke-width="2"/>
    <ellipse cx="14" cy="101" rx="6" ry="3" fill="none" stroke="#84b4cc" stroke-width="1.5"/>
    <ellipse cx="30" cy="99" rx="6" ry="3" fill="none" stroke="#84b4cc" stroke-width="1.5"/>
    <path d="M95 18 L97 12 L99 18 L105 16 L100 21 L102 27 L97 23 L92 27 L94 21 L89 16 Z" fill="#84b4cc" opacity="0.8"/>
  </svg>`,

  ex: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M76 62 Q98 52 94 36 Q90 21 79 28" fill="none" stroke="#cc84a0" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="60" cy="105" rx="32" ry="28" fill="#f0a8c0"/>
    <ellipse cx="38" cy="128" rx="11" ry="8" fill="#f0a8c0"/>
    <ellipse cx="82" cy="128" rx="11" ry="8" fill="#f0a8c0"/>
    <circle cx="60" cy="68" r="34" fill="#fcc8dc"/>
    <polygon points="30,48 38,18 50,45" fill="#fcc8dc"/>
    <polygon points="70,45 82,18 90,48" fill="#fcc8dc"/>
    <polygon points="33,47 39,24 47,45" fill="#f0a0b8"/>
    <polygon points="73,45 81,24 88,47" fill="#f0a0b8"/>
    <path d="M38 66 Q48 58 58 66" fill="none" stroke="#8a3a58" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M62 66 Q72 58 82 66" fill="none" stroke="#8a3a58" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="43" cy="74" rx="2.5" ry="4.5" fill="#84b4cc" opacity="0.85"/>
    <ellipse cx="77" cy="72" rx="2.5" ry="4.5" fill="#84b4cc" opacity="0.85"/>
    <ellipse cx="60" cy="79" rx="3.5" ry="2.5" fill="#e8709a"/>
    <path d="M53 86 Q60 83 67 86" fill="none" stroke="#8a3a58" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="35" cy="74" rx="8" ry="5" fill="#f5a0c0" opacity="0.5"/>
    <ellipse cx="85" cy="74" rx="8" ry="5" fill="#f5a0c0" opacity="0.5"/>
    <line x1="18" y1="77" x2="42" y2="80" stroke="#8a3a58" stroke-width="1" opacity="0.5"/>
    <line x1="18" y1="83" x2="42" y2="83" stroke="#8a3a58" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="80" x2="102" y2="77" stroke="#8a3a58" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="83" x2="102" y2="83" stroke="#8a3a58" stroke-width="1" opacity="0.5"/>
    <path d="M52 46 Q60 38 68 46 Q72 50 68 56 L60 64 L52 56 Q48 50 52 46Z" fill="#cc84a0" opacity="0.55"/>
    <line x1="60" y1="40" x2="60" y2="64" stroke="white" stroke-width="1.5" opacity="0.9"/>
  </svg>`,

  crush: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M76 62 Q98 50 93 34 Q88 20 77 27" fill="none" stroke="#e8a87c" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="60" cy="105" rx="32" ry="28" fill="#f0c090"/>
    <ellipse cx="38" cy="128" rx="11" ry="8" fill="#f0c090"/>
    <ellipse cx="82" cy="128" rx="11" ry="8" fill="#f0c090"/>
    <circle cx="60" cy="68" r="34" fill="#fce0bc"/>
    <polygon points="30,48 38,18 50,45" fill="#fce0bc"/>
    <polygon points="70,45 82,18 90,48" fill="#fce0bc"/>
    <polygon points="33,47 39,24 47,45" fill="#f0b090"/>
    <polygon points="73,45 81,24 88,47" fill="#f0b090"/>
    <path d="M38 62 Q48 54 58 62 Q48 70 38 62Z" fill="#e84848"/>
    <path d="M62 62 Q72 54 82 62 Q72 70 62 62Z" fill="#e84848"/>
    <ellipse cx="60" cy="79" rx="3.5" ry="2.5" fill="#e8907a"/>
    <path d="M52 86 Q60 93 68 86" fill="#f0a080" opacity="0.5"/>
    <path d="M52 86 Q60 94 68 86" fill="none" stroke="#8a4a20" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="34" cy="74" rx="10" ry="6" fill="#f09060" opacity="0.55"/>
    <ellipse cx="86" cy="74" rx="10" ry="6" fill="#f09060" opacity="0.55"/>
    <line x1="18" y1="77" x2="42" y2="80" stroke="#8a4a20" stroke-width="1" opacity="0.5"/>
    <line x1="18" y1="83" x2="42" y2="83" stroke="#8a4a20" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="80" x2="102" y2="77" stroke="#8a4a20" stroke-width="1" opacity="0.5"/>
    <line x1="78" y1="83" x2="102" y2="83" stroke="#8a4a20" stroke-width="1" opacity="0.5"/>
    <path d="M50 44 Q58 36 66 44 Q58 52 50 44Z" fill="#e84848" opacity="0.8"/>
    <path d="M65 38 Q74 29 83 38 Q74 47 65 38Z" fill="#e84848" opacity="0.65"/>
    <path d="M36 46 Q43 39 50 46 Q43 53 36 46Z" fill="#e8a87c" opacity="0.6"/>
  </svg>`,

  couple: `<svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 96 Q20 86 22 70 Q24 56 33 60" fill="none" stroke="#84cca4" stroke-width="5" stroke-linecap="round"/>
    <path d="M82 96 Q100 86 98 70 Q96 56 87 60" fill="none" stroke="#84cca4" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="40" cy="108" rx="24" ry="22" fill="#a0ddb8"/>
    <ellipse cx="80" cy="108" rx="24" ry="22" fill="#a0ddb8"/>
    <ellipse cx="20" cy="126" rx="9" ry="7" fill="#a0ddb8"/>
    <ellipse cx="100" cy="126" rx="9" ry="7" fill="#a0ddb8"/>
    <ellipse cx="60" cy="122" rx="16" ry="9" fill="#84cca4"/>
    <circle cx="40" cy="70" r="28" fill="#c4ecd4"/>
    <circle cx="80" cy="70" r="28" fill="#c4ecd4"/>
    <polygon points="20,54 27,30 37,52" fill="#c4ecd4"/>
    <polygon points="43,52 50,30 57,54" fill="#c4ecd4"/>
    <polygon points="63,54 70,30 77,52" fill="#c4ecd4"/>
    <polygon points="83,52 90,30 97,54" fill="#c4ecd4"/>
    <polygon points="22,53 28,34 35,52" fill="#90c8a8"/>
    <polygon points="45,52 50,34 55,53" fill="#90c8a8"/>
    <polygon points="65,53 70,34 75,52" fill="#90c8a8"/>
    <polygon points="85,52 90,34 95,53" fill="#90c8a8"/>
    <ellipse cx="33" cy="68" rx="7" ry="9" fill="white"/>
    <ellipse cx="47" cy="68" rx="7" ry="9" fill="white"/>
    <circle cx="33" cy="70" r="4" fill="#2a5a3a"/>
    <circle cx="47" cy="70" r="4" fill="#2a5a3a"/>
    <circle cx="35" cy="67" r="2" fill="white"/>
    <circle cx="49" cy="67" r="2" fill="white"/>
    <ellipse cx="73" cy="68" rx="7" ry="9" fill="white"/>
    <ellipse cx="87" cy="68" rx="7" ry="9" fill="white"/>
    <circle cx="73" cy="70" r="4" fill="#2a5a3a"/>
    <circle cx="87" cy="70" r="4" fill="#2a5a3a"/>
    <circle cx="75" cy="67" r="2" fill="white"/>
    <circle cx="89" cy="67" r="2" fill="white"/>
    <ellipse cx="40" cy="68" rx="3" ry="2" fill="#70b888"/>
    <ellipse cx="80" cy="68" rx="3" ry="2" fill="#70b888"/>
    <path d="M35 76 Q40 81 45 76" fill="none" stroke="#2a5a3a" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M75 76 Q80 81 85 76" fill="none" stroke="#2a5a3a" stroke-width="1.4" stroke-linecap="round"/>
    <ellipse cx="26" cy="73" rx="6" ry="4" fill="#80cc98" opacity="0.5"/>
    <ellipse cx="54" cy="73" rx="6" ry="4" fill="#80cc98" opacity="0.5"/>
    <ellipse cx="66" cy="73" rx="6" ry="4" fill="#80cc98" opacity="0.5"/>
    <ellipse cx="94" cy="73" rx="6" ry="4" fill="#80cc98" opacity="0.5"/>
    <path d="M54 52 Q60 44 66 52 Q60 60 54 52Z" fill="#e84848" opacity="0.85"/>
  </svg>`
}

export default function ResultPage() {
  const router = useRouter()
  const [resultText, setResultText] = useState('')
  const [quizType, setQuizType] = useState<string>(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('quiz_type') || 'attachment'
    return 'attachment'
  })
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
    if (stored) { setResultText(stored); setLoading(false); return }
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
    }).catch(() => { showToast('오류가 발생했어요'); setLoading(false) })
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

  function extractTypeName(text: string): string {
    if (!text) return ''
    const patterns = [
      /당신은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /당신의 전 애인은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /당신의 이상형은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /그 사람은\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
      /우리 관계는\s+([가-힣]+-[가-힣]+형|[가-힣]+형)/,
    ]
    for (const p of patterns) {
      const m = text.match(p)
      if (m) return m[1]
    }
    const m = text.split('\n')[0].match(/([가-힣]+-[가-힣]+형|[가-힣]+형)/)
    return m ? m[1] : ''
  }

  function copyLink() {
    const url = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
    navigator.clipboard.writeText(url).then(() => showToast('링크가 복사됐어요! 카톡에 붙여넣기 해보세요 🔮'))
      .catch(() => showToast('복사에 실패했어요'))
  }

  async function captureShareCard() {
    const el = shareCardRef.current
    if (!el) return
    showToast('카드 생성 중...')
    try {
      const canvas = await html2canvas(el, { backgroundColor: '#141428', scale: 3, useCORS: true, logging: false })
      const image = canvas.toDataURL('image/png')
      if (navigator.share) {
        const blob = await (await fetch(image)).blob()
        await navigator.share({ title: '연애 심리 분석 결과', files: [new File([blob], 'love-lab-card.png', { type: 'image/png' })] })
      } else {
        const link = document.createElement('a')
        link.download = 'love-lab-card.png'
        link.href = image
        link.click()
        showToast('카드가 저장됐어요!')
      }
    } catch (e: any) { if (e.name !== 'AbortError') showToast('저장 중 오류가 발생했어요') }
  }

  const typeColors: Record<string, string> = {
    attachment: '#c9a84c', pattern: '#a084cc', ideal: '#84b4cc',
    ex: '#cc84a0', crush: '#e8a87c', couple: '#84cca4'
  }

  const quiz = QUIZZES[quizType]
  const sections = parseResult(resultText)
  const typeName = extractTypeName(resultText)
  const tc = typeColors[quizType] || '#c9a84c'
  const catSvg = CAT_SVGS[quizType] || CAT_SVGS['attachment']

  return (
    <>
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, background: '#141428', zIndex: 10 }}>
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
            <div ref={shareCardRef} style={{
              background: 'linear-gradient(160deg, #1e1b38 0%, #141428 100%)',
              border: `1px solid ${tc}50`,
              borderRadius: 24, padding: '28px 20px 22px',
              textAlign: 'center', marginBottom: 28,
            }}>
              {/* 카테고리 */}
              <div style={{ fontSize: 10, letterSpacing: '0.18em', color: `${tc}bb`, border: `1px solid ${tc}35`, borderRadius: 20, padding: '3px 14px', display: 'inline-block', marginBottom: 16 }}>
                {quiz?.cat}
              </div>

              {/* 고양이 일러스트 */}
              <div style={{ width: 110, height: 110, margin: '0 auto 14px' }}
                dangerouslySetInnerHTML={{ __html: catSvg }} />

              {/* 유형 이름 */}
              {typeName ? (
                <div style={{ fontFamily: 'Noto Serif KR, serif', fontSize: '1.8rem', fontWeight: 700, color: '#f0ead8', letterSpacing: '0.02em', marginBottom: 8, lineHeight: 1.2 }}>
                  {typeName}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.4)', marginBottom: 8 }}>분석 중...</div>
              )}

              <div style={{ width: 28, height: 2, background: `${tc}70`, margin: '0 auto 16px', borderRadius: 2 }} />

              {/* 저장 버튼 */}
              <button onClick={captureShareCard} style={{
                background: `${tc}22`, border: `1px solid ${tc}50`, borderRadius: 10,
                padding: '7px 20px', fontSize: 12, color: `${tc}ee`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                ✨ 카드 저장하기
              </button>

              <div style={{ fontSize: 9, color: 'rgba(240,234,216,0.18)', marginTop: 14, letterSpacing: '0.1em' }}>love-lab.kr</div>
            </div>

            {/* 분석 본문 */}
            {sections.map((s, i) => (
              <div key={i} className="rs-section">
                <div className="rs-sep"><span className="rs-label">분석</span><div className="rs-sep-line" /></div>
                <div className="rs-title">{s.title}</div>
                <div className="rs-body">{s.body}</div>
              </div>
            ))}

            {/* 공유 섹션 */}
            <div style={{ marginTop: 32, background: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 16, padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f0ead8', marginBottom: 6 }}>친구와 공유하기</div>
              <div style={{ fontSize: 13, color: 'rgba(240,234,216,0.5)', marginBottom: 16, lineHeight: 1.6 }}>나도 분석해보라고 링크를 보내봐요 🔮</div>
              <button onClick={copyLink} style={{
                width: '100%', height: 48,
                background: 'linear-gradient(135deg, #b8922e, #e8c96a)',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700, color: '#1a1410',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>🔗 링크 복사하기</button>
            </div>
          </div>
        )}
      </div>

      {!loading && (
        <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-gold" style={{ height: 52, fontSize: 15 }}
            onClick={() => { sessionStorage.removeItem('result_text'); sessionStorage.removeItem('quiz_answers'); router.push(`/quiz/${quizType}`) }}>
            다시 분석하기
          </button>
          <button className="btn-ghost" onClick={() => router.push('/')}>처음으로 돌아가기</button>
        </div>
      )}

      <div className={`toast ${toast ? 'on' : ''}`}>{toast}</div>
    </>
  )
}
