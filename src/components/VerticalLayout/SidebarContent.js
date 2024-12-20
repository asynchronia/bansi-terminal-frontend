import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "../../components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
//import { withTranslation } from "react-i18next"

import APP_ENV from "../../utility/env";
import RequirePermission from "../../routes/middleware/requirePermission";
import {
  MODULES_ENUM,
  PERMISSIONS_ENUM,
  USER_TYPES_ENUM,
} from "../../utility/constants";
import RequireUserType from "../../routes/middleware/requireUserType";

const SidebarContent = (props) => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = process.env.PUBLIC_URL + props.router.location.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
    document.body.setAttribute("data-sidebar", "dark");
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu" data-sidebar="dark">
          <ul
            className="metismenu list-unstyled mm-show mm-active"
            id="side-menu"
          >
            {/* <li className="menu-title">{("Main")} </li> */}
            <li>
              <Link to="/dashboard" className="waves-effect">
                <i className="mdi mdi-view-dashboard"></i>
                <span className="badge rounded-pill bg-primary float-end">
                  2
                </span>
                <span>Dashboard</span>
              </Link>
            </li>
            <RequirePermission module={MODULES_ENUM.CLIENTS}>
              <li>
                <Link to="/clients" className=" waves-effect">
                  <i className="mdi mdi-account-multiple-outline"></i>
                  <span>Clients</span>
                </Link>
              </li>
            </RequirePermission>
            <RequireUserType userType={USER_TYPES_ENUM.ADMIN}>
              <RequirePermission module={MODULES_ENUM.ITEMS}>
                <li>
                  <Link to="/#" className="has-arrow waves-effect">
                    <i className="mdi mdi-email-outline"></i>
                    <span>Items</span>
                  </Link>
                  <ul className="sub-menu">
                    <RequirePermission
                      module={MODULES_ENUM.ITEMS}
                      permission={PERMISSIONS_ENUM.READ}
                    >
                      <li>
                        <Link to="/items">All Items</Link>
                      </li>
                    </RequirePermission>
                    <RequirePermission
                      module={MODULES_ENUM.ITEMS}
                      permission={PERMISSIONS_ENUM.CREATE}
                    >
                      <li>
                        <Link to="/create-item">Create Item</Link>
                      </li>
                    </RequirePermission>
                    <RequirePermission module={MODULES_ENUM.CATEGORIES}>
                      <li>
                        <Link to="/categories">Categories</Link>
                      </li>
                    </RequirePermission>
                  </ul>
                </li>
              </RequirePermission>
            </RequireUserType>
            <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
              <li>
                <Link to="/agreement-items" className=" waves-effect">
                  <i className="mdi mdi-account-multiple-outline"></i>
                  <span>Agreement Items</span>
                </Link>
              </li>
            </RequireUserType>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-cart-outline"></i>
                <span>Purchase Order</span>
              </Link>
              <ul className="sub-menu">
                <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
                  <li>
                    <Link to="/create-order">Create Order</Link>
                  </li>
                </RequireUserType>
                <li>
                  <Link to="/purchase-orders">All Orders</Link>
                </li>
                <li>
                  <Link to="/estimates">Estimates</Link>
                </li>
                {/* <li>
                  <Link to="/quotations">Quotations</Link>
                </li> */}
              </ul>
            </li>
            <li>
              <Link to="/ongoing-orders" className=" waves-effect">
                <i className="mdi mdi-cart-outline"></i>
                <span>Ongoing Orders</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect">
                <i className="mdi mdi-receipt"></i>
                <span>Invoices</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/invoices">All Invoices</Link>
                </li>
                <li>
                  <Link to="/payments">Payments</Link>
                </li>
              </ul>
            </li>
            {/* <li>
              <Link to="/expenses" className="waves-effect">
                <i className="mdi mdi-truck-delivery"></i>
                <span>Expenses</span>
              </Link>
            </li> */}
            <RequirePermission module={MODULES_ENUM.USERS}>
              <li>
                <Link to="/users" className=" waves-effect">
                  <i className="mdi mdi-account-multiple"></i>
                  <span>Users</span>
                </Link>
              </li>
            </RequirePermission>
            <RequirePermission module={MODULES_ENUM.WAREHOUSES}>
              <li>
                <Link to="/warehouses" className="waves-effect">
                  <i className="mdi mdi-warehouse"></i>
                  <span>Warehouses</span>
                </Link>
              </li>
            </RequirePermission>
            <RequireUserType userType={USER_TYPES_ENUM.CLIENT}>
              <li>
                <Link to="/branches" className="waves-effect">
                  <i className="mdi mdi-warehouse"></i>
                  <span>Branches</span>
                </Link>
              </li>
            </RequireUserType>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(SidebarContent);
