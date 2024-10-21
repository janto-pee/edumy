# Higher Learning Startup - Architecture
<!-- GO SQLC -->
<!-- coursera -->
<!-- https://dba.stackexchange.com/questions/298690/database-diagram-for-school-management-app
https://medium.com/@vaibhavkansagara/database-design-of-udemy-66af2d42a03f -->


## What is Higher Learning Startup (HLS)?
HLS  is a virtual learning environment for educational content and resources that offers students everything they need in one place: lectures, resources, opportunities to meet and chat with other students, and more. It is also an excellent way for the student and the teacher to monitor student progress. 

Once an author creates a course, it is listed on the listing page and can be seen by the general public (potential students). Courses with high ratings are added to the recommended list. Alternatively, students can register for one or more courses.


## How will we design HLS?
I have divided the design of HLS into four lessons:

Requirements: This lesson will put forth the functional and non-functional requirements of HLS.  
Design: This lesson will explain the workflow and usage of each component, API design and database schema.  
Detailed design: In this lesson, we’ll explore the components of our HLS design in detail and discuss various approaches to generate timelines. Moreover, we’ll also evaluate our proposed design.  
Quiz: This lesson will test our understanding of the HLS design.  


## Requirements

We’ll concentrate on some important features of HLS to make this design simple. Let’s list down the requirements for our system:  

### Functional requirements
Author:  
User Management: register using role based User registration and authentication  
Course Management: design courses and make them accessible.  
Content Management: attach materials to courses (videos, slides, articles)
Assessment and Evaluation: Instructor’s create Tasks Related with Quizzes - Creating and Managing them.  
Progress Tracking and Reporting: view student review andenrollment, performance and engagement metrics.  

Student:  
Searching and Filtering: search/filtering option to refine listed courses.  
Registration management: enroll and start using the learning management system.  
Course progress tracking: status of completion.
Feedback to students: in the form of scores after evaluation and completion of quiz exercise. 
Progress Tracking and Reporting: users can keep track of their courses’ enrollment status and completion  
Payment: Integration with payment gateways that allows courses to be purchased and subscription plans to be handled.  



### Non-functional requirements#
Scalability: The system should be scalable to handle millions of users in terms of computational resources and storage.  
Latency: The latency to generate a course feed should be low.  
Availability: The system should be highly available.  
Durability Any uploaded content (photos and videos) should never get lost.  
Consistency: We can compromise a little on consistency. It is acceptable if the courses takes time to show in followers’ feeds located in a distant region.  
Reliability: The system must be able to tolerate hardware and software failures.  


## Building blocks we will use#
We’ll focus on the high-level design of HLS. The design will utilize the following building blocks in our design:  

A load balancer at various layers will ensure smooth requests distribution among available servers.  
A database is used to store the user, students, courses, and accounts metadata and relationship among them.  
Blob storage is needed to store the various types of content such as photos, videos, slides and so on.  
A task scheduler schedules the events on the database such as removing the entries whose time to live exceeds the limit.  
A cache stores the most frequent content related requests.  
CDN is used to effectively deliver content to end-users which reduces delay and burden on end-servers.  



### High-level design
Our system should allow us to create, view, search and assess courses at a high level. To create courses, we need to upload and store course content, and upon fetching, we need to retrieve the data from the storage.


Course Management:

The workflow for the abstract design is provided below:

-   The author uploads a course to the server.
-   The server uses a CMS to store the metadata and the accompanying author's data to the database and, at the same time, hands over the video content to the encoder for encoding.
-   The encoder, along with the transcoder, compresses the video and transforms it into multiple resolutions (like 2160p, 1440p, 1080p, and so on). The videos are stored on blob storage (similar to GFS or S3).
-   Some popular videos may be forwarded to the CDN, which acts as a cache.
-   The CDN, because of its vicinity to the user, lets the user stream the video with low latency.


Search feature: 
    
-    Over time, as questions and answers are fed to the Quora system, it is possible to build an index in the HBase. User search queries are matched against the index, and related content is suggested to the user. Frequently accessed indexes can be served from cache for low latency. The index can be constructed from questions, answers, topics labels, and usernames. Tokenization of the search index returns the same results for reordered words also (see Scaling Search and Indexing in Distributed Search chapter for more details).

Recommendation system: 
    
-   The recommendation system is responsible for several features. For example, we might need to develop a user feed, find related questions and ads, recommend questions to potential respondents, and even highlight duplicate content and content in violation of the service’s terms of use. Unlike the answer ranking system, the recommendation system must provide both online and offline services. This system receives requests from the application server and forwards selected features to the ML engine.

Progress Tracking and Reporting: 

### API design
This section describes the APIs invoked by the users when performing different tasks (upload, like, and view courses, create and take test, view progress) on HLS. Let’s develop APIs for each of the following features:

upload course content
review course and instructor
Like to add course to wishlist
Search courses
track course progress


