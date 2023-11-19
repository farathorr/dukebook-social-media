import React from "react";
import style from "./Chat.module.scss";
import image from "../../images/Duke3D.png";
import FriendRow from "./FriendRow/FriendRow";

export default function Chat() {
	return (
		<div className={style["chat-page"]}>
			<nav>
				<img src="" alt="logo" />
				<a href="">Lorem.</a>
				<a href="">Facere?</a>
				<a href="">Temporibus.</a>
			</nav>
			<main className={style["page-content"]}>
				<div className={style["friend-list"]}>
					<FriendRow userName="Duke" lastMessage="asasd" image={image} />
					<FriendRow userName="Testing long name asdasdasd" lastMessage="asasd" image={image} />
					<FriendRow userName="Duke 1" lastMessage="asasd" image={image} />
					<FriendRow userName="Duke 2" lastMessage="asasd" image={image} />
					<FriendRow userName="Duke 3" image={image} />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
					<FriendRow />
				</div>
				<div className={style["chat-frame"]}>
					<div className={style["chat-bar"]}>
						<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
						<div className={style["bar-user-info-container"]}>
							<span className={style["user-name"]}>Duke</span>
							<div className={style["user-status-indicator"]} />
							<span className={style["user-status"]}>Online</span>
						</div>
					</div>
					<div className={style["message-box"]}>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke</span>
								<span className={style["message-date"]}>16/11/2023 09:01</span>
								<pre>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</pre>
								<pre>
									{"\t"}Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat ratione quod adipisci dolores aperiam, quidem
									recusandae cupiditate unde harum voluptatibus! Adipisci veritatis laborum minima modi ducimus nulla libero repudiandae!
									Eligendi.
								</pre>
								<pre>Lorem, ipsum dolor.</pre>
							</div>
						</div>
						<div className={style["message-day-separator"]}>17 November 2023</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke 2</span>
								<span className={style["message-date"]}>Yesterday at 15:30</span>
								<pre>lol</pre>
								<pre>nice</pre>
							</div>
						</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke</span>
								<span className={style["message-date"]}>Yesterday at 15:30</span>
								<pre>k</pre>
							</div>
						</div>
						<div className={style["message-day-separator"]}>18 November 2023</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke</span>
								<span className={style["message-date"]}>Today at 15:23</span>
								<pre>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</pre>
								<pre>
									{"\t"}Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat ratione quod adipisci dolores aperiam, quidem
									recusandae cupiditate unde harum voluptatibus! Adipisci veritatis laborum minima modi ducimus nulla libero repudiandae!
									Eligendi.
								</pre>
								<pre>Lorem, ipsum dolor.</pre>
							</div>
						</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke 2</span>
								<span className={style["message-date"]}>Today at 15:30</span>
								<pre>lol</pre>
								<pre>nice</pre>
							</div>
						</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke</span>
								<span className={style["message-date"]}>Today at 15:30</span>
								<pre>k</pre>
							</div>
						</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke</span>
								<span className={style["message-date"]}>Today at 15:23</span>
								<pre>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.</pre>
								<pre>
									{"\t"}Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat ratione quod adipisci dolores aperiam, quidem
									recusandae cupiditate unde harum voluptatibus! Adipisci veritatis laborum minima modi ducimus nulla libero repudiandae!
									Eligendi.
								</pre>
								<pre>Lorem, ipsum dolor.</pre>
							</div>
						</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke 2</span>
								<span className={style["message-date"]}>Today at 15:30</span>
								<pre>lol</pre>
								<pre>nice</pre>
							</div>
						</div>
						<div className={style["message-row"]}>
							<img className={style["profile-pic"]} src={image} alt="Profile picture" width={40} height={40} />
							<div className={style["message-content"]}>
								<span className={style["message-user-name"]}>Duke</span>
								<span className={style["message-date"]}>Today at 15:30</span>
								<pre>k</pre>
							</div>
						</div>
					</div>
					<form className={style["chat-input"]}>
						<textarea
							className={style["text-field"]}
							name="message"
							placeholder="Type a message..."
							onInput={(e) => {
								const input = e.target;
								input.style.height = "";
								input.style.height = input.scrollHeight + "px";
							}}
							defaultValue={""}
						/>
						<button className={style["send-button"]}>Send</button>
						<button className={style["attach-button"]}>Attach</button>
					</form>
				</div>
			</main>
		</div>
	);
}
