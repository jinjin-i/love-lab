// app/api/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { paymentKey, orderId, amount, phone, answers, quizType } = await req.json()

    // 1. 토스페이먼츠 결제 승인 요청
    const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })

    const tossData = await tossRes.json()

    if (!tossRes.ok) {
      return NextResponse.json({ error: tossData.message || '결제 승인 실패' }, { status: 400 })
    }

    // 2. 금액 검증 (1990원 맞는지 확인)
    if (tossData.totalAmount !== 1990) {
      return NextResponse.json({ error: '결제 금액 오류' }, { status: 400 })
    }

    // 3. Claude AI 분석 실행
    const { QUIZZES } = await import('@/lib/quizData')
    const quiz = QUIZZES[quizType as keyof typeof QUIZZES]
    const prompt = quiz.prompt(answers)

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const claudeData = await claudeRes.json()
    const resultText = claudeData.content?.map((c: any) => c.text || '').join('') || ''

    // 4. Firebase에 저장 (전화번호로 조회 가능하게)
    const phoneNormalized = phone.replace(/[^0-9]/g, '') // 숫자만
    await db.collection('results').doc(orderId).set({
      orderId,
      paymentKey,
      phone: phoneNormalized,
      quizType,
      resultText,
      paidAt: new Date().toISOString(),
      amount: tossData.totalAmount,
    })

    // 5. 전화번호 인덱스 (나중에 조회용)
    await db.collection('phones').doc(phoneNormalized).set({
      orderIds: db.collection('phones').doc(phoneNormalized)
        ? { arrayUnion: orderId }
        : [orderId],
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    return NextResponse.json({ success: true, orderId, resultText })

  } catch (err: any) {
    console.error('confirm error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 })
  }
}
