import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import NotificationControls from "./context/NotificationControls/NotificationControls";
import AuthenticationControls from "./context/AuthenticationContext/AuthenticationContext";
import ImageUploader from "./components/ImageUploader/ImageUploader";
import ChatProvider from "./context/ChatGroupContext/ChatGroupContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<NotificationControls>
			<AuthenticationControls>
				<ImageUploader>
					<ChatProvider>
						<App />
					</ChatProvider>
				</ImageUploader>
			</AuthenticationControls>
		</NotificationControls>
	</React.StrictMode>
);
