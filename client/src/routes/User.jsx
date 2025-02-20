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
import Playlists from "../pages/User/Playlists";
import PlaylistDetail from "../pages/User/PlaylistDetail";
import TrendingSongs from "../pages/User/TrendingSongs";
import NewReleaseSongs from "../pages/User/NewReleaseSongs";
import WeeklySongs from "../pages/User/WeeklySongs";
import ArtistSingleSongs from "../pages/User/ArtistSingleSongs";
import ArtistAlbum from "../pages/User/ArtistAlbum";
import AlbumDetail from "../pages/User/AlbumDetail";
import Albums from "../pages/User/Albums";
import Discover from "../pages/User/Discover";
import GenreDetail from "../pages/User/GenreDetail";
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
          <Route path="playlists" element={<Playlists />} />
          <Route path="playlist/:id" element={<PlaylistDetail />} />
          <Route path="trending-songs" element={<TrendingSongs />} />
          <Route path="new-songs" element={<NewReleaseSongs />} />
          <Route path="top-songs" element={<WeeklySongs />} />
          <Route path="artist-all-albums/:id" element={<ArtistAlbum />} />
          <Route path="album/:id" element={<AlbumDetail />} />
          <Route path="all-single-songs/:id" element={<ArtistSingleSongs />} />
          <Route path="albums" element={<Albums />} />
          <Route path="discover" element={<Discover />} />
          <Route path="genre/:id" element={<GenreDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default User;
