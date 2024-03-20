import React from "react"
import { Navigate } from "react-router-dom"

// // Profile
// import UserProfile from "../pages/Authentication/user-profile"

// // Pages Calendar
// import Calendar from "../pages/Calendar/index"

// //Email
// import EmailInbox from "../pages/Email/email-inbox"
// import EmailRead from "../pages/Email/email-read"
// import EmailCompose from "../pages/Email/email-compose"

// // Authentication related pages
// import Login from "../pages/Authentication/Login"
// import Logout from "../pages/Authentication/Logout"
// import Register from "../pages/Authentication/Register"
// import ForgetPwd from "../pages/Authentication/ForgetPassword"

// // Inner Authentication
// import Login1 from "../pages/AuthenticationInner/Login"
// import Register1 from "../pages/AuthenticationInner/Register"
// import Recoverpw from "../pages/AuthenticationInner/Recoverpw"
// import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"

// // Dashboard
import Dashboard from "../pages/Dashboard/index"

//Items
import CreateItems from "../pages/Items/CreateItems"
import AllItems from "../pages/Items/AllItems"
import AddCategory from "../pages/Categories/AddCategory"
import CreateClient from "../pages/Client/CreateClient"
import EditItems from "../pages/Items/EditItems";
import AllClients from "../pages/Clients/AllClients";
import Quotations from "../pages/Orders/Quotations";
import Allorders from "../pages/Orders/Allorders";
import Createorder from "../pages/Orders/Createorder";
import ViewClient from "../pages/Client/ViewClient";
import AllInvoices from "../pages/Invoices/AllInvoices";

//Charts
// import ChartsAppex from "../pages/Charts/charts-appex";
// import ChartsJs from "../pages/Charts/charts-chartjs";
// import ChartsKnob from "../pages/Charts/charts-knob";
// import ChartsC3 from "../pages/Charts/charts-c3";
// import ChartsSparkLine from "../pages/Charts/charts-sparkline";

// // Maps
// import MapsGoogle from "../pages/Maps/MapsGoogle"
// import MapsVector from "../pages/Maps/MapsVector"

// //Icons
// import IconMaterialdesign from "../pages/Icons/IconMaterialdesign"
// import Iconion from "../pages/Icons/Iconion"
// import IconFontawesome from "../pages/Icons/IconFontawesome"
// import IconThemify from "../pages/Icons/IconThemify"
// import IconDripicons from "../pages/Icons/IconDripicons"
// import IconTypicons from "../pages/Icons/IconTypicons"

// //Tables
// import BasicTables from "../pages/Tables/BasicTables"
// import DatatableTables from "../pages/Tables/DatatableTables"
// import ResponsiveTables from "../pages/Tables/ResponsiveTables"
// import EditableTables from "../pages/Tables/EditableTables"

// // Forms
// import FormElements from "../pages/Forms/FormElements"
// import FormAdvanced from "../pages/Forms/FormAdvanced"
// import FormEditors from "../pages/Forms/FormEditors"
// import FormValidations from "../pages/Forms/FormValidations"
// import FormUpload from "../pages/Forms/FormUpload"
// import FormXeditable from "../pages/Forms/FormXeditable"

// //Ui
// import UiAlert from "../pages/Ui/UiAlert"
// import UiButtons from "../pages/Ui/UiButtons"
// import UiBadge from "../pages/Ui/UiBadge"
// import UiCards from "../pages/Ui/UiCards"
// import UiCarousel from "../pages/Ui/UiCarousel"
// import UiDropdown from "../pages/Ui/UiDropdown"
// import UiGrid from "../pages/Ui/UiGrid"
// import UiImages from "../pages/Ui/UiImages"
// import UiLightbox from "../pages/Ui/UiLightbox"
// import UiModal from "../pages/Ui/UiModal"
// import UiPagination from "../pages/Ui/UiPagination"
// import UiPopoverTooltips from "../pages/Ui/UiPopoverTooltips"
// import UiProgressbar from "../pages/Ui/UiProgressbar"
// import UiTabsAccordions from "../pages/Ui/UiTabsAccordions"
// import UiTypography from "../pages/Ui/UiTypography"
// import UiVideo from "../pages/Ui/UiVideo"
// import UiSessionTimeout from "../pages/Ui/UiSessionTimeout"
// import UiRangeSlider from "../pages/Ui/UiRangeSlider"

// //Extra Pages
// import PagesTimeline from "../pages/Extra Pages/pages-timeline";
// import PagesInvoice from "../pages/Extra Pages/pages-invoice";
// import PagesDirectory from "../pages/Extra Pages/pages-directory";
// import PagesBlank from "../pages/Extra Pages/pages-blank";
// import Pages404 from "../pages/Extra Pages/pages-404";
// import Pages500 from "../pages/Extra Pages/pages-500";
// import UiUtilities from "pages/Ui/UiUtilities"
// import UiColors from "pages/Ui/UiColors"
// import UiOffcanvas from "pages/Ui/UiOffcanvas"
// import Chat from "pages/Chat/Chat";
// import Kanban from "pages/Kanban"


