const { BrowserRouter, Routes, Route } = require("react-router-dom");

function App() {
	return (
		<div className="app">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<div>Home</div>} />
					<Route path="/profile" element={<div>profile</div>} />
					<Route path="/feed" element={<div>feed</div>} />
					<Route path="/login" element={<div>login</div>} />
					<Route path="/register" element={<div>register</div>} />
					<Route path="/post" element={<div>post</div>} />
					<Route path="/chat" element={<div>chat</div>} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
