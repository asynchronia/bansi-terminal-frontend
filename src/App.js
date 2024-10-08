import PropTypes from 'prop-types'
import React from "react"

import { Route, Routes } from "react-router-dom"
import { connect } from "react-redux"
import { userRoutes, authRoutes } from "./routes/allRoutes"
import Authmiddleware from "./routes/middleware/Authmiddleware"
import "./assets/scss/theme.scss"

import VerticalLayout from "./components/VerticalLayout/"
import { ToastContainer } from 'react-toastify'

const App = props => {
  function getLayout() {
    let layoutCls = VerticalLayout
    
    return layoutCls
  }
  const Layout = getLayout();
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
                <Layout>{route.component}</Layout>
              </Authmiddleware>
            }
          />
        ))}
      </Routes>
      <ToastContainer position="top-center" theme="colored" />
    </React.Fragment>
  );
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
