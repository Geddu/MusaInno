'use strict';

angular.module("RestServiceModule", ['restangular'])
    .config(function (RestangularProvider) {
        RestangularProvider.setBaseUrl('http://localhost:80');
        RestangularProvider.setDefaultHeaders({'Content-Type': 'application/json'});
    })

    .service('RestService', function (Restangular, $window) {

        function setAuthorizationHeader() {
            Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + $window.sessionStorage.getItem('sessionToken')});
        }

        function getAll(endpoint, param) {
            setAuthorizationHeader();
            var url = param ? param + '/' + endpoint : endpoint;
            return Restangular.all(url).customGET()
                .then(function (res) {
                    return res[endpoint];
                });
        }

        function post(endpoint, payload, fullRes) {
            setAuthorizationHeader();
            return Restangular.all(endpoint).post(payload)
                .then(function (res) {
                    return fullRes ? res : res[endpoint];
                })
        }

        return {
            login: function (credentials) {
                return post('login', credentials, true);
            },

            getUsers: function () {
                setAuthorizationHeader();
                return Restangular.all('/user/all').customGET()
                    .then(function (res) {
                        return res.users;
                    });
            },

            getUser: function () {
                setAuthorizationHeader();
                return Restangular.one('user').get();
            },

            getUserEmail: function(emailParam){
                setAuthorizationHeader();
                return Restangular.all('user').get('find', {email: emailParam});
            },

            editUser: function (userInfo, userId) {
                return Restangular.all('user').customPUT(userInfo);
            },

            addAssignment: function (assignment, billable_info) {
                return Restangular.all('assignments').post(assignment)
                    .then(function () {
                        return Restangular.all('billableInfos').post(billable_info);
                    });
            },

            getUserAssignments: function () {
                setAuthorizationHeader();
                return Restangular.all('/assignments').customGET()
                    .then(function (res) {
                        return res.assignments;
                    });
            },

            getAllAssignments: function () {
                return getAll('assignments');
            },

            getTopics: function () {
                return getAll('topics');
            },

            getPaychecks: function () {
                return getAll('paychecks');
            },

            getBanks: function () {
                return Restangular.all('register').customGET()
                    .then(function (res) {
                        return res.services;
                    });
            },

            register: function (payload) {
                return post('register', payload, true);
            },

            logout: function () {
                return Restangular.all('login').customDELETE();
            },

            // Admin reitit
            getUsersAdmin: function () {
                setAuthorizationHeader();
                return Restangular.all('/admin/users').customGET()
                    .then(function (res) {
                        return res.users;
                    });
            },

            getUserAdmin: function (userId) {
                setAuthorizationHeader();
                return Restangular.one('/admin/user', userId).get();
            },

            editUserAdmin: function (userInfo, userId) {
                return Restangular.one('/admin/user', userId).customPUT(userInfo);
            },

        }

    });
