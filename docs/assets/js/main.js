(function () {
  var WA = document.documentElement.getAttribute("data-wa");

  // Mobile menu
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Project filters
  var filters = document.querySelectorAll(".filters button");
  filters.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      filters.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      document.querySelectorAll("[data-tags]").forEach(function (card) {
        var show = f === "all" || card.getAttribute("data-tags").split("|").indexOf(f) !== -1;
        card.hidden = !show;
      });
    });
  });

  // Forms that open a pre-filled WhatsApp chat
  window.HTWhatsApp = function (text) {
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(text);
  };
  document.querySelectorAll("form[data-wa-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var title = form.getAttribute("data-wa-form");
      var lines = ["Hello HolyTouch, I got your contact from your website. " + title + "."];
      form.querySelectorAll("input, select, textarea").forEach(function (el) {
        if (!el.name || !el.value) return;
        if ((el.type === "radio" || el.type === "checkbox") && !el.checked) return;
        var label = form.querySelector('label[for="' + el.id + '"]');
        lines.push((label ? label.textContent.replace(/\s*\(.*\)\s*$/, "") : el.name) + ": " + el.value);
      });
      window.open(window.HTWhatsApp(lines.join("\n")), "_blank", "noopener");
    });
  });
})();
