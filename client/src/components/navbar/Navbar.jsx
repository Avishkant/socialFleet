import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import { AuthContext } from "../../context/authContext";
import { useContext, useRef } from "react";
const Navbar = () => {
  const { setCurrentUser } = useContext(AuthContext);
  const searchRef = useRef();
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <div className="nav__content">
        <Link className="logo" to={"/"}>
          <img src="/logo.svg" alt="Socialfleet" />
        </Link>
        <div className="nav__search">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Enter user_name"
            ref={searchRef}
            className="nav__search--input"
          />
          <button
            onClick={() => {
              if (searchRef.current.value) {
                navigate(`/search/${searchRef.current.value}`);
              }
            }}
            className="nav__search--btn"
          >
            <SearchIcon />
          </button>
        </div>
        <ul className="nav__items">
          <li className="nav__item">
            <Link to={"/"}>
              <HomeOutlinedIcon />
            </Link>
          </li>
          <li className="nav__item">
            <Link
              onClick={() => {
                localStorage.setItem("user", null);
                setCurrentUser(null);
              }}
              to={"/login"}
            >
              <ExitToAppRoundedIcon />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
