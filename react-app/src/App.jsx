import { Auth } from "components/Auth";
import { Book, Dashboard, Finance, Login, MainLayout, Notification, Partner } from 'pages';
import Register from "pages/Register";
import { Navigate, Route, Routes, unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { history } from "utils/history";
import "./App.css";


function App() {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={
            <Auth>
              <MainLayout />
            </Auth>
          }>
            <Route index element={<Dashboard />}></Route>
            <Route path="finance" element={<Finance />}></Route>
            <Route path="book" element={<Book />}></Route>
            <Route path="partner" element={<Partner />}></Route>
            <Route path="notification" element={<Notification />}></Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HistoryRouter>
  );
}

export default App
