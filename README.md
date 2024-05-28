# Backend Assignment 
## Enhanced Authentication API :-

## Key Features

- User can register and login (JWT based authentication and authorization)
- User can register and login using Google (Using Google OAuth2.0)
- User can sign out.
- User can see his/her profile
- User can edit his/her profile details including : photo, name, bio, phone, email, and password.
- Role-based access control (admin/normal user)
- User can make his/her profile public or private.
- Admin functionality to view all profiles (public and private)
- Normal user can see public profiles.
- Error handling and validation

## API's Implemented

![Swagger](https://drive.google.com/uc?id=15n_2pwRg2dPKD-2G4WcuDkaX9IqASjwZ)

![Alt Text](https://drive.google.com/uc?id=1nakliGxAbDTCfYJL246_7ytxwZtYpJGo)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Rajdeep-nagar08/Backend-Assignment.git
```

2. Navigate to the project directory:

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

   - Create a `.env` file in the root directory.
   - Add the required environment variables - MongoDB connection details, JWT secret and OAuth client secrets.

5. Start the server:

```bash

npm start
```

The API will be available at `http://localhost:5000`.

## Swagger Documentation

You can also use the Swagger UI to interact with the API endpoints:

1. Start the server with the `npm start` command.
2. Open your browser and navigate to `http://localhost:5000/api-docs/`.

## API Testing Documentation

The API documentation is available at [https://docs.google.com/document/d/1bIK0D-H7fL9jm-eVCJUPl3Y-m1xoMqziY9OLtiNleDs/edit?usp=sharing)](https://docs.google.com/document/d/1bIK0D-H7fL9jm-eVCJUPl3Y-m1xoMqziY9OLtiNleDs/edit?usp=sharing).



## Technologies Used

- Node.js
- Express
- MongoDB
- Google OAuth2.0
- Mongoose
- bcrypt
- jsonwebtoken
- multer
- Swagger

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or inquiries, please contact [nagarrajdeep08@gmail.com](nagarrajdeep08@gmail.com).
