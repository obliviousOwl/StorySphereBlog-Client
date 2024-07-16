import { XCircle } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';


export default function DeleteComment({ comment, getComments }) {

    const deleteComment = (comment) => {
        Swal.fire({
            title: `You are about to delete this comment`,
            text: "Are you sure you want to proceed?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if(result.isConfirmed){
                executeDelete(comment)
            }
        })
    }

    const executeDelete = async (comment) => {
        try{
            const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${comment}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json();
            if(data.error === 'Comment not found'){
                Swal.fire({
                    title: 'Comment not found',
                    icon: 'error',
                })
            }
            else if (data.message === 'Comment deleted successfully'){
                Swal.fire({
                    title: 'Comment has been deleted',
                    icon: 'success'
                })
                getComments();
            }
            else{
                Swal.fire({
                    title: 'Error in deleting comment',
                    icon: 'error'
                })
            }
        }
        catch(err) {
            Swal.fire({
                title: 'Something went wrong',
                icon: 'error',
                text: 'Please try again'
            })
        }
    }
    return  (
        <Button
                variant="link"
                className="position-absolute top-0 end-0 m-2 p-0"
                onClick={() => deleteComment(comment)}
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