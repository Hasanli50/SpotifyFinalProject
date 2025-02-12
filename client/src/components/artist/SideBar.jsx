import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  PlusOutlined,
  LogoutOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import style from "../../assets/style/artist/sideBar.module.scss";
import AlbumIcon from "@mui/icons-material/Album";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import {Link, Outlet} from "react-router"
import Footer from "../Footer";

const { Header, Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [selectedKey, setSelectedKey] = useState("1");

  
  const backgroundImages = {
    1: "url('../../assets/image/photo/bgHome.png')", 
    2: "none", 
    3: "none", 
    4: "none", 
    5: "none", 
    6: "none", 
  };

  const headerHeight = selectedKey === "1" ? "100vh" : "";

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
              icon: <PlusOutlined />,
              label: <Link to={"/artist/add-track"}>Add Track</Link>,
            },
            {
              key: "5",
              icon: <SettingsSuggestIcon />,
              label: <Link to={"/artist/setting"}>Setting</Link>,
            },
            {
              key: "6",
              icon: <LogoutOutlined />,
              label: "Logout",
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
            backgroundColor: "#000"
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

            <ul className={style.list}>
              <li className={style.item}>About Us</li>
              <li className={style.item}>Contact</li>
              <li className={style.item}>Premium Tracks</li>
            </ul>

            <div className={style.buttons}>
              <div className={style.imgBox}>
                <img
                  className={style.img}
                  src="https://media.wired.com/photos/63b89b5b995aa119ba7ba7be/master/pass/Profile-Photos-Gear-1411545652.jpg"
                  alt="profile"
                />
              </div>

              <div className={style.logOut}>
                <LogoutOutlined className={style.icon} />
              </div>
            </div>
          </div>

          <div className={style.text}>
            <p className={style.letter} style={{ color: "#fff" }}>
              Welcome back, <span style={{ color: "#EE10B0" }}>Username!</span>
            </p>
            <p className={style.paragraph} style={{ color: "#d1d5db" }}>
              Followers: 12.000 <UserAddOutlined />
            </p>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: "0",
            // padding: 24,
            background: "#000",
            color: "#fff",
            textAlign: "center",
          }}
        >
          {/* components!!!! */}
          <Outlet/>
        </Content>


        <Footer/>
      </Layout>
    </Layout>
  );
};

export default SideBar;
