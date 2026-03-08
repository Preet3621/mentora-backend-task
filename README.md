# Mentora Backend

A simplified backend for a mentorship platform where parents, students, and mentors interact. Built with Node.js, Express.js, and MongoDB.

## How to Run the Project

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas URI
- A Google Gemini API key is already provided in .env file so you do not need to create your own.

### Steps

1. Clone the repository and install dependencies:
 # open the project in your selected IDE (ex. vs code) and open terminal in it and write below command.
npm install

2. .env file is already provided with temporarly gemini api key and mongo atlas connection 
  so that you can easily start the project.

3. start the project by writing below command in terminal:
npm run dev

## API Testing with Postman

A ready-made Postman collection is included — `Mentora Backend.postman_collection.json` in this github repository, you can direct import it in your postman.

### How to import:
1. Open Postman
2. Click Import button or you can directly drag and drop the Mentora Backend.postman_collection.json file 
3. Import `Mentora Backend.postman_collection.json`
5. This will auto import environoment for this collection also.

### Run order:
Run requests in this order so that tokens and IDs are auto-saved between requests:

1. Signup - Parent
2. Signup - Mentor
3. Login - Parent *(refreshes parent_token)*
4. Login - Mentor *(refreshes mentor_token)*
5. Create Student
6. Create Lesson
7. Create Booking
8. Create Session
9. Join Session

> **Note for GET /auth/me** — This request uses `parent_token` by default. To test it as a mentor, open the request and change the Authorization header value from `{{parent_token}}` to `{{mentor_token}}` manually.

All tokens and IDs are automatically passed between requests via pre/post scripts — no manual copy-pasting needed.

## Assumptions and Design Decisions

**Authentication**
- Only `parent` and `mentor` roles can sign up directly. Students are created by parents only, so students have no login of their own.
- JWT tokens expire in 7 days.

**Role-based Access**
- Parents can create students, make bookings, and join sessions on behalf of their students.
- Mentors can create lessons and sessions only for lessons they own.
- A parent can only book their own students — they cannot book a student that belongs to another parent.

**Booking Validation**
- Duplicate bookings are blocked — a student cannot be booked for the same lesson twice.
- Before joining a session, the system checks that the student is booked for that lesson.

**Pagination**
- All list APIs (`GET /students`, `GET /lessons`, `GET /bookings`, `GET /lessons/:id/sessions`) support `page` and `limit` query params.
- Default is `page=1` and `limit=10` if not provided.
- Response includes `data`, `page`, `limit`, `total`, and `totalPages`.

**LLM Summarization**
- Uses Google Gemini (`gemini-2.0-flash`) which has a free tier.
- Input is validated: minimum 50 characters, maximum 10,000 characters.
- Rate limited to 10 requests per minute per IP.
- API key is read from environment variables — never hardcoded.


## Project Structure

```
src/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # signup, login, getMe
│   ├── studentController.js   # createStudent, getStudents
│   ├── lessonController.js    # createLesson, getAllLessons, getLessonById
│   ├── bookingController.js   # createBooking, getMyBookings
│   ├── sessionController.js   # createSession, getSessionsByLesson, joinSession
│   └── llmController.js       # summarize
├── middlewares/
│   └── authMiddleware.js      # protect, onlyParent, onlyMentor
├── models/
│   ├── User.js                # parent and mentor accounts
│   ├── Student.js             # students created by parents
│   ├── Lesson.js              # lessons created by mentors
│   ├── Booking.js             # student assigned to a lesson
│   └── Session.js             # individual sessions under a lesson
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── lessonRoutes.js
│   ├── bookingRoutes.js
│   ├── sessionRoutes.js
│   └── llmRoutes.js
├── services/
│   └── llmService.js          # Gemini API call logic
└── index.js                   # app entry point
```

---

## API Overview

| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | /auth/signup | Public | Register as parent or mentor |
| POST | /auth/login | Public | Login and get token |
| GET | /auth/me | Any | Get current logged-in user |
| POST | /students | Parent | Create a student |
| GET | /students | Parent | Get all your students |
| POST | /lessons | Mentor | Create a lesson |
| GET | /lessons | Any | Get all lessons |
| GET | /lessons/:id | Any | Get lesson by ID |
| GET | /lessons/:id/sessions | Any | Get sessions for a lesson |
| POST | /bookings | Parent | Book a student into a lesson |
| GET | /bookings | Parent | Get all your bookings |
| POST | /sessions | Mentor | Create a session under a lesson |
| POST | /sessions/:id/join | Parent | Join a session with a student |
| POST | /llm/summarize | Any | Summarize a text using Gemini AI |

---

## LLM Summarization

**Endpoint:** `POST /llm/summarize`

**Request:**
```json
{
  "text": "Your text here (min 50 chars, max 10000 chars)"
}
```

**Response:**
```json
{
  "summary": "• Point 1\n• Point 2\n• Point 3",
  "model": "gemini-2.0-flash"
}
```

**Error codes:**
- `400` — text missing, empty, or under 50 characters
- `413` — text exceeds 10,000 characters
- `502` — Gemini API call failed

**Example curl:**
```bash
curl -X POST http://localhost:3000/llm/summarize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"text": "Node.js is a cross-platform open-source JavaScript runtime that runs on the V8 engine outside a web browser..."}'
```