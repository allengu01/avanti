import * as Font from "expo-font";
 
export default useFonts = async () =>
    await Font.loadAsync({
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
    });