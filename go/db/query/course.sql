-- name: CreateCourse :one
INSERT INTO courses (
    title = $1,
    subtitle = $2,
    language = $3,
    amount = $4,
    learning_list = $5,
    course_includes = $6,
    content = $7,
    requirements = $8,
    description = $9,
    target_students = $10,
    duration = $11,
    author_id = $12
    )
VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
        $10,
        $11,
        $12
    )
RETURNING *;

-- name: GetCourse :one
SELECT *
FROM courses
WHERE id = $1
LIMIT 1;

-- name: ListCourses :many
SELECT * FROM courses
WHERE title = $1
ORDER BY id
LIMIT $2
OFFSET $3;


-- name: UpdateCourse :one
-- coalesce function returns the first non null value of the variables
UPDATE courses
SET
    title =COALESCE(sqlc.narg(title), title),
    subtitle = COALESCE(sqlc.narg(subtitle), subtitle),
    language = COALESCE(sqlc.narg(language), language),
    amount = COALESCE(sqlc.narg(amount), amount),
    learning_list = COALESCE(sqlc.narg(learning_list), learning_list),
    course_includes = COALESCE(sqlc.narg(course_includes), course_includes),
    content = COALESCE(sqlc.narg(content), content),
    requirements = COALESCE(sqlc.narg(requirements), requirements),
    description = COALESCE(sqlc.narg(description), description),
    target_students = COALESCE(sqlc.narg(target_students), target_students),
    duration = COALESCE(sqlc.narg(duration), duration)

WHERE
  author_id = sqlc.arg(author_id)
RETURNING *;

-- name: DeleteCourses :exec
DELETE FROM courses
WHERE id = $1;