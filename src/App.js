import { Route, Routes } from "react-router-dom"
import React from 'react';
import { userRoutes, authRoutes } from "./routes/allRoutes"
import Authmiddleware from "./routes/middleware/Authmiddleware"
import "./assets/scss/theme.scss"

import VerticalLayout from "./components/VerticalLayout/"

function App() {
  return (
    <React.Fragment>
      <Routes>
        {/* Non-authenticated routes */}
        {authRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={route.component}
          />
        ))}

        {/* Authenticated routes */}
        {userRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <Authmiddleware>
                <VerticalLayout>{route.component}</VerticalLayout>
              </Authmiddleware>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
}

export default App;
