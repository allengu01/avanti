import * as SecureStore from 'expo-secure-store';
import { serializeParams } from './helpers';
import { getSavedToken } from './token';

// Gets the user with specified userID from Sharetribe
export const getUser = async (userID) => { // Does not work, needs token
    const url = 'https://flex-api.sharetribe.com/v1/api/users/show';
    var response, responseJSON, params;
    try {
        // Get user token
        const userToken = await getSavedToken('access');

        params = {
            id: userID,
            include: "profileImage"
        };
        response = await fetch(`${url}?${serializeParams(params)}`, {
            method: 'GET',
            headers: {'Authorization': `bearer ${userToken}`,
                      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                      'Accept': 'application/json'},
        });
        if (response.error === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await getUser(userID); // Try again
        }
        responseJSON = await response.json();
    }
    catch(error) {
        console.log(error);
    }
    return responseJSON;
}

// Gets the current user's info from Sharetribe
export const getCurrentUser = async () => { 
    const url = 'https://flex-api.sharetribe.com/v1/api/current_user/show';
    var response, responseJSON;
    try {
        // Get token from SecureStore
        const userToken = await SecureStore.getItemAsync('accessToken');
        
        // Fetch data from Sharetribe
        response = await fetch(url, {
            method: 'GET',
            headers: {'Authorization': `bearer ${userToken}`},
        });
        if (response.errors && response.errors[0].status === 401) { // 401 Error: Unauthorized
            await refreshToken(); // Refresh token
            return await getCurrentUser(); // Try again
        }
        responseJSON = await response.json();
    }
    catch(error) {
        console.log(`Failed to get current user: ${error}`);
    }
    return responseJSON;
}

// Gets the current user that is saved in SecureStore, key = 'user'
export const getStoredUser = async () => {
    const user = await SecureStore.getItemAsync('user');
    return JSON.parse(user).data;
}

export const isHelper = (user, listings) => {
    return user.attributes.profile.protectedData.isHelper || listings.length > 0;
}