
import { Route, Routes } from "react-router";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
const User = () => {
  return (
    <>
     <Routes>
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
      </Route>
      <Route path="*" element={<NotFound />} /> */}
    </Routes>
    </>
  )
}

export default User