// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { QUIZZES, QuizType } from '@/lib/quizData'

export async function POST(req: NextRequest) {
  try {
    const { quizType, answers } = await req.json()
    const quiz = QUIZZES[quizType as QuizType]

    if (!quiz || quiz.paid) {
      return NextResponse.json({ error: '잘못된 요청입니다' }, { status: 400 })
    }

    const prompt = quiz.prompt(answers)

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await res.json()
    const resultText = data.content?.map((c: any) => c.text || '').join('') || ''

    return NextResponse.json({ success: true, resultText })

  } catch (err) {
    console.error('analyze error:', err)
    return NextResponse.json({ error: '분석 중 오류가 발생했어요' }, { status: 500 })
  }
}
