{
  SessionsLayout,
  MainLayout
} = App.Layouts

{
  TweetsPage,
  LoginPage
} = App.Components

FlowRouter.route '/',
  name: 'tweets'
  action: (params, queryParams) ->
    ReactLayout.render MainLayout, {content: <TweetsPage />}

FlowRouter.route '/login',
  name: 'login'
  action: (params, queryParams) ->
    ReactLayout.render SessionsLayout, {content: <LoginPage />}