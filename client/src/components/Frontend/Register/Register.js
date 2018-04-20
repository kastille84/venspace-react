import React, { Component } from 'react';
import classes from './Register.css';

class Register extends Component {

    render() {

        return (
            <div className={classes.Register}>
                <h2>Register</h2>
                <p><small>Already registered? signin</small></p>
                <section>
                    <form>
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type='text' 
                                className="form-control" />
                        </div>
                    </form>

                </section>
                
            </div>
        )
    }
}

export default Register;