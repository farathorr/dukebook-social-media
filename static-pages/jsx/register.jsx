<div>
<html lang="en">
	<head>
		<meta charSet="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Login</title>
		<link rel="stylesheet" href="./css/index.css" />
		<link rel="stylesheet" href="./css/login.css" />
	</head>
	<body>
		<nav>
			<img src="" alt="logo" />
			<a href="feed.html">Feed</a>
			<a href="profile.html">Profile</a>
		</nav>
		<div className="main-content">
			<h1>Login</h1>
			<form className="loginForm">
				<label htmlFor="username">Username:</label>
				<input type="text" id="username" />
				<label htmlFor="password">Password:</label>
				<input type="password" id="password" />
				<input type="submit" value="Login" />
			</form>
			<div className="registerLoginContainer">
				<label htmlFor="register">New user? Register here:</label>
				<a className="registerButton" href="register.html">
					<button role="link">Register</button>
				</a>
			</div>
		</div>
	</body>
</html>
</div>