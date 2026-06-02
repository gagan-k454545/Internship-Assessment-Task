# 🎯 Smart Face Authentication Attendance System

> Internship Assessment — foxwel.ai | Candidate: Gagan

A full-stack MVP attendance system built with **Next.js**, **face-api.js**, **MongoDB Atlas**, and **GPS verification**. No Python. No Firebase. Everything runs in  the browser and deploys to Vercel.

---

## ✅ Features

| Feature | Status |
|---|---|
| Face Registration | ✅ |
| Face Authentication (Login) | ✅ |
| Face Authentication (Logout) | ✅ |
| GPS Location Capture | ✅ |
| Attendance Records in MongoDB | ✅ |
| Dashboard with Table | ✅ |
| Deployed on Vercel | ✅ |

---

## 🛠 Tech Stack

- **Frontend + Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Face Recognition**: face-api.js (browser-based)
- **Webcam**: react-webcam
- **Database**: MongoDB Atlas (Mongoose)
- **Deployment**: Vercel

---

## 📁 Project Structure

```
face-attendance/
├── app/
│   ├── page.js              → Home page
│   ├── register/page.js     → Face registration
│   ├── login/page.js        → Check-in with face
│   ├── logout/page.js       → Check-out with face
│   ├── dashboard/page.js    → Attendance records table
│   └── api/
│       ├── register/route.js   → POST: save new employee
│       ├── login/route.js      → POST: match face + log login
│       ├── logout/route.js     → POST: match face + log logout
│       └── attendance/route.js → GET: fetch all records
├── components/
│   ├── WebcamCapture.js     → Reusable webcam component
│   ├── StatusCard.js        → Loading/success/error messages
│   └── PageHeader.js        → Page header with back button
├── models/
│   ├── User.js              → MongoDB schema for employees
│   └── Attendance.js        → MongoDB schema for records
├── lib/
│   └── mongodb.js           → Database connection (cached)
├── utils/
│   └── faceUtils.js         → All face-api.js logic
└── public/
    └── models/              → ⚠️ face-api.js model files go here
```

---

## 🚀 Setup Instructions

### Step 1 — Clone & Install

```bash
git clone https://github.com/your-username/face-attendance.git
cd face-attendance
npm install
```

### Step 2 — Download Face-API Models

Download these 3 model folders from:
👉 https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Place them in `/public/models/`:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

> **Quick download script:**
> ```bash
> mkdir -p public/models
> BASE=https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights
> for f in tiny_face_detector_model-weights_manifest.json tiny_face_detector_model-shard1 \
>           face_landmark_68_model-weights_manifest.json face_landmark_68_model-shard1 \
>           face_recognition_model-weights_manifest.json face_recognition_model-shard1 \
>           face_recognition_model-shard2; do
>   curl -O --output-dir public/models "$BASE/$f"
> done
> ```

### Step 3 — Environment Variables

Create `.env.local` in the root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/face-attendance?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Get your MongoDB URI from [MongoDB Atlas](https://cloud.mongodb.com) → Connect → Drivers.

### Step 4 — Run Locally

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🌐 Vercel Deployment

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables:
   - `MONGO_URI` → your Atlas connection string
   - `NEXT_PUBLIC_API_URL` → your Vercel URL (e.g. `https://your-app.vercel.app`)
4. Deploy!

> ✅ face-api.js runs entirely in the browser — no special server config needed.

---

## 🧠 How It Works (Simple Explanation)

### Face Registration
1. User enters name + email
2. Webcam captures their face
3. face-api.js generates a **128-number array** (face descriptor) that uniquely represents their face
4. Descriptor is saved to MongoDB

### Face Login/Logout
1. Webcam captures current face
2. face-api.js generates a descriptor for the live face
3. API compares it to all stored descriptors using **Euclidean distance**
4. If distance < 0.6 → match found → attendance logged with time + GPS

### GPS Capture
- `navigator.geolocation.getCurrentPosition()` gets lat/long from browser
- Coordinates stored in the attendance record

---

## 📊 MongoDB Collections

### `users`
```json
{
  "_id": "ObjectId",
  "name": "Gagan Kumar",
  "email": "gagan@company.com",
  "descriptor": [0.12, -0.34, ...] // 128 numbers
}
```

### `attendances`
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "Gagan Kumar",
  "date": "2024-05-28",
  "loginTime": "09:30:00 AM",
  "logoutTime": "06:00:00 PM",
  "location": {
    "latitude": 12.8700,
    "longitude": 74.8430
  }
}
```

---

## ⚠️ Important Notes

- **HTTPS required for webcam/GPS** in production (Vercel provides this automatically)
- Allow camera and location permissions in the browser
- Models must be in `/public/models/` — without them, face detection won't work
- Face matching threshold is **0.6** (lower = stricter)

---

## 📋 Submission Checklist

- [x] GitHub Repository
- [x] Live Vercel deployment
- [x] README documentation
- [ ] Short demo video (record using Loom or OBS)

---

*Built for foxwel.ai Internship Assessment — May 2026*
