import { Route, Routes } from "react-router";
import Login from "../pages/User/Login";
import SignUp from "../pages/User/SignUp";
import NotFound from "../pages/User/NotFound";
import ForgotPass from "../pages/User/ForgotPass";
import ResetPass from "../pages/User/ResetPass";
import VerifyAccount from "../pages/User/VerifyAccount";
import SideBar from "../components/user/SideBar";
import AboutUs from "../components/AboutUs";
import Contact from "../components/Contact";
import Profile from "../pages/User/Profile";
import Home from "../pages/User/Home";
import Artists from "../pages/User/Artists";
import ArtistDetail from "../pages/User/ArtistDetail";
import Favorites from "../pages/User/Favorites";
const User = () => {
  return (
    <>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/verify/:token" element={<VerifyAccount />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        <Route path="/" element={<SideBar />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="artists" element={<Artists />} />
          <Route path="artists/:id" element={<ArtistDetail />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>

        {/* <Route path="/" element={<StudentLayout />}>
        <Route index element={<PrivateRoute element={<Home />} />} />
        <Route path="/tasks/:taskId" element={<PrivateRoute element={<Tasks />} />} />
        <Route path="/tasks/:taskId/zego-meet" element={<PrivateRoute element={<ZegoMeet />} />} />
        <Route path="/tasks/:taskId/:detailId" element={<PrivateRoute element={<TaskDetail />} />} />
        <Route
          path="/assignments"
          element={<PrivateRoute element={<Assignments />} />}
        />
        <Route
          path="/thedeadlinehasbeenmissed"
          element={<PrivateRoute element={<TheDeadlineHasBeenMissed />} />}
        />
        <Route path="/done" element={<PrivateRoute element={<Done />} />} />
        <Route
          path="/materials/:id"
          element={<PrivateRoute element={<Materials />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
       </Route> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default User;
