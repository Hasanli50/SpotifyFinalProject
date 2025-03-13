import style from "../../assets/style/admin/artists.module.scss";
import { useAllNonDeletedArtists } from "../../hooks/useArtist";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BASE_URL, ENDPOINT } from "../../api/endpoint";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getUserFromStorage } from "../../utils/localeStorage";
import moment from "moment";
import { Helmet } from "react-helmet-async";

const Messages = () => {
  const { data } = useAllNonDeletedArtists();
  const token = getUserFromStorage();
  const [artists, setArtists] = useState(data);

  useEffect(() => {
    const filteredData = data?.filter((artist) => artist?.status === "pending");
    setArtists(filteredData);
  }, [data]);

  const handleStatus = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, approved it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.patch(
            `${BASE_URL + ENDPOINT.artists}/verify/${id}`,
            { status: "approved" },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            title: "Uptated!",
            text: "Your file has been uptated.",
            icon: "success",
          });

          const updatedArtists = artists?.filter((artist) => artist?.id !== id);
          setArtists(updatedArtists?.status === "pending");
        }
      });
    } catch (error) {
      console.log("Error:", error.message);
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
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      sortDirections: ["descend", "ascend"],
      width: "10%",
      render: (text, record) => (
        <p>{moment(record.createdAt).format("MMM Do YY")}</p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <button
          onClick={() => handleStatus(record.id)}
          className={`${style.btn} ${style.btnApproved}`}
          key={record.id}
        >
          Approved
        </button>
      ),
      width: "10%",
    },
  ];
  return (
    <>
      <Helmet>
        <title>Messages</title>
      </Helmet>
      <section className={style.table}>
        <p className={style.users}>Artists who are awaiting confirmation: </p>
        <div>
          <Table
            columns={columns}
            dataSource={artists}
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

export default Messages;
