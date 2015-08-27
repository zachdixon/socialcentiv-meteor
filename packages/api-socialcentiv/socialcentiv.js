if(Meteor.isClient) {
  API = (function() {
    var API = {};
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
            name: "Users",
            url: "/users",
            methods: [
              {
                name: "getAll",
                type: "get"
              },
              {
                name: "update",
                url: "/:id",
                type: "put",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "Businesses",
            url: "/businesses",
            methods: [
              {
                name: "getAll",
                type: "get"
              },
              {
                name: "getSingle",
                url: "/:id",
                type: "get",
                url_params: ["id"]
              },
              {
                name: "update",
                url: "/:id",
                type: "put",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "Campaigns",
            url: "/campaigns",
            methods: [
              {
                name: "getAll",
                type: "get",
                required_params: ["business_id"]
              },
              {
                name: "getSingle",
                url: "/:id",
                type: "get",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "Conversations",
            url: "/conversations",
            methods: [
              {
                name: "getAll",
                type: "get",
                required_params: ["business_id", "num_per_page", "status", "order_by", "keyphrase_ids"]
              },
              {
                name: "getSingle",
                url: "/:id",
                type: "get",
                url_params: ["id"]
              },
              {
                name: "update",
                url: "/:id",
                type: "put",
                url_params: ["id"]
              },
              {
                name: "delete",
                url: "/:id",
                type: "del",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "SuggestedResponses",
            url: "/suggested_responses",
            methods: [
              {
                name: "getAll",
                type: "get"
              }
            ]
          },
          {
            name: "CountryTargets",
            url: "/country_targets",
            methods: [
              {
                name: "getAll",
                type: "get",
                required_params: ["campaign_id"]
              },
              {
                name: "create",
                type: "post",
                required_params: ["campaign_id"]
              },
              {
                name: "update",
                url: "/:id",
                type: "put",
                url_params: ["id"]
              },
              {
                name: "delete",
                url: "/:id",
                type: "del",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "RadiusTargets",
            url: "/radius_targets",
            methods: [
              {
                name: "getAll",
                type: "get",
                required_params: ["country_target_id"]
              },
              {
                name: "create",
                type: "post",
                required_params: ["country_target_id"]
              },
              {
                name: "update",
                url: "/:id",
                type: "put",
                url_params: ["id"]
              },
              {
                name: "delete",
                url: "/:id",
                type: "del",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "Keyphrases",
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
                url: "/:id",
                type: "del",
                url_params: ["id"]
              }
            ]
          },
          {
            name: "Images",
            url: "/campaign_images",
            methods: [
              {
                name: "getAll",
                type: "get",
                required_params: ["campaign_id"]
              },
              {
                name: "create",
                type: "post",
                required_params: ["campaign_id"]
              },
              {
                name: "update",
                url: "/:id",
                type: "put",
                url_params: ["id"]
              },
              {
                name: "delete",
                url: "/:id",
                type: "del",
                url_params: ["id"]
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
          "X-User-Email": (Cookie.get('advancedUserEmail') || Cookie.get('currentUserEmail')),
          "X-User-Token": (Cookie.get('advancedUserAuth') || Cookie.get('currentUserAuth')),
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

          var url = APIConfig.config.defaults.base_url + resource.url,
              params = {},
              email,
              auth;
          // Replace url params with values
          // i.e. looks for :id inside url /businesses/:id,
          // then replaces it with the value from options
          if(!!method.url_params) {
            url = url + method.url;
            method.url_params.forEach(function(param) {
              var regex = new RegExp("\:" + param, "ig");
              url = url.replace(regex, options[param])
              delete options[param];
            });
          }
          // Move required params to params object so we don't clutter url query with data
          if (!!method.required_params) {
            method.required_params.forEach(function(param) {
              params[param] = options[param];
              delete options[param];
            });
          }
          var response = Meteor.http[method.type.toLowerCase()](
            url,
            {
              responseType: "JSON",
              headers: {
                "X-User-Email": Cookie.get('currentUserEmail') || Cookie.get('advancedUserEmail'),
                "X-User-Token": Cookie.get('currentUserAuth') || Cookie.get('advancedUserAuth'),
                "Accept": "application/vnd.socialcentiv.v2"
              },
              // FIXME - update params to use only requiredParams from config
              // i.e. params = {business_id: 3}
              // options = {business_id: 3, accountinfo...}
              params: params,
              data: options
            },
            function(err, res) {
              cb(err,res);
            }
          );
        };
      });
    });
    return API;
  })(window);
  
  
  // Meteor.methods(API.methods);
}

