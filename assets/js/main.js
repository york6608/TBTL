(function () {
  "use strict";

  var UI = {
    en: {
      "nav.home": "Home", "nav.about": "About", "nav.products": "Products",
      "nav.contact": "Contact", "nav.chat": "WhatsApp",
      "hero.chat": "Chat on WhatsApp", "hero.call": "Call Us",
      "modal.spec": "Specification", "modal.price": "Price",
      "modal.enquire": "Enquire on WhatsApp", "footer.rights": "All rights reserved",
      "contact.phone": "Phone", "contact.whatsapp": "WhatsApp", "contact.email": "Email",
      "contact.address": "Address", "contact.hours": "Opening Hours",
      "product.priceOnRequest": "Price on request", "products.empty": "No products in this category yet."
    },
    sw: {
      "nav.home": "Nyumbani", "nav.about": "Kuhusu", "nav.products": "Bidhaa",
      "nav.contact": "Wasiliana", "nav.chat": "WhatsApp",
      "hero.chat": "Piga soga WhatsApp", "hero.call": "Tupigie Simu",
      "modal.spec": "Vipimo", "modal.price": "Bei",
      "modal.enquire": "Uliza kwa WhatsApp", "footer.rights": "Haki zote zimehifadhiwa",
      "contact.phone": "Simu", "contact.whatsapp": "WhatsApp", "contact.email": "Barua pepe",
      "contact.address": "Anuani", "contact.hours": "Saa za Kazi",
      "product.priceOnRequest": "Bei kwa ombi", "products.empty": "Hakuna bidhaa katika kundi hili bado."
    }
  };

  var ICONS = {
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7.2-7.2a2 2 0 01-.6-1.4V4a2 2 0 012-2h8c.5 0 1 .2 1.4.6l6.4 6.4a2 2 0 010 2.8z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.6A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 6l10 7 10-7"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
  };

  var state = { lang: "en", site: null, categories: [], products: [], filter: "all" };

  function t(key) { return (UI[state.lang] && UI[state.lang][key]) || UI.en[key] || key; }
  function loc(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[state.lang] || obj.en || obj.sw || "";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function getJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("Failed to load " + url);
      return r.json();
    });
  }

  function waLink(number, text) {
    var n = String(number || "").replace(/[^0-9]/g, "");
    var base = "https://wa.me/" + n;
    return text ? base + "?text=" + encodeURIComponent(text) : base;
  }

  /* ---------- Rendering ---------- */

  function applyStaticI18n() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.documentElement.lang = state.lang;
  }

  function renderSite() {
    var s = state.site;
    if (s.brandColor) document.documentElement.style.setProperty("--brand", s.brandColor);
    if (s.brandColorDark) {
      document.documentElement.style.setProperty("--brand-dark", s.brandColorDark);
      document.documentElement.style.setProperty("--brand-ink", s.brandColorDark);
    }

    byId("logo").textContent = s.logoText || s.companyName;
    byId("heroTitle").textContent = loc(s.hero.title);
    byId("heroSubtitle").textContent = loc(s.hero.subtitle);
    byId("aboutTitle").textContent = loc(s.about.title);
    byId("aboutBody").textContent = loc(s.about.body);
    byId("productsTitle").textContent = loc(s.products.title);
    byId("productsSubtitle").textContent = loc(s.products.subtitle);
    byId("contactTitle").textContent = loc(s.contact.title);
    byId("contactSubtitle").textContent = loc(s.contact.subtitle);
    byId("footerName").textContent = s.companyName;
    byId("year").textContent = new Date().getFullYear();
    document.title = s.companyName + " | Tanzania";

    var c = s.contact;
    var waMsg = state.lang === "sw" ? "Habari, ninahitaji msaada kuhusu bidhaa zenu." : "Hello, I would like more information about your products.";
    var wa = waLink(c.whatsapp, waMsg);
    var tel = "tel:" + String(c.phone || "").replace(/\s+/g, "");
    setHref("headerWhatsApp", wa);
    setHref("heroWhatsApp", wa);
    setHref("heroCall", tel);
    setHref("contactWhatsApp", wa);
    setHref("contactCall", tel);
    setHref("fabWhatsApp", wa);

    byId("mapFrame").src = c.mapEmbed || "";

    renderHighlights();
    renderContactList();
  }

  function renderHighlights() {
    var wrap = byId("highlights");
    wrap.innerHTML = (state.site.about.highlights || []).map(function (h) {
      return '<div class="highlight"><div class="icon">' + (ICONS[h.icon] || ICONS.shield) +
        "</div><h3>" + esc(loc(h.title)) + "</h3><p>" + esc(loc(h.text)) + "</p></div>";
    }).join("");
  }

  function renderContactList() {
    var c = state.site.contact;
    var rows = [];
    if (c.phone) rows.push(item("phone", t("contact.phone"), esc(c.phone)));
    if (c.whatsapp) rows.push(item("phone", t("contact.whatsapp"), esc("+" + String(c.whatsapp).replace(/[^0-9]/g, ""))));
    if (c.email) rows.push(item("email", t("contact.email"), esc(c.email)));
    if (loc(c.address)) rows.push(item("pin", t("contact.address"), esc(loc(c.address))));
    if (loc(c.hours)) rows.push(item("clock", t("contact.hours"), esc(loc(c.hours))));
    byId("contactList").innerHTML = rows.join("");

    function item(icon, title, value) {
      return '<li><span class="ci">' + ICONS[icon] + '</span><span><span class="ct">' +
        title + '</span><br><span class="cv">' + value + "</span></span></li>";
    }
  }

  function catName(id) {
    var c = state.categories.filter(function (x) { return x.id === id; })[0];
    return c ? loc(c.name) : id;
  }

  function renderFilters() {
    var wrap = byId("filters");
    var html = '<button type="button" class="filter-btn' + (state.filter === "all" ? " active" : "") +
      '" data-cat="all">' + esc(loc(state.site.products.allLabel) || t("nav.products")) + "</button>";
    html += state.categories.map(function (c) {
      return '<button type="button" class="filter-btn' + (state.filter === c.id ? " active" : "") +
        '" data-cat="' + esc(c.id) + '">' + esc(loc(c.name)) + "</button>";
    }).join("");
    wrap.innerHTML = html;
    wrap.querySelectorAll(".filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.filter = btn.getAttribute("data-cat");
        renderFilters();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    var grid = byId("productGrid");
    var list = state.products.filter(function (p) {
      return state.filter === "all" || p.category === state.filter;
    });
    var note = byId("emptyNote");
    if (!list.length) {
      grid.innerHTML = "";
      note.hidden = false;
      note.textContent = t("products.empty");
      return;
    }
    note.hidden = true;
    grid.innerHTML = list.map(function (p, i) {
      var idx = state.products.indexOf(p);
      var badge = p.featured ? '<span class="badge">' + (state.lang === "sw" ? "Maarufu" : "Featured") + "</span>" : "";
      var price = p.price ? '<div class="card-price">' + esc(p.price) + "</div>" :
        '<div class="card-price" style="color:var(--muted);font-weight:600;font-size:14px">' + t("product.priceOnRequest") + "</div>";
      return '<article class="product-card" data-idx="' + idx + '">' +
        '<div class="thumb">' + badge + '<img loading="lazy" src="' + esc(p.image || "/assets/images/placeholder.svg") +
        '" alt="' + esc(loc(p.name)) + '"></div>' +
        '<div class="card-body"><span class="card-cat">' + esc(catName(p.category)) + "</span>" +
        "<h3>" + esc(loc(p.name)) + "</h3>" +
        '<p class="card-desc">' + esc(loc(p.desc)) + "</p>" + price + "</div></article>";
    }).join("");
    grid.querySelectorAll(".product-card").forEach(function (card) {
      card.addEventListener("click", function () {
        openModal(state.products[parseInt(card.getAttribute("data-idx"), 10)]);
      });
    });
  }

  /* ---------- Modal ---------- */

  function openModal(p) {
    if (!p) return;
    byId("modalImage").src = p.image || "/assets/images/placeholder.svg";
    byId("modalImage").alt = loc(p.name);
    byId("modalCategory").textContent = catName(p.category);
    byId("modalName").textContent = loc(p.name);
    byId("modalDesc").textContent = loc(p.desc);

    byId("modalSpec").textContent = p.spec || "";
    byId("modalSpecRow").style.display = p.spec ? "" : "none";
    byId("modalPrice").textContent = p.price || t("product.priceOnRequest");
    byId("modalPriceRow").style.display = "";

    var msg = (state.lang === "sw" ? "Habari, ninavutiwa na: " : "Hello, I am interested in: ") + loc(p.name);
    setHref("modalWhatsApp", waLink(state.site.contact.whatsapp, msg));

    byId("productModal").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    byId("productModal").hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- Language ---------- */

  function setLang(lang) {
    if (!UI[lang]) lang = "en";
    state.lang = lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    applyStaticI18n();
    if (state.site) {
      renderSite();
      renderFilters();
      renderProducts();
    }
  }

  function detectLang() {
    var saved;
    try { saved = localStorage.getItem("lang"); } catch (e) {}
    if (saved && UI[saved]) return saved;
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("sw") === 0) return "sw";
    if (state.site && state.site.defaultLang && UI[state.site.defaultLang]) return state.site.defaultLang;
    return "en";
  }

  /* ---------- Helpers ---------- */

  function byId(id) { return document.getElementById(id); }
  function setHref(id, href) { var el = byId(id); if (el) el.setAttribute("href", href); }

  /* ---------- Init ---------- */

  function bindEvents() {
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });

    var toggle = byId("menuToggle");
    var nav = byId("mainNav");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
    });

    byId("productModal").addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  function init() {
    bindEvents();
    Promise.all([
      getJSON("/data/site.json"),
      getJSON("/data/categories.json"),
      getJSON("/data/products.json")
    ]).then(function (res) {
      state.site = res[0];
      state.categories = (res[1] && res[1].categories) || [];
      state.products = (res[2] && res[2].products) || [];
      setLang(detectLang());
    }).catch(function (err) {
      console.error(err);
      var grid = byId("productGrid");
      if (grid) grid.innerHTML = '<p style="text-align:center;color:#b00">Could not load site data. If viewing locally, run a local web server (see README).</p>';
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
