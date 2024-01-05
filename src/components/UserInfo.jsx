// UserInfo.js
import React, { useState, useEffect } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { useAccount } from "wagmi";
import { truncateAddress } from "../functions/utils";
import {
  getUserDetails,
  getFollowingStatus,
  followUser,
  unfollowUser,
} from "../functions/userInteractionFunctions";

function UserInfo(props) {
  const { address: userAddress } = useAccount();
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [isFollowingStatus, setFollowingStatus] = useState(false);
  const [reloadComponent, setReloadComponent] = useState(false);

  async function handleReadDetails() {
    const userDetails = await getUserDetails(props.address);
    setUserImage(userDetails.image);
    setUserName(userDetails.name);
  }

  async function handleFollowingStatus() {
    const status = await getFollowingStatus(userAddress, props.address);
    setFollowingStatus(status);
  }

  async function handleFollowUser() {
    await followUser(props.address);
    setReloadComponent(true);
  }

  async function handleUnfollowUser() {
    await unfollowUser(props.address);
    setReloadComponent(true);
  }

  useEffect(() => {
    handleReadDetails();
    handleFollowingStatus();
    if (reloadComponent) {
      setReloadComponent(false);
    }
  }, [userAddress, reloadComponent]);

  return (
    <div className="right-sidebar-user-info-box">
      <img
        src={
          userImage === ""
            ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
            : userImage
        }
        alt="UserImage"
        className="rightsidebar-profile-img"
      />

      <div className="rightsidebar-user-info-detail-content">
        <span className="post-header-username">
          {userName || truncateAddress(props.address)}
        </span>
        <span className="post-header-useraddress">
          {truncateAddress(props.address)}
        </span>
      </div>
      <div className="rightsidebar-follow-icon">
        {props.address === userAddress ? null : isFollowingStatus === true ? (
          <span className="follow-button" onClick={handleUnfollowUser}>
            <GroupRemoveIcon />
          </span>
        ) : (
          <span className="follow-button" onClick={handleFollowUser}>
            <GroupAddIcon />
          </span>
        )}
      </div>
    </div>
  );
}

export default UserInfo;
