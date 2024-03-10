// import Stories from "../../components/stories/Stories"
import Slider from "../../components/slider/Slider";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      {/* <Stories/> */}
      <Slider />
      <Share />
      <Posts />
    </div>
  );
};

export default Home;
