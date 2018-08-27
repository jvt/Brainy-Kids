import React from "react";

import { BrowserRouter } from "react-router-dom";

import Routes from "../Routes.js";
// import DevTools from "./DevTools";

export default function Root() {
	return (
		<BrowserRouter>
			<main style={{height: '100vh'}}>
				<Routes />
			</main>
		</BrowserRouter>
	);
}