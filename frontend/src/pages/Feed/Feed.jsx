import style from "./Feed.module.scss";
import { useState, useContext, useEffect } from "react";
import PostComponent from "../../components/PostComponent/PostComponent";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import PostSearch from "../../components/PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import PostForm from "../../components/PostForm/PostForm";
import CustomButton from "../../components/CustomButton/CustomButton";
import ScrollTopButton from "../../components//ScrollTopButton/ScrollTopButton";

export default function Feed() {
	const { authentication } = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);
	const [updatePostContent, setUpdatePostContent] = useState(false);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const { data, status } = await api.getUserFeedPosts();
				if (status === 200) setPosts(data);
			} catch (err) {}
		}

		fetchPosts();
	}, [searchParams, updatePostContent, authentication]);

	return (
		<div className={style["feed-pag"]}>
			<PostSearch />
			<h1 className={style["title"]}>Feed</h1>
			<section className={style["main-content"]}>
				<PostForm title="New post" updateInterface={setUpdatePostContent} type="post" />
				<div className={style["feed-posts"]}>
					{authentication.user?.followedIds.length === 0 && (
						<div className={style["no-posts"]}>
							<div className={style["help-text"]}>
								You are not following anyone yet.
								<CustomButton className={style["help-button"]} purpose="action" to="/search">
									Find posts
								</CustomButton>
							</div>
						</div>
					)}
					{posts.map((post) => (
						<NestPosts key={post._id} post={post} onUpdate={setPosts} />
					))}
				</div>
				<ScrollTopButton />
			</section>
		</div>
	);
}

const NestPosts = ({ post, onUpdate }) => {
	if (!post.originalPostParentId) {
		return <PostComponent post={post} onUpdate={onUpdate} />;
	}

	if (post.originalPostParentId._id == post.replyParentId._id) {
		return (
			<PostComponent post={post.originalPostParentId} onUpdate={onUpdate} children={<PostComponent post={post} onUpdate={onUpdate} />} />
		);
	}

	return (
		<PostComponent
			post={post.originalPostParentId}
			onUpdate={onUpdate}
			children={
				<PostComponent post={post.replyParentId} onUpdate={onUpdate} children={<PostComponent post={post} onUpdate={onUpdate} />} />
			}
		/>
	);
};
