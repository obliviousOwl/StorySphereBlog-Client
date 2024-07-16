import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { useContext } from 'react';
import UserContext from '../UserContext';

import { Link, NavLink } from 'react-router-dom';



export default function AppNavbar() {

	const { user } = useContext(UserContext);

	return(
		<Navbar bg="primary" expand="lg">
			<Container fluid>
			    <Navbar.Brand as={Link} to="/">Story Sphere </Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
				    <Nav className="ms-auto">
					{
					!user.id ?
						<>
							<Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
							<Nav.Link as={Link} to="/posts">Posts</Nav.Link>
							<Nav.Link as={Link} to="/login">Login</Nav.Link>
							<Nav.Link as={Link} to="/register">Register</Nav.Link>
						</>
					:
						<>
							<Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
							{
								!user.isAdmin && <Nav.Link as={Link} to="/newPost">Add Post</Nav.Link>
							}
							<Nav.Link as={Link} to="/posts">Posts</Nav.Link>
							<Nav.Link as={Link} to="/logout">Logout</Nav.Link>
						</>
					}
				    </Nav>
			    </Navbar.Collapse>
			</Container>
		</Navbar>
		)
}