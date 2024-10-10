-- name: CreateEnrollmentEvents :one
INSERT INTO enrollment_events (
        enrollment_id,
        event_id
    )
VALUES ($1, $2)
RETURNING *;

-- name: GetEnrollmentEvents :one
SELECT *
FROM enrollment_events
WHERE enrollment_id = $1
    AND event_id = $2
LIMIT 1;

-- name: ListEnrollmentsEvents :many
SELECT *
FROM enrollment_events
WHERE event_id = $1
ORDER BY id
LIMIT $2 OFFSET $3;