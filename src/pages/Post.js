import { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext';
import { Container } from "react-bootstrap";
import AdminView from "../components/AdminView";
import UserView from "../components/UserView";

export default function Posts() {

	const { user } = useContext(UserContext);

	const [posts, setPosts] = useState([]);

	const [loading, setLoading] = useState(true);

	const fetchData = () => {

		fetch(`${process.env.REACT_APP_API_URL}/blogs`)
			.then(res => res.json())
			.then(data => {
				if (typeof data.posts !== 'string') {
					setPosts(data.posts.reverse());
					setLoading(false);
				} else {
					setPosts([]);
					setLoading(false);
				}
			})
	}

	useEffect(() => {
		fetchData();
	})

	if (loading) return <div>Loading...</div>;

	return (
		<Container>
			<h1 className="text-center">Blog posts</h1>

			{
				user.isAdmin ?
					<AdminView postsData={posts} fetchData={fetchData} />
					:
					<UserView postsData={posts} />
			}
		</Container>
	)

}