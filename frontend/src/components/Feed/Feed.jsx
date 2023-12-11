import style from "./Feed.module.scss";
import { useState, useContext, useEffect } from "react";
import PostComponent from "../PostComponent/PostComponent";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import PostSearch from "../PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
import PostForm from "../PostForm/PostForm";

export default function Feed() {
	const { authentication } = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);
	const [updatePostContent, setUpdatePostContent] = useState(false);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const { data } = await api.getUserFeedPosts();
				setPosts(data);
			} catch (err) {}
		}

		fetchPosts();
	}, [searchParams, updatePostContent, authentication]);

	return (
		<>
			<PostSearch />
			<h1 className={style["title"]}>Feed</h1>
			<section className={style["main-content"]}>
				<PostForm title="New post" updateInterface={setUpdatePostContent} type="post" />
				<div className={style["feed-posts"]}>
					{posts.map((post) => (
						<NestPosts key={post._id} post={post} onUpdate={setPosts} />
					))}
				</div>
			</section>
		</>
	);
}

const NestPosts = ({ post, onUpdate }) => {
	if (!post.originalPostParentId) {
		return (
			<PostComponent
				postId={post._id}
				username={post.user?.username}
				userTag={post.user?.userTag}
				date={post.createdAt}
				text={post.postText}
				removed={post.removed}
				comments={post.comments?.length}
				dislikes={post.dislikes.length}
				likes={post.likes.length}
				onUpdate={onUpdate}
				edited={post.edited}
				tags={post.tags}
			/>
		);
	}

	if (post.originalPostParentId._id == post.replyParentId._id) {
		return (
			<PostComponent
				postId={post.originalPostParentId._id}
				username={post.originalPostParentId.user?.username}
				userTag={post.originalPostParentId.user?.userTag}
				date={post.originalPostParentId.createdAt}
				text={post.originalPostParentId.postText}
				removed={post.originalPostParentId.removed}
				comments={post.originalPostParentId.comments?.length}
				dislikes={post.originalPostParentId.dislikes.length}
				likes={post.originalPostParentId.likes.length}
				onUpdate={onUpdate}
				edited={post.originalPostParentId.edited}
				tags={post.originalPostParentId.tags}
				children={
					<PostComponent
						postId={post._id}
						username={post.user?.username}
						userTag={post.user?.userTag}
						date={post.createdAt}
						text={post.postText}
						removed={post.removed}
						comments={post.comments?.length}
						dislikes={post.dislikes.length}
						likes={post.likes.length}
						onUpdate={onUpdate}
						edited={post.edited}
						tags={post.tags}
					/>
				}
			/>
		);
	}

	return (
		<PostComponent
			postId={post.originalPostParentId._id}
			username={post.originalPostParentId.user?.username}
			userTag={post.originalPostParentId.user?.userTag}
			date={post.originalPostParentId.createdAt}
			text={post.originalPostParentId.postText}
			removed={post.originalPostParentId.removed}
			comments={post.originalPostParentId.comments?.length}
			dislikes={post.originalPostParentId.dislikes.length}
			likes={post.originalPostParentId.likes.length}
			onUpdate={onUpdate}
			edited={post.originalPostParentId.edited}
			tags={post.originalPostParentId.tags}
			children={
				<PostComponent
					postId={post.replyParentId._id}
					username={post.replyParentId.user?.username}
					userTag={post.replyParentId.user?.userTag}
					date={post.replyParentId.createdAt}
					text={post.replyParentId.postText}
					removed={post.replyParentId.removed}
					comments={post.replyParentId.comments?.length}
					dislikes={post.replyParentId.dislikes.length}
					likes={post.replyParentId.likes.length}
					onUpdate={onUpdate}
					edited={post.replyParentId.edited}
					tags={post.replyParentId.tags}
					children={
						<PostComponent
							postId={post._id}
							username={post.user?.username}
							userTag={post.user?.userTag}
							date={post.createdAt}
							text={post.postText}
							removed={post.removed}
							comments={post.comments?.length}
							dislikes={post.dislikes.length}
							likes={post.likes.length}
							onUpdate={onUpdate}
							edited={post.edited}
							tags={post.tags}
						/>
					}
				/>
			}
		/>
	);
};
