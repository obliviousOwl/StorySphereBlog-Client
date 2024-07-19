import { useState, useContext, useEffect } from "react";
import UserContext from "../UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, FloatingLabel, Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function AddPost() {
    const { user } = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isActive, setIsActive] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (title !== '' && content !== '') {
            setIsActive(true)
        }
        else {
            setIsActive(false)
        }
    }, [title, content])

    const addPost = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem('token');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    content
                })
            });
            const data = await response.json();

            if (data !== null) {
                Swal.fire({
                    title: 'Post successfully added',
                    icon: 'success'
                })
                navigate('/posts')
            }
        }
        catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error in posting',
                icon: 'error'
            });
        }
    }

    return (
        <>
            <h1 className="text-center pt-5">New Post</h1>
            {
                !user.id ?
                    <Navigate to='/login' />
                    :
                    user.isAdmin ?
                    <Navigate to='/' />
                    :
                    <Form onSubmit={e => addPost(e)}>
                        <FloatingLabel controlId="floatingName" label="Title" className="my-3">
                            <Form.Control type="text" placeholder="Title" required value={title} onChange={e => { setTitle(e.target.value) }} />
                        </FloatingLabel>

                        <Form.Control
                            as="textarea"
                            rows={8}
                            placeholder="Enter comment"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        {
                            isActive ?
                                <Button variant="primary" type="submit" id="submitBtn" className='my-2'>Submit</Button>
                                :
                                <Button variant="danger" type="submit" id="submitBtn" className='my-2' disabled>Submit</Button>
                        }
                    </Form>
            }
        </>
    )
}
