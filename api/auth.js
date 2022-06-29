import { getAnonymousToken, saveToken } from "./token";
import { serializeParams } from "./helpers";

// Creates a new user using the given arguments, returns the user's id.
export const signUpUser = async (email, password, firstName, lastName, protectedData) => {
    const createUserUrl = 'https://flex-api.sharetribe.com/v1/api/current_user/create';
    var response, responseJSON, params;
    try {
        const accessToken = await getAnonymousToken(); // Anonymous access token is needed for next API request

        params = {
            email: email, 
            password: password, 
            firstName: firstName, 
            lastName: lastName,
            protectedData: protectedData
        };
        // Create new user
        response = await fetch(createUserUrl, {
            method: 'POST',
            headers: {'Authorization': `bearer ${accessToken}`, 'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        });
        responseJSON = await response.json();
    }
    catch(error) {
        console.log(error);
    }
    return responseJSON;
};

// Signs in a user with username and password, returning an object with a user and refresh token.
export const signInUser = async (username, password) => {
    const url = 'https://flex-api.sharetribe.com/v1/auth/token';
    const clientID = '9a2f7cfb-f1c3-4e2b-b348-1bb1b74f207c';
    var response, responseJSON, params;
    try {
        // Call API to query user's transactions
        params = {client_id: clientID, grant_type: 'password', username: username, password: password, scope: 'user'};
        response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
            body: serializeParams(params),
        });
        if (response.status === 401) {
            throw 'Incorrect username and password.';
        }

        // Convert response to JSON
        responseJSON = await response.json();

        // Save tokens
        await saveToken('access', responseJSON.access_token);
        await saveToken('refresh', responseJSON.refresh_token);
    }
    catch(error) {
        console.log(error);
        throw error;
    }
    return responseJSON;
};