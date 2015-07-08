@Test = React.createClass
  render: ->
    <div>
      <p>This is a react component built with coffeescript (cjsx)</p>
      <p>It's also being rendered into a Meteor Blaze Template using {'{{> React component=ComponentName}}'}</p>
    </div>

@AnotherTest = React.createClass
  render: ->
    <div>
      <p>This is another component, rendered via React.render()</p>
    </div>

# I just wanted to test this out to see how it worked, for more info see http://react-in-meteor.readthedocs.org/en/latest/react-template-helper/
# We can also use React.render when we use full React, see http://react-in-meteor.readthedocs.org/en/latest/tutorial/


Template.Testtemplate.rendered = ->
  React.render <App/>, @firstNode