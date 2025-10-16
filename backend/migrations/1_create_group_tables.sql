
-- up
CREATE TABLE "group" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL
);

CREATE TABLE group_member (
    group_id INTEGER NOT NULL REFERENCES "group"(id),
    user_id TEXT NOT NULL,
    PRIMARY KEY (group_id, user_id)
);

-- down
DROP TABLE group_member;
DROP TABLE "group";
