import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
import { toast } from "react-toastify";
import Logo from "../../components/Logo";
import { RiLockPasswordFill, RiMailFill, RiUserFill } from "react-icons/ri";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const isError = await login(inputs);
    if (isError) {
      toast.error(isError);
    } else {
      toast.success("Login Successful.....");
      navigate("/");
    }
  };

  return (
    <div>
      <video
        className="video"
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          zIndex: "-1",
        }}
        src="/smv.mp4"
        autoPlay={true}
        autoFocus={true}
        loop={true}
      ></video>

      <div className="login">
        <div className="opacity">
          <Logo h={"150"} />
          <h1>Login</h1>
          <form>
            <div className="form-group">
              <RiUserFill />
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <RiLockPasswordFill />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <button onClick={handleLogin}>Login</button>
          </form>
          <span className="is-user">
            Don't have an account <Link to={"/register"}>Register</Link>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
