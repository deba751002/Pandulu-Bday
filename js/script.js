(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var PHOTOS = [
    { src: "images/18-best-senior.jpg", alt: "Pandulu smiling with a rose in her hair and a 'Best Senior' badge pinned to her saree", caption: "wearing 'best senior' like it's nothing", featured: true },
    { src: "images/19-so-proud-of-you.jpg", alt: "Pandulu smiling close-up, still wearing her 'Best Senior' badge", caption: "so proud of you, always", featured: true },
    { src: "images/01-where-it-started.jpg", alt: "Pandulu smiling at a table, an early evening together", caption: "where it started" },
    { src: "images/02-that-first-ride.jpg", alt: "Pandulu on the back of a scooter at night", caption: "that first ride together" },
    { src: "images/03-trying-on-colors.jpg", alt: "Pandulu and partner in a mirror selfie at a clothing store", caption: "trying on colors together" },
    { src: "images/04-off-on-an-adventure.jpg", alt: "Pandulu at an airport holding a drink", caption: "off on an adventure" },
    { src: "images/05-an-ordinary-day.jpg", alt: "Pandulu on a scooter in the daytime", caption: "the day we cried, together" },
    { src: "images/06-festival-lights.jpg", alt: "Pandulu dressed up for a festival evening", caption: "festival lights" },
    { src: "images/07-evening-at-the-temple.jpg", alt: "Pandulu at a temple decorated in red and gold for Ganesh Puja", caption: "Ganesh Puja, that evening" },
    { src: "images/08-street-food-after.jpg", alt: "Pandulu holding a tray of street food and waving", caption: "sharing street food after" },
    { src: "images/09-blue-saree-day.jpg", alt: "Pandulu in a blue saree, smiling outdoors", caption: "that blue saree day" },
    { src: "images/10-under-the-lit-monument.jpg", alt: "Pandulu and partner together at a lit-up monument at night", caption: "under the lit monument" },
    { src: "images/11-a-quiet-temple-afternoon.jpg", alt: "Pandulu standing at a temple entrance", caption: "a quiet temple afternoon" },
    { src: "images/12-walking-to-the-temple.jpg", alt: "Pandulu walking toward a temple in the rain", caption: "walking towards the temple" },
    { src: "images/13-lost-in-a-crowd.jpg", alt: "Pandulu and partner together in a crowd at night", caption: "lost in a crowd, found each other" },
    { src: "images/14-valentines-just-us.jpg", alt: "Pandulu and partner sitting together outdoors on Valentine's Day", caption: "this Valentine's, just us" },
    { src: "images/15-lost-in-thought.jpg", alt: "Pandulu sitting on steps outdoors, lost in thought", caption: "you, lost in thought" },
    { src: "images/16-the-walk.jpg", alt: "Pandulu and partner laughing together on a walk", caption: "the walk where you kept laughing" },
    { src: "images/17-the-sea.jpg", alt: "Pandulu standing at the seashore", caption: "the sea, and you — both endless" }
  ];

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  // ---------- Heart cursor persistence ----------
  if (localStorage.getItem("heartCursor") === "1") {
    document.documentElement.classList.add("heart-cursor");
  }

  function setHeartCursor() {
    localStorage.setItem("heartCursor", "1");
    document.documentElement.classList.add("heart-cursor");
  }

  // ---------- Next-page navigation ----------
  (function nextButtons() {
    var links = document.querySelectorAll(".btn-next");
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        setHeartCursor();
      });
    });
  })();

  // ---------- Letterbox (fixed black bars, cinema-screen framing) ----------
  (function letterbox() {
    ["top", "bottom"].forEach(function (side) {
      var bar = document.createElement("div");
      bar.className = "letterbox-bar " + side;
      bar.setAttribute("aria-hidden", "true");
      document.body.appendChild(bar);
    });
  })();

  // ---------- Cinematic page transitions: film-cut cross-fade + chapter title card ----------
  (function pageTransitions() {
    var overlay = document.createElement("div");
    overlay.className = "page-transition";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);

    var chapterTag = document.querySelector(".chapter-tag");
    var titleCard = null;
    if (chapterTag && !reduceMotion) {
      var parts = chapterTag.textContent.split("·").map(function (s) { return s.trim(); });
      titleCard = document.createElement("div");
      titleCard.className = "title-card";
      var eyebrow = document.createElement("span");
      eyebrow.className = "title-card-eyebrow";
      eyebrow.textContent = parts[0] || "";
      var rule = document.createElement("span");
      rule.className = "title-card-rule";
      var main = document.createElement("span");
      main.className = "title-card-main";
      main.textContent = parts[1] || parts[0] || "";
      titleCard.appendChild(eyebrow);
      titleCard.appendChild(rule);
      titleCard.appendChild(main);
      overlay.appendChild(titleCard);
    }

    if (reduceMotion) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlay.classList.add("hidden");
        });
      });
    } else if (titleCard) {
      // Hold on the black title card like a film's chapter slate, then cut to the page.
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          titleCard.classList.add("show");
        });
      });
      setTimeout(function () {
        titleCard.classList.remove("show");
      }, 1500);
      setTimeout(function () {
        overlay.classList.add("hidden");
      }, 2000);
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlay.classList.add("hidden");
        });
      });
    }

    if (reduceMotion) return;

    document.querySelectorAll('a[href$=".html"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        var href = link.getAttribute("href");
        if (!href || link.target === "_blank") return;
        e.preventDefault();
        if (titleCard) titleCard.remove();
        overlay.classList.remove("hidden");
        setTimeout(function () {
          window.location.href = href;
        }, 480);
      });
    });
  })();

  // ---------- Starfield + embers ----------
  (function starfield() {
    var canvas = document.getElementById("sky");
    if (!canvas) return;
    var ctx = canvas.getContext("2d", { alpha: true });
    var isCoarse = window.matchMedia("(pointer: coarse)").matches;
    var stars = [];
    var embers = [];
    var w, h;
    var running = true;

    // Canvas is fixed to the viewport (see CSS), so it only ever needs to
    // cover what's on screen, not the whole scrollable page.
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function initStars() {
      stars = [];
      var density = isCoarse ? 16000 : 9000;
      var count = Math.min(140, Math.floor((w * h) / density));
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8
        });
      }
    }

    function initEmbers() {
      embers = [];
      var count = isCoarse ? 6 : 14;
      for (var i = 0; i < count; i++) {
        embers.push({
          x: Math.random() * w,
          y: h + Math.random() * h,
          r: Math.random() * 2 + 1,
          drift: (Math.random() - 0.5) * 0.3,
          speed: 0.15 + Math.random() * 0.25,
          grad: null,
          gradKey: ""
        });
      }
    }

    var t = 0;
    function draw() {
      if (!running) return;
      t += 0.02;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244,236,223," + tw.toFixed(3) + ")";
        ctx.fill();
      }

      for (var j = 0; j < embers.length; j++) {
        var e = embers[j];
        if (!reduceMotion) {
          e.y -= e.speed;
          e.x += e.drift;
          if (e.y < -10) {
            e.y = h + 10;
            e.x = Math.random() * w;
            e.grad = null;
          }
        }
        // Gradients are pinned to a rounded position so they can be reused
        // across frames instead of allocated every draw call.
        var rx = Math.round(e.x / 6) * 6;
        var ry = Math.round(e.y / 6) * 6;
        var key = rx + "," + ry;
        if (!e.grad || e.gradKey !== key) {
          e.grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, e.r * 4);
          e.grad.addColorStop(0, "rgba(232,163,92,0.35)");
          e.grad.addColorStop(1, "rgba(232,163,92,0)");
          e.gradKey = key;
        }
        ctx.beginPath();
        ctx.arc(rx, ry, e.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = e.grad;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    resize();
    initStars();
    initEmbers();
    window.addEventListener("resize", function () {
      resize();
      initStars();
      initEmbers();
    });
    document.addEventListener("visibilitychange", function () {
      var wasRunning = running;
      running = document.visibilityState === "visible";
      if (running && !wasRunning) requestAnimationFrame(draw);
    });
    draw();
  })();

  // ---------- Cursor spotlight ----------
  (function cursorGlow() {
    if (reduceMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    var glow = document.getElementById("cursorGlow");
    if (!glow) return;
    var targetX = window.innerWidth / 2;
    var targetY = window.innerHeight / 2;
    var curX = targetX;
    var curY = targetY;

    function loop() {
      curX += (targetX - curX) * 0.15;
      curY += (targetY - curY) * 0.15;
      glow.style.transform = "translate(" + curX.toFixed(1) + "px, " + curY.toFixed(1) + "px)";
      requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.classList.add("active");
    });
    window.addEventListener("mouseleave", function () {
      glow.classList.remove("active");
    });
    requestAnimationFrame(loop);
  })();

  // ---------- Ambient floating hearts ----------
  (function floatingHearts() {
    if (reduceMotion) return;
    var layer = document.getElementById("heartsLayer");
    if (!layer) return;
    var isCoarse = window.matchMedia("(pointer: coarse)").matches;
    var glyphs = ["♥", "❤"];

    function spawn() {
      var heart = document.createElement("span");
      heart.className = "heart";
      heart.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
      var duration = 9 + Math.random() * 6;
      heart.style.animationDuration = duration + "s";
      heart.style.fontSize = 0.8 + Math.random() * 1.2 + "rem";
      layer.appendChild(heart);
      setTimeout(function () {
        heart.remove();
      }, duration * 1000 + 500);
    }

    setInterval(spawn, isCoarse ? 3200 : 1800);
    spawn();
  })();

  // ---------- Ambient balloons (site-wide) ----------
  (function floatingBalloons() {
    var layer = document.getElementById("balloonsLayer");
    if (!layer || reduceMotion) return;
    var isCoarse = window.matchMedia("(pointer: coarse)").matches;
    var colors = ["c-amber", "c-rose", "c-dusk", "c-cream"];

    function spawn() {
      var balloon = document.createElement("span");
      balloon.className = "balloon " + colors[Math.floor(Math.random() * colors.length)];
      balloon.style.left = Math.random() * 92 + "vw";
      balloon.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      var duration = 14 + Math.random() * 8;
      var scale = 0.7 + Math.random() * 0.6;
      balloon.style.transform = "scale(" + scale.toFixed(2) + ")";
      balloon.style.animationDuration = duration + "s";
      layer.appendChild(balloon);
      setTimeout(function () {
        balloon.remove();
      }, duration * 1000 + 500);
    }

    setInterval(spawn, isCoarse ? 5200 : 3200);
    spawn();
    setTimeout(spawn, 1200);
  })();

  // ---------- Gate balloons (celebratory burst behind envelope) ----------
  (function gateBalloons() {
    var layer = document.getElementById("gateBalloons");
    if (!layer) return;
    var colors = ["c-amber", "c-rose", "c-dusk", "c-cream"];

    function burst() {
      var count = reduceMotion ? 0 : 10;
      for (var i = 0; i < count; i++) {
        (function (i) {
          setTimeout(function () {
            var balloon = document.createElement("span");
            balloon.className = "balloon " + colors[i % colors.length];
            balloon.style.left = 5 + Math.random() * 90 + "vw";
            balloon.style.setProperty("--drift", (Math.random() * 70 - 35) + "px");
            var duration = 10 + Math.random() * 6;
            balloon.style.animationDuration = duration + "s";
            layer.appendChild(balloon);
            setTimeout(function () {
              balloon.remove();
            }, duration * 1000 + 500);
          }, i * 260);
        })(i);
      }
    }
    burst();
    if (!reduceMotion) setInterval(burst, 6000);
  })();

  // ---------- Scroll reveal ----------
  (function scrollReveal() {
    var targets = document.querySelectorAll(".reveal-child");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      targets.forEach(function (el) {
        el.classList.add("in-view");
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach(function (el) {
      observer.observe(el);
    });
  })();

  // ---------- Cinematic reel (auto-crossfading movie-style montage) ----------
  (function cinematicReel() {
    var reel = document.getElementById("reel");
    if (!reel) return;

    var layerA = document.createElement("img");
    var layerB = document.createElement("img");
    layerA.className = "reel-img";
    layerB.className = "reel-img";
    layerA.alt = "";
    layerB.alt = "";
    reel.appendChild(layerA);
    reel.appendChild(layerB);

    var caption = document.createElement("div");
    caption.className = "reel-caption";
    reel.appendChild(caption);

    var order = shuffleArray(PHOTOS);
    var index = 0;
    var activeIsA = true;

    function showNext() {
      var photo = order[index % order.length];
      index++;
      var incoming = activeIsA ? layerB : layerA;
      var outgoing = activeIsA ? layerA : layerB;
      incoming.src = photo.src;
      incoming.alt = photo.alt;
      incoming.style.transform = "scale(1.16)";
      incoming.classList.remove("active");
      void incoming.offsetWidth;
      requestAnimationFrame(function () {
        incoming.classList.add("active");
        incoming.style.transform = "scale(1)";
      });
      outgoing.classList.remove("active");
      caption.textContent = photo.caption;
      caption.classList.remove("show");
      requestAnimationFrame(function () {
        caption.classList.add("show");
      });
      activeIsA = !activeIsA;
    }

    showNext();
    if (!reduceMotion) {
      setInterval(showNext, 3400);
    }
  })();

  // ---------- Pyramid gallery + shuffle + tilt + lightbox ----------
  (function pyramidGallery() {
    var pyramid = document.getElementById("pyramid");
    if (!pyramid) return;

    function computeRowSizes(total) {
      var rows = [];
      var remaining = total;
      var row = 1;
      while (remaining > 0) {
        var take = Math.min(row, remaining);
        rows.push(take);
        remaining -= take;
        row++;
      }
      return rows;
    }
    var ROW_SIZES = computeRowSizes(PHOTOS.length);

    function attachTilt(frame) {
      if (reduceMotion || frame.dataset.tiltWired) return;
      frame.dataset.tiltWired = "1";
      frame.addEventListener("mousemove", function (e) {
        var rect = frame.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width;
        var relY = (e.clientY - rect.top) / rect.height;
        var rotY = (relX - 0.5) * 18;
        var rotX = (0.5 - relY) * 18;
        frame.style.transform =
          "perspective(700px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg) translateY(-6px) scale(1.05)";
      });
      frame.addEventListener("mouseleave", function () {
        frame.style.transform = "";
      });
    }

    var lb = document.getElementById("lightbox");
    var lbImg = document.getElementById("lightboxImg");
    var lbCaption = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    var lightboxWired = false;

    function sparkleBurst(x, y) {
      if (reduceMotion) return;
      var count = 10;
      for (var i = 0; i < count; i++) {
        var s = document.createElement("span");
        s.className = "sparkle";
        var angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        var dist = 40 + Math.random() * 50;
        s.style.left = x + "px";
        s.style.top = y + "px";
        s.style.setProperty("--sx", (Math.cos(angle) * dist).toFixed(1) + "px");
        s.style.setProperty("--sy", (Math.sin(angle) * dist).toFixed(1) + "px");
        document.body.appendChild(s);
        (function (el) {
          setTimeout(function () {
            el.remove();
          }, 750);
        })(s);
      }
    }

    function openLightbox(frame) {
      var img = frame.querySelector("img");
      var caption = frame.querySelector("figcaption");
      var rect = frame.getBoundingClientRect();
      sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = caption ? caption.textContent : "";
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      closeBtn.focus();
    }

    function closeLightbox() {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      lbImg.src = "";
    }

    function buildFrame(photo, rowIndex) {
      var figure = document.createElement("figure");
      figure.className = "frame reveal-child in-view" + (photo.featured ? " frame-featured" : "");
      figure.setAttribute("tabindex", "0");
      figure.setAttribute("role", "button");
      figure.style.setProperty("--tilt", (Math.random() * 4 - 2).toFixed(2) + "deg");
      var width = Math.max(110, 250 - rowIndex * 24);
      figure.style.setProperty("--frame-w", width + "px");
      figure.style.setProperty("--frame-fs", Math.max(0.68, 0.95 - rowIndex * 0.05) + "rem");

      var inner = document.createElement("div");
      inner.className = "frame-inner";
      figure.appendChild(inner);

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = "lazy";
      inner.appendChild(img);

      if (photo.featured) {
        var ribbon = document.createElement("span");
        ribbon.className = "frame-ribbon";
        ribbon.textContent = "just in";
        inner.appendChild(ribbon);
      }

      var caption = document.createElement("figcaption");
      caption.textContent = photo.caption;
      inner.appendChild(caption);

      attachTilt(figure);
      figure.addEventListener("click", function () {
        openLightbox(figure);
      });
      figure.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(figure);
        }
      });

      return figure;
    }

    function renderPyramid(order) {
      pyramid.innerHTML = "";
      var idx = 0;
      ROW_SIZES.forEach(function (count, rowIndex) {
        var row = document.createElement("div");
        row.className = "pyramid-row";
        row.setAttribute("data-row", String(rowIndex + 1));
        for (var i = 0; i < count && idx < order.length; i++, idx++) {
          row.appendChild(buildFrame(order[idx], rowIndex));
        }
        pyramid.appendChild(row);
      });
    }

    var currentOrder = PHOTOS.slice();
    renderPyramid(currentOrder);

    if (!lightboxWired && lb) {
      lightboxWired = true;
      closeBtn.addEventListener("click", closeLightbox);
      lb.addEventListener("click", function (e) {
        if (e.target === lb) closeLightbox();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeLightbox();
      });
    }

    var shuffleBtn = document.getElementById("shuffleBtn");
    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", function () {
        var frames = pyramid.querySelectorAll(".frame");
        frames.forEach(function (f) {
          f.classList.add("shuffling");
        });
        setTimeout(function () {
          currentOrder = shuffleArray(currentOrder);
          renderPyramid(currentOrder);
        }, 260);
      });
    }
  })();

  // ---------- Party scene bunting (wish page) ----------
  (function wishBunting() {
    var el = document.getElementById("wishBunting");
    if (!el) return;
    buildBunting(el, ["HAPPY BIRTHDAY"]);
  })();

  // ---------- Candle: make a wish ----------
  (function candle() {
    var btn = document.getElementById("blowBtn");
    var flame = document.getElementById("flame");
    var note = document.getElementById("wishNote");
    if (!btn) return;
    var lit = true;
    btn.addEventListener("click", function () {
      if (lit) {
        flame.classList.add("out");
        note.classList.add("show");
        btn.textContent = "light it again";
        lit = false;
      } else {
        flame.classList.remove("out");
        note.classList.remove("show");
        btn.textContent = "blow it out";
        lit = true;
      }
    });
  })();

  // ---------- Heart flip (celebrate finale) ----------
  (function heartFlip() {
    var heart = document.getElementById("heartFlip");
    if (!heart) return;
    heart.addEventListener("click", function () {
      heart.classList.toggle("flipped");
    });
    heart.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        heart.classList.toggle("flipped");
      }
    });
  })();

  // ---------- Love collage (celebrate finale) ----------
  (function loveCollage() {
    var wrap = document.getElementById("loveCollage");
    if (!wrap) return;

    var found = shuffleArray(PHOTOS);

    var layout = [
      { left: "3%", top: "0%", rot: -7 },
      { left: "36%", top: "0%", rot: 5 },
      { left: "69%", top: "0%", rot: -4 },
      { left: "15%", top: "17%", rot: 6 },
      { left: "48%", top: "17%", rot: -6 },
      { left: "70%", top: "17%", rot: 4 },
      { left: "3%", top: "34%", rot: -5 },
      { left: "36%", top: "34%", rot: 7 },
      { left: "69%", top: "34%", rot: -3 },
      { left: "15%", top: "51%", rot: 5 },
      { left: "48%", top: "51%", rot: -4 },
      { left: "70%", top: "51%", rot: 6 },
      { left: "3%", top: "68%", rot: -6 },
      { left: "36%", top: "68%", rot: 4 },
      { left: "69%", top: "68%", rot: -5 },
      { left: "18%", top: "85%", rot: 6 },
      { left: "52%", top: "85%", rot: -4 }
    ];

    found.forEach(function (photo, i) {
      var pos = layout[i % layout.length];
      var img = document.createElement("img");
      img.className = "collage-photo";
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = "lazy";
      img.style.left = pos.left;
      img.style.top = pos.top;
      img.style.setProperty("--rot", pos.rot + "deg");
      img.style.animationDelay = i * 0.4 + "s";
      wrap.appendChild(img);
    });
  })();

  // ---------- Confetti celebration ----------
  (function confetti() {
    var btn = document.getElementById("confettiBtn");
    var canvas = document.getElementById("confettiCanvas");
    if (!btn || !canvas) return;
    var ctx = canvas.getContext("2d");
    var pieces = [];
    var colors = ["#e8a35c", "#f0c78a", "#c9455f", "#f4ecdf", "#8a95b0"];
    var running = false;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function burst() {
      resize();
      pieces = [];
      var count = reduceMotion ? 0 : 90;
      for (var i = 0; i < count; i++) {
        pieces.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 9,
          vy: Math.random() * -8 - 2,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          life: 0
        });
      }
      if (!running && pieces.length) {
        running = true;
        requestAnimationFrame(tick);
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      for (var i = 0; i < pieces.length; i++) {
        var p = pieces[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28;
        p.rotation += p.spin;
        if (p.life < 160) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, 1 - p.life / 160);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      }
      if (alive) {
        requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    btn.addEventListener("click", burst);
    window.addEventListener("resize", resize);
    resize();
  })();

  // ---------- Reveal the arc-hero heart after pressing celebrate ----------
  (function revealArcHero() {
    var btn = document.getElementById("confettiBtn");
    var arcHero = document.getElementById("arcHero");
    if (!btn || !arcHero) return;
    btn.addEventListener("click", function () {
      arcHero.classList.add("revealed");
    });
  })();

  // ---------- Music control ----------
  (function music() {
    var audio = document.getElementById("bgMusic");
    var toggle = document.getElementById("musicToggle");
    if (!audio || !toggle) return;

    function updateIcon() {
      toggle.classList.toggle("playing", !audio.paused);
    }

    audio.volume = 0.55;

    var continuousKey = audio.getAttribute("data-continuous-key");
    if (continuousKey) {
      var storageKey = "music-progress-" + continuousKey;
      var isReload = false;
      try {
        var navEntries = performance.getEntriesByType("navigation");
        isReload = (navEntries.length && navEntries[0].type === "reload") ||
          (performance.navigation && performance.navigation.type === 1);
      } catch (e) {}

      if (isReload) {
        localStorage.removeItem(storageKey);
      } else {
        try {
          var saved = JSON.parse(localStorage.getItem(storageKey) || "null");
          if (saved) {
            var elapsed = (Date.now() - saved.savedAt) / 1000;
            var resumeAt = saved.time + elapsed;
            audio.addEventListener(
              "loadedmetadata",
              function () {
                if (resumeAt < audio.duration - 0.5) {
                  audio.currentTime = resumeAt;
                } else {
                  localStorage.removeItem(storageKey);
                }
              },
              { once: true }
            );
          }
        } catch (e) {}
      }

      function saveProgress() {
        try {
          localStorage.setItem(storageKey, JSON.stringify({ time: audio.currentTime, savedAt: Date.now() }));
        } catch (e) {}
      }
      window.addEventListener("pagehide", saveProgress);
      document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") saveProgress();
      });
    }

    var gatedByEnvelope = !!document.getElementById("envelopeBtn");
    if (!gatedByEnvelope) {
      audio.play().catch(function () {});
    }
    updateIcon();

    toggle.addEventListener("click", function () {
      if (audio.paused) {
        audio.play().catch(function () {});
      } else {
        audio.pause();
      }
    });
    audio.addEventListener("play", updateIcon);
    audio.addEventListener("pause", updateIcon);
  })();

  // ---------- Bunting banner builder (shared: envelope launch + wish scene) ----------
  function buildBunting(container, lines) {
    var colorless = 0;
    lines.forEach(function (line) {
      var row = document.createElement("div");
      row.className = "bunting-line";
      line.replace(/\s+/g, "").split("").forEach(function (ch, i) {
        var flag = document.createElement("span");
        flag.className = "bunting-flag";
        flag.textContent = ch;
        flag.style.animationDelay = (colorless + i) * 0.05 + "s";
        row.appendChild(flag);
      });
      colorless += line.length;
      container.appendChild(row);
    });
  }

  // ---------- Persistent bunting header (every page) ----------
  (function persistentBunting() {
    document.querySelectorAll(".page-bunting").forEach(function (el) {
      buildBunting(el, ["HAPPY BIRTHDAY", "PANDULU"]);
    });
  })();

  // ---------- Gate: open the envelope, launch balloons from it, move to the next page ----------
  (function gate() {
    var gateEl = document.getElementById("gate");
    var envelopeBtn = document.getElementById("envelopeBtn");
    if (!gateEl || !envelopeBtn) return;
    var opened = false;
    var launch = document.getElementById("balloonLaunch");

    var LAUNCH_TEXTS = ["Happy Birthday Mo Pageli", "Happy Birthday Mo Gharamani"];
    var BALLOON_COLORS = ["", "c-rose", "c-dusk"];

    function runLaunch(done) {
      if (!launch || reduceMotion) {
        done();
        return;
      }

      var originRect = envelopeBtn.getBoundingClientRect();
      var originX = originRect.left + originRect.width / 2;
      var originY = originRect.top + originRect.height / 2;

      var items = shuffleArray(LAUNCH_TEXTS.map(function (t) {
        return { type: "text", value: t };
      }));

      items.forEach(function (item, i) {
        var balloon = document.createElement("div");
        balloon.className = "launch-balloon " + item.type + " " + BALLOON_COLORS[i % BALLOON_COLORS.length];
        balloon.textContent = item.value;

        balloon.style.left = originX + "px";
        balloon.style.top = originY + "px";

        var spread = (i - (items.length - 1) / 2) * 60 + (Math.random() * 40 - 20);
        var riseHeight = window.innerHeight * 1.15 + Math.random() * 150;
        balloon.style.setProperty("--dx", spread.toFixed(0) + "px");
        balloon.style.setProperty("--dy", "-" + riseHeight.toFixed(0) + "px");
        balloon.style.setProperty("--tilt", (Math.random() * 12 - 6).toFixed(1) + "deg");
        balloon.style.setProperty("--tilt2", (Math.random() * 12 - 6).toFixed(1) + "deg");

        var clusterAngle = (i / items.length) * Math.PI * 2;
        var clusterRadius = 34 + Math.random() * 22;
        var cx = Math.cos(clusterAngle) * clusterRadius;
        var cy = -60 + Math.sin(clusterAngle) * clusterRadius * 0.6;
        balloon.style.setProperty("--cx", cx.toFixed(0) + "px");
        balloon.style.setProperty("--cy", cy.toFixed(0) + "px");

        var stringLen = 22 + Math.abs(cy) * 0.2;
        var stringRot = Math.max(-22, Math.min(22, -cx * 0.35));
        balloon.style.setProperty("--string-len", stringLen.toFixed(0) + "px");
        balloon.style.setProperty("--string-rot", stringRot.toFixed(1) + "deg");

        var gatherDuration = 0.6;
        var gatherDelay = i * 0.06;
        var hold = 0.3;
        var riseDuration = 6 + Math.random() * 2;
        var releaseDelay = i * 1;
        var riseDelay = gatherDelay + gatherDuration + hold + releaseDelay;

        balloon.style.animationDuration = gatherDuration + "s, " + riseDuration + "s";
        balloon.style.animationDelay = gatherDelay + "s, " + riseDelay + "s";
        launch.appendChild(balloon);
      });

      setTimeout(function () {
        launch.innerHTML = "";
        done();
      }, 9200);
    }

    envelopeBtn.addEventListener("click", function () {
      if (opened) return;
      opened = true;
      envelopeBtn.classList.add("open");
      setHeartCursor();
      var bgAudio = document.getElementById("bgMusic");
      if (bgAudio) {
        bgAudio.play().catch(function () {});
      }
      setTimeout(function () {
        runLaunch(function () {
          setTimeout(function () {
            window.location.href = envelopeBtn.getAttribute("data-next") || "hero.html";
          }, 250);
        });
      }, 500);
    });
  })();
})();
