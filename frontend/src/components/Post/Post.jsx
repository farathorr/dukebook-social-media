import style from "./Post.module.scss";
import PostComponent from "../PostComponent/PostComponent";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReplyForm from "./ReplyForm/ReplyForm";
import { api } from "../../api";

export default function Post() {
	const params = useParams();
	const [postData, setPostData] = useState([]);
	const [repliesData, setReplies] = useState([]);
	const [updatePostContent, setUpdatePostContent] = useState(false);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const parentPost = await api.getPostParent(params.id, 2);
				const replies = await api.getPostReplies(params.id, 7);

				if (parentPost.status === 200) setPostData(parentPost.data);
				if (replies.status === 200) setReplies(replies.data);
			} catch (err) {
				console.log(err);
			}
		};

		fetchServices();
	}, [params, updatePostContent]);

	if (postData.length === 0) return null;

	return (
		<>
			<h1 className={style["title"]}>Post</h1>
			<main className={style["main-content"]}>
				<div className={style["post-links"]}>
					{postData.at(-1).replyParentId && <Link to={"/post/" + postData.at(-1).replyParentId}>{"< Back"}</Link>}
					{postData.at(-1).originalPostParentId && <Link to={"/post/" + postData.at(-1).originalPostParentId}>{"To start"}</Link>}
				</div>
				<ParentLoop posts={postData} index={0} />
				<ReplyForm updateInterface={setUpdatePostContent} disabled={postData.at(-1).removed} />
				<div className={style["main-replies"]}>
					<CommentPosts replies={repliesData} loadMore={2} />
				</div>
			</main>
		</>
	);

	function ParentLoop({ posts, index }) {
		const post = posts[index];
		if (!post?._id) return null;
		return (
			<PostComponent
				key={post._id}
				postId={post._id}
				userTag={post.user?.userTag}
				username={post.user?.username}
				text={post.postText}
				likes={post.likes?.length}
				comments={post.comments?.length}
				dislikes={post.dislikes?.length}
				date={post.createdAt}
				removed={post.removed}
				onUpdate={setPostData}
				edited={post.edited}
			>
				<ParentLoop posts={posts} index={index + 1} />
			</PostComponent>
		);
	}

	function CommentPosts({ replies, more, startNestingLevel, loadMore }) {
		if (!replies.length) return null;
		if (!replies?.[0]?._id) return more;

		return (
			<>
				{replies.map((reply) => (
					<PostComponent
						postId={reply._id}
						key={reply._id}
						userTag={reply.user?.userTag}
						username={reply.user?.username}
						text={reply.postText}
						likes={reply.likes.length}
						dislikes={reply.dislikes.length}
						comments={reply.comments?.length}
						date={reply.createdAt}
						removed={reply.removed}
						onUpdate={setReplies}
						edited={reply.edited}
						children={
							<CommentPosts
								key={reply._id}
								replies={reply?.comments}
								startNestingLevel={startNestingLevel ?? reply.nestingLevel}
								loadMore={loadMore}
								more={reply.nestingLevel - startNestingLevel < loadMore ? <LoadMoreComments link={reply._id} /> : more}
							/>
						}
					/>
				))}
			</>
		);
	}
}

function LoadMoreComments(props) {
	return (
		<Link to={"/post/" + props.link}>
			<button>Load more</button>
		</Link>
	);
}
