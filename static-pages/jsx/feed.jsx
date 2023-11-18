<div>
<html lang="en">
	<head>
		<meta charSet="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Feed</title>
		<link rel="stylesheet" href="./css/index.css" />
		<link rel="stylesheet" href="./css/feed.css" />
	</head>
	<body>
		<nav>
			<img src="" alt="logo" />
			<a href="feed.html">Feed</a>
			<a href="profile.html">Profile</a>
		</nav>
		<h1 className="title">Feed</h1>
		<section className="main-content">
			<div className="newPost">
				<p>New Post</p>
				<textarea></textarea>
				<div className="buttonContainer">
					<button className="postButton" value="Post">Post</button>
					<button className="linkButton" value="Link">
						<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
							<path
								d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div className="postContainer">
				<div className="postData">
					<div className="postContent">
						<div className="profileContainer">
							<img className="profilePic" src="../public/Duke3D.png" alt="Profile picture" width="100" height="100" />
							<p className="postAuthor">@author</p>
							<p className="timeStamp" title="12:54 14/11/2023">2 hours ago</p>
						</div>
						<p className="postText">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quibusdam, voluptatum, quos, voluptatem voluptas quia quae
							aspernatur voluptatibus quod doloribus quas. Quisquam quibusdam, voluptatum, quos, voluptatem voluptas quia quae aspernatur
							voluptatibus quod doloribus quas.
						</p>
						<img className="postImage" src="../public/background.webp" alt="Picture" width="400" height="300" />
					</div>
					<div className="postStats">
						<div className="statContainer">
							<button className="likeButton">
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
									<path
										d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
									/>
								</svg>
							</button>
							<p>0</p>
						</div>
						<div className="statContainer">
							<button className="dislikeButton">
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
									<path
										d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
									/>
								</svg>
							</button>
							<p>0</p>
						</div>
						<div className="statContainer">
							<button className="commentButton">
								<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
									<path
										d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"
									/>
								</svg>
							</button>
							<p>0</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	</body>
</html>
</div>