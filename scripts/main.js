(function () {
    'use strict';

    class ViewModel {
        constructor() {
            this.username = ko.observable();
            this.password = ko.observable();
            this.showMessage= ko.observable();

            this.loggedIn = ko.observable(false);

            this.valid = ko.computed(function () {
                let username = this.username() || "";
                let password = this.password() || "";
                username = username.trim();
                password = password.trim();
                if (username && password) {
                    return true;
                } else {
                    return false;
                }

            }, this);
        }
       /*get groupDetails(){
           let result= await fetch(url,{
               meth
           })
       }
       */
        async login() {
            let data = {
                username: this.username(),
                password: this.password(),
                grant_type: "password",
                client_id: "Nimbus.web"
            };

            let headers = new Headers();
            headers.append('Content-Type', "application/x-www-form-urlencoded");
            //headers.append('Content-Type',"application/json");
            //headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');

            let url = "https://cubexnimbus-dev.azurewebsites.net/Token";
            let result = await fetch(url, {
                method: "POST",
                headers: headers,
                //  mode: 'cors',
                credentials: "omit",
                body: objectToUrlString(data)
            });
            let body = await result.json();
            if (body && body.refresh_token) {
                sessionStorage.setItem('login', JSON.stringify(body));
                this.loggedIn(true);
                this.showMessage("");
            }else{
                this.showMessage(`Please check your username and password`);
            }
        }
    }

    var viewmodel = new ViewModel();
    window.viewmodel=viewmodel;

    ko.applyBindings(viewmodel);

    function objectToUrlString(obj) {
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return values.join('&');
    }

})();