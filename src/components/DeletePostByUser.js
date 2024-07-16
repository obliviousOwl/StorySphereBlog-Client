import { Button } from "react-bootstrap";
import Swal from "sweetalert2";
import { XCircle } from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";


export default function DeletePostByUser({ post, postTitle }) {

    const navigate = useNavigate()


    const deletePost = (post) => {
        Swal.fire({
            title: `You are about to delete this Post - ${postTitle}`,
            text: "Are you sure you want to proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                executeDelete(post)
            }
        })
    }

    const executeDelete = async (post) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/blogs/${post}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json();
            if (data.error === 'Unable to find post') {
                Swal.fire({
                    title: 'Post not found',
                    icon: 'error',
                    text: 'The post you are trying to delete could not be found'
                })
                navigate('/posts');
            }
            else if (data.error === 'Error in deleting Post') {
                Swal.fire({
                    title: 'Error in deleting Post',
                    icon: 'error'
                })
            }
            else if (data.message === 'Post Deleted Successfully') {
                Swal.fire({
                    title: 'Post has been deleted',
                    icon: 'success'
                })
                navigate('/posts');
            }
        }
        catch (err) {
            console.log('Error in deleting workout: ', err)
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error',
                text: 'Please try again'
            })
        }

    }

    return (

        <Button
        variant="link"
        className="position-absolute top-0 end-0 m-2 p-0"
        onClick={() => deletePost(post)}
        style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'red'
        }}
    >
        <XCircle size={24} />
    </Button>
    )
}