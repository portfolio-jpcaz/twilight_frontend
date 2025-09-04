# 🌙 Twilight – Frontend (React / Next.js)

Twilight is a web application inspired by Twitter, built to showcase advanced **fullstack development skills**.  
The frontend is developed with **React / Next.js**, providing a structured UI with authentication, dynamic routes, and real-time trends visualization.

---

## 🚀 Try it out

Twilight is a **web app** – no installation needed.  
👉 Access it directly here: [Vercel Link](https://twilight-frontend-five.vercel.app)

---

## ✨ Main Features

- **Secure Authentication**

  - Signup with **email confirmation**
  - Login with **JWT** and **refresh tokens** handled via **HTTP-only cookies**

- **Tweet Management**

  - Create, delete, like/unlike tweets
  - Automatic hashtag extraction when creating tweets

- **Trends (Hashtags)**

  - Display of most used and recent hashtags
  - Trends column updating regularly with polling

- **Hashtag Search**

  - Explore all tweets linked to a specific hashtag

- **User Interface**
  - Three-column layout (navigation / content / trends)
  - Desktop design faithfully reproduced from a **custom mockup**
  - 📱 A **mobile version with React Native** is planned

---

## 🛠️ Tech Stack & Skills Demonstrated

### 🔹 Frontend

- **Next.js / React**

  - Static and **dynamic routing** (by hashtag)
  - Global state management with **Redux**
  - Logic factorization using **custom hooks**
  - Reusable and modular **React components** for a clean architecture

- **UI & Interaction**

  - Mockup-to-code reproduction with **CSS Modules**
  - **Polling** with `setInterval` to simulate real-time trends
  - Automatic token injection in API calls

- **Authentication (Client-side)**
  - Secure JWT storage & refresh token handling
  - Session management with Redux + cookies

### 🔹 Backend Integration

- Works with a **Node.js / Express** API (separate repo)
- **PostgreSQL** database hosted on **Supabase**
- Token verification middleware securing protected routes

---

## 🧑‍💻 How to use the app

1. **Sign up** with your email and confirm it.
2. Once logged in, you see the **list of tweets** in the central column.
3. You can:
   - **Like / Unlike** any tweet.
   - **Create a new tweet** (hashtags are automatically detected).
   - See the **most used hashtags** from recent tweets in the right column.
4. **Explore hashtags**:
   - Click a hashtag in the trends list or inside a tweet to view all related tweets.
   - On a hashtag page, type a different hashtag in the search input to view its tweets.
5. **Navigation**:
   - Click the **logo** (top-left) to return to the full tweet feed.
   - Use the **logout link** (bottom-left) to disconnect.
6. **Real-time updates**: tweets appear dynamically as users post them.

---

## 💡 Future Improvements

- 📱 Mobile application in **React Native**
- 🔐 **Google Sign-In (OAuth2)** support

---

## 👩‍💻 Author

Developed by **Jean-Pierre Cazeaux**  
📌 GitHub: [github account]( https://github.com/portfolio-jpcaz )  
🌐 Deployed on Vercel:[link]( https://twilight-frontend-five.vercel.app/ )
