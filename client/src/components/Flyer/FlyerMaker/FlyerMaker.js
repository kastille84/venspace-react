import React, { Component } from 'react';

import classes from './FlyerMaker.css';

class FlyerMaker extends Component {
    state = {
        controls: {
            heading: {
                value: '',
                validation: []
            },
            description: {
                value: '',
                validation: []
            }
        },
        phone: false,
        email: false,
        isValid: false,
        reqErrors: false
    }
    onEmail = (e) => {
        this.setState({email: !this.state.email});
    }
    onPhone = (e) => {
        this.setState({phone: !this.state.phone});
    }
    handleSubmit = (e)=> {

    }

    render() {
        return (
            <div className={classes.FlyerMaker}>
                <h3>Make Your Flyer</h3>
                <section>
                    <form onSubmit={this.handleSubmit}>
                        <div className='form-group'>
                            <label>Flyer Heading</label>
                            <input type="text" 
                                className="form-control"
                                name="heading" />
                        </div>
                        <div className='form-group'>
                            <label>Description</label>
                            <textarea 
                                className='form-control'
                                name="description"></textarea>
                        </div>
                        <div className='form-group'>
                            <label>Way to Contact You</label>
                            <div className='btn-group-sm'>
                                <input type="checkbox" value="email" onClick={this.onEmail}/> Email
                                <input type="checkbox" value="phone" onClick={this.onPhone}/> Phone                        
                            </div>
                        </div>
                        <button className="btn btn-primary">MAKE FLYER</button>

                    </form>
                </section>
                
            </div>
        )
    }
}

export default FlyerMaker;