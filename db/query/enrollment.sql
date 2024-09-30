-- name: CreateEnrollment :one
INSERT INTO enrollment (
        student,
        enrollement_name,
        duration
    )
VALUES (
        $1,
        $2,
        $3
    )
RETURNING *;

-- name: GetEnrollment :one
SELECT *
FROM enrollment
WHERE student = $1
LIMIT 1;

-- name: ListEnrollments :many
SELECT *
FROM enrollment
WHERE enrollement_name = $1
ORDER BY id
LIMIT $2 OFFSET $3;

-- name: UpdateEnrollment :one
UPDATE enrollment
SET enrollment_is_active = $1
WHERE enrollement_name = $2
    AND student = $3
RETURNING *;
