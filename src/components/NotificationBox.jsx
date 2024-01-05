// NotificationBox.js
import React, { useState, useEffect } from "react";
import { timeSince, truncateAddress } from "../functions/utils";
import { getUserDetails } from "../functions/userInteractionFunctions";
import { useAccount } from "wagmi";

function NotificationBox(props) {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const { address: userAddress } = useAccount();

  async function handleReadDetails() {
    const userDetails = await getUserDetails(props.address);
    setUserImage(userDetails.image);
    setUserName(userDetails.name);
  }

  useEffect(() => {
    handleReadDetails();
  }, [userAddress]);

  return (
    <div className="notification-box">
      <img
        src={
          userImage === ""
            ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
            : userImage
        }
        alt="UserImage"
        className="notification-profile-img"
      />

      <div className="notification-content-box">
        <span className="notification-content">
          {userName || truncateAddress(props.address)}
          {props.action === "like" ? " liked your post!" : " is following you!"}
        </span>
        <span>{timeSince(props.time)} ago</span>
      </div>
    </div>
  );
}

export default NotificationBox;
