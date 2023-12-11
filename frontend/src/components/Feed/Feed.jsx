import style from "./Feed.module.scss";
import { useState, useContext, useEffect } from "react";
import PostComponent from "../PostComponent/PostComponent";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import PostSearch from "../PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
// import PostFiltering from "../Search/PostFiltering/PostFiltering";
import PostForm from "../PostForm/PostForm";

export default function Feed() {
	const { authentication } = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);
	const [updatePostContent, setUpdatePostContent] = useState(false);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const { data } = await api.getPosts(searchParams.toString());
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
				{/* <PostFiltering /> */}
				{posts.map((post) => (
					<PostComponent
						key={post._id}
						postId={post._id}
						username={post.user?.username}
						userTag={post.user?.userTag}
						date={post.createdAt}
						text={post.postText}
						removed={post.removed}
						comments={post.comments?.length}
						dislikes={post.dislikes.length}
						likes={post.likes.length}
						onUpdate={setPosts}
						edited={post.edited}
						tags={post.tags}
					/>
				))}
			</section>
		</>
	);
}
