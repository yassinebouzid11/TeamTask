import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import Navbar from "./components/NavBar";
import DashboardLayout from "./dashboard/DashboarLayout";
import ManageTasks from "./dashboard/ManageTasks";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <DashboardLayout /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index path="/dashboard/tasks" element={<ManageTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
