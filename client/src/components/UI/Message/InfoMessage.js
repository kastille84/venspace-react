import React from 'react';

const infoMessage = (props) => {
    const messageType = props.messageType;

    let messageEl = null;

    if (messageType === 'success') {
        messageEl = (
            <div className="alert alert-success alert-dismissible fade show" role="alert" >
                {props.children}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }
    if (messageType === 'fail') {
        messageEl = (
            <div className="alert alert-danger alert-dismissible fade show" role="alert" >
                {props.children}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }  
    if (messageType === 'warning') {
        messageEl = (
            <div className="alert alert-warning alert-dismissible fade show" role="alert" >
                {props.children}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }  
    if (messageType === 'info') {
        messageEl = (
            <div className="alert alert-info alert-dismissible fade show" role="alert" >
                {props.children}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }  
    
    return (
        <div>
            {messageEl}
        </div>
    )
}

export default infoMessage;