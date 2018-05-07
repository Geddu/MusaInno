'use strict';

angular.module("CommonModule", [])
    .service("common", function () {

        function formatDate(eventDate) {
            var date = new Date(eventDate);
            return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        }

        return {
            formatAssignmentDates: function (assignments) {
                for (var i = 0; i < assignments.length; i++) {
                    assignments[i].event_date = formatDate(assignments[i].event_date);
                }
                return assignments;
            },

            formatAssignmentReadyDates: function (assignments) {
                for (var i = 0; i < assignments.length; i++) {
                    assignments[i].ready_date = formatDate(assignments[i].ready_date);
                }
                return assignments;
            },

            assignReadyStates: function (assignments) {
                for (var i = 0; i < assignments.length; i++) {
                    if (assignments[i].creator_ready && assignments[i].compensation_ready) {
                        assignments[i].ready_state = 'Lähetetty';
                    } else if (assignments[i].creator_ready) {
                        assignments[i].ready_state = 'Odottaa muiden tietoja';
                    } else {
                        assignments[i].ready_state = 'Keskeneräinen';
                    }
                }
                return assignments;
            }
        }
    });
