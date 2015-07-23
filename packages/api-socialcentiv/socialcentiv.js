if(Meteor.isClient) {
  API = {};
  var DOMAIN = location.hostname.replace(/http:\/\/.+?\./, '').replace(/^[^.]+\./g, "");
  if (DOMAIN == "hiplocalhost.com" || DOMAIN == "localhost") {
    url = "http://api.hiplocalhost.com:3000"; // Development
  } else if (DOMAIN == "socialcentivbeta.net" || DOMAIN == "socialcentiv.net" || DOMAIN == "meteor.com") {
    url = "http://api.socialcentiv.net"; // Staging
  } else if (DOMAIN == "socialcentiv.com") {
    url = "http://api.socialcentiv.com"; // Production
  }
  API.URL = url;
  var APIConfig = {
    "config": {
      "defaults": {
        base_url: url
      },
      "misc": {
        "login": {
          url: "/users/me",
          type: "get"
        }
      },
      "resources": [
        {
          name: "users",
          url: "/users",
          methods: [
            {
              name: "update",
              type: "put",
              url_param: "id",
              required_params: ["id"]
            }
          ]
        },
        {
          name: "businesses",
          url: "/businesses",
          methods: [
            {
              name: "getSingle",
              type: "get",
              required_params: ["user_id"]
            },
            {
              name: "update",
              type: "put",
              url_param: "id",
              required_params: ["id"]
            }
          ]
        },
        {
          name: "campaigns",
          url: "/campaigns",
          methods: [
            {
              name: "getAll",
              type: "get",
              requried_params: ["business_id"]
            },
            {
              name: "getSingle",
              type: "get",
              url_param: "id",
              required_params: ["id"]
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
              required_params: ["business_id", "id"]
            },
            {
              name: "update",
              type: "put",
              required_params: ["business_id", "id"]
            },
            {
              name: "delete",
              type: "del",
              url_param: "id",
              required_params: ["id"]
            }
          ]
        },
        {
          name: "suggestedResponses",
          url: "/suggested_responses",
          methods: [
            {
              name: "getAll",
              type: "get"
            }
          ]
        },
        {
          name: "keyphrases",
          url: "/keyphrases",
          methods: [
            {
              name: "getAll",
              type: "get",
              required_params: ["campaign_id"]
            },
            {
              name: "create",
              type: "post",
              required_params: ["campaign_id", "phrase", "action_type"]
            },
            {
              name: "delete",
              type: "del",
              url_param: "id",
              required_params: ["id"]
            }
          ]
        }
      ]
    }
  };

  API.sessions = API.sessions || {};
  API.sessions.login = function(options, cb) {
    check(options, Object);
    check(cb, Function);
    route_config = APIConfig.config.misc.login;
    url = APIConfig.config.defaults.base_url + route_config.url;
    if(options.auth_type.toLowerCase() == "basic") {
      headers = {
        "Authorization": "Basic " + options.auth_string,
        "Accept": "application/vnd.socialcentiv.v2"
      };
    }else if(options.auth_type.toLowerCase() == "token") {
      headers = {
        "X-User-Email": Cookie.get('currentUserEmail'),
        "X-User-Token": Cookie.get('currentUserAuth'),
        "Accept": "application/vnd.socialcentiv.v2"
      };
    }
    var response = Meteor.http.get(
      url,
      {
        headers: headers
      },
      cb
    );
  };

  // Create methods for all APIConfig.config.resources
  APIConfig.config.resources.forEach(function(resource){
    resource.methods.forEach(function(method){
      API[resource.name] = API[resource.name] || {};
      API[resource.name][method.name] = function(options, cb) {
        check(options, Object);
        check(cb, Function);
        url = APIConfig.config.defaults.base_url + resource.url;
        if(!!method.url_param) {
          url += ("/" + options[method.url_param]);
        }
        var response = Meteor.http[method.type.toLowerCase()](
          url,
          {
            headers: {
              "X-User-Email": Cookie.get('currentUserEmail'),
              "X-User-Token": Cookie.get('currentUserAuth'),
              "Accept": "application/vnd.socialcentiv.v2"
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

