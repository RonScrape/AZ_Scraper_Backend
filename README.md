# AZ_Scraper_Backend
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/RonScrape/AZ_Scraper_Backend)

This repository contains the backend service for the AZ Scraper application. It is built with Node.js and Express, providing user authentication, including standard registration/login and Google OAuth 2.0. The server uses JWT for secure session management and connects to a MongoDB database.

## Features

*   **User Authentication**: Secure user registration and login with password hashing (bcryptjs).
*   **Google OAuth 2.0**: Allows users to sign in using their Google accounts.
*   **JWT-based Authorization**: Implements JSON Web Tokens (access and refresh tokens) for securing API endpoints. Tokens are stored in HTTP-only cookies for improved security.
*   **Role-Based Access Control**: Differentiates between `user` and `admin` roles, with protected routes for admins.
*   **RESTful API**: A well-structured API for authentication and accessing protected resources.
*   **MongoDB Integration**: Uses Mongoose for object data modeling and interaction with a MongoDB database.

## Tech Stack

*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB with Mongoose
*   **Authentication**: `jsonwebtoken`, `bcryptjs`, `google-auth-library`, `cookie-parser`
*   **HTTP Client**: `axios`, `node-fetch`
*   **Environment Management**: `dotenv`

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

*   Node.js (v14 or higher)
*   npm
*   MongoDB instance (local or cloud-based)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ronscrape/az_scraper_backend.git
    cd az_scraper_backend
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root directory and add the following environment variables. You will need to obtain Google OAuth credentials from the Google Cloud Console.

    ```env
    # Server Configuration
    PORT=8000

    # MongoDB Connection
    MONGO_URI=your_mongodb_connection_string

    # JWT Secrets
    JWT_SECRET=your_jwt_secret_key
    COOKIE_SECRET=your_cookie_parser_secret

    # Google OAuth 2.0 Credentials
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

    # Google APIs
    GOOGLE_OAUTH_URL=https://accounts.google.com/o/oauth2/v2/auth
    GOOGLE_ACCESS_TOKEN_URL=https://oauth2.googleapis.com/token
    GOOGLE_USERINFO_EMAIL=https://www.googleapis.com/auth/userinfo.email
    GOOGLE_USERINFO_PROFILE=https://www.googleapis.com/auth/userinfo.profile
    ```

### Running the Server

Start the development server with the following command:

```sh
node server.js
```

The server will be running on `http://localhost:8000` (or the port specified in your `.env` file).

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication Routes (`/auth`)

| Method | Endpoint             | Description                                          | Request Body                        |
| :----- | :------------------- | :--------------------------------------------------- | :---------------------------------- |
| `POST` | `/register`          | Registers a new user.                                | `{ "username", "email", "password" }` |
| `POST` | `/login`             | Logs in a user and sets JWT cookies.                 | `{ "email", "password" }`           |
| `GET`  | `/googlePage`        | Redirects the user to the Google OAuth consent screen. | N/A                                 |
| `GET`  | `/google/callback`   | Handles the callback from Google after authentication. | N/A (query params from Google)      |

### Page Routes (`/pages`)

These routes are protected and require a valid JWT.

| Method | Endpoint      | Description                                | Access |
| :----- | :------------ | :----------------------------------------- | :----- |
| `GET`  | `/home`       | Access a protected home page for logged-in users. | User   |
| `GET`  | `/adminhome`  | Access a protected admin page.             | Admin  |

## Project Structure

```
.
├── Controllers/
│   └── AuthControllers.js    # Logic for authentication (register, login, Google OAuth)
├── Database/
│   └── Db_connect.js         # MongoDB connection logic
├── Helpers/
│   └── TokenCreator.js       # Helper function to create JWTs
├── Middlewares/
│   └── AuthMiddleware.js     # Middleware for checking authorization and admin roles
├── Models/
│   └── User.js               # Mongoose schema for the User model
├── Routes/
│   ├── AuthRoutes.js         # Routes for authentication
│   └── PageRoutes.js         # Routes for protected pages
├── .env.example              # Example environment variables
├── package.json
└── server.js                 # Main server entry point
