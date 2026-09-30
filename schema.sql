PRAGMA foreign_keys = ON;


-- ============================================================================
-- 1. USERS
-- ============================================================================

CREATE TABLE users (
  id           INTEGER PRIMARY KEY,
  username     TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT,
  bio          TEXT,
  avatar_url   TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at   INTEGER
);


-- ============================================================================
-- 2. COMMUNITIES
-- ============================================================================

CREATE TABLE communities (
  id               INTEGER PRIMARY KEY,
  name             TEXT NOT NULL UNIQUE COLLATE NOCASE,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  creator_id       INTEGER
                   REFERENCES users(id)
                   ON DELETE SET NULL,
  subscriber_count INTEGER NOT NULL DEFAULT 0,
  created_at       INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at       INTEGER
);


-- ============================================================================
-- 3. COMMUNITY SUBSCRIPTIONS
-- ============================================================================

CREATE TABLE community_subscriptions (
  id           INTEGER PRIMARY KEY,
  user_id      INTEGER NOT NULL
               REFERENCES users(id)
               ON DELETE CASCADE,
  community_id INTEGER NOT NULL
               REFERENCES communities(id)
               ON DELETE CASCADE,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE (user_id, community_id)
);

CREATE INDEX idx_subscriptions_user
ON community_subscriptions (
  user_id,
  created_at DESC
);

CREATE INDEX idx_subscriptions_community
ON community_subscriptions (
  community_id,
  created_at DESC
);


-- ============================================================================
-- 4. POSTS
-- ============================================================================

CREATE TABLE posts (
  id            INTEGER PRIMARY KEY,

  community_id  INTEGER NOT NULL
                REFERENCES communities(id)
                ON DELETE CASCADE,

  author_id     INTEGER
                REFERENCES users(id)
                ON DELETE SET NULL,

  title         TEXT NOT NULL,

  content_text  TEXT NOT NULL DEFAULT '',

  score         INTEGER NOT NULL DEFAULT 0,

  comment_count INTEGER NOT NULL DEFAULT 0,

  created_at    INTEGER NOT NULL DEFAULT (unixepoch()),

  updated_at    INTEGER,

  deleted_at    INTEGER
);


-- Newest posts in a community
CREATE INDEX idx_posts_community_new
ON posts (
  community_id,
  created_at DESC,
  id DESC
);


-- Posts by a user
CREATE INDEX idx_posts_author
ON posts (
  author_id,
  created_at DESC,
  id DESC
);


-- Top posts in a community
CREATE INDEX idx_posts_community_top
ON posts (
  community_id,
  score DESC,
  created_at DESC,
  id DESC
);


-- ============================================================================
-- 5. COMMENTS
-- ============================================================================

CREATE TABLE comments (
  id           INTEGER PRIMARY KEY,

  post_id      INTEGER NOT NULL
               REFERENCES posts(id)
               ON DELETE CASCADE,

  parent_id    INTEGER
               REFERENCES comments(id)
               ON DELETE CASCADE,

  author_id    INTEGER
               REFERENCES users(id)
               ON DELETE SET NULL,

  content_text TEXT NOT NULL,

  depth        INTEGER NOT NULL DEFAULT 0
               CHECK (depth >= 0),

  score        INTEGER NOT NULL DEFAULT 0,

  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),

  updated_at   INTEGER,

  deleted_at   INTEGER
);


-- Comments for a post
CREATE INDEX idx_comments_post
ON comments (
  post_id,
  created_at ASC,
  id ASC
);


-- Replies to a comment
CREATE INDEX idx_comments_parent
ON comments (
  parent_id,
  created_at ASC,
  id ASC
);


-- Comments by author
CREATE INDEX idx_comments_author
ON comments (
  author_id,
  created_at DESC,
  id DESC
);


-- ============================================================================
-- 6. POST VOTES
-- ============================================================================

