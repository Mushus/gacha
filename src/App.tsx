import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Top from "@/pages/Top";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import Create from "@/pages/Create";
import Edit from "@/pages/Edit";
import Gacha from "@/pages/Gacha";
import Header from "./components/layout/Header";
import { AuthRequired, Provider as AuthProvider } from "./middleware/auth/Auth";
import Test from "./pages/Test";

const CreatePage = AuthRequired(Create);
const EditPage = AuthRequired(Edit);

export default () => {
	return (
		<AuthProvider>
			<ChakraProvider>
				<HashRouter hashType="slash">
					<Header />
					<Switch>
						<Route exact path="/login" component={Login} />
						<Route exact path="/logout" component={Logout} />
						<Route exact path="/create" component={CreatePage} />
						<Route exact path="/edit/:id" component={EditPage} />
						<Route exact path="/gacha/:id" component={Gacha} />
						<Route exact path="/test" component={Test} />
						<Route exact path="/" component={Top} />
					</Switch>
				</HashRouter>
			</ChakraProvider>
		</AuthProvider>
	);
};
