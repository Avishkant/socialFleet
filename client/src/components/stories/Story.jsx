import React from "react";

const Story = ({ imgSrc, username, onClick }) => {
  return (
    <div className="story" onClick={onClick}>
      <img
        src={imgSrc ? "/upload/" + imgSrc : "/user.png"}
        alt={"image of " + username + " not availabe"}
      />
      <span>{username}</span>
    </div>
  );
};

export default Story;
