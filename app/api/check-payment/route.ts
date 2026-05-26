// app/api/check-payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()
    const phoneNormalized = phone.replace(/[^0-9]/g, '')

    if (!phoneNormalized || phoneNormalized.length < 10) {
      return NextResponse.json({ error: '올바른 전화번호를 입력해주세요' }, { status: 400 })
    }

    // 전화번호로 결과 조회
    const snapshot = await db.collection('results')
      .where('phone', '==', phoneNormalized)
      .where('quizType', '==', 'ex')
      .orderBy('paidAt', 'desc')
      .limit(1)
      .get()

    if (snapshot.empty) {
      return NextResponse.json({ found: false })
    }

    const data = snapshot.docs[0].data()
    return NextResponse.json({
      found: true,
      resultText: data.resultText,
      paidAt: data.paidAt,
      orderId: data.orderId,
    })

  } catch (err: any) {
    console.error('check-payment error:', err)
    return NextResponse.json({ error: '서버 오류가 발생했어요' }, { status: 500 })
  }
}
