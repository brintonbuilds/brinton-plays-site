(function () {
  var audio = document.getElementById('audio');
  var play = document.getElementById('play');
  var iPlay = document.getElementById('icon-play');
  var iPause = document.getElementById('icon-pause');
  var bar = document.getElementById('bar');
  var fill = document.getElementById('fill');
  var cur = document.getElementById('cur');
  var dur = document.getElementById('dur');

  function fmt(s) {
    if (!isFinite(s)) return '0:00';
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function setPlaying(on) {
    iPlay.hidden = on;
    iPause.hidden = !on;
    play.setAttribute('aria-label', on ? 'Pause' : 'Play');
  }
  function unavailable() {
    play.disabled = true;
    dur.textContent = 'Release coming soon';
  }

  audio.addEventListener('loadedmetadata', function () { dur.textContent = fmt(audio.duration); });
  audio.addEventListener('error', unavailable);
  audio.addEventListener('timeupdate', function () {
    var p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = p + '%';
    bar.setAttribute('aria-valuenow', Math.round(p));
    cur.textContent = fmt(audio.currentTime);
  });
  audio.addEventListener('play', function () { setPlaying(true); });
  audio.addEventListener('pause', function () { setPlaying(false); });
  audio.addEventListener('ended', function () { setPlaying(false); });

  play.addEventListener('click', function () {
    if (audio.paused) { var p = audio.play(); if (p && p.catch) p.catch(unavailable); }
    else audio.pause();
  });
  bar.addEventListener('click', function (e) {
    if (!audio.duration) return;
    var r = bar.getBoundingClientRect();
    audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
  });
  bar.addEventListener('keydown', function (e) {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
  if (audio.error) unavailable();

  var copy = document.getElementById('copy');
  var email = document.getElementById('email');
  if (!copy || !email) return;
  copy.addEventListener('click', function () {
    var text = email.textContent.trim();
    function selectIt() {
      var range = document.createRange();
      range.selectNodeContents(email);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copy.textContent = 'SELECTED';
    }
    try {
      navigator.clipboard.writeText(text).then(function () { copy.textContent = 'COPIED'; }, selectIt);
    } catch (err) { selectIt(); }
    setTimeout(function () { copy.textContent = 'COPY EMAIL'; }, 2000);
  });
})();
