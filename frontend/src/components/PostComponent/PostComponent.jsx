import style from "./PostComponent.module.scss";
import { Link } from "react-router-dom";
import PostTime from "./PostTime/PostTime";
import PostStats from "./PostStats/PostStats";

export default function PostComponent(props) {
	const { postId, likes, dislikes, comments, onUpdate, userTag, text, edited, removed } = props;
	const stats = { postId, likes, dislikes, comments, onUpdate, userTag, text, removed };

	return (
		<div className={style["post-container"]} id={postId}>
			<div className={style["post-data"] + " " + (!props.removed || style["removed"])}>
				<div className={style["post-content"]}>
					{!props.removed && <img className={style["profile-pic"]} src={props.profilePic} alt="Profile picture" width={100} height={100} />}
					<div className={style["post-text-container"]}>
						{!props.removed && (
							<>
								<span className={style["post-user-name"]}>{props.username}</span>
								<Link className={style["post-user-tag"]} to={`/user/${userTag}`}>
									@{userTag}
								</Link>
							</>
						)}
						<PostTime time={props.date} />
						<pre className={style["post-text"]}>{props.text}</pre>
						{props.images.map((image, index) => (
							<img className={style["post-image"]} src={image} key={index} alt="Picture" />
						))}
						
						{edited ? <span className={style["edited"]}>(Edited)</span> : null}
					</div>
				</div>
				<PostStats {...stats} />
			</div>
			{props.children ? (
				<div className={style["replies"]}>
					<div className={style["reply-line"]} />
					{props.children}
				</div>
			) : null}
		</div>
	);
}

PostComponent.defaultProps = {
	profilePic: require("../../images/Duke3D.png"),
	username: "Duke",
	userTag: "author",
	postText:
		"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quibusdam, voluptatum, quos, voluptatem voluptas quia quaeaspernatur voluptatibus quod doloribus quas. Quisquam quibusdam, voluptatum, quos, voluptatem voluptas quia quae aspernaturvoluptatibus quod doloribus quas.",
	images: [],
	likes: 0,
	dislikes: 0,
	comments: 0,
	date: new Date().toLocaleString(),
};
