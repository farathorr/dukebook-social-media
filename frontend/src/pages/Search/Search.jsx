import style from "./Search.module.scss";
import { useState, useContext, useEffect } from "react";
import PostComponent from "../../components/PostComponent/PostComponent";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import PostSearch from "../../components/PostSearch/PostSearch";
import { useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import PostFiltering from "./PostFiltering/PostFiltering";
import PostForm from "../../components/PostForm/PostForm";

export default function Search() {
	const { authentication } = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const { data, status } = await api.getPosts(searchParams.toString());
				if (status === 200) setPosts(data);
			} catch (err) {}
		}

		fetchPosts();
	}, [searchParams, authentication]);

	return (
		<div className={style["search-page"]}>
			<PostSearch />
			<h1 className={style["title"]}>Search</h1>
			<section className={style["main-content"]}>
				<PostFiltering />
				{posts.length === 0 && <p>No posts found</p>}
				{posts.map((post) => (
					<PostComponent key={post._id} post={post} onUpdate={setPosts} />
				))}
			</section>
		</div>
	);
}
