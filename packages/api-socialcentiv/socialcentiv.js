if(Meteor.isServer) {
  var API = {
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
      "resources": {
        "businesses": {
          url: "/businesses",
          methods: {
            getSingle: {
              type: "get",
              url_param: "user_id",
              required_params: ["user_id"]
            }
          }
        },
        "conversations": {
          url: "/conversations",
          methods: {
            getAll: {
              type: "get",
              required_params: ["business_id"]
            },
            getSingle: {
              type: "get",
              url_param: "conversation_id",
              required_params: ["business_id", "conversation_id"]
            },
            update: {
              type: "put",
              url_param: "conversation_id",
              required_params: ["business_id", "conversation_id"]
            },
            destroy: {
              type: "del",
              url_param: "conversation_id",
              required_params: ["business_id", "conversation_id"]
            }
          }
        }
      }
    }
  };

  API.methods['sessions.login'] = function(options) {
    check(options, Object);
    route_config = API.config.routes.login;
    options.format = options.format || route_config.format || API.config.defaults.format;
    url = API.config.defaults.base_url + route_config.url;
    var response = Meteor.http.get(
      url,
      {
        headers: {
          "Authorization": "Basic " + options.auth_string
        }
      }
    );
    if(response.statusCode == 200) {
      return response.data;
    } else {
      throw new Meteor.Error(500, "API call failed with error: " + response.status_txt);
    }
  };

  // Create methods for all API.config.resources
  var resources = API.config.resources;
  for(var resource in resources) {
    methods = resources[resource].methods;
    for(var method in methods) {
      config = methods[method];
      API.methods[resource + "." + method] = function(options) {
        check(options, Object);
        options.format = options.format || config.format || API.config.defaults.format;
        url = API.config.defaults.base_url + resource.url;
        if (!!config.url_param) {
          url += ("/" + options[config.url_param]);
        }
        var response = Meteor.http[config.type.toLowerCase()](
          url,
          {
            headers: {
              "X-User-Email": "tracie%2Btest108%40socialcentiv.com",
              "X-User-Token": "-uyU1EGcsSV9rzBsTJrM"
            },
            params: options
          }
        );
        if(response.statusCode == 200){
          return response.data;
        }else{
          throw new Meteor.Error(500, "API call failed with error: "+response.status_txt);
        }
      };
    }
  };

  // var getAuthHeaders = function() {
  //   # Set auth_string for basic auth, used for the sign in form
  //   auth_string = env.options.data?.auth_string
  //   if url is "/users/me.json" and auth_string
  //     headers["Authorization"] = "Basic #{auth_string}"
  //   else
  //     # Sets email and token headers; checks env.options.data and currentUser for values
  //     # Remove email and authentication_token from query string
  //     email = env.options.data?.email or $.cookie('currentUserEmail')
  //     auth = env.options.data?.authentication_token or $.cookie('currentUserAuth')
  //     unless url is "/passwords"
  //       delete env.options.data?.email
  //       delete env.options.data?.authentication_token
  //     headers["X-User-Email"] = email
  //     headers["X-User-Token"] = auth
  //     return headers
  // };
  
  Meteor.methods(API.methods);
}

