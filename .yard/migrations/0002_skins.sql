-- Uploaded skins, stored once per distinct image (id is a hash of the PNG).
CREATE TABLE IF NOT EXISTS skins (
  id TEXT PRIMARY KEY,
  png TEXT NOT NULL,
  owner TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
