import style from "../../assets/style/admin/artists.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getUserFromStorage } from "../../utils/localeStorage";
import { useAllNonDeletedUsers } from "../../hooks/useUser";

const Users = () => {
  const { data } = useAllNonDeletedUsers();
  const token = getUserFromStorage();
  const [users, setUsers] = useState(data);

  useEffect(() => {
    const filteredData = data?.filter((user) => user.role === "user");
    setUsers(filteredData);
  }, [data]);

  const handleBan = async (id, duration) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, ban it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.patch(
            `${BASE_URL + ENDPOINT.users}/ban-account/${id}`,
            { duration },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Banned!",
            text: "Artist has been banned.",
            icon: "success",
          });
          setUsers((prevState) =>
            prevState.map((user) =>
              user.id === id ? { ...user, isBanned: true } : user
            )
          );
        }
      });
    } catch (error) {
      console.log("Error:", error);
      toast.error("Error to ban user");
    }
  };

  const handleUnBan = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, unban it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.patch(
            `${BASE_URL + ENDPOINT.users}/unban-account/${id}`,
            {
              isBanned: false,
              banExpiresAt: null,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Unbanned!",
            text: "Your file has been unbanned.",
            icon: "success",
          });
          setUsers((prevState) =>
            prevState.map((users) =>
              users.id === id ? { ...users, isBanned: false } : users
            )
          );
        }
      });
    } catch (error) {
      console.log("Error:", error);
      toast.error("Error to ban users");
    }
  };

  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.delete(
            `${BASE_URL + ENDPOINT.users}/delete-account/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
          const filteredData = data?.filter(
            (user) => user.id !== id && user.role === "user"
          );
          setUsers(filteredData);
        }
      });
    } catch (error) {
      console.log("Error:", error);
      toast.error("Error to ban artist");
    }
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Profile Image",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (text, record) => (
        <>
          <img
            style={{ width: "70px" }}
            src={record.image}
            alt="profile image"
          />
        </>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "10%",
      ...getColumnSearchProps("username"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
      width: "10%",
    },
    {
      title: "Premium",
      dataIndex: "isPremium",
      key: "isPremium",
      width: "5%",
      render: (text, record) => (
        <>
          <p>{record.isPremium === true ? "True" : "False"}</p>
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            style={{
              background: record.isBanned === false ? "#2D336B" : "#FFF2F2",
            }}
            className={style.btn}
            key={record.id}
            onClick={() => handleBan(record.id, 1)}
            disabled={record.isBanned}
          >
            Ban
          </button>

          <button
            style={{
              background: record.isBanned === true ? "#2D336B" : "#FFF2F2",
            }}
            onClick={() => handleUnBan(record.id)}
            className={style.btn}
            key={record.name}
            disabled={!record.isBanned}
          >
            Unban
          </button>

          <button
            style={{
              background: "red",
            }}
            onClick={() => handleDelete(record.id)}
            className={style.btn}
            key={record.name + "hfjd"}
          >
            Delete
          </button>
        </div>
      ),
      width: "10%",
    },
  ];
  return (
    <>
      <section className={style.table}>
        <p className={style.users}>Users: </p>
        <div>
          <Table
            columns={columns}
            dataSource={users}
            scroll={{
              x: 800,
              //   y: 400,
            }}
          />
        </div>
      </section>
    </>
  );
};

export default Users;
