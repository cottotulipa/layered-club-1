import { NextResponse } from 'next/server';
import { readJobs } from '@/lib/storage';
import { STAGE_LABELS } from '@/lib/types';
import Anthropic from '@anthropic-ai/sdk';

export async function GET() {
  const jobs = await readJobs();

  // Build stats summary
  const total = jobs.length;
  const byStage: Record<string, number> = {};
  jobs.forEach((j) => {
    byStage[j.stage] = (byStage[j.stage] || 0) + 1;
  });

  const rejected = jobs.filter((j) => j.stage === 'rejected');
  const offers = jobs.filter((j) => j.stage === 'offer');
  const active = jobs.filter(
    (j) => !['rejected', 'withdrawn', 'offer'].includes(j.stage)
  );

  const stagesSummary = Object.entries(byStage)
    .map(([stage, count]) => `${STAGE_LABELS[stage as keyof typeof STAGE_LABELS] ?? stage}: ${count}`)
    .join(', ');

  const rejectedDetails = rejected
    .map((j) => `${j.company} (${j.position}) - ${j.notes ?? '메모 없음'}`)
    .join('\n');

  const prompt = `당신은 취업 코치입니다. 다음은 취준생의 지원 현황 데이터입니다.

총 지원: ${total}건
현황별: ${stagesSummary}
합격: ${offers.length}건, 불합격: ${rejected.length}건, 진행 중: ${active.length}건

불합격 기업 및 메모:
${rejectedDetails || '없음'}

위 데이터를 분석하여 다음을 한국어로 작성해주세요:
1. 현재 취업 활동 전반 평가 (2-3문장)
2. 불합격 패턴 분석 (있다면)
3. 개선 포인트 3가지 (구체적으로)
4. 이번 주 추천 액션 아이템 2가지

각 항목은 JSON 형식으로 반환해주세요:
{
  "overall": "전반 평가 텍스트",
  "rejectionPattern": "패턴 분석 텍스트",
  "improvements": ["개선1", "개선2", "개선3"],
  "actions": ["액션1", "액션2"]
}`;

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(getMockInsights(total, rejected.length, offers.length, active.length));
    }

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    return NextResponse.json(getMockInsights(total, rejected.length, offers.length, active.length));
  } catch {
    return NextResponse.json(getMockInsights(total, rejected.length, offers.length, active.length));
  }
}

function getMockInsights(total: number, rejected: number, offers: number, active: number) {
  return {
    overall: `총 ${total}건의 지원 중 ${offers}건 합격, ${rejected}건 불합격, ${active}건 진행 중입니다. 합격률은 ${total > 0 ? Math.round((offers / total) * 100) : 0}%로, ${offers > 0 ? '좋은 성과를 내고 있습니다.' : '아직 합격 소식을 기다리고 있습니다.'}`,
    rejectionPattern: rejected > 0
      ? `${rejected}건의 불합격 중 서류 단계 탈락이 주를 이루고 있습니다. 자기소개서의 직무 연관성과 구체적인 성과 수치를 보강하는 것이 필요해 보입니다.`
      : '아직 불합격 패턴을 분석할 데이터가 충분하지 않습니다.',
    improvements: [
      '자소서에 구체적인 수치(매출 OO% 증가, 비용 OO% 절감 등)를 추가하세요',
      '지원하는 기업의 최근 서비스/뉴스를 리서치하여 맞춤 지원서를 작성하세요',
      '면접 전 기업 컬처핏 준비를 강화하고 역질문을 미리 준비하세요',
    ],
    actions: [
      `${active}건의 진행 중 지원에 대한 다음 일정을 캘린더에 정리하세요`,
      '이번 주 최소 2개 신규 공고에 지원하여 파이프라인을 유지하세요',
    ],
  };
}
