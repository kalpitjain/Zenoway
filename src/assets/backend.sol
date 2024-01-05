// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract zenoway {
    struct User {
        address userAddress;
        string username;
        string profileImageAddress;
        string bio;
        address[] followers;
        address[] following;
        uint256 postCount;
        Notification[] userNotifications;
    }

    struct Post {
        uint256 postId;
        address creatorAddress;
        string imageAddress;
        string postCaption;
        uint256 timeCreated;
        address[] likes;
    }

    struct Notification {
        address userAddress;
        string action;
        uint256 time;
    }

    address[] public allUsers;
    Post[] posts;
    mapping(address => User) users;

    function addUser(address userAddress) public {
        bool userExists = false;
        for (uint i = 0; i < allUsers.length; i++) {
            if (allUsers[i] == userAddress) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            allUsers.push(msg.sender);
        }
    }

    //Create Post
    function createPost(string memory imageAddress, string memory postCaption) public {
        require(bytes(imageAddress).length > 0 || bytes(postCaption).length > 0, "Empty Field");
        uint256 postId = posts.length;
        address[] memory postLikes = new address[](0);
        Post memory newPost = Post(postId, msg.sender, imageAddress, postCaption, block.timestamp, postLikes);
        posts.push(newPost);
        users[msg.sender].postCount++;
    }

    // Like Post
    function likePost(uint256 postId) public {
        require(postId < posts.length, "Post does not exist");
        require(!hasLiked(postId, msg.sender), "Already Like");
        posts[postId].likes.push(msg.sender);
        if(posts[postId].creatorAddress != msg.sender){
            Notification memory newNotification = Notification(msg.sender, "like", block.timestamp);
            users[posts[postId].creatorAddress].userNotifications.push(newNotification);
        }
    }

    // Get Post Like Count
    function getPostLikesCount(uint256 postId) public view returns (uint256) {
        require(postId < posts.length, "Post does not exist");
        return posts[postId].likes.length;
    }

    // Check Liked
    function hasLiked(uint postId, address userAddress) public view returns (bool) {
        for(uint256 i=0; i<posts[postId].likes.length; i++){
            if(posts[postId].likes[i] == userAddress){
                return true;
            }
        }
        return false;
    }

    // Unlike Post
    function unlikePost(uint256 postId) public{
        require(postId < posts.length, "Post does not exist");
        bool doesUserExists = false;
        uint256 likedUserIndex = posts[postId].likes.length;
        for(uint256 j=0; j<posts[postId].likes.length; j++){
            if(posts[postId].likes[j] == msg.sender){
                doesUserExists = true;
                likedUserIndex = j;
                break;
            }
        }
        if(doesUserExists){
        for(uint256 j=likedUserIndex; j<posts[postId].likes.length-1; j++){
                posts[postId].likes[j] = posts[postId].likes[j+1];
            }
            posts[postId].likes.pop();
        }
    }

    //Follow User
    function followUser(address userToFollow) public {
        require(userToFollow != msg.sender, "You cannot follow yourself");
        users[userToFollow].followers.push(msg.sender);
        users[msg.sender].following.push(userToFollow);
        Notification memory newNotification = Notification(msg.sender, "follow", block.timestamp);
        users[userToFollow].userNotifications.push(newNotification);
    }

    //Unfollow User
    function unfollowUser(address userToUnfollow) public {
        for (uint i = 0; i < users[userToUnfollow].followers.length; i++) {
            if (users[userToUnfollow].followers[i] == msg.sender) {
                // Remove the follower
                users[userToUnfollow].followers[i] = users[userToUnfollow].followers[users[userToUnfollow].followers.length - 1];
                users[userToUnfollow].followers.pop();
                users[msg.sender].following.pop();
                break;
            }
        }
    }

    // Check Following
    function isFollowing(address follower, address following) public view returns (bool) {
        for (uint i = 0; i < users[following].followers.length; i++) {
            if (users[following].followers[i] == follower) {
                return true;
            }
        }
        return false;
    }

    // Get Notifications
    function getUserNotifications(address userAddress) public view returns (Notification[] memory) {
        return users[userAddress].userNotifications;
    }

    // Clear Notifications 
    function clearNotifications() public {
        delete users[msg.sender].userNotifications;
    }

    // Notifications Count
    function getNotificationCount(address userAddress) public view returns (uint256) {
        return users[userAddress].userNotifications.length;
    }

    //Read All Posts
    function readPosts() public view returns (Post[] memory) {
        return posts;
    }

    //Read User Post
    function readUserPosts(address userAddress) public view returns (Post[] memory) {
        uint256[] memory userPosts = new uint256[](posts.length);
        uint256 userPostsCount = 0;
        for (uint256 i = 0; i < posts.length; i++) {
            if (posts[i].creatorAddress == userAddress) {
                userPosts[userPostsCount] = i;
                userPostsCount++;
            }
        }
        Post[] memory result = new Post[](userPostsCount);
        for (uint256 i = 0; i < userPostsCount; i++) {
            result[i] = posts[userPosts[i]];
        }
        return result;
    }

    // Read Following Posts
    function readFollowingPosts(address userAddress) public view returns (Post[] memory) {
        uint256[] memory followedPosts = new uint256[](posts.length);
        uint256 followedPostsCount = 0;
        for (uint256 i = 0; i < posts.length; i++) {
            if (isFollowing(userAddress, posts[i].creatorAddress)) {
                followedPosts[followedPostsCount] = i;
                followedPostsCount++;
            }
        }
        Post[] memory result = new Post[](followedPostsCount);
        for (uint256 i = 0; i < followedPostsCount; i++) {
            result[i] = posts[followedPosts[i]];
        }
        return result;
    }

    // Set Username
    function setUserName(string memory newName) public {
        require (bytes(newName).length > 0, "Empty Field");
        users[msg.sender].username = newName;
    }

    // Set Profile Image
    function setUserProfileImage(string memory newImage) public {
        require (bytes(newImage).length > 0, "Empty Field");
        users[msg.sender].profileImageAddress = newImage;
    }

    // Set Bio
    function setUserBio(string memory newBio) public {
        require (bytes(newBio).length > 0, "Empty Field");
        users[msg.sender].bio = newBio;
    }

    // Get Username
    function getUserName(address userAddress) public view returns (string memory) {
        return users[userAddress].username;
    }

    // Get Profile Image
    function getUserProfileImage(address userAddress) public view returns (string memory) {
        return users[userAddress].profileImageAddress;
    }

    // Get Bio
    function getUserBio(address userAddress) public view returns (string memory) {
        return users[userAddress].bio;
    }

    // Post Count 
    function getUserPostsCount(address userAddress) public view returns (uint256) {
        return users[userAddress].postCount;
    }

    // Get following count
    function getFollowingsCount(address userAddress) public view returns (uint256) {
        return users[userAddress].following.length;
    }

    // Get follower count
    function getFollowersCount(address userAddress) public view returns (uint256) {
        return users[userAddress].followers.length;
    }

    // Get Followers Address
    function getFollowersAddress(address userAddress) public view returns (address[] memory) {
        return users[userAddress].followers;
    }

    //Get following addresses

    function getFollowingAddresses(address userAddress) public view returns (address[] memory) {
        return users[userAddress].following;
    }

    // Get Post Likes
    function getPostLikes(uint256 postId) public view returns (address[] memory) {
        require(postId < posts.length, "Post does not exist");
        return posts[postId].likes;
    }
}
