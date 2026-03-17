-- ============================================================
-- 취준 대시보드 - Supabase 스키마
-- Supabase 대시보드 > SQL Editor에서 실행하세요.
-- ============================================================

-- jobs 테이블 생성
CREATE TABLE IF NOT EXISTS jobs (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  company       TEXT NOT NULL,
  position      TEXT NOT NULL,
  department    TEXT,
  stage         TEXT NOT NULL DEFAULT 'wishlist',
  applied_date  TEXT,
  deadline      TEXT,
  next_event_date TEXT,
  next_event_note TEXT,
  salary        TEXT,
  location      TEXT,
  job_url       TEXT,
  cover_letter  TEXT,
  notes         TEXT,
  tags          TEXT[] DEFAULT '{}',
  priority      TEXT NOT NULL DEFAULT 'medium',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 유저 ID 인덱스 (자주 사용되는 필터)
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs (user_id);
CREATE INDEX IF NOT EXISTS jobs_user_stage_idx ON jobs (user_id, stage);

-- Row Level Security 활성화
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- 서비스 롤 키(SUPABASE_SERVICE_ROLE_KEY)를 사용하므로
-- 서버에서 RLS를 우회합니다. 아래 정책은 추가 보안 레이어입니다.
-- (직접 Supabase 클라이언트로 접근하는 경우를 막기 위한 안전장치)
CREATE POLICY "service_role_only" ON jobs
  USING (auth.role() = 'service_role');
