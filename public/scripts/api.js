var $ = $ || require("jquery")(require("jsdom").jsdom().defaultView);

var API = {
    dbInfo: {
        dbuser: "admin",
        dbpassword: "admin",
        url: "mongodb://<dbuser>:<dbpassword>@ds157248.mlab.com:57248/extdb",
        getConnectionString: function () {
            return this.url.replace("<dbuser>", this.dbuser).replace("<dbpassword>", this.dbpassword);
        }
    },
    API_KEY: "kH7vhCSdc9IeGZnAXwjm02DwxDqmA1O-",
    DB_NAME: "extdb",
    BASE_URL: "https://api.mlab.com/api/1/",

    url: function (path) {
        return API.BASE_URL + path + "?apiKey=" + API.API_KEY;
    }, 

    database: {
        test: function () {
            return $.ajax({
                url: API.url("databases"),
                type: "GET",
                dataType: "json"
            });
        }
    },

    collections: {
        users: {
            url: function () {
                return API.url("databases/" + API.DB_NAME + "/collections/users");
            },
            get: function () {
                return $.ajax({
                    url: API.collections.users.url(),
                    type: "GET",
                    contentType: "application/json"
                });
            },
            add: function (email, fullname, password) {
                return $.ajax({
                    url: API.collections.users.url(),
                    data: JSON.stringify({
                        "email": email,
                        "fullname": fullname,
                        "password": password
                    }),
                    type: "POST",
                    contentType: "application/json"
                });
            }
        }
    }

}
module.exports = API;
