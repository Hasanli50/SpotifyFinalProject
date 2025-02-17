import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SearchOutlined,
  HeartOutlined,
  PlusOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import style from "../../assets/style/user/sideBar.module.scss";
import { Link, Outlet, useNavigate } from "react-router";
import bgHome from "../../assets/image/photo/bgHome.png";
import Footer from "../Footer";
import {
  getUserFromStorage,
  removeUserFromStorage,
} from "../../utils/localeStorage";
import { fetchUserByToken } from "../../utils/reusableFunc";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";

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
    10: "none",
  };

  const headerHeight = selectedKey === "1" ? "100vh" : "";
  const text = selectedKey === "1" ? "block" : "none";

  //----------------------------------------------------------
  //get user by token
  const [user, setUser] = useState([]);

  const token = getUserFromStorage();
  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetchUserByToken(token);
        setUser(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  //-----------------------------------------------------------
  //logout
  const handleLogout = () => {
    removeUserFromStorage();
    navigate("/login");
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
            webkitBackgroundClip: "text",
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
              label: <Link to={"/"}>Home</Link>,
            },
            {
              key: "2",
              icon: <SearchOutlined />,
              label: "Discover",
            },
            {
              key: "3",
              icon: <HeartOutlined />,
              label: "Your Favorites",
            },
            {
              key: "4",
              icon: <PlusOutlined />,
              label: "Add Playlist",
            },
            ...(user && Object.keys(user).length > 0
            ? [
                {
                  key: "5",
                  icon: <PersonIcon />,
                  label: <Link to={"/profile"}>Profile</Link>,
                },
              ]
            : []),
            {
              key: "7",
              icon: <InfoIcon />,
              label: <Link to={"/about-us"}>About Us</Link>,
            },
            {
              key: "8",
              icon: <PhoneIcon />,
              label: <Link to={"/contact"}>Contact</Link>,
            },
            {
              key: "10",
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
            height: headerHeight,
            backgroundSize: "cover",
            width: "100%",
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

            {user?.length === 0 ? (
              <div className={style.buttons}>
                <Link to={"/login"}>
                  <button className={style.loginBtn}>Login</button>
                </Link>
                <Link to={"/register"}>
                  <button className={style.registerBtn}>Sign Up</button>
                </Link>
              </div>
            ) : (
              <div className={style.buttons}>
                <div className={style.imgBox}>
                  <img
                    className={style.img}
                    src={user?.image}
                    alt="profile"
                  />
                </div>

                <div className={style.logOut} onClick={handleLogout}>
                  <LogoutOutlined className={style.icon} />
                </div>
              </div>
            )}
          </div>

          {user?.length === 0 ? (
            <div className={style.text} style={{ display: text }}>
              <p className={style.letter} style={{ color: "#fff" }}>
                All the <span style={{ color: "#EE10B0" }}>Best Songs</span> in
                One Place
              </p>
              <p className={style.paragraph} style={{ color: "#d1d5db" }}>
                On our website, you can access an amazing collection of popular
                and new songs. Stream your favorite tracks in high quality and
                enjoy without interruptions. Whatever your taste in music, we
                have it all for you!
              </p>
              <div className={style.btns}>
                <Link to={"/login"}>
                  <button className={style.discoverBtn}>Discover Now</button>
                </Link>
                <Link to={"/login"}>
                  <button className={style.createPlaylist}>
                    Create Playlist
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className={style.text} style={{ display: text }}>
              <p className={style.letter} style={{ color: "#fff" }}>
                Welcome back,{" "}
                <span style={{ color: "#EE10B0" }}>{user?.username}!</span>
              </p>
              <p className={style.paragraph} style={{ color: "#d1d5db" }}>
                Followers: {user?.followers} <UserAddOutlined />
              </p>
            </div>
          )}
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "0",
            padding: "0 50px",
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
