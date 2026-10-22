/* ==========================================================================
   Chainseer — motion engine (static edition)
   One clock: GSAP ticker drives Lenis and ScrollTrigger. Fetch-based page
   transitions between the static pages. Works with JS off; reduced motion
   gets a calm, complete page.
   ========================================================================== */
(function () {
  "use strict";

  var html = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasMotion = html.classList.contains("motion");
  var EASE_OUT = "expo.out";
  var EASE_GATE = "expo.inOut";
  var pageCleanups = [];

  /* ------------------------------------------------------------ engine */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  var lenis = null;
  function initScroll() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.1, touchMultiplier: 1.2, anchors: true });
    lenis.on("scroll", function () { ScrollTrigger.update(); });
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  function stopScroll() { if (lenis) lenis.stop(); }
  function startScroll() { if (lenis) lenis.start(); }
  function jumpTop() {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------ reveals */
  /* One standard mechanism for everything: an explicit from/state and an
     explicit to/state, driven by a ScrollTrigger. Intro elements get
     "top bottom" so they fire immediately at boot. */
  function initReveals() {
    if (!hasMotion) return;
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var isIntro = el.hasAttribute("data-intro");
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        onSplit: function (self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.15,
            stagger: 0.09,
            ease: EASE_OUT,
            delay: delay,
            scrollTrigger: { trigger: el, start: isIntro ? "top bottom" : "top 88%", once: true },
          });
        },
      });
    });

    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      var kind = el.getAttribute("data-reveal") || "up";
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      var isIntro = el.hasAttribute("data-intro");
      var isClip = kind === "clip";
      var from = isClip
        ? { clipPath: "inset(0% 0% 100% 0%)" }
        : { y: 42, autoAlpha: 0 };
      var to = isClip
        ? { clipPath: "inset(0% 0% 0% 0%)" }
        : { y: 0, autoAlpha: 1 };
      gsap.set(el, { visibility: "visible" });
      /* from AND to are both explicit: `to` is merged into the vars object. */
      gsap.fromTo(el, from, Object.assign({}, to, {
        duration: isClip ? 1.2 : 1.1,
        ease: EASE_OUT,
        delay: delay,
        onStart: function () { el.classList.add("is-shown"); },
        scrollTrigger: { trigger: el, start: isIntro ? "top bottom" : "top 90%", once: true },
      }));
    });
    return true;
  }

  /* --------------------------------------------------------------- hero */
  function initHero() {
    if (!hasMotion) return;

    /* scan countdown: the idle heart of the page. One clock, pauses off screen. */
    var scan = document.querySelector("[data-scan]");
    if (scan) {
      var value = { v: 15 };
      var running = false;
      var lastStep = 0;
      var tick = function (time) {
        if (time - lastStep >= 1) {
          lastStep = time;
          value.v = value.v <= 0 ? 15 : value.v - 1;
          scan.textContent = value.v;
        }
      };
      var setRunning = function (on) {
        if (on === running) return;
        running = on;
        if (on) gsap.ticker.add(tick);
        else gsap.ticker.remove(tick);
      };
      ScrollTrigger.create({
        trigger: scan,
        start: "top bottom",
        end: "bottom top",
        onToggle: function (self) { setRunning(self.isActive); },
      });
    }

    /* stat counters (real numbers, counted once) */
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target,
        duration: 1.4,
        ease: EASE_OUT,
        snap: { textContent: 1 },
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });
  }

  /* --------------------------------------------------------------- sieve */
  function initSieve() {
    var inner = document.querySelector(".sieve-inner");
    if (!inner || !hasMotion) return;

    var mm = gsap.matchMedia();
    mm.add("(min-width: 941px)", function () {
      var rows = gsap.utils.toArray(".sieve-board .s-row");
      if (rows.length < 2) return;
      var rejects = rows.slice(0, -1);
      var survivor = rows[rows.length - 1];
      var screened = document.querySelector("[data-n-screened]");
      var sent = document.querySelector("[data-n-sent]");
      var delivered = document.querySelector(".sieve-delivered");
      var gateWord = document.querySelector("[data-gate-word]");

      gsap.set(rejects, { top: function (i) { return "calc(" + i + " * 3.05rem)"; } });
      gsap.set(survivor, { top: "calc(" + rejects.length + " * 3.05rem)" });
      gsap.set(rows, { yPercent: 230, autoAlpha: 0 });

      var tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: inner,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      rejects.forEach(function (row, i) {
        var pos = i * 0.9;
        tl.fromTo(row, { yPercent: 230, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.42 }, pos);
        tl.to(row.querySelector(".strike"), { scaleX: 1, duration: 0.22, ease: "power1.in" }, pos + 0.34);
        tl.to(row, { opacity: 0.32, duration: 0.24 }, pos + 0.4);
        tl.call(function () {
          if (screened) screened.textContent = i + 1;
          if (gateWord) gateWord.textContent = row.getAttribute("data-reason");
        }, null, pos + 0.45);
      });

      var sPos = rejects.length * 0.9 + 0.2;
      tl.fromTo(survivor, { yPercent: 230, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5 }, sPos);
      tl.to(survivor, { y: "+=16vh", duration: 0.7, ease: "power1.inOut" }, sPos + 0.75);
      tl.call(function () {
        if (gateWord) gateWord.textContent = "passed";
        if (screened) screened.textContent = rejects.length + 1;
      }, null, sPos + 0.8);
      tl.fromTo(delivered, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, sPos + 1.4);
      tl.call(function () { if (sent) sent.textContent = "1"; }, null, sPos + 1.45);
    });
  }

  /* --------------------------------------------------------- score bars */
  function initScoreBars() {
    if (!hasMotion) return;
    document.querySelectorAll(".score-fill").forEach(function (bar) {
      var card = bar.closest(".tcard");
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: 1,
        duration: 1.3,
        ease: EASE_OUT,
        scrollTrigger: { trigger: card || bar, start: "top 85%", once: true },
      });
    });
  }

  /* ------------------------------------------------- header (bound once) */
  function initHeaderState() {
    var update = function () {
      var header = document.querySelector(".site-header");
      if (header) header.classList.toggle("is-scrolled", (window.scrollY || 0) > 12);
    };
    update();
    if (lenis) lenis.on("scroll", update);
    else window.addEventListener("scroll", update, { passive: true });
  }

  /* section links marked as current while their section is in view */
  function initSectionSpy() {
    if (!("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
    if (!links.length) return;
    var map = {};
    links.forEach(function (link) {
      var hash = link.getAttribute("href").split("#")[1];
      var section = hash && document.getElementById(hash);
      if (section) map[hash] = link;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        var active = map[entry.target.id];
        if (active) active.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    pageCleanups.push(function () { observer.disconnect(); });
  }

  /* legal table of contents spy */
  function initTocSpy() {
    if (!("IntersectionObserver" in window)) return;
    var toc = document.querySelector(".legal-toc");
    if (!toc) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) map[section.id] = link;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-active"); });
        var active = map[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-15% 0px -70% 0px" });
    Object.keys(map).forEach(function (id) { observer.observe(document.getElementById(id)); });
    pageCleanups.push(function () { observer.disconnect(); });
  }

  /* ------------------------------------------------------- menu (docs once) */
  var menuDocsBound = false;
  function closeMenu() {
    var button = document.getElementById("menu-btn");
    var menu = document.getElementById("menu");
    if (!menu) return;
    menu.classList.remove("is-open");
    if (button) {
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open menu");
    }
    startScroll();
  }
  function bindMenuDocs() {
    if (menuDocsBound) return;
    menuDocsBound = true;
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      var menu = document.getElementById("menu");
      if (menu && menu.classList.contains("is-open")) {
        var button = document.getElementById("menu-btn");
        closeMenu();
        if (button) button.focus();
      }
    });
    document.addEventListener("click", function (event) {
      var menu = document.getElementById("menu");
      if (!menu || !menu.classList.contains("is-open")) return;
      if (menu.contains(event.target)) return;
      var button = document.getElementById("menu-btn");
      if (button && button.contains(event.target)) return;
      closeMenu();
    });
  }
  function initMenu() {
    var button = document.getElementById("menu-btn");
    var menu = document.getElementById("menu");
    if (!button || !menu) return;
    bindMenuDocs();
    button.addEventListener("click", function () {
      if (button.getAttribute("aria-expanded") === "true") {
        closeMenu();
      } else {
        menu.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "Close menu");
        stopScroll();
        var first = menu.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      }
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
  }

  /* --------------------------------------------------------------- copy */
  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2200);
  }
  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }
  function initCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var source = document.getElementById(button.getAttribute("data-copy"));
        if (!source) return;
        var text = source.textContent.trim();
        var done = function (ok) {
          if (!ok) return showToast("Copy failed, select the address manually");
          button.textContent = "Copied";
          showToast("Contract address copied");
          window.setTimeout(function () { button.textContent = "Copy"; }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
        } else {
          done(fallbackCopy(text));
        }
      });
    });
  }

  /* --------------------------------------------------------------- year */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* -------------------------------------------------------- transitions */
  var curtain = document.getElementById("curtain");
  var panel = curtain ? curtain.querySelector(".curtain__panel") : null;
  var busy = false;

  function cover() {
    if (!curtain) return Promise.resolve();
    if (!hasMotion) {
      return gsap.timeline()
        .set(curtain, { autoAlpha: 1, visibility: "visible" })
        .fromTo(curtain, { opacity: 0 }, { opacity: 1, duration: 0.2 })
        .then();
    }
    return new Promise(function (resolve) {
      gsap.timeline({ onComplete: resolve })
        .set(curtain, { autoAlpha: 1, visibility: "visible" })
        .fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: EASE_GATE });
    });
  }
  function uncover() {
    if (!curtain) return Promise.resolve();
    if (!hasMotion) {
      return gsap.timeline()
        .to(curtain, { opacity: 0, duration: 0.2 })
        .set(curtain, { autoAlpha: 0, visibility: "hidden" })
        .then();
    }
    return new Promise(function (resolve) {
      gsap.timeline({ onComplete: resolve })
        .to(panel, { yPercent: 100, duration: 0.8, ease: EASE_GATE })
        .set(curtain, { autoAlpha: 0, visibility: "hidden" });
    });
  }

  function fetchDoc(href) {
    return fetch(href, { headers: { "X-Requested-With": "chainseer" } })
      .then(function (res) {
        if (!res.ok) throw new Error("http " + res.status);
        return res.text();
      })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, "text/html");
        if (!doc.querySelector("#page")) throw new Error("no page");
        return doc;
      });
  }

  function swapDoc(doc) {
    var next = doc.querySelector("#page");
    var here = document.getElementById("page");
    if (next && here) here.innerHTML = next.innerHTML;
    document.title = doc.title;
    var desc = doc.querySelector('meta[name="description"]');
    var hereDesc = document.querySelector('meta[name="description"]');
    if (desc && hereDesc) hereDesc.setAttribute("content", desc.getAttribute("content"));
    var canon = doc.querySelector('link[rel="canonical"]');
    var hereCanon = document.querySelector('link[rel="canonical"]');
    if (canon && hereCanon && canon.getAttribute("href")) hereCanon.setAttribute("href", canon.getAttribute("href"));
  }

  function initPage() {
    pageCleanups.splice(0).forEach(function (fn) { try { fn(); } catch (err) { /* keep going */ } });
    var ctx = gsap.context(function () {
      initReveals();
      initHero();
      initSieve();
      initScoreBars();
      initSectionSpy();
      initTocSpy();
      initMenu();
      initCopy();
      initYear();
    });
    pageCleanups.push(function () { ctx.revert(); });

    /* mark the current page in the header */
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll('#page a[href$=".html"], #page a[href="index.html"]').forEach(function (a) {
      if (a.hasAttribute("data-telegram")) return;
      var href = a.getAttribute("href").split("#")[0];
      a.removeAttribute("aria-current");
      if (href === path && a.closest(".site-nav")) a.setAttribute("aria-current", "page");
    });

    requestAnimationFrame(function () { ScrollTrigger.refresh(); });
  }

  function navigate(href) {
    if (busy) return;
    busy = true;
    var hash = href.split("#")[1] || "";
    var fetchP = fetchDoc(href.split("#")[0]).catch(function () {
      window.location.href = href; /* graceful fallback */
      return null;
    });
    var coverP = cover();
    Promise.all([fetchP, coverP]).then(function (results) {
      if (!results[0]) { busy = false; return; }
      swapDoc(results[0]);
      displayedPath = location.pathname;
      var target = hash ? document.getElementById(hash) : null;
      if (target) {
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
        else target.scrollIntoView();
      } else {
        jumpTop();
      }
      var intro = initPage();
      busy = false;
      return uncover();
    }).catch(function () { busy = false; });
  }

  function transitionsSupported() {
    return "fetch" in window && "DOMParser" in window && location.protocol.indexOf("http") === 0;
  }

  function initTransitions() {
    document.addEventListener("click", function (event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var link = event.target.closest("a");
      if (!link || !link.origin || link.origin !== location.origin) return;
      if (link.hasAttribute("data-telegram") || link.hasAttribute("download") || link.target === "_blank") return;
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      if (link.pathname === location.pathname) {
        if (link.hash) return; /* same page anchor: the scroll engine handles it */
      }
      var isPage = /\.html$/i.test(link.pathname) || link.pathname.charAt(link.pathname.length - 1) === "/";
      if (isPage) {
        event.preventDefault();
        var path = link.pathname + link.hash;
        history.pushState({ path: path }, "", link.href);
        navigate(path);
      }
    });
    window.addEventListener("popstate", function () {
      if (busy) return;
      /* A fragment-only traversal (browser pushes hash state on anchor links)
         fires popstate with the same pathname. The scroll engine already owns
         that change; re-swapping the document mid-glide would reset to the top. */
      if (location.pathname === displayedPath) {
        var frag = location.hash.slice(1);
        var fragTarget = frag && document.getElementById(frag);
        if (fragTarget) {
          if (lenis) lenis.scrollTo(fragTarget, { force: true });
          else fragTarget.scrollIntoView();
        }
        return;
      }
      navigate(location.pathname);
    });
  }

  /* the path currently rendered by #page; kept in step by swaps so the
     popstate handler can tell a full cross-page restore from a fragment push */
  var displayedPath = location.pathname;

  function boot() {
    initScroll();
    stopScroll();
    initHeaderState();
    initPage();
    if (transitionsSupported()) initTransitions();
    startScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
