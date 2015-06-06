if(Meteor.isClient) {
  API = {
    "sessions": {},
    "businesses": {},
    "campaigns": {},
    "conversations": {}
  };
  APIConfig = {
    "methods": {},
    "config": {
      "defaults": {
        base_url: "http://api.hiplocalhost.com:3000",
        format: "JSON"
      },
      "routes": {
        "login": {
          url: "/users/me",
          type: "get"
        }
      },
      "resources": [
        {
          name: "businesses",
          url: "/businesses",
          methods: [
            {
              name: "getSingle",
              type: "get",
              required_params: ["user_id"]
            }
          ]
        },
        {
          name: "campaigns",
          url: "/campaigns",
          methods: [
            {
              name: "getSingle",
              type: "get",
              required_params: ["business_id"]
            }
          ]
        },
        {
          name: "conversations",
          url: "/conversations",
          methods: [
            {
              name: "getAll",
              type: "get",
              required_params: ["business_id"]
            },
            {
              name: "getSingle",
              type: "get",
              required_params: ["business_id", "conversation_id"]
            },
            {
              name: "update",
              type: "put",
              required_params: ["business_id", "conversation_id"]
            },
            {
              name: "destroy",
              type: "del",
              required_params: ["business_id", "conversation_id"]
            }
          ]
        }
      ]
    }
  };

  API.sessions.login = function(options, cb) {
    check(options, Object);
    check(cb, Function);
    route_config = APIConfig.config.routes.login;
    options.format = options.format || route_config.format || APIConfig.config.defaults.format;
    url = APIConfig.config.defaults.base_url + route_config.url;
    var response = Meteor.http.get(
      url,
      {
        headers: {
          "Authorization": "Basic " + options.auth_string
        }
      },
      function(err, res) {
        cb(err, res.data);
      }
    );
  };

  // Create methods for all APIConfig.config.resources
  APIConfig.config.resources.forEach(function(resource){
    resource.methods.forEach(function(method){
      API[resource.name][method.name] = function(options, cb) {
        check(options, Object);
        check(cb, Function);
        options.format = options.format || method.format || APIConfig.config.defaults.format;
        url = APIConfig.config.defaults.base_url + resource.url;
        var response = Meteor.http[method.type.toLowerCase()](
          url,
          {
            headers: {
              "X-User-Email": Cookie.get('currentUserEmail'),
              "X-User-Token": Cookie.get('currentUserAuth')
            },
            params: options
          },
          function(err, res) {
            cb(err,res.data);
          }
        );
      };
    });
  });
  
  // Meteor.methods(API.methods);
}

