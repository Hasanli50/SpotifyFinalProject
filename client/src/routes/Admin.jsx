import { Route, Routes } from "react-router";
import Login from "../pages/Admin/Login";
import Home from "../pages/Admin/Home";
import { ProtectedRouteAdmin } from "../routes/ProtectedRoute";
import SideBar from "../components/admin/SideBar";
import NotFound from "../pages/Admin/NotFound";
import Arists from "../pages/Admin/Arists";
import Users from "../pages/Admin/Users";
import Messages from "../pages/Admin/Messages";
import Profile from "../pages/Admin/Profile";
const User = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
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
          {/* <Route path="tracks" element={<Tracks />} />
          <Route path="add-track" element={<AddTrack />} />
          <Route path="edit-album/:id" element={<EditAlbum />} />
          <Route path="profile" element={<Profile />} />
          <Route path="setting" element={<Setting />} />
          <Route path="premium-tracks" element={<PremiumTracks />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default User;
