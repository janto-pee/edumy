-- name: CreateEnrollmentCourse :one
INSERT INTO enrollment_courses (
        student_name,
        course_id,
        expires_at
    )
VALUES ($1, $2, $3)
RETURNING *;
-- name: GetEnrollmentCourse :one
SELECT *
FROM enrollment_courses
WHERE student_name = $1
    AND course_id = $2
LIMIT 1;
-- name: ListEnrollmentsCourses :many
SELECT *
FROM enrollment_courses
WHERE course_id = $1
ORDER BY id
LIMIT $2 OFFSET $3;