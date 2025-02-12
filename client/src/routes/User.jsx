import { Route, Routes } from "react-router";
import Login from "../pages/User/Login";
import SignUp from "../pages/User/SignUp";
import NotFound from "../pages/User/NotFound";
import Home from "../pages/User/Home";
import ForgotPass from "../pages/User/ForgotPass";
import ResetPass from "../pages/User/ResetPass";
import VerifyAccount from "../pages/User/VerifyAccount";
const User = () => {
  return (
    <>
      <Routes>
        <Route path="/"  element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/verify/:token" element={<VerifyAccount />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
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
