/* Meta Church — скрипты сайта */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Настройки анонса трансляции.
     Время — ташкентское (UTC+5, перехода на летнее время нет).
     day: 0 = воскресенье, 1 = понедельник ... 6 = суббота
     --------------------------------------------------------- */
  var STREAMS = [
    { day: 0, start: '11:00', end: '12:45', title: 'Воскресное собрание' }
  ];
  var ANNOUNCE_BEFORE_MIN = 30;   // за сколько минут показывать анонс
  var TZ_OFFSET_MIN = 5 * 60;     // UTC+5

  function toMinutes(hhmm) {
    var p = hhmm.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  // Текущее время в Ташкенте независимо от часового пояса посетителя
  function tashkentNow() {
    var now = new Date();
    var t = new Date(now.getTime() + (now.getTimezoneOffset() + TZ_OFFSET_MIN) * 60000);
    return { day: t.getDay(), minutes: t.getHours() * 60 + t.getMinutes() };
  }

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function updateLiveBar() {
    var bar = document.getElementById('live-bar');
    var text = document.getElementById('live-bar-text');
    if (!bar || !text) return;

    var now = tashkentNow();
    var message = null;

    for (var i = 0; i < STREAMS.length; i++) {
      var s = STREAMS[i];
      if (s.day !== now.day) continue;
      var start = toMinutes(s.start);
      var end = toMinutes(s.end);

      if (now.minutes >= start - ANNOUNCE_BEFORE_MIN && now.minutes < start) {
        var left = start - now.minutes;
        message = s.title + ' начнётся через ' + left + ' ' + plural(left, 'минуту', 'минуты', 'минут');
      } else if (now.minutes >= start && now.minutes < end) {
        message = 'Идёт прямая трансляция: ' + s.title.toLowerCase();
      }
    }

    if (message) {
      text.textContent = message;
      bar.hidden = false;
    } else {
      bar.hidden = true;
    }
  }

  updateLiveBar();
  setInterval(updateLiveBar, 30000);

  // Год в подвале
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
