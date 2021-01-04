import * as React from "react";
import { render } from "react-dom";
import App from "@/App";
import { ChakraProvider } from "@chakra-ui/react";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyChlUSrv0kpFQQwU6BwBLHuCnSwVsQ1JlU",
	authDomain: "gacha-285d9.firebaseapp.com",
	databaseURL: "https://gacha-285d9.firebaseio.com",
	projectId: "gacha-285d9",
	storageBucket: "gacha-285d9.appspot.com",
	messagingSenderId: "666806246106",
	appId: "1:666806246106:web:32ae392cc3cc4bcb7ba3e3",
	measurementId: "G-XW8LQKEFDN",
};

firebase.initializeApp(firebaseConfig);

render(<App />, document.getElementById("app"));
