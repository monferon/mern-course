import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { LinksPage } from "./pages/LinksPage";
import { CreatePage } from "./pages/CreatePage";
import { DetailPage } from "./pages/DetailPage";
import { AuthPage } from "./pages/AuthPage";

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links" exact>
          <LinksPage></LinksPage>
        </Route>
        <Route path="/create" exact>
          <CreatePage></CreatePage>
        </Route>
        <Route path="/detail/:id">
          <DetailPage></DetailPage>
        </Route>
        <Redirect to="/create"></Redirect>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/">
        <AuthPage></AuthPage>
      </Route>
      <Redirect to="/create"></Redirect>
    </Switch>
  );
};
