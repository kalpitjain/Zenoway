// Home.js
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import Post from "../components/Post";
import Suggestionbar from "../components/Suggestionbar";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { readFollowingPosts } from "../functions/readPostFunctions";

function Home() {
  const [posts, setPosts] = useState([]);
  const { address: userAddress } = useAccount();

  useEffect(() => {
    async function fetchData() {
      const followingPosts = await readFollowingPosts(userAddress);
      setPosts(followingPosts);
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
              <Link
                to={"/explore"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span>
                  <ErrorOutlineIcon
                    style={{ transform: "scale(2)", margin: "1.5rem" }}
                  />
                </span>
                <br />
                <span>Follow People from explore page...</span>
              </Link>
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

export default Home;
