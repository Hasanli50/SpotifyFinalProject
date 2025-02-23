import style from "../../assets/style/notFound.module.scss";
import {Link} from "react-router"
const NotFound = () => {
  return (
    <>
      <div className={style.notFound}>
        <Link to={"/admin"} >
          <button className={style.btn}>Back Home</button>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
