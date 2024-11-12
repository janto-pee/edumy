CREATE TABLE "organiztion" (
  "id" varchar PRIMARY KEY,
  "name" varchar NOT NULL,
  "password" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "address" varchar NOT NULL,
  "city" varchar NOT NULL,
  "country" varchar NOT NULL,
  "is_email_verified" bool NOT NULL DEFAULT false,
  "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01',
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
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
CREATE TABLE "partners" (
  "id" varchar PRIMARY KEY,
  "name" varchar NOT NULL,
  "logoURL" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "instructors" (
  "id" varchar PRIMARY KEY,
  "photoURL" varchar PRIMARY KEY,
  "name" varchar NOT NULL,
  "title" varchar NOT NULL,
  "department" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "programs" (
  "id" varchar PRIMARY KEY,
  "name" varchar NOT NULL,
  "logoURL" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "programMembership" (
  "joinedAt" varchar NOT NULL,
  "id" varchar NOT NULL,
  "programId" varchar NOT NULL,
  "externalId" varchar NOT NULL,
  "fullName" varchar NOT NULL,
  "email" varchar NOT NULL,
);
CREATE TABLE "SpecializationDefinition" (
  "courseIds" varchar NOT NULL,
  "promoPhoto" varchar NOT NULL,
  "tagline" varchar NOT NULL,
  "parentCourseId" varchar NOT NULL "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "skillSetReport" (
  "userName" varchar NOT NULL,
  "userEmail" varchar NOT NULL,
  "Id" varchar NOT NULL,
  "skillId" varchar NOT NULL,
  "Percentage" Int NOT NULL,
  "latestProgressMadeAt" varchar NOT NULL,
  "enterpriseUserSkillList" VARCHAR NOT NULL,
  "skillsetTargetSkillScores" varchar NOT NULL,
);
CREATE TABLE "enterpriseSkillSetList"(
  "skillId" varchar NOT NULL,
  "skillName" varchar NOT NULL,
  "score" Int NOT NULL,
  "proficiency" varchar NOT NULL,
);
CREATE TABLE "enterpriseTargetSkillScores"(
  "skillId" varchar NOT NULL,
  "targetProficiencyScore" varchar NOT NULL,
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
CREATE TABLE "courses" (
  "id" varchar PRIMARY KEY,
  "subtitle_codes" varchar PRIMARY KEY,
  "difficulty_level" varchar NOT NULL,
  "content_id" varchar NOT NULL,
  "description" varchar NOT NULL,
  "languageCode" varchar NOT NULL,
  "instructors" varchar NOT NULL,
  "description" varchar NOT NULL,
  "amount" varchar NOT NULL,
  "partners" varchar NOT NULL,
  "name" varchar NOT NULL,
  "program" varchar NOT NULL,
  "extraMetaData" varchar NOT NULL,
  "clipMetaData" varchar NOT NULL,
  "specializationMetaData" varchar NOT NULL,
  "courseMetaData" varchar NOT NULL,
  "contentType" varchar UNIQUE NOT NULL,
  "duration" varchar NOT NULL,
  "slug" varchar NOT NULL,
  "partner" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);
CREATE TABLE "courseMetaData" (
  "skills" varchar NOT NULL,
  "estimatedLearningTime" varchar NOT NULL,
  "promoPhoto" varchar NOT NULL,
  "domainTypes" varchar NOT NULL,
);
CREATE TABLE "skills" (
  "skillName" varchar NOT NULL,
  "skillId" varchar NOT NULL,
  "string" varchar NOT NULL,
);
CREATE TABLE "CourseGradebookReport" (
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
  "itemGradebooks",
  "CourseItemGradebook",
  "enrolledAt" INT NOT NULL,
  "isCompleted" boolean NOT NULL
);
CREATE TABLE "itemGradebooks" (
  "itemId": varchar NOT NULL,
  "itemName": varchar NOT NULL,
  "itemType": varchar NOT NULL,
  "itemOrder": INT NOT NULL,
  "isItemPassed": bool NOT NULL,
  "itemRiskFlags": varchar NOT NULL "itemDeadline": varchar NOT NULL,
  "moduleName": varchar NOT NULL "lessonId": varchar NOT NULL "itemGrade": INT NOT NULL "moduleId": varchar NOT NULL "itemWeight": INT NOT NULL "lessonName": varchar NOT NULL
);
CREATE TABLE "itemRiskFlags" (
  "id" varchar NOT NULL,
  "CONFIRMED_PLAGIARISM" boolean NOT NULL,
  "SUSPECTED_PLAGIARISM" boolean NOT NULL,
  "FAILED_ASSIGNMENT" boolean NOT NULL,
);
CREATE TABLE "enrollmentReport" (
  "approxTotalCourseHrs": 2.98,
  "overallProgress": 37,
  "membershipState": "MEMBER",
  "contentId": "r0GnHOZaEees-Q6jQMxlrg",
  "externalId": "sdfsdf2@fake.com",
  "lastActivityAt": 1569229361000,
  "id": "sdfsdf2@fake.com~dfsfsdfs~fffg",
  "grade": 0.922300033569336,
  "contentType": "Course",
  "programId": "gywzv9MFEeml3w46OqZe-A",
  "enrolledAt": 1568138449555,
  "isCompleted": true,
  "completedAt": 1568748366896,
  "collectionId" varchar NOT NuLL,
  "collectionName" varchar NOT NuLL,
  "deletedAt" int NOT NULL,
  "updatedAt" int NOT NULL,
  "contentName" varchar NOT NuLL,
  "contentSlug" varchar NOT NuLL,
  "partnerNames" "contentCertificateUrl" varchar NOT NuLL,
  "fullName" varchar NOT NuLL,
  "email" varchar NOT NuLL,
  "programName" varchar NOT NuLL,
  "programSlug" varchar NOT NuLL,
  "contractId" varchar NOT NuLL,
  "contractName" varchar NOT NULL,
);
CREATE TABLE "CourseMaterials"(
  "id" VARCHAR NOT NULL,
  "module" VARCHAR NOT NULL,
);
CREATE TABLE "Module" (
  "id" varchar not null,
  "name" varchar not null,
  "lessons" varchar NOT NULL,
  "id" varchar NOT NULL,
  "items" varchar NOT NULL
);
CREATE TABLE "moduleitems"(
  "itemType" varchar NOT NULL,
  "name" varchar NOT NULL,
  "deeplinkUrl" varchar NOT NULL,
  "id" varchar NOT NULL,
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
CREATE TABLE "skillset" (
  "skillsetName": "Accountant",
  "skillsetId": "IZWq23fdgdfafKX12w",
  "skillsetDescription": "Accountant empowers you to reskill by revisiting core accounting operations. This SkillSet refreshes your knowledge of accounting principles and practices, spreadsheets, and data analysis tools. Choose from any of our content recommendations in 5 target skills. Move your skill score to the next level in accounting, communication, data analysis software, general accounting, and spreadsheet software.",
  "programId": "your_program_id",
  "programName": "Learning Program",
  "deeplink": "https://www.coursera.org/programs/learning-program-itfhe/skillsets/accountant-f0asr?apiSource=enterprise_external_api_skillsets&isExternal=true",
  "skills" varchar NOT NULL;
);
CREATE TABLE "externalSkillProgressByLearner" (
  "learnerName": "Jerry",
  "learnerEmail": "example@coursera.org",
  "learnerExternalUserId": "63261a1fxxxxx818578fa"
);
CREATE INDEX ON "authors" ("username");
CREATE INDEX ON "students" ("username");
CREATE INDEX ON "speakers" ("username");
CREATE INDEX ON "enrollment" ("student");
ALTER TABLE "verify_emails"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "authors"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
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
ADD FOREIGN KEY ("author_id") REFERENCES "authors" ("username");
ALTER TABLE "enrollment"
ADD FOREIGN KEY ("student") REFERENCES "students" ("username");
ALTER TABLE "sessions"
ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
ALTER TABLE "ratings"
ADD FOREIGN KEY ("enrollmment_id") REFERENCES "enrollment" ("id");
-- CREATE TABLE "organiztion" (
--   "id" varchar PRIMARY KEY,
--   "name" varchar NOT NULL,
--   "password" varchar NOT NULL,
--   "slug" varchar NOT NULL,
--   "email" varchar UNIQUE NOT NULL,
--   "address" varchar NOT NULL,
--   "city" varchar NOT NULL,
--   "country" varchar NOT NULL,
--   "is_email_verified" bool NOT NULL DEFAULT false,
--   "password_changed_at" timestamptz NOT NULL DEFAULT '0001-01-01',
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE "subtitle"(
--   "id" varchar PRIMARY KEY,
--   "codes": INT UNIQUE NOT NULL
-- );
-- CREATE TABLE "courses" (
--   "id" varchar PRIMARY KEY,
--   "subtitle_codes" varchar PRIMARY KEY,
--   "difficulty_level" varchar NOT NULL,
--   "content_id" varchar NOT NULL,
--   "description" varchar NOT NULL,
--   "languageCode" varchar NOT NULL,
--   "instructors" varchar NOT NULL,
--   "partners" varchar NOT NULL,
--   "name" varchar NOT NULL,
--   "program" varchar NOT NULL,
--   "extraMetaData" varchar NOT NULL,
--   "clipMetaData" varchar NOT NULL,
--   "specializationMetaData" varchar NOT NULL,
--   "courseMetaData" varchar NOT NULL,
--   "contentType" varchar UNIQUE NOT NULL,
--   "slug" varchar NOT NULL,
--   "partner" varchar NOT NULL,
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE "instructors" (
--   "id" varchar PRIMARY KEY,
--   "photoURL" varchar PRIMARY KEY,
--   "name" varchar NOT NULL,
--   "title" varchar NOT NULL,
--   "department" varchar NOT NULL,
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE "partners" (
--   "id" varchar PRIMARY KEY,
--   "name" varchar NOT NULL,
--   "logoURL" varchar NOT NULL,
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE "programs" (
--   "id" varchar PRIMARY KEY,
--   "name" varchar NOT NULL,
--   "logoURL" varchar NOT NULL,
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE "metadata_type" (
--   "id" varchar PRIMARY KEY,
--   "name" varchar NOT NULL,
--   "logoURL" varchar NOT NULL,
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE "metadatas" (
--   "id" varchar PRIMARY KEY,
--   "typeName" varchar NOT NULL,
--   "definition" varchar NOT NULL,
--   "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE clipDefinition (
--   "parentLessonName" varchar NOT NULL,
--   "parentLessonObjectUrl" varchar NOT NULL,
--   "estimatedLearningTime" varchar NOT NULL,
--   "skillTags" varchar NOT NULL,
--   "skillName" varchar NOT NULL,
--   "skillId" varchar NOT NULL,
--   "promoPhoto" varchar NOT NULL,
--   "parentCourseId" varchar NOT NULL "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE SpecializationDefinition (
--   "courseIds" varchar NOT NULL,
--   "promoPhoto" varchar NOT NULL,
--   "tagline" varchar NOT NULL,
--   "parentCourseId" varchar NOT NULL "created_at" timestamptz NOT NULL DEFAULT (now()),
--   "updated_at" timestamptz NOT NULL DEFAULT (now())
-- );
-- CREATE TABLE courseMetaData (
--   "skills" varchar NOT NULL,
--   "estimatedLearningTime" varchar NOT NULL,
--   "promoPhoto" varchar NOT NULL,
--   "domainTypes" varchar NOT NULL,
-- );
-- CREATE TABLE skills (
--   "skillName" varchar NOT NULL,
--   "skillId" varchar NOT NULL,
--   "string" varchar NOT NULL,
-- );
-- CREATE TABLE domain (
--   "name" varchar NOT NULL,
--   "domainId" varchar NOT NULL
-- );
-- CREATE TABLE subDomain (
--   "name" varchar NOT NULL,
--   "subDomainId" varchar NOT NULL
-- );
-- CREATE TABLE CourseGradebookReport (
--   "completedAt" INT NOT NULL,
--   "overallProgress" INT NOT NULL,
--   "approxTotalLearningHrs" INT NOT NULL,
--   "fullName" varchar NOT NULL,
--   "externalId" varchar NOT NULL,
--   "lastActivityAt" INT NOT NULL,
--   "courseName" varchar NOT NULL,
--   "overallCourseGrade" INT NOT NULL,
--   "riskFlags" varchar NOT NULL,
--   "courseId" varchar NOT NULL,
--   "programId" varchar NOT NULL,
--   "itemGradebooks",
--   "CourseItemGradebook",
--   "enrolledAt" INT NOT NULL,
--   "isCompleted" boolean NOT NULL
-- );
-- CREATE TABLE riskFlags (
--   "id" varchar NOT NULL,
--   "active" boolean NOT NULL
-- );
-- CREATE TABLE itemGradebooks (
--   "itemId": varchar NOT NULL,
--   "itemName": varchar NOT NULL,
--   "itemType": varchar NOT NULL,
--   "itemOrder": INT NOT NULL,
--   "isItemPassed": bool NOT NULL,
--   "itemRiskFlags": varchar NOT NULL "itemDeadline": varchar NOT NULL,
--   "moduleName": varchar NOT NULL "lessonId": varchar NOT NULL "itemGrade": INT NOT NULL "moduleId": varchar NOT NULL "itemWeight": INT NOT NULL "lessonName": varchar NOT NULL
-- );
-- CREATE TABLE itemTiskFlags (
--   "id" varchar NOT NULL,
--   "CONFIRMED_PLAGIARISM" boolean NOT NULL,
--   "SUSPECTED_PLAGIARISM" boolean NOT NULL,
--   "FAILED_ASSIGNMENT" boolean NOT NULL,
-- );
-- CREATE TABLE enrollmentReport (
--   "approxTotalCourseHrs": 2.98,
--   "overallProgress": 37,
--   "membershipState": "MEMBER",
--   "contentId": "r0GnHOZaEees-Q6jQMxlrg",
--   "externalId": "sdfsdf2@fake.com",
--   "lastActivityAt": 1569229361000,
--   "id": "sdfsdf2@fake.com~dfsfsdfs~fffg",
--   "grade": 0.922300033569336,
--   "contentType": "Course",
--   "programId": "gywzv9MFEeml3w46OqZe-A",
--   "enrolledAt": 1568138449555,
--   "isCompleted": true,
--   "completedAt": 1568748366896,
--   "collectionId" varchar NOT NuLL,
--   "collectionName" varchar NOT NuLL,
--   "deletedAt" int NOT NULL,
--   "updatedAt" int NOT NULL,
--   "contentName" varchar NOT NuLL,
--   "contentSlug" varchar NOT NuLL,
--   "partnerNames" "contentCertificateUrl" varchar NOT NuLL,
--   "fullName" varchar NOT NuLL,
--   "email" varchar NOT NuLL,
--   "programName" varchar NOT NuLL,
--   "programSlug" varchar NOT NuLL,
--   "contractId" varchar NOT NuLL,
--   "contractName" varchar NOT NULL,
-- );
-- CREATE TABLE learnerprofilestandardfield (
--   "managerName" varchar NOT NuLL,
--   "managerEmail" varchar NOT NuLL,
--   "jobTitle" varchar NOT NuLL,
--   "jobType" varchar NOT NuLL,
--   "businessUnit" varchar NOT NuLL,
--   "businessUnit2" varchar NOT NuLL,
--   "locationCity" varchar NOT NuLL,
--   "locationRegion" varchar NOT NuLL,
--   "locationCountry" varchar NOT NuLL
-- );
-- CREATE TABLE programs (
--   { "id" varchar NOT NuLL,
--   "name" varchar NOT NuLL,
--   "tagline": "Everyone at GlobeLand can learn to be a leader!",
--   "url": "https://www.coursera.org/programs/learning-and-leadership",
--   "contentIds": [
--         {
--           "contentId": "GdeNrll1EeSROyIACtiVvg",
--           "contentType": "Course"
--         },
--         {
--           "contentId": "Wl5ych5kEeWFIxLDnS6_kQ",
--           "contentType": "Course"
--         }
--       ] },
-- );
-- CREATE TABLE CourseMaterials(
--   "id" VARCHAR NOT NULL,
--   "module" VARCHAR NOT NULL,
-- );
-- CREATE TABLE Module (
--   "id" varchar not null,
--   "name" varchar not null,
--   "lessons" { "name": "Data analysis basics",
--   "id": "Q73qz",
--   "items": [
--     {
--       "itemType": "VIDEO",
--       "name": "The analysis process",
--       "deeplinkUrl": "https://www.coursera.org/programs/learning-program-uzmjj?showMiniModal=true&attemptSSOLogin=true&productType=course&productId=gawUVgp9EeuyHQ758rw-Yw&itemId=olTet",
--       "id": "olTet"
--     }]
-- );
-- CREATE TABLE curriculumCollection (
--   { "elements": [
--     {
--       "contents": [
--         {
--           "partners": [
--             {
--               "name": "Yale University"
--             }
--           ],
--   "name": "The Science of Well-Being",
--   "description": "NEW TEEN VERSION AVAILABLE HERE: https://www.coursera.org/learn/the-science-of-well-being-for-teens\n\nIn this course you will engage in a series of challenges designed to increase your own happiness and build more productive habits. As preparation for these tasks, Professor Laurie Santos reveals misconceptions about happiness, annoying features of the mind that lead us to think the way we do, and the research that can help us change. You will ultimately be prepared to successfully incorporate a specific wellness activity into your life.\n\nTHE SCIENCE OF WELL BEING WAS PRODUCED IN PART DUE TO THE GENEROUS FUNDING OF THE DAVID F. SWENSEN FUND FOR INNOVATION IN TEACHING.",
--   "id": "rUHfSakHEeeQ3gpuC4Fs_g",
--   "contentType": "Course",
--   "extraMetadata": { "typeName": "courseMetadata",
--   "definition": { "promoPhoto": "https://coursera-course-photos.s3.amazonaws.com/7e/aff5b0f54c11e7b5ae579a0e963c38/Logo_TheScienceofWell-Being.png" } },
--   "slug": "the-science-of-well-being",
--   "instructors": [
--             {
--               "photoUrl": "https://coursera-instructor-photos.s3.amazonaws.com/1b/bd3e80f55211e7b5ae579a0e963c38/Santos_Headshot_Cropped.jpg",
--               "name": "Laurie Santos",
--               "title": "Professor",
--               "department": "Psychology"
--             }
--           ] } ],
--   "id": "y0TO1t4fEe2bIBLACu-NKQ~fac3r",
--   "description": "Some description",
--   "title": "",
--   "collectionId": "fac3r",
--   "programId": "y0TO1t4fEe2bIBLACu-NKQ" } ],
--   "paging": { "total": 1 },
--   "linked": { } }
-- );
-- CREATE TABLE pageInvites (
--   { "createdAt": 1602490628732,
--   "id": "p5Zp4xs32adzwpn63qgwg~12312312312",
--   "programId": "program_id",
--   "externalId": 413861904646,
--   "fullName": "John Doe",
--   "email": "jdoe@domain.com" }
-- );
-- CREATE TABLE programMembership (
--   { "elements": [    {      "joinedAt": 1602490628732,      "id": "p5Zp4c0nEea0zwpn63qgwg~413861904646",      "programId": "p5Zp4c0nEea0zwpn63qgwg",      "externalId": 413861904646,      "fullName": "John Doe",      "email": "jdoe@domain.com"    }  ],
--   "paging": { "next": 10,
--   "total": 245 } }
-- );
-- CREATE TABLE enrollmentState (
--   { "elements": [    {      "contentId": "6EAVDavbEeaPvQ5eOPtN_A",      "externalId": "johndoe-sample-infosys-ID",      "state": "AVAILABLE",      "id": "johndoe-sample-infosys-ID~Course~6EAVDavbEeaPvQ5eOPtN_A",      "contentType": "Course"    }  ],
--   "paging": { "next": 10,
--   "total": 200 },
--   "linked": { } }
-- );
-- CREATE TABLE users (
--   { "externalId": "user_external_id_1",
--   "fullName": "John Doe",
--   "id": "user_coursera_account_id_1",
--   "email": "user.name1@coursera.org",
--   "membershipProgramIds": [
--         "enrolled_program_id_1",
--         "enrolled_program_id_2"
--       ] },
-- );
-- CREATE TABLE externalUserSkillSetReport (
--   { "enterpriseUserSkillsets": [    {      "userName": "Jerry",      "userEmail": "example@coursera.org",      "organizationId": "your_org_id",      "skillId": "computer-programming",      "progressPercentage": 38,      "latestProgressMadeAt": 1602490628732,      "programIds": [        "program_id_1 program_id_2 program_id_3"      ],
--   "enterpriseUserSkillList": [        {          "skillId": "computer-programming",          "skillName": "Computer Programming",          "score": 315,          "proficiency": "ADVANCED"        }      ],
--   "skillsetTargetSkillScores": [        {          "skillId": "computer-programming",          "targetProficiencyScore": 100        }      ] } ],
--   "pagination": { "total": 1,
--   "nextPage": "" } }
-- );
-- CREATE TABLE skillSetWithProgram (
--   { "elements": [    {      "skillsetName": "Software Engineer",      "skillsetId": "9YIu5234234wrbiliZxQ",      "skillsetDescription": "Accountant empowers you to reskill by revisiting core accounting operations. This SkillSet refreshes your knowledge of accounting principles and practices, spreadsheets, and data analysis tools. Choose from any of our content recommendations in 5 target skills. Move your skill score to the next level in accounting, communication, data analysis software, general accounting, and spreadsheet software.",      "programs": [        {          "programId": "your_program_id",          "programName": "Example program name",          "skillsetDeeplink": "https://www.coursera.org/programs/learning-program-uzmjj?showMiniModal=true&attemptSSOLogin=true&productType=course&productId=gawUVgp9EeuyHQ758rw-Yw&itemId=6chA9"        }      ],
--   "skills": [        {          "skillName": "Data Analysis Software",          "skillId": "data-analysis-software",          "targetScore": 250        }      ] } ],
--   "pagination": { "total": 1,
--   "nextPage": "" } }
-- );
-- CREATE TABLE externalLearnerWithSkillSetId (
--   { "learnerEmail": "example@coursera.org",
--   "learnerName": "Jerry",
--   "externalUserId": "63261a1fxxxxx818578fa",
--   "elements": [    {      "skillId": "computer-programming",      "skillName": "Computer Programming",      "skillDescription": "Learn computer programming to develop software solutions. From data and logic to software engineering, you'll be equipped for building business applications, video games, and more.",      "skillScore": 315,      "skillProficiency": "INTERMEDIATE"    },    {      "skillId": "software-engineering",      "skillName": "Software Engineering",      "skillDescription": "Learn software engineering to build modern computer applications. From data structures and logic to development tools and techniques, you'll be equipped to design, develop, and maintain software.",      "skillScore": 100,      "skillProficiency": "BEGINNER"    }  ],
--   "pagination": { "total": 2,
--   "nextPage": "" } }
-- );
-- CREATE TABLE externalLearnerWithSkillScore (
--   { "learnerEmail": "example@coursera.org",
--   "learnerName": "Jerry",
--   "externalUserId": "63261a1fxxxxx818578fa",
--   "skillScore": 315,
--   "skillProficiency": "INTERMEDIATE" }
-- );
-- CREATE TABLE skillset (
--   [  {    "skillsetName": "Accountant",    "skillsetId": "IZWq23fdgdfafKX12w",    "skillsetDescription": "Accountant empowers you to reskill by revisiting core accounting operations. This SkillSet refreshes your knowledge of accounting principles and practices, spreadsheets, and data analysis tools. Choose from any of our content recommendations in 5 target skills. Move your skill score to the next level in accounting, communication, data analysis software, general accounting, and spreadsheet software.",    "programId": "your_program_id",    "programName": "Learning Program",    "deeplink": "https://www.coursera.org/programs/learning-program-itfhe/skillsets/accountant-f0asr?apiSource=enterprise_external_api_skillsets&isExternal=true",    "skills": [      {        "skillName": "Data Analysis Software",        "skillId": "data-analysis-software",        "targetScore": 250      },      {        "skillName": "Accounting",        "skillId": "accounting",        "targetScore": 425      },      {        "skillName": "Communication",        "skillId": "communication",        "targetScore": 250      },      {        "skillName": "Spreadsheet Software",        "skillId": "spreadsheet-software",        "targetScore": 250      },      {        "skillName": "General Accounting",        "skillId": "general-accounting",        "targetScore": 100      }    ] } ]
-- );
-- CREATE TABLE externalSkilsetRecommendation (
--   { "skillsetName": "Testing for Software Engineers",
--   "skillsetId": "IZWq23fdgdfafKX12w",
--   "programId": "your_program_id",
--   "elements": [    {      "name": "Software Development Lifecycle",      "id": "9FGXduzMdasadfzYJCA",      "productType": "specialization",      "logo": "https://sdf143.cloudfront.net/17/6b66f0asdfxad85e33e8374f520/example.jpg",      "deeplink": "https://www.coursera.org/programs/learning-program-itfhe/skillsets/testing-for-software-engineers-qfgzk/skill/software-testing?apiSource=enterprise_external_api_skillsets&isExternal=true&showMiniModal=true&collectionId=storedCollection~example&productId=9FGXduzMdasadfzYJCA&productType=s12n"    },    {      "name": "Lean Software Development",      "id": "c20ET-asdsde-cXg",      "productType": "course",      "logo": "https://coursera-university-assets.s3.amazonaws.com/2e/ad2fad2fdg73f/081ndyxhn3.png",      "deeplink": "https://www.coursera.org/programs/learning-program-itfhe/skillsets/testing-for-software-engineers-qfgzk/skill/software-testing?apiSource=enterprise_external_api_skillsets&isExternal=true&showMiniModal=true&collectionId=storedCollection~asdf3rg3&productId=c20ET-sef3fas-cXg&productType=course"    }  ],
--   "pagination": { "total": 1000,
--   "nextPage": "e3f5s9jf",
--   "nextPageLink": "https://api.coursera.com/ent/api/rest/v1/enterprise/programs/auvx5sf12ad78nvs/skillsets?limit=10&nextPage=e3f5s9jf" } }
-- );
-- CREATE TABLE externalSkilRecommendation(
--   { "skillName": "Software Testing",
--   "skillId": "software-testing",
--   "programId": "your_program_id",
--   "elements": [    {      "name": "Software Development Lifecycle",      "id": "9FGXduzMdasadfzYJCA",      "productType": "specialization",      "logo": "https://sdf143.cloudfront.net/17/6b66f0asdfxad85e33e8374f520/example.jpg",      "deeplink": "https://www.coursera.org/programs/learning-program-itfhe/skillsets/testing-for-software-engineers-qfgzk/skill/software-testing?apiSource=enterprise_external_api_skillsets&isExternal=true&showMiniModal=true&collectionId=storedCollection~example&productId=9FGXduzMdasadfzYJCA&productType=s12n"    },    {      "name": "Lean Software Development",      "id": "c20ET-asdsde-cXg",      "productType": "course",      "logo": "https://coursera-university-assets.s3.amazonaws.com/2e/ad2fad2fdg73f/081ndyxhn3.png",      "deeplink": "https://www.coursera.org/programs/learning-program-itfhe/skillsets/testing-for-software-engineers-qfgzk/skill/software-testing?apiSource=enterprise_external_api_skillsets&isExternal=true&showMiniModal=true&collectionId=storedCollection~asdf3rg3&productId=c20ET-sef3fas-cXg&productType=course"    }  ] }
-- );
-- CREATE TABLE externalSkillProgressByLearner (
--   { "learnerName": "Jerry",
--   "learnerEmail": "example@coursera.org",
--   "learnerExternalUserId": "63261a1fxxxxx818578fa",
--   "elements": [    {      "skillsetName": "Software Engineer",      "skillsetId": "9YIu5234234wrbiliZxQ",      "progressPercent": 38    }  ],
--   "pagination": { "total": 1,
--   "nextPage": "" } }
-- )