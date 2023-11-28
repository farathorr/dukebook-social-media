import React from "react";
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
				const parentPost = await api.getPostParent(params.id, 5);
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
				{postData.replyParentId && <Link to={"/post/" + postData.replyParentId._id}>{"< Back"}</Link>}
				<PostComponent
					key={postData._id}
					postId={postData._id}
					userTag={postData.user?.userTag}
					username={postData.user?.username}
					text={postData.postText}
					likes={postData.likes?.length}
					comments={postData.comments?.length}
					dislikes={postData.dislikes?.length}
					date={postData.createdAt}
				/>
				<ReplyForm updateInterface={setUpdatePostContent} />
				<div className={style["main-replies"]}>
					<LoopComments replies={repliesData} key="comments" />
				</div>
			</main>
		</>
	);

	function LoopParents({ post }) {
		return (
			<PostComponent
				postId={post._id}
				userTag={post.user?.userTag}
				username={post.user?.username}
				text={post.postText}
				likes={post.likes.length}
				dislikes={post.dislikes.length}
				comments={post.comments?.length}
				date={post.createdAt}
			>
				{post?.replyParentId && <LoopComments post={post?.replyParentId} />}
			</PostComponent>
		);
	}

	function LoopComments(props) {
		return (
			<>
				{props.replies.map((reply) => (
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
						onRemove={setReplies}
					>
						{reply?.comments?.[0]?.createdAt && <LoopComments key={reply._id + "comments"} replies={reply?.comments} />}
						{reply?.comments.length !== 0 && !reply?.comments?.[0]?.createdAt && <LoadMoreComments link={reply._id} />}
					</PostComponent>
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
