import { useEffect, useState, useCallback, useContext } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import CommentCard from '../components/CommentCard';
import DeletePostByUser from "../components/DeletePostByUser";
import UserContext from "../UserContext";
import UpdatePost from "../components/UpdatePost";

export default function PostView() {
    const { user } = useContext(UserContext);
    const { postId } = useParams();
    const [post, setPost] = useState({ id: '', title: '', author: '', content: '', date: '' });
    const [userId, setUserId] = useState('');
    const [newComment, setNewComment] = useState('');
    const [headerText, setHeaderText] = useState('Loading Comments');
    const [comments, setComments] = useState([]);

    const getPostData = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs/${postId}`);
            const data = await response.json();

            if (data.error === 'No Post Found') {
                Swal.fire({ title: 'Post not found', icon: 'error' });
            } else if (data._id) {
                setPost({
                    id: data._id,
                    title: data.title,
                    author: data.author.username,
                    content: data.content,
                    date: data.dateCreated,
                });
                setUserId(data.author._id);
            } else {
                Swal.fire({ title: 'Error in getting post', icon: 'error' });
            }
        } catch {
            Swal.fire({ title: 'Something went wrong', icon: 'error', text: 'Please try again' });
        }
    }, [postId]);

    const getPostComment = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            if (data.error === "No comments found") {
                setHeaderText('No Comments yet');
                setComments([]);
            } else if (data.comments) {
                setHeaderText('Comments');
                setComments(data.comments.reverse());
            }
        } catch {
            Swal.fire({ title: 'Something went wrong', icon: 'error', text: 'Please try again' });
        }
    }, [postId]);

    const postComment = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content: newComment })
            });
            const data = await response.json();

            if (data.error === 'Post not found') {
                Swal.fire({ title: 'Post not found', icon: 'error' });
            } else if (data.message === 'Comment added successfully') {
                Swal.fire({ title: 'Comment Successfully posted', icon: 'success' });
                setNewComment('');
                getPostComment();
            } else {
                Swal.fire({ title: 'Error in posting comment', icon: 'error' });
            }
        } catch {
            Swal.fire({ title: 'Something went wrong', icon: 'error', text: 'Please try again' });
        }
    };

    const newDate = new Date(post.date);
    const formattedDateTime = newDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    useEffect(() => {
        getPostData();
        getPostComment();
    }, [getPostData, getPostComment]);

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col xs={12} sm={10} md={8} lg={{ span: 6, offset: 3 }}>
                        <Card>
                            <Card.Body className="text-center">
                                <Card.Title><h2>{post.title}</h2></Card.Title>
                                <Card.Subtitle>by: {post.author}</Card.Subtitle>
                                <Card.Text>{post.content}</Card.Text>
                                <Card.Text>{formattedDateTime}</Card.Text>
                            </Card.Body>
                            <div className="d-flex justify-content-end">
                                {user.id === userId && <UpdatePost post={post.id} fetchData={getPostData}/>}
                                {(user.id === userId || user.isAdmin) && (
                                    <DeletePostByUser post={postId} postTitle={post.title} />
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
            {user.id && (
                <Container className="my-5">
                    <Row>
                        <Col xs={12} sm={10} md={8} lg={{ span: 6, offset: 3 }}>
                            <Form>
                                <Form.Group controlId="userEmail">
                                    <Form.Label>Post Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter comment"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="danger" size="sm" onClick={postComment} className="my-2">
                                    Post
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}
            <Container className="mt-3">
                <Row>
                    <Col xs={12} sm={10} md={8} lg={{ span: 6, offset: 3 }}>
                        <h3 className="text-center my-3">{headerText}</h3>
                        {comments.map(comment => (
                            <CommentCard commentProp={comment} key={comment._id} getComments={getPostComment} />
                        ))}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
