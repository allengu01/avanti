import { serializeParams } from "./helpers";
import * as SecureStore from 'expo-secure-store';

// Gets an anonymous token from Sharetribe. This token is currently used for
// creating a new user when signing up.
export const getAnonymousToken = async () => {
    const tokenUrl = 'https://flex-api.sharetribe.com/v1/auth/token';
    const clientID = '9a2f7cfb-f1c3-4e2b-b348-1bb1b74f207c';

    var response, responseJSON, params;
    try {
        // Get anonymous token with Sharetribe API https://www.sharetribe.com/api-reference/authentication.html#grant-types 
        params = {client_id: clientID, grant_type: 'client_credentials', scope: 'public-read'};
        response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': 'application/json'},
            body: serializeParams(params)
        });
        responseJSON = await response.json();
    }
    catch {
        console.log("Error retrieving anonymous token"); // TODO: Better error handling
    }
    return responseJSON['access_token'];
}

// Saves a token to SecureStore (not sure if this should go here or inits own file...)
export const saveToken = async (type, token) => {
    switch (type) {
        case 'access':
            await SecureStore.setItemAsync('accessToken', token);
            break;
        case 'refresh':
            await SecureStore.setItemAsync('refreshToken', token);
    }
}

// Gets saved token from SecureStore
export const getSavedToken = async (type) => {
    try {
        switch (type) {
            case 'access':
                return await SecureStore.getItemAsync('accessToken');
            case 'refresh':
                return await SecureStore.getItemAsync('refreshToken');
            default:
                return null;
        }
    }
    catch(error) {
        throw error;
    }
}

// Deletes a saved token from SecureStore
export const deleteSavedToken = async (type) => {
    switch (type) {
        case 'access':
            return await SecureStore.deleteItemAsync('accessToken');
        case 'access':
            return await SecureStore.deleteItemAsync('refreshToken');
        default:
            break;
    }
}

// Refreshes user access token.
export const refreshToken = async () => {
    const url = 'https://flex-api.sharetribe.com/v1/auth/token';
    const clientID = '9a2f7cfb-f1c3-4e2b-b348-1bb1b74f207c';
    var response, responseJSON, params;
    try {
        // Get refresh token from SecureStore
        const storedRefreshToken = await getSavedToken("refresh");

        // Call API to query user's transactions
        params = {client_id: clientID, grant_type: 'refresh_token', refresh_token: storedRefreshToken, scope: 'user'};
        response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
            body: serializeParams(params),
        });
        // Convert response to JSON
        responseJSON = await response.json();
        await saveToken('access', responseJSON.access_token);
        await saveToken('refresh', responseJSON.refresh_token);
    }
    catch(error) {
        console.log("Failed to refresh token.");
    }
    return responseJSON;
};

export const revokeToken = async (token) => {
    const tokenUrl = 'https://flex-api.sharetribe.com/v1/auth/revoke';

    var response, responseJSON, params;
    try {
        params = {token: token};
        response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Accept': 'application/json'},
            body: serializeParams(params)
        });
        responseJSON = await response.json();
    }
    catch {
        console.log("Error revoking token"); // TODO: Better error handling
    }
    return responseJSON;
}