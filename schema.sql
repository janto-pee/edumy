
CREATE TABLE "users" (
  "username" varchar PRIMARY KEY,
  "hashed_password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "address" varchar NOT NULL,
  "address2" varchar NOT NULL,
  "city" varchar NOT NULL,
  "country" varchar NOT NULL,
  "is_email_verified" bool NOT NULL DEFAULT false,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "authors" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "author_type" varchar NOT NULL,
  "author_is_active" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "students" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "student_is_active" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "speakers" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY,
  "username" varchar NOT NULL,
  "refresh_token" varchar NOT NULL,
  "user_agent" varchar NOT NULL,
  "client_ip" varchar NOT NULL,
  "is_blocked" boolean NOT NULL DEFAULT false,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "verify_emails" (
  "id" BIGSERIAL PRIMARY KEY,
  "username" varchar NOT NULL,
  "email" varchar NOT NULL,
  "secret_code" varchar NOT NULL,
  "is_used" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "expired_at" timestamptz NOT NULL DEFAULT (now()+interval'15 minutes')
);

CREATE TABLE "courses" (
  "id" BIGSERIAL PRIMARY KEY,
  "title" varchar NOT NULL,
  "subtitle" varchar NOT NULL,
  "language" varchar NOT NULL,
  "amount" varchar NOT NULL,
  "learning_list" varchar NOT NULL,
  "course_includes" varchar NOT NULL,
  "content" varchar NOT NULL,
  "requirements" varchar NOT NULL,
  "description" varchar NOT NULL,
  "target_students" varchar NOT NULL,
  "duration" varchar NOT NULL,
  "author_id" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "enrollment" (
  "id" BIGSERIAL PRIMARY KEY,
  "student" varchar NOT NULL,
  "enrollement_name" varchar NOT NULL,
  "enrollment_is_active" bool NOT NULL DEFAULT false,
  "duration" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "events" (
  "id" BIGSERIAL PRIMARY KEY,
  "speaker" varchar NOT NULL,
  "event_name" varchar NOT NULL,
  "event_type" varchar NOT NULL,
  "event_is_active" bool NOT NULL DEFAULT false,
  "event_start_date" timestamptz NOT NULL,
  "event_end_date" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "enrollment_courses" (
  "id" BIGSERIAL PRIMARY KEY,
  "enrollment_id" bigint NOT NULL,
  "course_id" BIGSERIAL NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "enrollment_payment" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "amount" bigint NOT NULL,
  "enrollment_id" bigint NOT NULL,
  "payment_date" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "enrollment_events" (
  "id" BIGSERIAL PRIMARY KEY,
  "enrollment_id" bigint NOT NULL,
  "event_id" BIGSERIAL NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "ratings" (
  "id" BIGSERIAL PRIMARY KEY,
  "reviewer" varchar UNIQUE NOT NULL,
  "enrollmment_id" bigint NOT NULL,
  "enrollment_count" int NOT NULL,
  "enrollment_type" varchar NOT NULL,
  "ratings" bigint NOT NULL,
  "review_text" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "authors" ("username");

CREATE INDEX ON "students" ("username");

CREATE INDEX ON "speakers" ("username");

CREATE INDEX ON "enrollment" ("student");

ALTER TABLE "verify_emails" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");

ALTER TABLE "authors" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");

ALTER TABLE "students" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");

ALTER TABLE "speakers" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");

ALTER TABLE "enrollment_courses" ADD FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id");

ALTER TABLE "enrollment_payment" ADD FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id");

ALTER TABLE "enrollment_courses" ADD FOREIGN KEY ("course_id") REFERENCES "courses" ("id");

ALTER TABLE "enrollment_events" ADD FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id");

ALTER TABLE "enrollment_events" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "events" ADD FOREIGN KEY ("speaker") REFERENCES "speakers" ("username");

ALTER TABLE "courses" ADD FOREIGN KEY ("author_id") REFERENCES "authors" ("username");

ALTER TABLE "enrollment" ADD FOREIGN KEY ("student") REFERENCES "students" ("username");

ALTER TABLE "sessions" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");

ALTER TABLE "ratings" ADD FOREIGN KEY ("enrollmment_id") REFERENCES "enrollment" ("id");

