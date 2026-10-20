/* Chainseer — progressive enhancement only. The site works without this file. */
(function () {
  "use strict";

  var CONFIG = {
    // Replace with your real group link, e.g. https://t.me/+AbCdEfGhIjK
    telegramUrl: "https://t.me/chainseer"
  };

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js");

  /* ---------------------------------------------------------------- config */
  function applyConfig() {
    var links = document.querySelectorAll("[data-telegram]");
    for (var i = 0; i < links.length; i += 1) {
      if (CONFIG.telegramUrl) {
        links[i].setAttribute("href", CONFIG.telegramUrl);
      }
      links[i].setAttribute("target", "_blank");
      links[i].setAttribute("rel", "noopener noreferrer");
    }
  }

  /* ---------------------------------------------------------------- header */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ mobile nav */
  function initMenu() {
    var button = document.getElementById("menu-btn");
    var nav = document.getElementById("primary-nav");
    if (!button || !nav) return;

    function close() {
      nav.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Open menu");
    }

    button.addEventListener("click", function () {
      var open = button.getAttribute("aria-expanded") === "true";
      if (open) {
        close();
      } else {
        nav.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        button.setAttribute("aria-label", "Close menu");
      }
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        close();
        button.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !button.contains(event.target)) close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) close();
    });
  }

  /* -------------------------------------------------------------- reveal */
  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      var hidden = document.querySelectorAll(".reveal");
      for (var k = 0; k < hidden.length; k += 1) hidden[k].classList.add("is-visible");
      return;
    }

    var targets = document.querySelectorAll(
      ".section-head, .steps, .feature-grid, .loop, .telegram-panel, .faq, .final-cta, .risk-banner"
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    for (var i = 0; i < targets.length; i += 1) {
      var el = targets[i];
      el.classList.add("reveal");
      el.style.transitionDelay = ((i % 4) * 55) + "ms";
      observer.observe(el);
    }
  }

  /* -------------------------------------------------------------- counters */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      var duration = 900;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (counter) { observer.observe(counter); });
  }

  /* ---------------------------------------------------------- active nav */
  function initActiveNav() {
    if (!("IntersectionObserver" in window)) return;
    var links = document.querySelectorAll('.nav a[href^="#"]');
    if (!links.length) return;

    var map = {};
    links.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) map[id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.remove("is-active"); });
        var active = map[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  /* -------------------------------------------------------------- copy CA */
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
    var buttons = document.querySelectorAll("[data-copy]");
    for (var i = 0; i < buttons.length; i += 1) {
      buttons[i].addEventListener("click", function () {
        var source = document.getElementById(this.getAttribute("data-copy"));
        if (!source) return;
        var text = source.textContent.trim();
        var button = this;
        var original = button.textContent;

        function done(ok) {
          if (!ok) {
            showToast("Copy failed — select the address manually");
            return;
          }
          button.textContent = "Copied";
          showToast("Contract address copied");
          window.setTimeout(function () { button.textContent = original; }, 1600);
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () {
            done(fallbackCopy(text));
          });
        } else {
          done(fallbackCopy(text));
        }
      });
    }
  }

  /* ----------------------------------------------------------------- misc */
  function initMisc() {
    var year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());

    // Keep same-page anchors working when the file is opened from disk.
    document.addEventListener("click", function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (target.id === "main") {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
      if (history.replaceState) {
        try { history.replaceState(null, "", id); } catch (err) { /* file:// origins may refuse */ }
      }
    });
  }

  applyConfig();
  initHeader();
  initMenu();
  initReveal();
  initCounters();
  initActiveNav();
  initCopy();
  initMisc();
})();
