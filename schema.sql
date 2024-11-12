CREATE TABLE "users" (
  "username" varchar PRIMARY KEY,
  "password" varchar NOT NULL,
  "first_name" varchar NOT NULL,
  "last_name" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "is_email_verified" bool NOT NULL DEFAULT false,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "address" (
  "id" varchar NOT NULL,
  "username" varchar UNIQUE NOT NULL,
  "street" varchar NOT NULL,
  "street2" varchar NOT NULL,
  "city" varchar NOT NULL,
  "state_province_code" varchar NOT NULL,
  "state_province_name" varchar NOT NULL,
  "postal_code" varchar NOT NULL,
  "country_code" varchar NOT NULL,
  "location" varchar NOT NULL,
  "country" varchar NOT NULL
);
CREATE TABLE "location" (
  "id" BIGSERIAL PRIMARY KEY,
  "address" varchar NOT NULL,
  "latitude" int NOT NULL,
  "longitude" INT NOT NULL
);
CREATE TABLE "instructors" (
  "id" varchar PRIMARY KEY,
  "photoURL" varchar,
  "username" varchar NOT NULL,
  "title" varchar NOT NULL,
  "department" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
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
CREATE TABLE "programs" (
  "id" varchar PRIMARY KEY,
  "instructors" varchar NOT NULL,
  "name" varchar NOT NULL,
  "logoURL" varchar NOT NULL,
  "courseIds" varchar NOT NULL,
  "promoPhoto" varchar NOT NULL,
  "tagline" varchar NOT NULL,
  "parentCourseId" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "courses" (
  "id" varchar PRIMARY KEY,
  "subtitle_codes" varchar NOT NULL,
  "difficulty_level" varchar NOT NULL,
  "content" varchar NOT NULL,
  "description" varchar NOT NULL,
  "languageCode" varchar NOT NULL,
  "instructors" varchar NOT NULL,
  "amount" varchar NOT NULL,
  "name" varchar NOT NULL,
  "program" varchar NOT NULL,
  "courseMetaData" varchar NOT NULL,
  "duration" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "courseMetaData" (
  "skills" varchar NOT NULL,
  "courseId" varchar UNIQUE NOT NULL,
  "estimatedLearningTime" varchar NOT NULL,
  "promoPhoto" varchar NOT NULL,
  "domainTypes" varchar NOT NULL
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
CREATE TABLE "content" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "courseId" varchar NOT NULL,
  "lessons" varchar NOT NULL,
  "items" varchar NOT NULL
);
CREATE TABLE "contentItems" (
  "id" BIGSERIAL PRIMARY KEY,
  "contentId" BIGSERIAL NOT NULL,
  "content_url" varchar NOT NULL,
  "content_title" varchar NOT NULL,
  "content_duration" varchar NOT NULL
);
CREATE TABLE "programMembership" (
  "id" BIGSERIAL NOT NULL,
  "programId" varchar NOT NULL,
  "enrollmentId" varchar NOT NULL
);
CREATE TABLE "enrollment" (
  "id" BIGSERIAL PRIMARY KEY,
  "student" varchar NOT NULL,
  "enrollement_name" varchar NOT NULL,
  "enrollment_is_active" bool NOT NULL DEFAULT false,
  "duration" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "enrollment_courses" (
  "id" BIGSERIAL PRIMARY KEY,
  "enrollment_id" BIGSERIAL NOT NULL,
  "student" varchar UNIQUE NOT NULL,
  "course_id" BIGSERIAL NOT NULL,
  "expires_at" timestamptz NOT NULL,
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
  "course" varchar NOT NULL,
  "enrollmment_id" bigint NOT NULL,
  "ratings" bigint NOT NULL,
  "review_text" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "skills" (
  "id" BIGSERIAL NOT NULL,
  "courseId" BIGSERIAL NOT NULL,
  "skillsetName" varchar NOT NULL,
  "skillsetId" varchar NOT NULL,
  "skillsetDescription" varchar NOT NULL,
  "skills" varchar NOT NULL
);
CREATE TABLE "courseGradeReport" (
  "completedAt" INT NOT NULL,
  "overallProgress" INT NOT NULL,
  "approxTotalLearningHrs" INT NOT NULL,
  "fullName" varchar NOT NULL,
  "externalId" varchar NOT NULL,
  "lastActivityAt" INT NOT NULL,
  "courseName" varchar NOT NULL,
  "overallCourseGrade" INT NOT NULL,
  "riskFlags" varchar NOT NULL,
  "courseId" varchar NOT NULL,
  "programId" varchar NOT NULL,
  "itemGradebooks" varchar NOT NULL,
  "CourseItemGradebook" varchar NOT NULL,
  "enrolledAt" INT NOT NULL,
  "isCompleted" boolean NOT NULL
);
CREATE TABLE "itemGradeReport" (
  "itemId" varchar NOT NULL,
  "itemName" varchar NOT NULL,
  "itemType" varchar NOT NULL,
  "itemOrder" INT NOT NULL,
  "itemDeadline" varchar NOT NULL,
  "moduleName" varchar NOT NULL,
  "contentItemId" varchar NOT NULL,
  "itemGrade" INT NOT NULL,
  "moduleId" varchar NOT NULL,
  "lessonName" varchar NOT NULL
);
CREATE TABLE "enrollment_payment" (
  "id" BIGSERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "amount" bigint NOT NULL,
  "enrollment_id" bigint NOT NULL,
  "payment_date" timestamptz NOT NULL DEFAULT (now()),
  "created_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE INDEX ON "instructors" ("username");
CREATE INDEX ON "students" ("username");
CREATE INDEX ON "speakers" ("username");
CREATE INDEX ON "enrollment" ("student");
ALTER TABLE "instructors"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "address"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "location"
ADD FOREIGN KEY ("address") REFERENCES "address" ("id");
ALTER TABLE "students"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "speakers"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "enrollment_courses"
ADD FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id");
ALTER TABLE "enrollment_payment"
ADD FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id");
ALTER TABLE "enrollment_courses"
ADD FOREIGN KEY ("course_id") REFERENCES "courses" ("id");
ALTER TABLE "enrollment_events"
ADD FOREIGN KEY ("enrollment_id") REFERENCES "enrollment" ("id");
ALTER TABLE "enrollment_events"
ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");
ALTER TABLE "events"
ADD FOREIGN KEY ("speaker") REFERENCES "speakers" ("username");
ALTER TABLE "courses"
ADD FOREIGN KEY ("instructors") REFERENCES "instructors" ("username");
ALTER TABLE "programs"
ADD FOREIGN KEY ("instructors") REFERENCES "instructors" ("id");
ALTER TABLE "enrollment"
ADD FOREIGN KEY ("student") REFERENCES "students" ("username");
ALTER TABLE "sessions"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "programMembership"
ADD FOREIGN KEY ("programId") REFERENCES "programs" ("id");
ALTER TABLE "programMembership"
ADD FOREIGN KEY ("enrollmentId") REFERENCES "enrollment" ("id");
ALTER TABLE "ratings"
ADD FOREIGN KEY ("enrollmment_id") REFERENCES "enrollment" ("id");
ALTER TABLE "ratings"
ADD FOREIGN KEY ("enrollmment_id") REFERENCES "enrollment_courses" ("id");
ALTER TABLE "ratings"
ADD FOREIGN KEY ("reviewer") REFERENCES "enrollment_courses" ("student");
ALTER TABLE "ratings"
ADD FOREIGN KEY ("course") REFERENCES "enrollment_courses" ("course_id");
ALTER TABLE "courseMetaData"
ADD FOREIGN KEY ("courseId") REFERENCES "courses" ("courseMetaData");
ALTER TABLE "contentItems"
ADD FOREIGN KEY ("contentId") REFERENCES "content" ("id");
ALTER TABLE "content"
ADD FOREIGN KEY ("courseId") REFERENCES "courses" ("id");
ALTER TABLE "skills"
ADD FOREIGN KEY ("courseId") REFERENCES "courses" ("id");
ALTER TABLE "courseGradeReport"
ADD FOREIGN KEY ("courseId") REFERENCES "courses" ("id");
ALTER TABLE "itemGradeReport"
ADD FOREIGN KEY ("contentItemId") REFERENCES "contentItems" ("id");