import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, FloatingLabel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';
import './Register.css'; 

export default function Register() {

    const { user } = useContext(UserContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);

    function registerUser(e) {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.message === "Registered Successfully") {
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Thank you for registering!"
                });
            }
        });
    }

    useEffect(() => {
        if ((email !== "" && password !== "" && confirmPassword !== "") && (password === confirmPassword)) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password, confirmPassword]);

    return (
        !user.id ?
        <div className="custom-body">
            <Card className="custom-card-container my-5">
                <h1 className="custom-form-title">Register</h1>
                <Form onSubmit={(e) => registerUser(e)}>
                    <FloatingLabel controlId="username" label="Username" className="custom-mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Enter Username"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="userEmail" label="Email address" className="custom-mb-3">
                        <Form.Control
                            type="email"
                            placeholder="Enter Email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="password" label="Password" className="custom-mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </FloatingLabel>

                    <FloatingLabel controlId="confirmPassword" label="Confirm Password" className="custom-mb-3">
                        <Form.Control
                            type="password"
                            placeholder="Confirm Password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </FloatingLabel>

                    {isActive ?
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
    );
}
