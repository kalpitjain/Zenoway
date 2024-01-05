// Profile.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import Post from "../components/Post";
import { useAccount } from "wagmi";
import { readUserPosts } from "../functions/readPostFunctions";
import UserProfile from "../components/UserProfile";
import RefreshIcon from "@mui/icons-material/Refresh";

function Profile() {
  const [posts, setPosts] = useState([]);
  const { address: userAddress } = useAccount();

  useEffect(() => {
    async function fetchData() {
      const userPosts = await readUserPosts(userAddress);
      setPosts(userPosts);
    }

    fetchData();
  }, [userAddress]);

  return (
    <>
      <Header />
      <LeftSidebar />
      <div className="post-container container">
        {posts.length === 0 ? (
          <div className="warning">
            <span
              onClick={() => {
                window.location.reload();
              }}
            >
              <RefreshIcon
                style={{
                  transform: "scale(2)",
                  margin: "1.5rem",
                  cursor: "pointer",
                }}
              />
            </span>
            <br />
            <span style={{ cursor: "pointer" }}>No Posts Yet...</span>
          </div>
        ) : (
          posts
            .slice(0)
            .reverse()
            .map((post, index) => (
              <Post
                key={index}
                id={Number(post.postId)}
                creatorAddress={post.creatorAddress}
                addressOfImage={post.imageAddress}
                postCaption={post.postCaption}
                dateCreated={post.timeCreated}
              />
            ))
        )}
      </div>
      <UserProfile />
    </>
  );
}

export default Profile;
