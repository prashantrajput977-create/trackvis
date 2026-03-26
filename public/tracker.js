/**
 * TrackVis tracker — embed on any website
 * ─────────────────────────────────────────
 * <script src="https://YOUR-TRACKVIS-URL/tracker.js"></script>
 *
 * Change ENDPOINT to your deployed URL before embedding on production.
 */
(function () {
  'use strict';

  var ENDPOINT = 'http://localhost:3000'; // ← change after deploying

  // Deduplicate within the same browser tab session
  var dedupKey = 'tv_seen_' + location.pathname;
  if (sessionStorage.getItem(dedupKey)) return;
  sessionStorage.setItem(dedupKey, '1');

  var ts       = new Date().toISOString();
  var referrer = document.referrer || '';
  var page     = location.href;

  // 1. Get public IP
  fetch('https://api.ipify.org?format=json')
    .then(function (r) { return r.json(); })
    .then(function (d) { return d.ip || 'unknown'; })
    .catch(function ()  { return 'unknown'; })
    .then(function (ip) {
      // 2. Geo-enrich the IP
      return fetch('https://ipapi.co/' + ip + '/json/?fields=org,city,country_name,country_code')
        .then(function (r) { return r.json(); })
        .then(function (g) {
          return {
            ip:           ip,
            org:          g.org          || null,
            city:         g.city         || null,
            country:      g.country_name || null,
            country_code: g.country_code || null,
          };
        })
        .catch(function () { return { ip: ip }; });
    })
    .then(function (info) {
      // 3. POST to TrackVis
      var payload = Object.assign({
        timestamp: ts,
        referrer:  referrer,
        page:      page,
      }, info);

      fetch(ENDPOINT + '/api/log', {
        method:    'POST',
        headers:   { 'Content-Type': 'application/json' },
        body:      JSON.stringify(payload),
        mode:      'cors',
        keepalive: true,
      }).catch(function () { /* silent — never break the host page */ });
    });
}());