const userRoutes = [
  { path: "/create-item", component: <CreateItems /> },
  { path: "/edit-item/:id", component: <EditItems /> },
  { path: "/client/add", component: <CreateClient /> },
  { path: "/items", component: <AllItems /> },
  { path: "/clients", component: <AllClients /> },
  { path: "/categories", component: <AddCategory /> },
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/quotations", component: <Quotations /> },
  { path: "/orders", component: <Allorders /> },
  { path: "/create-order", component: <Createorder /> },
  { path: "/client/:id", component: <ViewClient />},
  { path: "/invoices", component: <AllInvoices />},
  // // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },

  // // //calendar
  // { path: "/calendar", component: <Calendar /> },

  // { path: "/chat", component: <Chat /> },
  // { path: "/kanbanboard", component: <Kanban /> },

  // // // //profile
  // { path: "/profile", component: <UserProfile /> },

  // // //Email
  // { path: "/email-inbox", component: <EmailInbox /> },
  // { path: "/email-read", component: <EmailRead /> },
  // { path: "/email-compose", component: <EmailCompose /> },

  // // //Charts
  // { path: "/apex-charts", component: <ChartsAppex /> },
  // { path: "/charts-chartjs", component: <ChartsJs /> },
  // { path: "/charts-knob", component: <ChartsKnob /> },
  // { path: "/charts-c3", component: <ChartsC3 /> },
  // { path: "/sparkline-charts", component: <ChartsSparkLine /> },

  // // // Icons
  // { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
  // { path: "/icons-ion", component: <Iconion /> },
  // { path: "/icons-fontawesome", component: <IconFontawesome /> },
  // { path: "/icons-themify", component: <IconThemify /> },
  // { path: "/icons-dripicons", component: <IconDripicons /> },
  // { path: "/icons-typicons", component: <IconTypicons /> }, 

  // // // Tables
  // { path: "/tables-basic", component: <BasicTables /> },
  // { path: "/tables-datatable", component: <DatatableTables /> },
  // { path: "/tables-responsive", component: <ResponsiveTables /> },
  // { path: "/tables-editable", component: <EditableTables /> },

  // // // Maps
  // { path: "/maps-google", component: <MapsGoogle /> },
  // { path: "/maps-vector", component: <MapsVector /> },

  // // // Forms
  // { path: "/form-elements", component: <FormElements /> },
  // { path: "/form-advanced", component: <FormAdvanced /> },
  // { path: "/form-editors", component: <FormEditors /> },
  // { path: "/form-uploads", component: <FormUpload /> },
  // { path: "/form-validation", component: <FormValidations /> },
  // { path: "/form-xeditable", component: <FormXeditable /> },

  // // // Ui
  // { path: "/ui-alerts", component: <UiAlert /> },
  // { path: "/ui-buttons", component: <UiButtons /> },
  // { path: "/ui-badge", component: <UiBadge /> },
  // { path: "/ui-cards", component: <UiCards /> },
  // { path: "/ui-carousel", component: <UiCarousel /> },
  // { path: "/ui-dropdowns", component: <UiDropdown /> },
  // { path: "/ui-grid", component: <UiGrid /> },
  // { path: "/ui-images", component: <UiImages /> },
  // { path: "/ui-lightbox", component: <UiLightbox /> },
  // { path: "/ui-modals", component: <UiModal /> },
  // { path: "/ui-pagination", component: <UiPagination /> },
  // { path: "/ui-popover-tooltip", component: <UiPopoverTooltips /> },
  // { path: "/ui-progressbars", component: <UiProgressbar /> },
  // { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
  // { path: "/ui-typography", component: <UiTypography /> },
  // { path: "/ui-video", component: <UiVideo /> },
  // { path: "/ui-session-timeout", component: <UiSessionTimeout /> },
  // { path: "/ui-rangeslider", component: <UiRangeSlider /> },
  // { path: "/ui-utilities", component: <UiUtilities /> },
  // { path: "/ui-colors", component: <UiColors /> },
  // { path: "/ui-offcanvas", component: <UiOffcanvas /> },

  // // //Extra Pages
  // { path: "/pages-timeline", component: <PagesTimeline /> },
  // { path: "/pages-invoice", component: <PagesInvoice /> },
  // { path: "/pages-directory", component: <PagesDirectory /> },
  // { path: "/pages-blank", component: <PagesBlank /> },

]

const authRoutes = [
  // { path: "/logout", component: <Logout /> },
  // { path: "/login", component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPwd /> },
  // { path: "/register", component: <Register /> },

  // { path: "/pages-404", component: <Pages404 /> },
  // { path: "/pages-500", component: <Pages500 /> },

  // // Authentication Inner
  // { path: "/pages-login", component: <Login1 /> },
  // { path: "/pages-register", component: <Register1 /> },
  // { path: "/page-recoverpw", component: <Recoverpw /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },
]

export { userRoutes, authRoutes }