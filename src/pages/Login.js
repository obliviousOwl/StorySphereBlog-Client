import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate, Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import './Login.css';

export default function Login() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);

    const navigate = useNavigate();

    function authenticate(e) {

        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            if (typeof data.access === 'string') {
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome to Inventory!"
                });
                navigate('/');
            } else if(data.error === 'Email and password do not match') {
                Swal.fire({
                    title: "Email and password do not match",
                    icon: "error",
                    text: "Invalid Email and password!"
                });
            } else {
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    text: 'Please try again'
                })
            }
        })

        setEmail('');
        setPassword('');
    }

    const retrieveUserDetails = (token) => {
        fetch(`${process.env.REACT_APP_API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin,
                email: data.user.email,
                username: data.user.username
            });
        })
    };

    useEffect(() => {
        if (email !== "" && password !== "") {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }, [email, password]);

    return (
        !user.id ?
        <div className="custom-body">
            <Card className="custom-card-container my-5">
                <h1 className="custom-form-title">Login</h1>
                <Form onSubmit={(e) => authenticate(e)}>
                    <FloatingLabel controlId="userEmail" label="Email address" className="custom-mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="password" label="Password" className="custom-mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FloatingLabel>

                    {
                        isActive ?
                            <Button variant="primary" type="submit" className="custom-submit-btn">
                                Submit
                            </Button>
                            :
                            <Button variant="danger" type="submit" className="custom-submit-btn" disabled>
                                Submit
                            </Button>
                    }
                </Form>
            </Card>
        </div>
        :
        <Navigate to={'/'} />
    )
}
