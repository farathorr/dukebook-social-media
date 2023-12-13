import style from "./Feed.module.scss";
import { useState, useContext, useEffect } from "react";
import PostComponent from "../../components/PostComponent/PostComponent";
import { AuthenticationContext } from "../../context/AuthenticationContext/AuthenticationContext";
import PostSearch from "../../components/PostSearch/PostSearch";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../utils/api";
import PostForm from "../../components/PostForm/PostForm";
import CustomButton from "../../components/CustomButton/CustomButton";

export default function Feed() {
	const { authentication } = useContext(AuthenticationContext);
	const [searchParams] = useSearchParams();
	const [posts, setPosts] = useState([]);
	const [updatePostContent, setUpdatePostContent] = useState(false);
	const [positionY, setPositionY] = useState(0);
	const [isButtonVisible, setIsButtonVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setPositionY(window.scrollY);
		};
		window.addEventListener("scroll", handleScroll);
		if (positionY > 600) {
			setIsButtonVisible(true);
		} else {
			setIsButtonVisible(false);
		}
	}, [window.scrollY]);

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
							<span>
								You are not following anyone yet. Find <Link to="/search">trending posts</Link>
							</span>
						</div>
					)}
					{posts.map((post) => (
						<NestPosts key={post._id} post={post} onUpdate={setPosts} />
					))}
				</div>
				{isButtonVisible && (
					<CustomButton className={style["scroll-to-top-button"]} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
						Top
					</CustomButton>
				)}
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
