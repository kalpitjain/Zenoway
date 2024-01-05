import React, { useState } from "react";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import {
  updateUserBio,
  updateUserName,
  updateUserProfile,
} from "../functions/userInteractionFunctions";

function EditProfile() {
  const [image, setImage] = useState("");
  const [displayImage, setDisplayImage] = useState(null);

  function handleImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setDisplayImage(URL.createObjectURL(img));
      setImage(event.target.files[0]);
    }
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

  async function updateImage() {
    try {
      await updateUserProfile(image);

      setImage(null);
      setDisplayImage(null);
    } catch (err) {
      console.log(err);
      alert("Unable to Upload Image");
    }
  }

  const [userName, setUserName] = useState("");
  function handleUserNameChange(event) {
    setUserName(event.target.value);
  }

  async function updateName() {
    await updateUserName(userName);
    setUserName("");
  }

  const [userBio, setUserBio] = useState("");
  function handleUserBioChange(event) {
    setUserBio(event.target.value);
  }

  async function updateBio() {
    await updateUserBio(userBio);
    setUserBio("");
  }

  return (
    <>
      <div className="edit-page-box">
        <div className="flex-shrink-0" style={{ height: "10rem" }}>
          <div className="image-drop-down">
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
                <div style={{ transform: "scale(1.5)" }}>
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
          </div>

          <input
            type="file"
            className="Edit-img-box img-fluid"
            id="upload-file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        <div className="profile-update-button" onClick={updateImage}>
          Update Image
        </div>

        <hr />

        <input
          value={userName}
          type="text"
          placeholder="New Username"
          onChange={handleUserNameChange}
          className="profile-username-input"
        />

        <div className="profile-update-button" onClick={updateName}>
          Update Name
        </div>

        <hr />

        <textarea
          value={userBio}
          onChange={handleUserBioChange}
          id="scroll-bar"
          className="profile-bio-input"
          placeholder="New Bio"
        />

        <div className="profile-update-button" onClick={updateBio}>
          Update Bio
        </div>
      </div>
    </>
  );
}
export default EditProfile;
