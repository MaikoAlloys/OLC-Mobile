import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StorekeeperRequests from "./StorekeeperRequests";
import ReceiveItem from "./ReceiveItem";

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="StorekeeperRequests" 
                    component={StorekeeperRequests} 
                    options={{ title: "Requests" }} 
                />
                <Stack.Screen 
                    name="ReceiveItem" 
                    component={ReceiveItem} 
                    options={{ title: "Receive Item" }} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
