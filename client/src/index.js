import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

const app = (
    <div>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </div>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
