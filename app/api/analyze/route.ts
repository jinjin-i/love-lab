// app/api/analyze/route.ts
import { NextRequest } from 'next/server'
import { QUIZZES, QuizType } from '@/lib/quizData'

export async function POST(req: NextRequest) {
  try {
    const { quizType, answers } = await req.json()
    const quiz = QUIZZES[quizType as QuizType]

    if (!quiz) {
      return new Response(JSON.stringify({ error: '잘못된 요청입니다' }), { status: 400 })
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
        stream: true,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'AI 분석 오류' }), { status: 500 })
    }

    // 스트리밍 응답을 그대로 클라이언트에 전달
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    const reader = res.body!.getReader()
    const decoder = new TextDecoder()

    ;(async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  await writer.write(encoder.encode(parsed.delta.text))
                }
              } catch {}
            }
          }
        }
      } finally {
        await writer.close()
      }
    })()

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (err) {
    console.error('analyze error:', err)
    return new Response(JSON.stringify({ error: '분석 중 오류가 발생했어요' }), { status: 500 })
  }
}
