import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import NotificationControls from "./context/NotificationControls/NotificationControls";
import AuthenticationControls from "./context/AuthenticationContext/AuthenticationContext";
import ImageUploader from "./components/ImageUploader/ImageUploader";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<NotificationControls>
			<AuthenticationControls>
				<ImageUploader>
					<App />
				</ImageUploader>
			</AuthenticationControls>
		</NotificationControls>
	</React.StrictMode>
);
