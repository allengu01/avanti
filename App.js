import React, {useState, useEffect, useReducer} from 'react';
import * as Font from "expo-font";
// import AppLoading from 'expo-app-loading';
import * as SecureStore from 'expo-secure-store';
import useFonts from './hooks/useFonts'
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Loading from './components/Loading/Loading';
import Home from './pages/Home.js';
import Detail from './pages/Detail.js';
import SessionsList from './pages/SessionsList';
import Messages from './pages/Messages';
import SignIn from './pages/SignIn.js';
import SignUp from './pages/SignUp.js';
import { signUpUser, signInUser } from './api/auth';
import { getCurrentUser, getStoredUser, isHelper } from './api/user';
import { getOwnListings, getSessions } from './api/marketplace.js';
import { getSavedToken, refreshToken, saveToken, revokeToken, deleteSavedToken } from './api/token';
import AuthContext from './contexts/AuthContext';
import DataContext from './contexts/DataContext';

const Stack = createNativeStackNavigator();
// const isSignedIn = false; // for testing

export default function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("");
  const [data, setData] = useState([]);

  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isSignedIn: true,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            isSignedIn: false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      isSignedIn: false,
    }
  );

  // Formats the sessions reponse (containing a data array and an included array)
  // into a dictionary with key/value pairs:
  //      session: session data
  //      booking: booking data (time, status)
  //      listing: listing data (price, subjects that provider can help with)
  //      provider: provider data (name)
  const formatSessionsData = (dataArray, includedArray) => {
      const formattedArray = dataArray.map((session, i) => {
          const includedData = includedArray[i];
          const bookingRelationshipID = session.relationships.booking.data.id;
          const listingRelationshipID = session.relationships.listing.data.id;
          const providerRelationshipID = session.relationships.provider.data.id;
          const customerRelationshipID = session.relationships.customer.data.id;

          const bookingData = includedArray.find(data => data.id === bookingRelationshipID && data.type === "booking");
          const listingData = includedArray.find(data => data.id === listingRelationshipID && data.type === "listing");
          const providerData = includedArray.find(data => data.id === providerRelationshipID && data.type === "user");
          const customerData = includedArray.find(data => data.id === customerRelationshipID && data.type === "user");

          const formatted = {session: session,
                              booking: bookingData,
                              listing: listingData,
                              provider: providerData,
                              customer: customerData};
          return formatted;
      });
      formattedArray.sort((a, b) => a.booking.attributes.start < b.booking.attributes.start);
      for (let i = 0; i < formattedArray.length; i++) {
          formattedArray[i].key = `${i}`;
      }
      return formattedArray
  };

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        const {username, password} = data;

        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        
        // Call Sharetribe API to get token with username and password
        try {
          const signInResponse = await signInUser(username, password);
          dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
        }
        // TODO: Error handling
        catch(error) {
          return error;
        }

        return null;
      },
      signOut: async () => {
        try {
          const refreshToken = await getSavedToken('refresh');
          const [revokeResponse, deleteAccessResponse, deleteRevokeResponse] = await Promise.all([revokeToken(refreshToken), deleteSavedToken('access'), deleteSavedToken('refresh')]);
        }
        catch(error) {
          console.log(error);
        }
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async data => {
        const { email, password, firstName, lastName, phoneNumber } = data;
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        const signUpResponse = await signUpUser(email, password, firstName, lastName, {phoneNumber: phoneNumber});
        if (signUpResponse.errors) {
          if (signUpResponse.errors[0].status === 409) { // Email already taken
            return signUpResponse.errors[0];
          }
        }

        // TODO: Error handling

        // Call Sharetribe API to get token with username and password
        const signInResponse = await signInUser(email, password);

        // TODO: Error handling

        // Get user
        const userResponse = await getCurrentUser();
        await SecureStore.setItemAsync('user', JSON.stringify(userResponse));
        
        dispatch({ type: 'SIGN_IN' });
        return { status: 200 };
      },
    }),
    []
  );

  const dataContext = React.useMemo(() => ({
    user: user,
    data: data,
    userType: userType,
    fetchData: async () => {
      try {
          // Gets user data from SecureStore
          const userResponse = await getCurrentUser();
          console.log("Current User:")
          console.log(userResponse.data);
          // Gets sessions data for user
          const userID = userResponse.data.id;
          const [sessionsResponse, listingsResponse] = await Promise.all([getSessions(userID), getOwnListings()]);
          const formattedSessions = formatSessionsData(sessionsResponse.data, sessionsResponse.included);

          setUser(userResponse.data);
          setData(formattedSessions);
          if (isHelper(userResponse.data, listingsResponse.data)) {
              setUserType("helper");
          }
          else {
              setUserType("customer");
          }
      }
      catch(error) {
          alert(error);
          throw error;
      }
    }
  }), [user, data, userType]);

  const fetchAssets = async () => {
    await useFonts();
  }

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await Font.loadAsync({
          'Lato-Bold': require('./assets/fonts/Lato-Bold.ttf'),
          'Lato-Regular': require('./assets/fonts/Lato-Regular.ttf'),
        });
        let userToken;
        userToken = await getSavedToken('access');
        if (userToken != null) {
          await refreshToken();
          dispatch({ type: 'RESTORE_TOKEN' });
          dispatch({ type: 'SIGN_IN' });
        }
        else {
          dispatch({ type: 'RESTORE_TOKEN' });
        }
      } catch (e) {
        console.log(e);
      }

    };

    bootstrapAsync();
  }, [])

  // Presentational stuff starts here
  if (state.isLoading) {
    return (
      <View>
        <Loading />
      </View>
    )
  }
  else {
    return (
      <DataContext.Provider value={dataContext}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <Stack.Navigator>
              {state.isSignedIn ? (
                <>
                  <Stack.Screen name="Home" 
                                component={Home} 
                                options={{headerShown: false}}
                                initialParams={{user: user, data: data, userType: userType}} />
                  <Stack.Screen name="SessionsList" 
                                component={SessionsList}
                                options={{
                                  headerTitle: "",
                                  headerBackTitle: "",
                                  headerTintColor: "black",
                                }} />
                  <Stack.Screen name="Detail" 
                                component={Detail} 
                                options={{
                                  headerStyle: {
                                    backgroundColor: "white",
                                  },
                                  headerTitle: "",
                                  headerBackTitle: "",
                                  headerTintColor: "black",
                                }}/>
                  <Stack.Screen name="Messages" 
                                component={Messages} 
                                options={{
                                  headerStyle: {
                                    backgroundColor: "white",
                                  },
                                  headerTitle: "",
                                  headerBackTitle: "",
                                  headerTintColor: "black",
                                }}/>
                </>
              ) : (
                <Stack.Group screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="SignIn" component={SignIn} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </DataContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
