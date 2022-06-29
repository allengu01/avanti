import { getSavedToken, refreshToken } from './token.js';
import { serializeParams } from './helpers.js';

///////////////////// SESSIONS ////////////////////////////

// Get's user's sessions (need to move this somewhere later)
export const getSessions = async (userID) => { 
    // https://www.sharetribe.com/api-reference/#including-related-resources
    // https://www.sharetribe.com/api-reference/marketplace.html#transactions 
    let url = 'https://flex-api.sharetribe.com/v1/api/transactions/query';
    var response, responseJSON;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        // Call API to query user's transactions
        const params = {include: 'listing,booking,provider,customer'};
        response = await fetch(`${url}?${serializeParams(params)}`, {
            method: 'GET',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
        });
        // Convert response to JSON
        responseJSON = await response.json();
        if (responseJSON.errors && responseJSON.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            console.log("Refreshed here");
            return await getSessions(userID); // Try again
        }
    }
    catch(error) {
        console.log(`Error fetching sessions: ${error}`);
    }
    return responseJSON;
}

// Given a provider object from API response, get the provider name
export const getProviderName = (provider) => {
    return provider.attributes.profile.displayName;
}

export const getCustomerName = (customer) => {
    return customer.attributes.profile.displayName;
}

// Given a booking object from API response, get the booking start time
export const getBookingStartTime = (booking) => {
    return new Date(booking.attributes.start);
}

// Given a booking object from API response, get the booking end time
export const getBookingEndTime = (booking) => {
    return new Date(booking.attributes.end);
}

// Given a booking object from API response, get the booking status
export const getStatus = (booking) => {
    const statusStr = booking.attributes.state;
    return statusStr[0].toUpperCase() + statusStr.slice(1);
}

// Given a listing object from API response, get the price
export const getPrice = (listing) => {
    return `${listing.attributes.price.amount / 100}`;
}



//////////////// MESSAGES ///////////////////////

// Get's user's sessions (need to move this somewhere later)
export const getMessages = async (transactionID) => { 
    // https://www.sharetribe.com/api-reference/marketplace.html#query-messages
    let url = 'https://flex-api.sharetribe.com/v1/api/messages/query';
    var response, responseJSON;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        // Call API to query user's transactions
        const params = {transactionId: transactionID, include: 'sender'};
        response = await fetch(`${url}?${serializeParams(params)}`, {
            method: 'GET',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
        });
        // Convert response to JSON
        responseJSON = await response.json();
        if (responseJSON.errors && responseJSON.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await getMessages(transactionID); // Try again
        }
    }
    catch(error) {
        console.log(`Error fetching messages: ${error}`);
    }
    return responseJSON;
}

// Get's user's sessions (need to move this somewhere later)
export const sendMessage = async (transactionID, message) => { 
    // https://www.sharetribe.com/api-reference/marketplace.html#query-messages
    let url = 'https://flex-api.sharetribe.com/v1/api/messages/send';
    var response, responseJSON;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        // Call API to query user's transactions
        const params = {transactionId: transactionID, content: message};
        response = await fetch(`${url}`, {
            method: 'POST',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'},
            body: JSON.stringify(params)
        });
        // Convert response to JSON
        responseJSON = await response.json();
        if (responseJSON.errors && responseJSON.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await sendMessage(message); // Try again
        }
    }
    catch(error) {
        console.log(`Error sending message: ${error}`);
    }
    return responseJSON;
}


////////////////// LISTINGS //////////////////////

// Get user's own listings
export const getOwnListings = async () => { 
    // https://www.sharetribe.com/api-reference/marketplace.html#query-messages
    let url = 'https://flex-api.sharetribe.com/v1/api/own_listings/query';
    var response, responseJSON;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        // Call API to query user's transactions
        response = await fetch(`${url}`, {
            method: 'GET',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
        });
        // Convert response to JSON
        responseJSON = await response.json();
        if (responseJSON.errors && responseJSON.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await sendMessage(message); // Try again
        }
    }
    catch(error) {
        console.log(`Error sending message: ${error}`);
    }
    return responseJSON;
}

///////////////// TRANSACTIONS ///////////////////

// Gets transaction
export const getTransaction = async (transactionID, includeArray) => { 
    // https://www.sharetribe.com/api-reference/marketplace.html#query-messages
    let url = 'https://flex-api.sharetribe.com/v1/api/transactions/show';
    var response, responseJSON;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        // Call API to query user's transactions
        const params = {id: transactionID, include: includeArray.join(",")};
        response = await fetch(`${url}?${serializeParams(params)}`, {
            method: 'GET',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
        });
        // Convert response to JSON
        responseJSON = await response.json();
        if (responseJSON.errors && responseJSON.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await getTransaction(transactionID); // Try again
        }
    }
    catch(error) {
        console.log(`Error fetching transaction: ${error}`);
    }
    return responseJSON;
}

// Transition the given transaction
export const transitionTransaction = async (transactionID, transition, params={}) => { 
    let url = 'https://flex-api.sharetribe.com/v1/api/transactions/transition';
    var response, responseJSON;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        // Call API to query user's transactions
        const requestParams = {id: transactionID, transition: transition, params: params};
        response = await fetch(`${url}`, {
            method: 'POST',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/json',
                      'Accept': 'application/json'},
            body: JSON.stringify(requestParams)
        });
        // Convert response to JSON
        responseJSON = await response.json();
        if (responseJSON.errors && responseJSON.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await transitionTransaction(transactionID, transition, params); // Try again
        }
    }
    catch(error) {
        console.log(`Error transitioning transaction: ${error}`);
    }
    return responseJSON;
}