CREATE TABLE post_votes (
  id         INTEGER PRIMARY KEY,

  user_id    INTEGER NOT NULL
             REFERENCES users(id)
             ON DELETE CASCADE,

  post_id    INTEGER NOT NULL
             REFERENCES posts(id)
             ON DELETE CASCADE,

  value      INTEGER NOT NULL
             CHECK (value IN (-1, 1)),

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE (user_id, post_id)
);


CREATE INDEX idx_post_votes_post
ON post_votes (
  post_id
);


-- ============================================================================
-- 7. COMMENT VOTES
-- ============================================================================

CREATE TABLE comment_votes (
  id         INTEGER PRIMARY KEY,

  user_id    INTEGER NOT NULL
             REFERENCES users(id)
             ON DELETE CASCADE,

  comment_id INTEGER NOT NULL
             REFERENCES comments(id)
             ON DELETE CASCADE,

  value      INTEGER NOT NULL
             CHECK (value IN (-1, 1)),

  created_at INTEGER NOT NULL DEFAULT (unixepoch()),

  UNIQUE (user_id, comment_id)
);


CREATE INDEX idx_comment_votes_comment
ON comment_votes (
  comment_id
);


-- ============================================================================
-- 8. FTS5 SEARCH TABLES
-- ============================================================================
-- External-content FTS5.
-- The actual data stays in posts/comments.
--
-- prefix='2 3' adds indexes for 2- and 3-character prefixes.
-- unicode61 is the standard Unicode tokenizer.
-- ============================================================================

CREATE VIRTUAL TABLE posts_fts USING fts5(
  title,
  content_text,
  content='posts',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2',
  prefix='2 3'
);


CREATE VIRTUAL TABLE comments_fts USING fts5(
  content_text,
  content='comments',
  content_rowid='id',
  tokenize='unicode61 remove_diacritics 2',
  prefix='2 3'
);


-- ============================================================================
-- 9. POST FTS5 TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_posts_fts_ai
AFTER INSERT ON posts
BEGIN
  INSERT INTO posts_fts (
    rowid,
    title,
    content_text
  )
  VALUES (
    new.id,
    new.title,
    new.content_text
  );
END;


CREATE TRIGGER trg_posts_fts_ad
AFTER DELETE ON posts
BEGIN
  INSERT INTO posts_fts (
    posts_fts,
    rowid,
    title,
    content_text
  )
  VALUES (
    'delete',
    old.id,
    old.title,
    old.content_text
  );
END;


CREATE TRIGGER trg_posts_fts_au
AFTER UPDATE OF title, content_text ON posts
BEGIN
  INSERT INTO posts_fts (
    posts_fts,
    rowid,
    title,
    content_text
  )
  VALUES (
    'delete',
    old.id,
    old.title,
    old.content_text
  );

  INSERT INTO posts_fts (
    rowid,
    title,
    content_text
  )
  VALUES (
    new.id,
    new.title,
    new.content_text
  );
END;


-- ============================================================================
-- 10. COMMENT FTS5 TRIGGERS
-- ============================================================================

CREATE TRIGGER trg_comments_fts_ai
AFTER INSERT ON comments
BEGIN
  INSERT INTO comments_fts (
    rowid,
    content_text
  )
  VALUES (
    new.id,
    new.content_text
  );
END;


CREATE TRIGGER trg_comments_fts_ad
AFTER DELETE ON comments
BEGIN
  INSERT INTO comments_fts (
    comments_fts,
    rowid,
    content_text
  )
  VALUES (
    'delete',
    old.id,
    old.content_text
  );
END;


CREATE TRIGGER trg_comments_fts_au
AFTER UPDATE OF content_text ON comments
BEGIN
  INSERT INTO comments_fts (
    comments_fts,
    rowid,
    content_text
  )
  VALUES (
    'delete',
    old.id,
    old.content_text
  );

  INSERT INTO comments_fts (
    rowid,
    content_text
  )
  VALUES (
    new.id,
    new.content_text
  );
END;


-- ============================================================================
-- 11. POST VOTE SCORE
-- ============================================================================

