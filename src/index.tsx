import React from "react";
import { render } from "react-dom";
import { App } from "./App";

render(<App />, document.getElementById("root"));

// @ts-ignore
if (module.hot) module.hot.accept();