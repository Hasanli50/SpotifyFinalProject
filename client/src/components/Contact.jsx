import style from "../assets/style/contact.module.scss";
import SearchIcon from "@mui/icons-material/Search";
const Contact = () => {
  return (
    <>
      <section className={style.contactUs}>
        <div className={style.inputBox}>
          <input
            type="text"
            className={style.input}
            placeholder="Contact with us..."
          />
          <SearchIcon className={style.searchIcon} />
        </div>

        <div className={style.mapsBox}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12156.182256779399!2d49.82030165!3d40.38568275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2saz!4v1739647153335!5m2!1sru!2saz"
            className={style.maps}
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default Contact;
