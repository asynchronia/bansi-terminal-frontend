import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);