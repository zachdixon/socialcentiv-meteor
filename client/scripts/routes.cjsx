{ ReactRouter } = NpmDependencies

{
  Route,
  NotFoundRoute,
  DefaultRoute,
} = ReactRouter

{
  AppBody,
  TweetsPage,
  LoginPage
} = App.Components

routes = (
  <Route name="root" path="/" handler={AppBody}>
    <Route name="tweets" path="/" handler={TweetsPage}/>
    <Route name="login" path="/login" handler={LoginPage}/>
  </Route>
)

{
  # <Route name="root" handler={AppBody} path="/">
  #   <Route name="todoList" path="/lists/:listId" handler={TodoListPage} />
  #   <Route name="join" path="/join" handler={AuthJoinPage} />
  #   <Route name="signin" path="/signin" handler={AuthSignInPage} />
  #   <DefaultRoute handler={AppLoading} />
  #   <NotFoundRoute handler={AppNotFound} />
  # </Route>
}

router = ReactRouter.create
  routes: routes
  location: ReactRouter.HistoryLocation

Meteor.startup ->
  router.run (Handler, state) ->
    React.render(<Handler/>, document.getElementById("app-container"));