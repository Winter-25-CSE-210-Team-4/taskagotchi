# Taskagotchi

## Setup
Frontend setup is done, backend may need some work from the backend team.
1. Ensure Node.js is installed on your machine.
2. Run ```npm install``` to install dependencies before starting work.

Backend setup is done, it's on 'backend set up' branch
1. ```cd taskagotchi/backend```  navigate to the backend directory
2. Run ```npm npm install``` to install dependencies
3. Create a .env file in the backend directory with the following content
```
PORT=5050
MONGODB_URI=mongodb://localhost:27017/taskagotchi
NODE_ENV=development
JWT_SECRET=your-secret-key
```
4. Run ```npm run dev``` to start the development server and visit http://localhost:5050/api/test in your browser or use curl: curl http://localhost:5050/api/test


# Development Processes
1. Make sure to create a new branch to work on
2. Make sure to follow good documentation practices
2. When the time comes to merge branches, make sure any junk code, like code used to debug is commented out or deleted.
3. Create pull requests when merging branches, have that reviewed two people.
