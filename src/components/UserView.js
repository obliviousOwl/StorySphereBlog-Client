import { useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import PostCard from './PostCard';
import { Form, FloatingLabel } from 'react-bootstrap';

export default function UserView({ postsData }) {
    const [posts, setPosts] = useState(null); // Initialize with null or undefined

    const [search, setSearch] = useState('');

    useEffect(() => {
        if (Array.isArray(postsData)) {
            const postsArr = postsData.filter(post => {
                const searchTerm = search.toLowerCase();
                const titleMatches = post.title.toLowerCase().includes(searchTerm);
                const authorMatches = post.author.username && typeof post.author.username === 'string' && post.author.username.toLowerCase().includes(searchTerm);
                const contentMatches = post.content && typeof post.content === 'string' && post.content.toLowerCase().includes(searchTerm);
                return searchTerm === ''
                    ? true // Show all posts if search is empty
                    : titleMatches || authorMatches || contentMatches;
            }).map(post => (
                <PostCard postsProp={post} key={post._id} />
            ));
            setPosts(postsArr);
        } else {
            setPosts([]);
        }
    }, [postsData, search]);

    return (
        <>
            <Form>
                <FloatingLabel controlId="floatingName" label="Search Title, Author, or Content" className="my-3">
                    <Form.Control type="text" placeholder="Search Title, Author, or Content" value={search} onChange={e => setSearch(e.target.value)} />
                </FloatingLabel>
            </Form>
            <Row>
                {posts !== null && posts.length > 0 ? (posts) : <h1>No Posts Found</h1>}
            </Row>
        </>
    );
}
