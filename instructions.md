# How to Run This Project

## Prerequisites

- Node.js and npm installed (https://nodejs.org/)
- (Optional but recommended) Git installed

## Steps

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd DOCUMENT-MANAGEMENT-SYSTEM-REPO
```

### 2. Install Backend Dependencies

```sh
cd server
npm install
```

### 3. Start the Backend Server

```sh
npm start
```
- The backend will typically run on `http://localhost:5000` (check your `server/app.js` for the port).

### 4. Install Frontend Dependencies

Open a new terminal, then:

```sh
cd client
npm install
```

### 5. Start the Frontend (React) App

```sh
npm run dev
```
- The frontend will typically run on `http://localhost:5173` (or as shown in the terminal).

### 6. Access the Application

- Open your browser and go to `http://localhost:5173`

## Installed npm Packages

### Frontend (client)
- react - `npm install react`
- react-dom - `npm install react-dom`
- vite - `npm install vite`
- @vitejs/plugin-react - `npm install @vitejs/plugin-react`

### Backend (server)
- express - `npm install express`
- mongoose - `npm install mongoose`
- cors - `npm install cors`
- dotenv - `npm install dotenv`
- bcryptjs - `npm install bcryptjs`
- jsonwebtoken - `npm install jsonwebtoken`
- multer - `npm install multer`
- multer-storage-cloudinary - `npm install multer-storage-cloudinary`
- cloudinary - `npm install cloudinary`

These packages are automatically installed when you run `npm install` in each respective folder, but you can also install them individually using the above commands.

