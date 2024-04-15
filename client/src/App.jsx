import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { Outlet, Navigate, Routes, Route, useLocation } from "react-router-dom";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Friends from "./components/friends/Friends";
import Followers from "./pages/followers/Followers";
import Following from "./pages/followers/Following";
import SearchPage from "./pages/searchpage/SearchPage";
import CloseIcon from "@mui/icons-material/Close";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import Navbar from "./components/navbar/Navbar";
import Posts from "./components/posts/Posts";
function App() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const { darkMode, toggle } = useContext(DarkModeContext);
  const Layout = () => {
    useEffect(() => {
      if (darkMode) {
        document.getElementsByTagName("html")[0].style.backgroundColor = "#222";
      } else {
        document.getElementsByTagName("html")[0].style.backgroundColor = "#fff";
      }
    }, [darkMode]);
    const [sidebarStatus, setsidebarStatus] = useState("close");
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        {location.pathname !== "/search" && <Navbar />}
        <div style={{ display: "flex", height: "100vh" }}>
          <div
            style={{ height: "100%" }}
            className={`${
              window.innerWidth <= 960
                ? `toggle-sidebar toggle-sidebar-${sidebarStatus}`
                : ""
            } `}
          >
            <LeftBar />
          </div>
          <div style={{ flex: 6, width: "75%", height: "100%" }}>
            <Outlet />
          </div>
          {location.pathname == "/" && <RightBar />}
        </div>
        {window.innerWidth <= 960 && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "10px",
              zIndex: "100",
            }}
          >
            {sidebarStatus == "open" ? (
              <CloseIcon
                style={{ color: darkMode ? "white" : "black" }}
                onClick={() =>
                  setsidebarStatus((prev) =>
                    prev == "open" ? "close" : "open"
                  )
                }
              />
            ) : (
              <DensityMediumIcon
                style={{ color: darkMode ? "white" : "black" }}
                onClick={() =>
                  setsidebarStatus((prev) =>
                    prev == "open" ? "close" : "open"
                  )
                }
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Routes>
      {/* <RouterProvider router={router} /> */}
      <Route
        path="/"
        element={currentUser ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route path={"/"} element={<Home />} />
        <Route path={"/profile/:username"} element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/followers" element={<Followers />} />
        <Route path="/following" element={<Following />} />
        <Route path="/search/:username" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/user-post"
          element={<Posts username={currentUser?.username} />}
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<h1>404 page not found</h1>} />
    </Routes>
  );
}

export default App;
