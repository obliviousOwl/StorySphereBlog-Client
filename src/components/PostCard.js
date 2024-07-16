import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PostCard.css";

export default function MovieCard({ postsProp }) {
  const { _id, title, content, dateCreated, author } = postsProp;
  const { username } = author;

  const date = new Date(dateCreated);

  const formattedDateTime = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  // Truncate the content to 100 characters
  const truncatedContent = content.length > 100 ? content.substring(0, 100) + "..." : content;

  return (
    <Col className="my-2 col-12">
      <Link to={`/post/${_id}`} className="post-card-link">
        <Card className="post-card">
          <Card.Body className="post-card-body">
            <Card.Title className="post-card-title">{title}</Card.Title>
            <Card.Subtitle className="post-card-subtitle">by: {username}</Card.Subtitle>
            <div className="post-card-content my-2">{truncatedContent}</div>
            <div className="post-card-text">{formattedDateTime}</div>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
}
