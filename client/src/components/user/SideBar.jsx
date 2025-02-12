import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SearchOutlined,
  HeartOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import style from "../../assets/style/user/sideBar.module.scss";

const { Header, Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout >
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
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: "Home",
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
          ]}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className={style.header}>
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
              <li className={style.item}>Premium</li>
            </ul>

            <div className={style.buttons}>
              <button className={style.loginBtn}>Login</button>

              <button className={style.registerBtn}>Sign Up</button>
            </div>
          </div>

          <div className={style.text}>
            <p className={style.letter} style={{ color: "#fff" }}>
              All the <span style={{ color: "#EE10B0" }}>Best Songs</span> in
              One Place
            </p>
            <p className={style.paragraph} style={{ color: "#d1d5db" }}>
              On our website, you can access an amazing collection of popular
              and new songs. Stream your favorite tracks in high quality and
              enjoy without interruptions. Whatever your taste in music, we have
              it all for you!
            </p>
            <div className={style.btns}>
              <button className={style.discoverBtn}>Discover Now</button>
              <button className={style.createPlaylist}>Create Playlist</button>
            </div>
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default SideBar;
