import React, { useState } from "react"
import PropTypes from 'prop-types'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

//i18n
// import { withTranslation } from "react-i18next"
// Redux
import { connect } from "react-redux"
import {  Link } from "react-router-dom";
import withRouter from "../../Common/withRouter";

// users
import user1 from "../../../assets/images/users/user.png"

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false)

  function handleLogout() {
    localStorage.clear()
    props.router.navigate("/login")
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <img
            className="rounded-circle header-profile-user"
            src={user1}
            alt="Header Avatar"
          />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem tag="a" href="/profile">
            {" "}
            <i className="mdi mdi-account-circle font-size-17 text-muted align-middle me-1"/>
            {("Profile")}{" "}
          </DropdownItem>
          {/* <DropdownItem tag="a" href="#">
            <i className="mdi mdi-wallet font-size-17 text-muted align-middle me-1"/>
            {("My Wallet")}
          </DropdownItem>
          <DropdownItem className="d-flex align-items-center" to="#">
            <i className="mdi mdi-cog font-size-17 text-muted align-middle me-1"></i>
            {("Settings")}<span className="badge bg-success ms-auto">11</span></DropdownItem>
          <DropdownItem tag="a" href="auth-lock-screen">
            <i className="mdi mdi-lock-open-outline font-size-17 text-muted align-middle me-1"/>
            {("Lock screen")}
          </DropdownItem>
          
          <div className="dropdown-divider"/> */}
          <DropdownItem onClick={handleLogout} className="dropdown-item text-danger">
            <i className="mdi mdi-power font-size-17 text-muted align-middle me-1 text-danger"/>
            <span>{("Logout")}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
}

const mapStatetoProps = state => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(
  connect(mapStatetoProps, {})(ProfileMenu)
);