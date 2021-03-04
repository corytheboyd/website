import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomePage } from "./lib/pages/HomePage";
import { BlogPage } from "./lib/pages/BlogPage";
import { ProjectsPage } from "./lib/pages/ProjectsPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/blog">
          <BlogPage />
        </Route>
        <Route path="/projects">
          <ProjectsPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
