import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const { message } = await req.json()
  if (!message) return new Response(JSON.stringify({ error: '메시지가 없어요' }), { status: 400 })

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5',
    max_tokens: 600,
    system: `당신은 연애심리연구소의 AI 연애 상담사입니다. 따뜻하고 솔직하게 연애 고민을 들어주고 심리학적 관점에서 조언해주세요. 
전문 용어 없이 친구처럼 쉽고 공감 있게 답변하세요. 
마크다운 기호(**, ##, -)는 절대 쓰지 마세요. 
답변은 3-5문장으로 간결하게 해주세요.
한국어로 답변하세요.`,
    messages: [{ role: 'user', content: message }],
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

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
