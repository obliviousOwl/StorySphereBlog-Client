import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Error() {

	return (
		<>
        <Row>
            <Col className="p-4 text-center">
                <h1>404 Page not found</h1>
                <p>The page you are trying to access does not exist.</p>
                <Link className="btn btn-primary" to={'/'}>Back Home</Link>
            </Col>
        </Row>
		</>
	)
}