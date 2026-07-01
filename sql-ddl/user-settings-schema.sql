-- User preferences for the coding challenge dashboard.
-- Applied via Neon MCP during development; source of truth for the schema.

CREATE TABLE IF NOT EXISTS user_settings (
  "userId" INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  "challengeMinutes" INTEGER NOT NULL DEFAULT 2 CHECK ("challengeMinutes" BETWEEN 1 AND 60)
);
