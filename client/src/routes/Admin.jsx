import { Route, Routes } from "react-router";
import Login from "../pages/Admin/Login";
import Home from "../pages/Admin/Home";
import SideBar from "../components/admin/SideBar";
import NotFound from "../pages/Admin/NotFound";
import Arists from "../pages/Admin/Arists";
import Users from "../pages/Admin/Users";
import Messages from "../pages/Admin/Messages";
import Profile from "../pages/Admin/Profile";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";
const Admin = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRouteAdmin>
              <SideBar />
            </ProtectedRouteAdmin>
          }
        >
          <Route index element={<Home />} />
          <Route path="artists" element={<Arists />} />
          <Route path="users" element={<Users />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Admin;
