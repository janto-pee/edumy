-- name: CreateUser :one
INSERT INTO users (
        username,
        hashed_password,
        first_name,
        last_name,
        email,
        address,
        address2,
        city,
        country
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
    )
RETURNING *;

-- name: GetUser :one
SELECT *
FROM users
WHERE username = $1
LIMIT 1;

-- name: ListUsers :many
-- SELECT *
-- FROM users
-- ORDER BY name;


-- name: UpdateUser :one
-- coalesce function returns the first non null value of the variables
UPDATE users
SET
  hashed_password = COALESCE(sqlc.narg(hashed_password), hashed_password),
  password_changed_at = COALESCE(sqlc.narg(password_changed_at), password_changed_at),
  first_name = COALESCE(sqlc.narg(first_name), first_name),
  last_name = COALESCE(sqlc.narg(last_name), last_name),
  email = COALESCE(sqlc.narg(email), email),
  is_email_verified = COALESCE(sqlc.narg(is_email_verified), is_email_verified),
  address = COALESCE(sqlc.narg(address), address),
  address2 = COALESCE(sqlc.narg(address2), address2),
  city = COALESCE(sqlc.narg(city), city),
  country = COALESCE(sqlc.narg(country), country)
WHERE
  username = sqlc.arg(username)
RETURNING *;

