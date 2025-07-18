# AZ Scraper Backend
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/RonScrape/AZ_Scraper_Backend)

This repository contains the backend server for the AZ Scraper application. It is a Node.js and Express-based server responsible for user authentication, authorization, and serving protected content. It uses JSON Web Tokens (JWT) for handling user sessions with an access token and refresh token mechanism.

## Features

-   **User Authentication**: Secure user registration and login functionality.
-   **Password Hashing**: Uses `bcryptjs` to hash and salt user passwords before storing them in the database.
-   **JWT-Based Authorization**: Implements JWT for stateless authentication. It issues both a short-lived access token and a longer-lived refresh token.
-   **Token Refresh Mechanism**: Automatically refreshes expired access tokens using a valid refresh token, providing a seamless user experience.
-   **Cookie-Based Token Storage**: Stores tokens in secure, `httpOnly` cookies to mitigate XSS attacks.
-   **Role-Based Access Control**: Differentiates between standard users and administrators, with specific routes protected for admin-only access.
-   **MongoDB Integration**: Uses Mongoose for object data modeling (ODM) to interact with a MongoDB database.
-   **Structured Codebase**: Organizes code into distinct modules for controllers, routes, models, middleware, and helpers for better maintainability.

## Project Structure

The project follows a standard MVC-like pattern to keep the codebase organized and scalable.

```
/
├── Controllers/        # Request handling logic for routes
├── Database/           # MongoDB connection setup
├── Helpers/            # Utility functions (e.g., token creation)
├── Middlewares/        # Express middleware (e.g., authentication checks)
├── Models/             # Mongoose schemas and models
├── Routes/             # API route definitions
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
└── server.js           # Main server entry point
```

## Technologies Used

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web framework for Node.js.
-   **MongoDB**: NoSQL database for storing user data.
-   **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js.
-   **jsonwebtoken**: For generating and verifying JSON Web Tokens.
-   **bcryptjs**: For hashing passwords.
-   **cookie-parser**: Middleware to parse `Cookie` header and populate `req.cookies`.
-   **cors**: Middleware to enable Cross-Origin Resource Sharing.
-   **dotenv**: To load environment variables from a `.env` file.

## Setup and Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ronscrape/az_scraper_backend.git
    cd az_scraper_backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file:**
    Create a `.env` file in the root directory and add the following environment variables. Replace the placeholder values with your own.

    ```env
    # Server configuration
    PORT=5000

    # MongoDB connection string
    MONGO_URI=mongodb://localhost:27017/az_scraper

    # JWT configuration
    JWT_SECRET=your_super_secret_jwt_key
    COOKIE_SECRET=your_super_secret_cookie_key
    ```

4.  **Start the server:**
    ```sh
    node server.js
    ```
    The server will start running on the port specified in your `.env` file (e.g., `http://localhost:5000`).

## API Endpoints

The following are the available API endpoints:

### Authentication Routes

-   **`POST /api/auth/register`**
    -   Registers a new user.
    -   **Request Body**:
        ```json
        {
          "username": "testuser",
          "email": "test@example.com",
          "password": "password123"
        }
        ```
    -   **Response**: Returns a success message and user details (excluding password) if registration is successful.

-   **`POST /api/auth/login`**
    -   Logs in an existing user.
    -   Sets `access_token` and `refresh_token` as `httpOnly` cookies upon successful login.
    -   **Request Body**:
        ```json
        {
          "email": "test@example.com",
          "password": "password123"
        }
        ```
    -   **Response**: Returns a success message.

### Protected Page Routes

These routes require valid JWTs (sent via cookies) to be accessed.

-   **`GET /api/pages/home`**
    -   A protected route accessible to any authenticated user.
    -   The `checkAuthorized` middleware verifies the user's tokens.
    -   **Response**: A welcome message including the username.

-   **`GET /api/pages/adminhome`**
    -   A protected route accessible only to users with the `admin` role.
    -   This route uses both `checkAuthorized` and `checkIfAdmin` middlewares.
    -   **Response**: A welcome message for the admin user.