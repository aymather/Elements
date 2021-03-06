import axios from 'axios';
import { getHeaders } from './authActions';
import {
    CLIENTS_LOADING,
    ADD_CLIENT,
    REMOVE_CLIENT,
    CLIENTS_SUCCESS,
    CLIENTS_FAIL,
    CLIENT_OURA_DATA,
    CLIENT_OURA_DATA_LOADING,
    CLIENT_OURA_FAIL,
    CLIENT_PROFILE_UPDATING,
    UPDATE_PROFILE_FAIL,
    CLIENT_PROFILE_UPDATED,
    REMOVE_FILE_FAIL,
    REMOVE_CLIENT_FILE
} from './types';
import { returnErrors } from './errorActions';

export const loadClients = () => (dispatch, getState) => {
    dispatch({ type: CLIENTS_LOADING });

    const config = {
        url: '/clients',
        headers: getHeaders(getState),
        method: 'GET'
    }

    axios(config)
        .then(res => {
            dispatch({
                type: CLIENTS_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'CLIENTS_FAIL'));
            dispatch({ type: CLIENTS_FAIL });
        })
}

export const loadClientOuraData = (access_token, day, id) => (dispatch, getState) => {
    dispatch({
        type: CLIENT_OURA_DATA_LOADING,
        payload: id
    })

    const config = {
        url: '/client-oura-data',
        headers: getHeaders(getState),
        method: 'POST',
        data: { access_token, day, id }
    }
    
    axios(config)
        .then(res => {
            dispatch({ 
                type: CLIENT_OURA_DATA,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: CLIENT_OURA_FAIL, 
                payload: id 
            });
        })
}

export const createClient = (data, history) => (dispatch, getState) => {
    dispatch({ type: CLIENTS_LOADING });

    const config = {
        url: '/new-client',
        headers: getHeaders(getState),
        method: 'POST',
        data
    }

    axios(config)
        .then(res => {
            sendLocalEmail(res.data.client.id, res.data.client.email, getState);
            dispatch({
                type: ADD_CLIENT,
                payload: res.data
            })
            history.push('/new-client/success', res.data);
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'CLIENTS_FAIL'))
            dispatch({ type: CLIENTS_FAIL });
        })
}

export const removeClient = (client_id, history) => (dispatch, getState) => {
    dispatch({ type: CLIENTS_LOADING });
    
    const config = {
        method: 'POST',
        headers: getHeaders(getState),
        url: '/remove-client',
        data: { client_id }
    }
    
    axios(config)
        .then(res => {
            dispatch({
                type: REMOVE_CLIENT,
                payload: res.data
            })
            history.push('/');
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: CLIENTS_FAIL });
        })
}

const sendLocalEmail = (id, email, getState) => {
    console.log('Entered sendemail');
    const config = {
        method: 'GET',
        url: '/send-email',
        headers: getHeaders(getState)
    }

    config.headers['client_id'] = id;
    config.headers['email'] = email;

    axios(config)
        .then(res => {
            console.log('made request');
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
}

export const sendEmail = (id, email) => (dispatch, getState) => {
    console.log('Entered sendemail');
    const config = {
        method: 'GET',
        url: '/send-email',
        headers: getHeaders(getState)
    }

    config.headers['client_id'] = id;
    config.headers['email'] = email;

    axios(config)
        .then(res => {
            console.log('made request');
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        })
}

export const updateClientProfile = (data) => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({ type: CLIENT_PROFILE_UPDATING, payload: data.client_id });

        const config = {
            method: 'POST',
            url: '/update-client-profile',
            headers: getHeaders(getState),
            data
        }

        axios(config)
            .then(res => {
                dispatch({
                    type: CLIENT_PROFILE_UPDATED,
                    payload: res.data
                })
                resolve();
            })
            .catch(err => {
                dispatch(returnErrors(err.response.data, err.response.status));
                dispatch({ type: UPDATE_PROFILE_FAIL, payload: data.client_id });
            })
    })
}


export const removeFile = (file_id, client_id) => (dispatch, getState) => {
    const options = {
        method: 'POST',
        url: '/remove-file',
        headers: getHeaders(getState),
        data: {
            file_id,
            client_id
        }
    }

    axios(options)
        .then(res => {
            dispatch({
                type: REMOVE_CLIENT_FILE,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({ type: REMOVE_FILE_FAIL });
        })
}