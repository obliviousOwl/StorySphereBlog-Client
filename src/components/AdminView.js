import { useContext, useEffect, useState } from 'react';
import { Table, Form, FloatingLabel } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';
import DeletePost from './DeletePost';
import { Link } from 'react-router-dom';

export default function AdminView({ postsData, fetchData }) {

    const { user } = useContext(UserContext)
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')


    useEffect(() => {
        if (Array.isArray(postsData)) {
            const postsArr = postsData.filter(post => {
                return search.toLocaleLowerCase === '' ? post : post.title.toLocaleLowerCase().includes(search) || post.author.toLocaleLowerCase().includes(search)
            }).map(post => {

                const date = new Date(post.dateCreated);

                const formattedDateTime = date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                });
                return (
                    <tr key={post._id}>
                        <td><Link to={`/post/${post._id}`}>{post.title}</Link></td>
                        <td>{post.author.username}</td>
                        <td>{formattedDateTime}</td>
                        <td><DeletePost post={post._id} postTitle={post.title} fetchData={fetchData} /></td>
                    </tr>
                )
            })
            setPosts(postsArr)
        }
        else {
            setPosts([])
        }
    }, [postsData, fetchData, search])

    return (

        !user.isAdmin ?
            <Navigate to={'/post'} />
            :
            <>
                <h1 className="text-center my-4">Admin Dashboard</h1>
                <Form>
                    <FloatingLabel controlId="floatingName" label="Search Title or Author" className="my-3">
                        <Form.Control type="text" placeholder="Search Title or Author" value={search} onChange={e => { setSearch(e.target.value) }} />
                    </FloatingLabel>
                </Form>
                <Table striped bordered hover responsive variant="dark">
                    <thead>
                        <tr className="text-center">
                            <th>Title</th>
                            <th>Author</th>
                            <th>Date Created</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            posts.length > 0 ?
                                (posts)
                                :
                                <tr>
                                    <td colSpan="4" className="text-center">No Post found</td>
                                </tr>
                        }
                    </tbody>
                </Table>
            </>
    )
}