-- name: CreateStudent :one
INSERT INTO students (
        username,
        author_is_active
    )
VALUES (
        $1,
        $2
    )
RETURNING *;

-- name: GetStudent :one
SELECT *
FROM students
WHERE user= $1
LIMIT 1;

-- name: UpdateStudent :one
UPDATE students
SET author_type = $2,
    author_is_active = $3
WHERE user = $1
RETURNING *;