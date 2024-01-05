// LeftSidebar.js
import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Public";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { Modal } from "react-bootstrap";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import { truncateAddress } from "../functions/utils";
import { getLeftSideBarDetails } from "../functions/userInteractionFunctions";
import { uploadPost } from "../functions/uploadPostFunction";

function LeftSidebar() {
  const { address: userAddress } = useAccount();
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState("");
  const [displayImage, setDisplayImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setImage("");
    setDisplayImage(null);
    setCaption("");
  };

  async function uploadPostHandler() {
    await uploadPost(image, caption);
    setCaption("");
    setImage(null);
    setDisplayImage(null);
    handleClose();
    window.location.reload();
  }

  async function handleReadDetails() {
    try {
      const details = await getLeftSideBarDetails(userAddress);

      setNotificationsCount(details.notificationCount.toNumber());
      setUserImage(details.image);
      setUserName(details.name);
    } catch (error) {
      console.error("Error reading user details:", error);
    }
  }

  useEffect(() => {
    handleReadDetails();
  }, [userAddress, notificationsCount]);

  function handleCaptionChange(event) {
    setCaption(event.target.value);
  }

  function handleDrop(event) {
    event.preventDefault();
    const img = event.dataTransfer.files[0];
    setDisplayImage(URL.createObjectURL(img));
    setImage(img);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleClick(event) {
    event.preventDefault();
    document.getElementById("upload-file").click();
  }

  function handleImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setDisplayImage(URL.createObjectURL(img));
      setImage(event.target.files[0]);
    }
  }

  return (
    <div className="left-sidebar-container">
      <Link
        to={"/profile"}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="left-sidebar-user-info-box">
          <div className="leftsidebar-profile-img-box">
            <img
              className="leftsidebar-profile-img"
              src={
                userImage === ""
                  ? "https://gateway.ipfs.io/ipfs/QmQL7iRtD6P5d7bdzxWGrE89mVUvZi1jqn6kmpMtEF6CMv"
                  : userImage
              }
              alt="UserImage"
            />
          </div>
          <br />
          <div className="leftsidebar-user-info-detail-content">
            <span className="post-header-username">
              {userName === "" ? truncateAddress(userAddress) : userName}
            </span>
            <span className="post-header-useraddress">
              {truncateAddress(userAddress)}
            </span>
          </div>
        </div>
      </Link>
      <div className="left-sidebar-button-container">
        <Link
          to={"/"}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div className="left-sidebar-button">
            <div>
              <HomeIcon className="left-sidebar-button-icon" />
              <span className="left-sidebar-text">Home</span>
            </div>
          </div>
        </Link>

        <Link
          to={"/explore"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="left-sidebar-button">
            <div>
              <ExploreIcon className="left-sidebar-button-icon" />
              <span className="left-sidebar-text">Explore</span>
            </div>
          </div>
        </Link>

        <Link
          to={"/alert"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="left-sidebar-button">
            <div style={notificationsCount === 0 ? null : { color: "#f75656" }}>
              <NotificationsIcon className="left-sidebar-button-icon" />
              <span className="left-sidebar-text">Alerts</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Create Button */}
      <div className="left-sidebar-create-post-button" onClick={handleShow}>
        <div>
          <AddCircleOutlineIcon className="left-sidebar-button-icon" />
          <span className="left-sidebar-text">
            <span>Create</span>
            <span> Post</span>
          </span>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div
            className="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={handleClick}
          >
            {image && (
              <img
                src={displayImage}
                alt="Dropped"
                className="input-post-image"
              />
            )}
            {!image && (
              <div style={{ transform: "scale(3)" }}>
                <span>
                  <PermMediaOutlinedIcon style={{ marginBottom: "0.5rem" }} />
                </span>
                <div style={{ fontSize: "0.6rem" }}>
                  Drag Image here...
                  <br />
                  or
                  <br />
                  Click to choose Image...
                </div>
              </div>
            )}
          </div>

          <input
            type="file"
            className="post-image-input"
            id="upload-file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <textarea
            className="post-textarea"
            id="scroll-bar"
            rows="4"
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Write a post..."
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="post-button" onClick={uploadPostHandler}>
            Post
          </div>
          <div className="close-button" onClick={handleClose}>
            Close
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default LeftSidebar;
