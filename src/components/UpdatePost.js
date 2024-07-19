import { Pencil } from "react-bootstrap-icons";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import { useState } from "react";

export default function UpdatePost({ post, fetchData }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showEdit, setShowEdit] = useState(false);

    const openEdit = async (post) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs/${post}`);
            const data = await response.json();

            if (data.error === 'No Post Found') {
                Swal.fire({ title: 'Post not found', icon: 'error' });
            } else if (data._id) {
                setTitle(data.title);
                setContent(data.content);
                setShowEdit(true);
            } else {
                Swal.fire({ title: 'Error in getting post', icon: 'error' });
            }
        } catch {
            Swal.fire({ title: 'Something went wrong', icon: 'error', text: 'Please try again' });
        }
    };

    const closeEdit = () => {
        setShowEdit(false);
        setTitle('');
        setContent('');
    };

    const editPost = async (e, post) => {
        e.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs/${post}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, content })
            });
            const data = await response.json();
            if (data.message === 'Post updated successfully') {
                Swal.fire({ title: 'Success!', icon: 'success', text: 'Post Successfully Updated' });
                closeEdit();
                fetchData();
            } else {
                Swal.fire({ title: 'Error!', icon: 'error', text: 'Please try again' });
                closeEdit();
                fetchData();
            }
        } catch {
            Swal.fire({ title: 'Something went wrong', icon: 'error', text: 'Please try again' });
        }
    };

    return (
        <>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Edit</Tooltip>}
            >
                <Button
                    variant="link"
                    className="m-2 p-0"
                    onClick={() => openEdit(post)}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'blue'
                    }}
                >
                    <Pencil size={24} />
                </Button>
            </OverlayTrigger>

            <Modal show={showEdit} onHide={closeEdit}>
                <Form onSubmit={(e) => editPost(e, post)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => closeEdit()}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
