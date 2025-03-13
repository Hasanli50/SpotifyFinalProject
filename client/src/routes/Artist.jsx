import { Route, Routes } from "react-router";
import Login from "../pages/Artist/Login";
import SignUp from "../pages/Artist/Register";
import Home from "../pages/Artist/Home";
import ForgotPass from "../pages/Artist/ForgotPass";
import ResetPass from "../pages/Artist/ResetPass";
import NotFound from "../pages/Artist/NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import Albums from "../pages/Artist/Albums";
import Tracks from "../pages/Artist/Tracks";
import AddTrack from "../pages/Artist/AddTrack";
import Profile from "../pages/Artist/Profile";
import SideBar from "../components/artist/SideBar";
import PremiumTracks from "../pages/Artist/PremiumTracks";
import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import UpdateAlbum from "../components/artist/UpdateAlbum";
const Artist = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SideBar />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="albums" element={<Albums />} />
          <Route path="tracks" element={<Tracks />} />
          <Route path="edit-album/:id" element={<UpdateAlbum />} />
          <Route path="profile" element={<Profile />} />
          <Route path="premium-tracks" element={<PremiumTracks />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="add-track/:id" element={<AddTrack />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default Artist;
