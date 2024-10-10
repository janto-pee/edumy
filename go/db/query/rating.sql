-- name: CreateRating :one
INSERT INTO ratings (
        reviewer,
        enrollmment_id,
        enrollment_count,
        enrollment_type,
        ratings,
        review_text
    )
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
-- name: GetRating :one
SELECT *
FROM ratings
WHERE reviewer = $1
    AND enrollmment_id = $2
LIMIT 1;
-- name: ListRatings :many
SELECT *
FROM ratings
WHERE enrollmment_id = $1
ORDER BY id
LIMIT $2 OFFSET $3;