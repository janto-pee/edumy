-- name: CreateEnrollmentPayment :one
INSERT INTO enrollment_payment (
         name,
  amount,
  enrollment_id
    )
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetEnrollmentPayment :one
SELECT *
FROM enrollment_payment
WHERE enrollment_id = $1
    AND amount = $2
LIMIT 1;