All of the following calls will have a userID, that uniquely specifies the user performing the action. We’ll only discuss new parameters in the calls.

#### Upload course content
The POST method is used to create course to the server from the user through the /postCourse API. The /postCourse API is as follows:

postCourse(userID, content_type, course_title, course_content, caption)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| content_type         | It indicates the type of course content. content could be video, pdf or slides.   |
| course_title                | Title of the course             |
| course_content                | Course topic and sub topic              |


<!-- course content -->
<!-- course_content: {
    section: string
    subsection: {
        topic: string,
        content_type: video|pdf|slide,
    }[]
}[] -->

### Stream course

The GET method is best suited for the /streamCourse API:

streamCourse(user_id, video_id, screen_resolution, user_bitrate, device_chipset)

<!-- Some new things introduced in this case are the following parameters: -->


#### Search courses
The GET method is used to get course from the server through the /searchCourse API. The /searchCourse API is as follows:

searchCourse(keyword)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| keyword               | keyword could be title of course, category or caption        |


#### Add Course to WishList
The POST method is used to add Course to users wishlist through the /postWishlist API. The /postWishlist API is as follows:

postWishlist(userID, courseID, authorID)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| courseID         | the unique ID of the course   |
| authorID               | the unique of the author               |


#### Create Review
The POST method is used to post Review to the server from the user through the /postReview API. The /postReview API is as follows:

postReview(userID, courseID, rating, review_topic, review_text)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| courseID         | It indicates the type of course content. content could be video, pdf or slides.   |
| rating                | Title of each sub topic               |
| review_topic                | Title of review              |
| review_text              | User comment for the purchased course             |


#### View Review
The GET method is used to get Review from the server through the /getReview API. The /getReview API is as follows:

getReview(userID, courseID, reviewID)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| courseID         | The unique ID of the course   |
| reviewID                | the specific ID for each review             |

<!-- 
#### View User Progres (Tracking)
The POST method is used to post photos/videos to the server from the user through the /postCourse API. The /postCourse API is as follows:

getProgress(userID, courseID)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| courseID         | The unique ID of the course   |
 -->

#### Create Enrollment
The POST method is used to post enrollment to the server from the user through the /postEnrollment API. The /postEnrollment API is as follows:

postEnrollment(userID, courseID)

| Parameter | Description |
| ---------------------------------- | ---------------------------------- |
| courseID         | The unique ID of the course   |


#### View General Performance
The GET method is used to get data about courses to the user using the userID from the server. The getGeneralPerformance API is as follows:

getGeneralPerformance(userID)






## Storage schema
Let’s define our data model now:

Relational or non-relational database#
It is essential to choose the right kind of database for our HLS system, but which is the right choice — SQL or NoSQL? Our data is inherently relational, and we need an order for the data (posts should appear in chronological order) and no data loss even in case of failures (data durability). Moreover, in our case, we would benefit from relational queries like fetching the followers or images based on a user ID. Hence, SQL-based databases fulfill these requirements.

So, we’ll opt for a relational database and store our relevant data in that database.

### Define tables
On a basic level, we need the following tables:

Users: This stores all user-related data such as ID, name, email, bio, location, date of account creation, time of the last login, and so on.

author: This stores the relations of users. In HLS, we have a unidirectional relationship, for example, if user A accepts a follow request from user B, user B can view user A’s post, but vice versa is not valid.

speakers: This stores all photo-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which photo belongs to which user. The user ID is a foreign key from the users table.

course: This stores all video-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which video belongs to which user. The user ID is a foreign key from the users table.

enrollment: This stores all video-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which video belongs to which user. The user ID is a foreign key from the users table.

event: This stores all video-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which video belongs to which user. The user ID is a foreign key from the users table.

Course Category: This stores all video-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which video belongs to which user. The user ID is a foreign key from the users table.

Attendance:  This stores all video-related information such as ID, location, caption, time of creation, and so on. We also need to keep the user ID to determine which video belongs to which user. The user ID is a foreign key from the users table.

## Detailed Design
Upload Course:

Assessment & Evaluation

Progress Tracking

Recommendation system

Searching & filtering:


### Add more components
Let’s add a few more components to our design:

Load balancer: To balance the load of the requests from the end-users.

Application servers: To host our service to the end-users.

Relational database: To store our data.

Blob storage: To store the photos and videos uploaded by the users.























<!-- 


## Higher Learning Startup - DevOps 
- Time it takes for building multiple environments
- Issues we face with different environments
- Scale-Up and Scale-Down On-Demand

## Higher Learning Startup - DevOps 
- Visibility
- Stability
- Scalability
- Security
- Audit

## Higher Learning Startup - Backend
- Time it takes for building multiple environments
- Issues we face with different environments
- Scale-Up and Scale-Down On-Demand

## Higher Learning Startup - Frontend
- Visibility
- Stability
- Scalability
- Security
- Audit -->
