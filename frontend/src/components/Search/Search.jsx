import style from "./Search.module.scss";
import { useState, useContext, useEffect } from "react";
import PostComponent from "../PostComponent/PostComponent";
import { AuthenticationContext } from "../AuthenticationControls/AuthenticationControls";
import PostSearch from "../PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import { api } from "../../api";
import PostFiltering from "./PostFiltering/PostFiltering";
import PostForm from "../PostForm/PostForm";

export default function Search() {
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
			<h1 className={style["title"]}>Search</h1>
			<section className={style["main-content"]}>
				<PostFiltering />
				{posts.length === 0 && <p>No posts found</p>}
				{posts.map((post) => (
					<PostComponent key={post._id} post={post} onUpdate={setPosts} />
				))}
			</section>
		</>
	);
}
