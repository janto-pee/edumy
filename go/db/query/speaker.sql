-- name: CreateSpeaker :one
INSERT INTO speakers (
        username
    )
VALUES (
        $1
    )
RETURNING *;

-- name: GetSpeaker :one
SELECT *
FROM speakers
WHERE user = $1
LIMIT 1;

