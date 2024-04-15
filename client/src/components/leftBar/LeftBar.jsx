import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import SearchImg from "../../assets/search.png";
import Gallery from "../../assets/8.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
const LeftBar = ({ className }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { darkMode, toggle } = useContext(DarkModeContext);

  return (
    <div className={`leftBar`}>
      <div className="container">
        <div className="menu">
          <div className="item">
            <Link
              to={"/profile/" + currentUser.username}
              style={{ textDecoration: "none" }}
            >
              <img src={"/upload/" + currentUser.profilePic} alt="" />
              <span>{currentUser.name}</span>
            </Link>
          </div>
          <div className="item">
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <img src={"/home.jpeg"} alt="home" />
              <span>Home</span>
            </Link>
          </div>
          <div className="item">
            <Link to={"/followers"} style={{ textDecoration: "none" }}>
              <img src={Groups} alt="" />
              <span>followers</span>
            </Link>
          </div>
          <div className="item">
            <Link to={"/following"} style={{ textDecoration: "none" }}>
              <img src={Friends} alt="" />
              <span>following</span>
            </Link>
          </div>
          <div className="item">
            <Link to={"/user-post"} style={{ textDecoration: "none" }}>
              <img src={Gallery} alt="" />
              <span>Your Post</span>
            </Link>
          </div>
          <div className="item">
            <Link to={"/search"} style={{ textDecoration: "none" }}>
              <img src={SearchImg} alt="" />
              <span>Search user</span>
            </Link>
          </div>
          <div className="item">
            <Link
              to={"/login"}
              className="logout"
              onClick={() => {
                localStorage.setItem("user", null);
                setCurrentUser(null);
              }}
              style={{ textDecoration: "none" }}
            >
              <img src={"/lg.png"} alt="" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        {darkMode ? (
          <WbSunnyOutlinedIcon style={{ color: "white" }} onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
      </div>
    </div>
  );
};

export default LeftBar;
