/*
 * Copyright (C) 2015 EDF SA
 *
 * This file is part of slurm-web.
 *
 * slurm-web is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * slurm-web is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with slurm-web.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

define([
  'jquery'
], function($) {
  $(document).ajaxError(function(event, jqueryXHR, error, errorThrown) {
    console.log(JSON.stringify(event), JSON.stringify(jqueryXHR), JSON.stringify(error), JSON.stringify(errorThrown));  // eslint-disable-line no-console

    // In case of 403 error (forbidden), logout from cluster(s) except for
    // /login route since this error in handled with login form logic in
    // dashboard/js/core/login/login.js
    if (jqueryXHR.status === 403 && !(error.url.indexOf('/login') > -1)) {
      $(document).trigger('logout');
    }

    // Ignore error for /authentication here because this route is used to
    // probe cluster availability and API authentication configuration on
    // dashboard load and the errors on this route are directly handled in
    // dashboard/js/core/clusters/clusters.js
    if (!(error.url.indexOf('/authentication') > -1)) {

      // Show error in #flash.
      // When the REST API fails in unexpected way (typically with 500 internal
      // error) and CORS is enabled, the REST API is unable to set CORS
      // Access-Control headers properly in its response. This results in the
      // browser blocking the response and not propagating the response HTTP
      // status to jquery XHR. It is the reason why we check for unknown jXHR
      // status here.
      if (!jqueryXHR.status) {
        $('#flash .alert').append($('<p>').text('Unknown error on request ' + error.type + ' ' + error.url));
      } else {
        $('#flash .alert').append($('<p>').text('Error ' + jqueryXHR.status + ' on request ' + error.type + ' ' + error.url));
      }
      $('#flash').show();
    }
  });
});
