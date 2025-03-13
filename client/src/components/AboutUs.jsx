import { Helmet } from "react-helmet-async";
import style from "../assets/style/aboutUs.module.scss";

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <main className={style.main}>
        <section className={style.aboutUs}>
          <h2 className={style.heading}>About Us</h2>
          <p className={style.paragraph}>
            Welcome to <span className={style.logo}>Melodies</span> — where
            music meets passion. We`re a streaming platform designed for music
            lovers, artists, and creators. Whether you`re here to discover new
            tracks, create your own music playlist, or share your latest
            creations, Melodies provides the space and tools to experience music
            in a way that resonates with you.
          </p>
        </section>

        <section className={style.ourMission}>
          <h2 className={style.heading}>Our Mission</h2>
          <p className={style.paragraph}>
            At <span className={style.logo}>Melodies</span>, we believe that
            music is more than just sound — it`s an experience that connects
            people, inspires emotions, and creates memories. Our mission is to
            provide a space where listeners and artists can connect, share, and
            celebrate music in its purest form. From independent artists to
            established stars, everyone has a place here to share their voice
            and passion for music.
          </p>
        </section>

        <section className={style.whatWeOffer}>
          <h2 className={style.heading}>What We Offer</h2>

          <ul>
            <li className={style.item}>
              <span className={style.logo}>Music Streaming: </span>With millions
              of tracks across all genres, there`s always something new to
              discover. Whether you`re into pop, rock, classical, or hip-hop,
              we`ve got you covered.
            </li>

            <li className={style.item}>
              <span className={style.logo}>Artist Collaboration: </span>Melodies
              fosters creativity by offering collaboration tools for musicians
              and producers. Whether you`re looking to work on your next album
              or collaborate with others, our platform makes it easy to connect.
            </li>

            <li className={style.item}>
              <span className={style.logo}>Custom Playlists: </span>Create
              personalized playlists for any mood, moment, or genre. Share your
              favorite tracks with friends or discover new ones curated by our
              community.
            </li>

            <li className={style.item}>
              <span className={style.logo}>Exclusive Content: </span>With
              premium memberships, you get access to early releases, exclusive
              albums, and behind-the-scenes content from your favorite artists.
            </li>
          </ul>
        </section>

        <section className={style.ourVision}>
          <h2 className={style.heading}>Our Vision</h2>
          <p className={style.paragraph}>
            We aim to be more than just a music platform. We want to inspire and
            amplify the voices of independent artists, provide music lovers with
            a place to discover new sounds, and offer creators the tools they
            need to succeed. Whether you`re listening, sharing, or creating,
            Melodies is your music companion for life.
          </p>
        </section>

        <section className={style.joinUs}>
          <h2 className={style.heading}>Join the Melodies Community</h2>
          <p className={style.paragraph}>
            Melodies is a community that celebrates diversity, creativity, and
            the power of music. No matter where you are in your musical journey,
            we’re here to support you. Join the Melodies family and let`s
            create, listen, and enjoy music together.
          </p>
        </section>
      </main>
    </>
  );
};

export default AboutUs;
