# Drink Master Project - Backend Part

Welcome to the Drink Master project! This Node.js backend application provides the core functionality for the Drink Master application, allowing you to explore, create, and manage your favorite cocktails and drinks. With this backend, users can create accounts, add their own drink recipes, and save their favorite drinks for future reference.

## Table of Contents

- [Video presentation](#video-presentation)
- [Frontend](#frontend)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-docs)
- [Contributors](#contributors)

## <a id="video-presentation">Video presentation</a>

[The Drink Master App | Tech Titans](https://youtu.be/cGbgcujXnaw)

## <a id="frontend">Frontend</a>

- [GitHub](https://github.com/svoits/drink-master-frontend)
- [Live page](https://svoits.github.io/drink-master-frontend/)

## <a id="features">Features</a>

The Drink Master backend provides a set of features that enable users to interact with the system through the API endpoints (see [Usage](#usage)):

- User account creation and authentication
- Adding and deleting own drink recipes
- Browsing and searching for drink recipes
- Saving favorite drinks for easy access
- Secure and efficient backend powered by Node.js

## <a id="getting-started">Getting Started</a>

### <a id="prerequisites">Prerequisites</a>

Before you can run the Drink Master backend, you'll need to have the following software installed on your system:

- Node.js - JavaScript runtime
- npm or Yarn - Package manager for Node.js

### <a id="installation">Installation</a>

1. Clone the repository to your local machine:
   `git clone https://github.com/svoits/drink-master-backend.git`
2. Change your current directory to the project folder:
   `cd drink-master-backend`
3. Install the project dependencies:
   ```
   npm install
   or
   yarn install
   ```
4. Configure the environment variables. You will need to create a .env file in the project root and define the required variables (e.g., database connection details, API keys, etc) - see `.env.example` for required variables.
5. Start the server:
   ```
   npm run start:dev
   or
   yarn run start:dev
   ```

Your Drink Master backend should now be running and accessible at `http://localhost:3000` (if you set the PORT `.env` variable as 3000).

## <a id="usage">Usage</a>

Here are some example use cases of the Drink Master backend:

- To create a new user account, send a POST request to `/auth/signup`.
- To authenticate a user, send a POST request to `/auth/signin`.
- To log out, send a POST request to `/auth/signout`.
- To get the current user, send a GET request to `/users/current`.
- To update user info, send a PATCH request to `/users/update`.
- To subscribe a user to the newsletter, send a POST request to `/users/subscribe`.
- To get main page drinks, send a GET request to `/api/drinks/mainpage`.
- To get popular drinks, send a GET request to `/api/drinks/popular`.
- To get drinks by search, send a GET request to `/api/drinks/search`.
- To get a drink by ID, send a GET request to `/api/drinks/:id`.
- To add your own drink, send a POST request to `/api/drinks/own/add`.
- To delete your own drink, send a DELETE request to `/api/drinks/own/remove`.
- To get your own drinks, send a GET request to `/api/drinks/own/all`.
- To add a drink to your favorite drinks, send a POST request to `/api/drinks/favorite/add/:id`.
- To remove a drink from your favorite drinks, send a DELETE request to `/api/drinks/favorite/remove/:id`.
- To get all your favorite drinks, send a GET request to `/api/drinks/favorite/all`.
- To get all drink categories, send a GET request to `/api/filters/categories`.
- To get all ingredients, send a GET request to `/api/filters/ingredients`.
- To get all glasses, send a GET request to `/api/filters/glasses`.

These endpoints allow you to interact with various features of the Drink Master backend, including user management, drink management, and access to filters and categories.

## <a id="api-docs">API Documentation</a>

For detailed API documentation or tests, please refer to the [Swagger API Documentation](https://drink-master-api.onrender.com/api-docs/).
The first opening may be long, because free render.com service is used for backend deployment.

## <a id="contributors">Contributors</a>

This project was made possible by the hard work and dedication of the following team members:

- Serhii Voitsekhovskyi - Team Lead / Developer
  - [GitHub](https://github.com/svoits)
  - [LinkedIn](https://www.linkedin.com/in/voitsekhovskyi/)
- Illia Shulha - Team Lead / Developer
  - [GitHub](https://github.com/cutestsun)
  - [LinkedIn](https://www.linkedin.com/in/illia-shulha-511155272/)
- Alla Kaplia - Scrum Master / Developer
  - [GitHub](https://github.com/AllaKaplia)
  - [LinkedIn](https://www.linkedin.com/in/alla-kaplia)
- Nadiia Honcharova - Developer
  - [GitHub](https://github.com/NGanch)
  - [LinkedIn](https://www.linkedin.com/in/nadiia-honcharova-b120ab22a/)
- Natalia Skyrda - Developer
  - [GitHub](https://github.com/talask)
  - [LinkedIn](https://www.linkedin.com/in/natalia-skyrda-aa8069171)
- Natalia Tkachenko - Developer
  - [GitHub](https://github.com/nataprofits)
  - [LinkedIn](https://www.linkedin.com/in/natalia-tkachenko/)
- Oleksii Guzko - Developer
  - [GitHub](https://github.com/A-lex-G)
  - [LinkedIn](https://www.linkedin.com/in/a-lex-g/)
- Olena Khomutovska - Developer
  - [GitHub](https://github.com/Helen-A-lex)
  - [LinkedIn](https://www.linkedin.com/in/olena-khomutovska-864023262/)
- Pavlo Nikolashchuk - Developer
  - [GitHub](https://github.com/nikolashchuk)
  - [LinkedIn](https://www.linkedin.com/in/pavlo-nikolashchuk/)
- Tetiana Omanashvili - Developer
  - [GitHub](https://github.com/tetianaom)
  - [LinkedIn](https://www.linkedin.com/in/omanashvili/)

**A big thank you to our team for their contributions to this project!**
