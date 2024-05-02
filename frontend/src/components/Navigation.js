import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    NotesApp
                </Link>
                    <ul className="navbar-nav ml-auto d-flex">
                        <li className="nav-item active">
                            <Link className="nav-link" to="/"> Notes </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/create"> Create Note </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/user"> User Manage </Link>
                        </li>
                    </ul>
            
            </div>
        </nav>

    )
    
    }
}
