import React, { useState, useEffect } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useAccount } from "wagmi";
import { Modal } from "react-bootstrap";
import UserInfo from "./UserInfo";
import { timeSince, truncateAddress } from "../functions/utils";
import {
  getFollowingStatus,
  followUser,
  unfollowUser,
} from "../functions/userInteractionFunctions";

import {
  getIsLiked,
  getLikeCount,
  getPostDetails,
  likePost,
  unLikePost,
} from "../functions/postFunctions";

function Post(props) {
  const [showLikes, setShowLikes] = useState(false);
  const [likesUsers, setLikesUsers] = useState([]);
  const [reloadComponent, setReloadComponent] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const { address: userAddress } = useAccount();
  const [isFollowingStatus, setFollowingStatus] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [likes, setLikes] = useState(0);
  const [isLiked, setLiked] = useState(false);

  useEffect(() => {
    handlePostDetails();
    handleLikeCount();
    handleCheckLike();
    handleFollowingStatus();
  }, [userAddress, reloadComponent, likePost, unLikePost]);

  const handlePostDetails = async () => {
    const details = await getPostDetails(props.creatorAddress, props.id);
    setLikesUsers(details.allLikesUsers);
    setUserImage(details.image);
    setUserName(details.name);
  };

  const handleFollowingStatus = async () => {
    const status = await getFollowingStatus(userAddress, props.creatorAddress);
    setFollowingStatus(status);
  };

  const handleFollowUser = async () => {
    await followUser(props.creatorAddress);
    setReloadComponent(true);
  };

  const handleUnfollowUser = async () => {
    await unfollowUser(props.creatorAddress);
    setReloadComponent(true);
  };

  const handleLike = async () => {
    await likePost(props.id);
    setReloadComponent(true);
  };

  const handleUnlike = async () => {
    unLikePost(props.id);
    setReloadComponent(true);
  };

  const handleLikeCount = async () => {
    try {
      const likesCount = await getLikeCount(props.id);
      setLikes(likesCount.toNumber());
    } catch (error) {
      console.error("Error getting like count:", error);
    }
  };

  const handleCheckLike = async () => {
    const liked = await getIsLiked(props.id, userAddress);
    setLiked(liked);
  };

  const handleReadMoreClick = () => setExpanded(true);
  const handleReadLessClick = () => setExpanded(false);

  const handleShowLikes = () => setShowLikes(true);
  const handleCloseLikes = () => setShowLikes(false);

  return (
    <div className="post">
      <div className="post-header">
        <div className="head">
          <div className="head-box">
            <img
              src={
                userImage === ""
                  ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
                  : userImage
              }
              alt="UserImage"
              className="profile-img"
            />
            <div className="post-header-content">
              <span className="post-header-username">
                {userName === ""
                  ? truncateAddress(props.creatorAddress)
                  : userName}
              </span>
              <span className="time-duration">
                {timeSince(props.dateCreated.toNumber())} {"ago"}
              </span>
            </div>
          </div>

          <div className="action-button">
            {props.creatorAddress === userAddress ? null : isFollowingStatus ===
              true ? (
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
      </div>
      <div className="post-caption">
        {props.postCaption.length > 200 ? (
          isExpanded ? (
            <p>
              {props.postCaption}{" "}
              <span className="read-link" onClick={handleReadLessClick}>
                <br />
                less
              </span>
            </p>
          ) : (
            <p>
              {props.postCaption.substring(0, 200)}
              {"... "}
              <span className="read-link" onClick={handleReadMoreClick}>
                more
              </span>
            </p>
          )
        ) : (
          <p>{props.postCaption}</p>
        )}
      </div>
      <div className="post-middle">
        {props.addressOfImage === "" ? null : (
          <img
            className="post-image"
            src={props.addressOfImage}
            alt="User's Post"
          />
        )}
        <div className="post-footer">
          {likes === 0 ? null : (
            <Modal show={showLikes} onHide={handleCloseLikes}>
              <Modal.Header closeButton>
                <Modal.Title>Likes</Modal.Title>
              </Modal.Header>
              <div className="dialog-box" id="scroll-bar">
                <Modal.Body>
                  {likesUsers
                    .slice(0)
                    .reverse()
                    .map((likesUsers, index) => {
                      return <UserInfo key={index} address={likesUsers} />;
                    })}
                </Modal.Body>
              </div>
            </Modal>
          )}
          <span style={{ cursor: "pointer" }}>
            {isLiked === true ? (
              <span onClick={handleUnlike} className="like-button">
                <ThumbUpIcon />
              </span>
            ) : (
              <span onClick={handleLike} className="like-button">
                <ThumbUpOutlinedIcon />
              </span>
            )}
            <span className="like-count" onClick={handleShowLikes}>
              {likes} {likes <= 1 ? "Like" : "Likes"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Post;
