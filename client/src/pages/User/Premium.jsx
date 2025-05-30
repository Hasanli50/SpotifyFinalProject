import { useEffect, useState } from "react";
import style from "../../assets/style/user/premium.module.scss";
import CheckoutForm from "./CheckoutForm";
import { getUserFromStorage } from "../../utils/localeStorage";
import { fetchUserByToken } from "../../utils/reusableFunc";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const Premium = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = getUserFromStorage();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const handleUser = () => {
    if (Object.keys(user).length === 0) {
      return navigate("/login");
    }
  };

  return (
    <>
      <Helmet>
        <title>Premium</title>
      </Helmet>
      <main className={style.main}>
        <section className={style.features}>
          <h2 className={style.heading}>
            Unlock Premium Features with Melodies
          </h2>
          <p className={style.paragraph}>
            Upgrade to Melodies Premium for just $5 and take your music
            experience to the next level! With a Premium subscription, you’ll
            gain access to exclusive features that will make your listening
            experience even more enjoyable.
          </p>
        </section>

        <section className={style.whatWeOffer}>
          <h2 className={style.heading}>What you can do with Premium:</h2>

          <ul>
            <li className={style.item}>
              <span className={style.logo}>Listen to Premium Tracks: </span>
              Enjoy high-quality music and exclusive tracks only available to
              Premium users. Access the latest hits, albums, and curated
              playlists without any interruptions.
            </li>

            <li className={style.item}>
              <span className={style.logo}>Ad-Free Listening: </span>
              Skip the ads and dive straight into your favorite tunes with a
              seamless listening experience.
            </li>
          </ul>
        </section>

        <section className={style.joinUs}>
          <h2 className={style.heading}>
            Want all these premium features for just $5?
          </h2>
          <p className={style.paragraph}>
            Click the button below to upgrade now and start enjoying your
            enhanced music experience with Melodies!
          </p>
        </section>

        <button
          onClick={() => {
            handleUser();
            handleOpen();
          }}
          className={style.premiumBtn}
          disabled={user.isPremium}
        >
          {user.isPremium ? "Already Premium" : "Upgrade to Premium"}
        </button>

        <CheckoutForm open={open} handleClose={handleClose} />
      </main>
    </>
  );
};

export default Premium;
