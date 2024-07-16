import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {

	return (
		<>
        <Row>
            <Col className="p-4 text-center">
                <h1>Welcome to Story Sphere</h1>
                <p>Discover, Explore, and Share Your Journey Through Words.</p>
                <Link className="btn btn-primary" to={'/posts'}>View Posts</Link>
            </Col>
        </Row>
		</>
	)
}