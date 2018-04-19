import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import thunk from 'redux-thunk';
//import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { createStore, applyMiddleware, compose, combineReducers} from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'

import userReducer from './store/reducers/user';
import locationReducer from './store/reducers/location';

const rootReducer = combineReducers({
    userRedux: userReducer,
    locationRedux: locationReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    <div>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </div>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