CREATE TRIGGER trg_post_votes_ai
AFTER INSERT ON post_votes
BEGIN
  UPDATE posts
  SET score = score + new.value
  WHERE id = new.post_id;
END;


CREATE TRIGGER trg_post_votes_ad
AFTER DELETE ON post_votes
BEGIN
  UPDATE posts
  SET score = score - old.value
  WHERE id = old.post_id;
END;


CREATE TRIGGER trg_post_votes_au
AFTER UPDATE OF value ON post_votes
BEGIN
  UPDATE posts
  SET score = score - old.value + new.value
  WHERE id = new.post_id;
END;


-- ============================================================================
-- 12. COMMENT VOTE SCORE
-- ============================================================================

CREATE TRIGGER trg_comment_votes_ai
AFTER INSERT ON comment_votes
BEGIN
  UPDATE comments
  SET score = score + new.value
  WHERE id = new.comment_id;
END;


CREATE TRIGGER trg_comment_votes_ad
AFTER DELETE ON comment_votes
BEGIN
  UPDATE comments
  SET score = score - old.value
  WHERE id = old.comment_id;
END;


CREATE TRIGGER trg_comment_votes_au
AFTER UPDATE OF value ON comment_votes
BEGIN
  UPDATE comments
  SET score = score - old.value + new.value
  WHERE id = new.comment_id;
END;


-- ============================================================================
-- 13. POST COMMENT COUNT
-- ============================================================================

CREATE TRIGGER trg_comments_count_ai
AFTER INSERT ON comments
BEGIN
  UPDATE posts
  SET comment_count = comment_count + 1
  WHERE id = new.post_id;
END;


CREATE TRIGGER trg_comments_count_ad
AFTER DELETE ON comments
BEGIN
  UPDATE posts
  SET comment_count = comment_count - 1
  WHERE id = old.post_id;
END;


-- ============================================================================
-- 14. COMMUNITY SUBSCRIBER COUNT
-- ============================================================================

CREATE TRIGGER trg_subs_count_ai
AFTER INSERT ON community_subscriptions
BEGIN
  UPDATE communities
  SET subscriber_count = subscriber_count + 1
  WHERE id = new.community_id;
END;


CREATE TRIGGER trg_subs_count_ad
AFTER DELETE ON community_subscriptions
BEGIN
  UPDATE communities
  SET subscriber_count = subscriber_count - 1
  WHERE id = old.community_id;
END;


-- ============================================================================
-- 15. COMMENT DEPTH
-- ============================================================================

CREATE TRIGGER trg_comments_set_depth
AFTER INSERT ON comments
WHEN new.parent_id IS NOT NULL
 AND new.depth = 0
BEGIN
  UPDATE comments
  SET depth = (
    SELECT parent.depth + 1
    FROM comments AS parent
    WHERE parent.id = new.parent_id
  )
  WHERE id = new.id;
END;


-- ============================================================================
-- 16. UPDATED_AT
-- ============================================================================

CREATE TRIGGER trg_users_touch_au
AFTER UPDATE OF display_name, bio, avatar_url ON users
BEGIN
  UPDATE users
  SET updated_at = unixepoch()
  WHERE id = new.id;
END;


CREATE TRIGGER trg_communities_touch_au
AFTER UPDATE OF name, title, description ON communities
BEGIN
  UPDATE communities
  SET updated_at = unixepoch()
  WHERE id = new.id;
END;


CREATE TRIGGER trg_posts_touch_au
AFTER UPDATE OF title, content_text, deleted_at ON posts
BEGIN
  UPDATE posts
  SET updated_at = unixepoch()
  WHERE id = new.id;
END;


CREATE TRIGGER trg_comments_touch_au
AFTER UPDATE OF content_text, deleted_at ON comments
BEGIN
  UPDATE comments
  SET updated_at = unixepoch()
  WHERE id = new.id;
END;


-- ============================================================================
-- 17. VERIFY
-- ============================================================================

SELECT name
FROM sqlite_master
WHERE type IN ('table', 'view')
ORDER BY name;
