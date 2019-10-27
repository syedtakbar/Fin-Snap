# Fin-Snap
MERN project to personalize financial snapshot using Auth0 and Plaid. This SPA (Single Page Application) uses [`react-router-dom`]to navigate, hide and show your React components without changing the route within Express.

When using our Plaid Sandbox environment, use user_good as the username and pass_good for the password. 

This project uses the following technologies:

- [Auth0](https://auth0.com) user/api authentication and authorization
- [React](https://reactjs.org) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Node](https://nodejs.org/en/) for the backend
- [MongoDB](https://www.mongodb.com/) for the database
- [Redux](https://redux.js.org/basics/usagewithreact) for global state management
- [Plaid](https://plaid.com) for bank account linkage and transaction data
- [Socket](https://socket.io) for user action alerts
- [material-table](https://material-table.com/#/) for bank transaction display and search

## The App

![Alt text](./fin-snap-app-demo.gif "Fin-Snap-App")

## Configuration

```
    REACT_APP_AUTH0_DOMAIN=XXX
    REACT_APP_AUTH0_CLIENT_ID=XXX
    REACT_APP_AUTH0_CALLBACK_URL=http://localhost:3000/callback
    REACT_APP_RETURN_TO_URL=http://localhost:3000
    REACT_APP_AUTH0_AUDIENCE=http://localhost:3001
    REACT_APP_API_URL=http://localhost:3001
    REACT_APP_PLAID_CLIENT_NAME=FIN-SNAP-APP
    REACT_APP_PLAID_CLIENT_ID=XXX
    REACT_APP_PLAID_SECRET=XXX
    REACT_APP_PLAID_PUBLIC_KEY=XXX
    REACT_APP_PLAID_PRODUCTS=transactions
    REACT_APP_PLAID_COUNTRY_CODES=US,CA,GB,FR,ES
    REACT_APP_PLAID_ENV=sandbox 
    MONGODB_URI=mongodb://localhost:27017/Fin-Snap
```


### Live site

* deployed: https://fin-snap.herokuapp.com/