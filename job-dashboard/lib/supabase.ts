import { createClient } from "@supabase/supabase-js";

// 서버 전용 - 서비스 롤 키로 RLS 우회하여 userId 기반 필터링 수행
export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았습니다. " +
      "NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 .env.local에 추가하세요."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
