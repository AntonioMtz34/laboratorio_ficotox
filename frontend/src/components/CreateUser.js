import React, { Component } from 'react'
import axios from 'axios'

export default class CreateUser extends Component {
   state = {
        users: [],
        username: ''
    }
    async componentDidMount(){
        console.log('omg');
        const res = await axios.get('http://localhost:4000/api/users');
        this.getUsers();
        this.setState({users: res.data});
        console.log(this.state.users);
    }
    onChangeUsername = (e) => {
        this.setState({
            username: e.target.value
        })
    }
    getUsers = async () => {
        const res = await axios.get('http://localhost:4000/api/users');
        this.setState({users: res.data});
    }
   onSubmit = async e => {
        e.preventDefault();
        await axios.post('http://localhost:4000/api/users', {
            username: this.state.username
        })
       
        this.setState({username: ''});
        this.getUsers();
    }
    handleDelete = (userId) => {
        // Show a confirmation dialog
        const confirmDelete = window.confirm("¿Are you sure you want to delete this user?");
    
        // If the user confirms deletion, call the deleteUser method
        if (confirmDelete) {
            this.deleteUser(userId);
        }
    };
    
    deleteUser = async (userId) => {
        // Logic to delete the user
        try {
            await axios.delete(`http://localhost:4000/api/users/${userId}`);
            this.getUsers();
            // Update the state or perform any other necessary actions after deletion
        } catch (error) {
            // Handle any errors that occur during deletion
            console.error("Error deleting user:", error);
        }
    };

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card card-body">
                        <h3>Create New User</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                <div className="card card-body">
    <ul className="list-group">
        <h3>List of Users</h3>
        {this.state.users.map(user => (
            <li className="list-group-item d-flex justify-content-between align-items-center" key={user._id}>
                {user.username}
                <button
                    onClick={() => this.handleDelete(user._id)}
                    className="btn btn-danger btn-sm ml-auto"
                >
                    Delete
                </button>
            </li>
        ))}
    </ul>
</div>

</div>

           </div>
        )
    }
}
