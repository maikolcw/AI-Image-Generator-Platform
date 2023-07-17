About:

Web application that harnesses the power of DALL-E AI! Users can generate images, showcase them on the website, and download and share them with friends!

Prerequisites:
* You'will need a .env file for server side
* A mongo account with password for user for the database
* You will need the API key from openai.com, in your account generate API Key
* You will also need the 3 pieces of info from a Cloudinary account (it's free), which can be found from the dashboard.
* Sample server .env should look like this:
```
OPENAI_API_KEY=
MONGODB_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
* You will need a .env file for client side
* Sample client .env should look like this:
```
VITE_SERVER_POST="http://localhost:8080/api/v1/post"
VITE_SERVER_DALLE="http://localhost:8080/api/v1/dalle"
```


How to start:

1. Cd into client folder
2. Npm install
3. Npm run dev
4. Cd into server folder
5. Npm install
6. Npm start


Tech stacks used:

* React
* Vite
* Tailwindcss
* File-saver
* React-router-dom
* Cloudinary
* Cors
* Dotenv
* Express
* Mongoose
* Nodemon
* Openai
