import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMakeRequest from "../../hook/useFetch";
import Popup from "../Popup/Popup"; // Import Popup component

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [captionOpen, setCaptionOpen] = useState(false); // State to manage the caption popup
  const makeRequest = useMakeRequest();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();

    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  const handleCaptionGenerated = (generatedCaption) => {
    setDesc(generatedCaption); // Update desc with the generated caption
    setCaptionOpen(false); // Close the caption popup after generating caption
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button className="generate-caption-btn" onClick={() => setCaptionOpen(true)}>Generate Caption</button>
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
      {/* Render Popup only when captionOpen is true */}
      {captionOpen && <Popup open={captionOpen} handleClose={() => setCaptionOpen(false)} handleCaptionGenerated={handleCaptionGenerated} />}
    </div>
  );
};

export default Share;
