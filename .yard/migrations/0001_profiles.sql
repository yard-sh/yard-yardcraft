-- One row per player: their display name, skin and arm model.
-- skin is "preset:<id>" or "custom:<skins.id>".
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  skin TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'classic',
  updated_at INTEGER NOT NULL
);
