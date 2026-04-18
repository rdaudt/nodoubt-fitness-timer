insert into public.official_templates (
  id,
  slug,
  title,
  summary,
  workout_type,
  difficulty,
  interval_count,
  total_seconds,
  intervals,
  is_published
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'starter-hiit-18',
    'Starter HIIT 18',
    'Introductory HIIT template with steady work and recovery pacing.',
    'hiit',
    'beginner',
    6,
    1080,
    '[
      {"id":"warmup","label":"Warm up","kind":"warmup","durationSeconds":180},
      {"id":"round-1-work","label":"Round 1 work","kind":"work","durationSeconds":45},
      {"id":"round-1-rest","label":"Round 1 rest","kind":"rest","durationSeconds":30},
      {"id":"round-2-work","label":"Round 2 work","kind":"work","durationSeconds":45},
      {"id":"round-2-rest","label":"Round 2 rest","kind":"rest","durationSeconds":30},
      {"id":"cooldown","label":"Cooldown","kind":"cooldown","durationSeconds":750}
    ]'::jsonb,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'mobility-reset-12',
    'Mobility Reset 12',
    'Low-intensity mobility flow intended for recovery or warm-up blocks.',
    'mobility',
    'beginner',
    5,
    720,
    '[
      {"id":"prep","label":"Prep","kind":"warmup","durationSeconds":120},
      {"id":"flow-1","label":"Flow 1","kind":"work","durationSeconds":120},
      {"id":"transition-1","label":"Transition","kind":"rest","durationSeconds":30},
      {"id":"flow-2","label":"Flow 2","kind":"work","durationSeconds":120},
      {"id":"reset","label":"Reset","kind":"cooldown","durationSeconds":330}
    ]'::jsonb,
    true
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  workout_type = excluded.workout_type,
  difficulty = excluded.difficulty,
  interval_count = excluded.interval_count,
  total_seconds = excluded.total_seconds,
  intervals = excluded.intervals,
  is_published = excluded.is_published,
  updated_at = timezone('utc', now());
