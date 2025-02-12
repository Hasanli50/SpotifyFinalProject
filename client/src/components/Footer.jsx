import style from "../assets/style/footer.module.scss";
import {
  FacebookOutlined,
  InstagramOutlined,
  PhoneOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <>
      <footer className={style.footer}>
        <div className={style.container}>
          <div className={style.box}>
            <div className={style.colOne}>
              <p className={style.heading}>About</p>
              <p className={style.text}>
                Melodies is a website that has been created for over{" "}
                <span className={style.year}>5 year’s</span> now and it is one
                of the most famous music player website’s in the world. in this
                website you can listen and download songs for free. also of you
                want no limitation you can buy our{" "}
                <span className={style.pass}>premium pass’s.</span>
              </p>
            </div>

            <ul className={style.list}>
              <li className={style.heading}>Melodies</li>
              <li className={style.item}>Songs</li>
              <li className={style.item}>Radio</li>
              <li className={style.item}>Podcast</li>
            </ul>

            <ul className={style.list}>
              <li className={style.heading}>Access</li>
              <li className={style.item}>Explor</li>
              <li className={style.item}>Artists</li>
              <li className={style.item}>Playlists</li>
              <li className={style.item}>Albums</li>
              <li className={style.item}>Trending</li>
            </ul>

            <ul className={style.list}>
              <li className={style.heading}>Contact</li>
              <li className={style.item}>About</li>
              <li className={style.item}>Policy</li>
              <li className={style.item}>Social Media</li>
              <li className={style.item}>Soppurt</li>
            </ul>

            <div className={style.colFourth}>
              <h2 className={style.logo}>melodies</h2>

              <div className={style.icons}>
                <div className={style.iconBox}>
                  <FacebookOutlined className={style.icon} />
                </div>
                <div className={style.iconBox}>
                  <InstagramOutlined className={style.icon} />
                </div>
                <div className={style.iconBox}>
                  <TwitterOutlined className={style.icon} />
                </div>
                <div className={style.iconBox}>
                  <PhoneOutlined className={style.icon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
