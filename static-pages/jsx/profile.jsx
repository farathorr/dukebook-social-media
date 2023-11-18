<>
	<meta charSet="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>profile</title>
	<link rel="stylesheet" href="./css/profile.css" />
	<link rel="stylesheet" href="./css/index.css" />
	<nav>
		<img src="" alt="pictures" />
		<a href="feed.html">Feed</a>
		<a href="profile.html">Profile</a>
	</nav>
	<main>
		<div className="app-container">
			<div className="profile-pic">
				<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
					{/*! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
					<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
				</svg>
			</div>
			<div className="profile-info">
				<div className="title row">
					<h2>@Matti69</h2>
					<button className="btb">Follow</button>
				</div>
				<div className="details row">
					<ul>
						<li>
							<span>1</span>posts
						</li>
						<li>
							<span>1</span>follower
						</li>
						<li>
							<span>1</span>following
						</li>
					</ul>
				</div>
				<div className="descriptions">
					<h1>@Matti Valopää</h1>
					<span> Everyone has a story to tell!</span>
				</div>
			</div>
		</div>
		<div className="profile-container">
			<div className="post-container">
				<div className="post-header">
					<img src="profile-picture.jpg" alt="Profile Picture" className="profile-picture" />
					<div className="post-info">
						<h3 className="username">Username</h3>
						<div className="pictures-conttainer">
							<img className="pictures" src="../public/Duke3D.png" alt="Profile picture" width={279} height={279} />
							<div className="button-container">
								<button className="like-btn">Like</button>
								<button className="dislike-btn">Dislike</button>
								<button className="share-btn">Share</button>
								<button className="share-btn">Comment</button>
							</div>
							<p className="post-date">Posted on November 17, 2023</p>
							<p className="post-story">#like4like</p>
						</div>
						<div className="pictures-conttainer">
							<img className="pictures" src="../public/Duke3D.png" alt="Profile picture" width={279} height={279} />
							<div className="button-container">
								<button className="like-btn">Like</button>
								<button className="dislike-btn">Dislike</button>
								<button className="share-btn">Share</button>
								<button className="share-btn">Comment</button>
							</div>
							<p className="post-date">Posted on June 13, 2023</p>
							<p className="post-story">#like4like</p>
						</div>
						<div className="pictures-conttainer">
							<img className="pictures" src="../public/Duke3D.png" alt="Profile picture" width={279} height={279} />
							<div className="button-container">
								<button className="like-btn">Like</button>
								<button className="dislike-btn">Dislike</button>
								<button className="share-btn">Share</button>
								<button className="share-btn">Comment</button>
							</div>
							<p className="post-date">Posted on May 14, 2024</p>
							<p className="post-story">#like4like</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</>;
