import { Helmet } from "react-helmet-async";
import style from "../../assets/style/notFound.module.scss";
import { Link } from "react-router";
const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <div className={style.notFound}>
        <Link to={"/artist"}>
          <button className={style.btn}>Back Home</button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
