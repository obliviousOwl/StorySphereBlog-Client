import { XCircle } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function DeletePostByUser({ post, postTitle }) {
    const deletePost = () => {
        Swal.fire({
            title: `You are about to delete the post: ${postTitle}`,
            text: "Are you sure you want to proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                executeDelete(post);
            }
        });
    };

    const executeDelete = async (post) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${post}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.error === 'Post not found') {
                Swal.fire({ title: 'Post not found', icon: 'error' });
            } else if (data.message === 'Post deleted successfully') {
                Swal.fire({ title: 'Post has been deleted', icon: 'success' });
                // Optionally, you can redirect the user or update the state here
            } else {
                Swal.fire({ title: 'Error in deleting post', icon: 'error' });
            }
        } catch (err) {
            Swal.fire({ title: 'Something went wrong', icon: 'error', text: 'Please try again' });
        }
    };

    return (
            <Button
                variant="link"
                className="m-2 p-0"
                onClick={deletePost}
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'red'
                }}
            >
                <XCircle size={24} />
            </Button>
    );
}
