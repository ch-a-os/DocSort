# This script will start the frontend and backend server.
cd DocSort-Backend/
npm install
npm start &
cd ../DocSort-Frontend
npm install
npm start &
