import { Card } from "react-bootstrap";
import DeleteComment from "./DeleteComment";
import UserContext from "../UserContext";
import { useContext } from "react";

export default function CommentCard({ commentProp, getComments }) {

    const { user } = useContext(UserContext)

    const { _id, author, content } = commentProp;
    const { username } = author;

    return (
        <Card className="my-3 position-relative">
            {
                user.isAdmin && <DeleteComment comment={_id} getComments={getComments}/>
            }
            
            <Card.Body className="text-center">
                <Card.Title><h2>"{content}"</h2></Card.Title>
                <Card.Subtitle>By: User{username}</Card.Subtitle>
            </Card.Body>
        </Card>
    );
}
