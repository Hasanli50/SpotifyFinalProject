import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import style from "../../assets/style/artist/sideBar.module.scss";
import AlbumIcon from "@mui/icons-material/Album";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import { Link, Outlet, useNavigate } from "react-router";
import Footer from "../Footer";
import bgHome from "../../assets/image/photo/bgHome.png";
import {
  getUserFromStorage,
  removeArtistFromStorage,
} from "../../utils/localeStorage";
import { fetchArtistByToken } from "../../utils/reusableFunc";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from '@mui/icons-material/Info';
import PhoneIcon from '@mui/icons-material/Phone';

const { Header, Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();

  const backgroundImages = {
    1: `url(${bgHome})`,
    2: "none",
    3: "none",
    4: "none",
    5: "none",
    6: "none",
    7: "none",
    8: "none",
    9: "none",
    10: "none"
  };

  const headerHeight = selectedKey === "1" ? "100vh" : "";
  const text = selectedKey === "1" ? "block" : "none";

  //----------------------------------------------------------
  //get user by token
  const [artist, setArtist] = useState([]);

  const token = getUserFromStorage();
  useEffect(() => {
    const getArtistByToken = async () => {
      try {
        const response = await fetchArtistByToken(token);
        setArtist(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getArtistByToken();
  }, [token]);

  //-----------------------------------------------------------
  //logout
  const handleLogout = () => {
    removeArtistFromStorage();
    navigate("/artist/login");
  };

  return (
    <Layout>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={style.sideBar}
        style={{
          backgroundColor: "#000",
          padding: "0 10px  0 ",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient( 90deg, rgba(238, 16, 176, 1) 12%,rgba(14, 158, 239, 1) 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            margin: "16px 0",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "M" : "Melodies"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ backgroundColor: "#000" }}
          selectedKeys={[selectedKey]}
          onSelect={(e) => setSelectedKey(e.key)}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: <Link to={"/artist"}>Home</Link>,
            },
            {
              key: "2",
              icon: <AlbumIcon />,
              label: <Link to={"/artist/albums"}>Albums</Link>,
            },
            {
              key: "3",
              icon: <AudiotrackIcon />,
              label: <Link to={"/artist/tracks"}>Tracks</Link>,
            },
            {
              key: "4",
              icon: <AudiotrackIcon />,
              label: <Link to={"/artist/premium-tracks"}>Premium Tracks</Link>
            },
            {
              key: "5",
              icon: <PersonIcon />,
              label: <Link to={"/artist/profile"}>Profile</Link>,
            },
            {
              key: "6",
              icon: <InfoIcon />,
              label: <Link to={"/artist/about-us"}>About Us</Link>,
            },
            {
              key: "7",
              icon: <PhoneIcon />,
              label: <Link to={"/artist/contact"}>Contact</Link>,
            },
            {
              key: "8",
              icon: <LogoutOutlined />,
              label: <p onClick={handleLogout}>Logout</p>,
            },
            
          ]}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          className={style.header}
          style={{
            backgroundImage: backgroundImages[selectedKey],
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            width: "100%",
            height: headerHeight,
            backgroundColor: "#000",
          }}
        >
          <div className={style.box}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                color: "#fff",
              }}
            />
            <div className={style.buttons}>
              <div className={style.imgBox}>
                <img className={style.img} src={artist?.image} alt="profile" />
              </div>

              <div className={style.logOut} onClick={handleLogout}>
                <LogoutOutlined className={style.icon} />
              </div>
            </div>
          </div>

          <div className={style.text} style={{ display: text }}>
            <p className={style.letter} style={{ color: "#fff" }}>
              Welcome back,{" "}
              <span style={{ color: "#EE10B0" }}>{artist?.username}!</span>
            </p>
            <p className={style.paragraph} style={{ color: "#d1d5db" }}>
              Followers: {artist?.followers} <UserAddOutlined />
            </p>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "0",
            // padding: 24,
            height: "100%",
            background: "#000",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {/* components!!!! */}
          <Outlet />
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
};

export default SideBar;
