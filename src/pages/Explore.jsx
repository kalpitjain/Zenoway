// Explore.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import Post from "../components/Post";
import Suggestionbar from "../components/Suggestionbar";
import { readPosts } from "../functions/readPostFunctions";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAccount } from "wagmi";

function Explore() {
  const { address: userAddress } = useAccount();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allPosts = await readPosts();
      setPosts(allPosts);
    }

    fetchData();
  }, [userAddress]);

  return (
    <>
      <Header />
      <div className="main">
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
        <Suggestionbar />
      </div>
    </>
  );
}

export default Explore;
