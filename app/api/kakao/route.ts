import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const { conversation } = await req.json()
  if (!conversation) return new Response(JSON.stringify({ error: '대화 내용이 없어요' }), { status: 400 })

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: `당신은 연애 심리 전문가입니다. 카카오톡 대화를 분석해서 세 가지를 알려주세요.
마크다운 기호(**, ##, -)는 절대 쓰지 마세요.
이모지는 섹션 제목 앞에만 써주세요.
전문 용어 없이 친구한테 얘기하듯 쉽고 따뜻하게 써주세요.
한국어로 작성하세요.
아래 형식으로 작성하세요:

[💘 관심도 분석]
이 사람이 나를 좋아하는지 솔직하게 2-3문장. "관심 있어요" / "애매해요" / "관심 없어요" 중 하나로 시작하세요.

[🧠 상대방 심리 분석]
대화 패턴으로 보이는 이 사람의 성격과 애착유형을 2-3문장.

[💬 답장 코칭]
지금 상황에서 어떻게 답장하면 좋을지 구체적인 예시 문장 포함해서 2-3문장.`,
    messages: [{ role: 'user', content: `다음 카카오톡 대화를 분석해주세요:\n\n${conversation}` }],
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
