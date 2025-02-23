import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LogoutOutlined,
  // UserAddOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import style from "../../assets/style/admin/sideBar.module.scss";
import EmailIcon from "@mui/icons-material/Email";
import { Link, Outlet, useNavigate } from "react-router";
import Footer from "../Footer";
import {
  getUserFromStorage,
  removeAdminFromStorage,
} from "../../utils/localeStorage";
import { fetcAdminByToken } from "../../utils/reusableFunc";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";

const { Header, Sider, Content } = Layout;

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();

  const { data } = useAllNonDeletedArtists();
  const filteredData = data?.filter((user) => user.status === "pending");

  //----------------------------------------------------------
  //get user by token
  const [admin, setAdmin] = useState([]);

  const token = getUserFromStorage();
  useEffect(() => {
    const getUserByToken = async () => {
      try {
        const response = await fetcAdminByToken(token);
        setAdmin(response);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getUserByToken();
  }, [token]);

  //-----------------------------------------------------------
  //logout
  const handleLogout = () => {
    removeAdminFromStorage();
    navigate("/admin/login");
  };

  const SmallBadge = styled(Badge)(() => ({
    "& .MuiBadge-badge": {
      fontSize: "0.75rem",
      height: "16px",
      minWidth: "16px",
      padding: "0 4px",
      right: "-10px",
      top: "10px",
    },
  }));

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
        className={style.admin}
          theme="dark"
          mode="inline"
          style={{ backgroundColor: "#000" }}
          selectedKeys={[selectedKey]}
          onSelect={(e) => setSelectedKey(e.key)}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: <Link to={"/admin"}>Home</Link>,
            },
            {
              key: "2",
              icon: <PeopleIcon />,
              label: <Link to={"/admin/artists"}>Artists</Link>,
            },
            {
              key: "3",
              icon: <PeopleIcon />,
              label: <Link to={"/admin/users"}>Users</Link>,
            },
            {
              key: "4",
              icon: <PersonIcon />,
              label: <Link to={"/admin/profile"}>Profile</Link>,
            },
            {
              key: "5",
              icon: <EmailIcon />,
              label: (
                <Link
                  to="/admin/messages"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <SmallBadge badgeContent={filteredData?.length} color="primary">
                    Messages
                  </SmallBadge>
                </Link>
              ),
            },
            {
              key: "6",
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
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
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
            <div className={style.buttons}>
              <div className={style.imgBox}>
                <img className={style.img} src={admin?.image} alt="profile" />
              </div>

              <div className={style.logOut} onClick={handleLogout}>
                <LogoutOutlined className={style.icon} />
              </div>
            </div>
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
