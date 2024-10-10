-- name: CreateAuthor :one
INSERT INTO authors (
        username,
        author_type,
        author_is_active
    )
VALUES (
        $1,
        $2,
        $3
    )
RETURNING *;

-- name: GetAuthor :one
SELECT *
FROM authors
WHERE user = $1
LIMIT 1;

-- name: UpdateAuthor :one
-- coalesce function returns the first non null value of the variables
UPDATE authors
SET author_type = $2,
    author_is_active = $3
WHERE user = $1
RETURNING *;