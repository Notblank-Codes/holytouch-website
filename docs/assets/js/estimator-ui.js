(function () {
  var S = window.HT_SETTINGS;
  var form = document.getElementById("calc-form");
  var out = document.getElementById("calc-results");
  if (!form || !out) return;

  var pitch = form.querySelector("#pitch");
  var overhang = form.querySelector("#overhang");
  if (pitch && !pitch.value) pitch.value = S.defaultPitchDeg;
  if (overhang && !overhang.value) overhang.value = S.defaultOverhangM;

  function fmt(n, d) { return Number(n).toLocaleString("en-NG", { maximumFractionDigits: d == null ? 1 : d }); }
  function naira(n) { return "₦" + Number(Math.round(n)).toLocaleString("en-NG"); }
  function val(name) {
    var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]');
    return el ? el.value : "";
  }
  function row(a, b) { return "<tr><td>" + a + "</td><td>" + b + "</td></tr>"; }

  function render() {
    var input = {
      length: val("length"), width: val("width"), shape: val("shape"),
      pitch: val("pitch"), overhang: val("overhang"), profile: val("profile"), thickness: val("thickness"),
    };
    var rise = Number(val("rise"));
    var Lr = Number(input.length), Wr = Number(input.width);
    if (rise > 0 && Lr > 0 && Wr > 0 && input.shape !== "flat") {
      var run = Math.min(Lr, Wr) / 2;
      input.pitch = (Math.atan(rise / run) * 180 / Math.PI).toFixed(1);
      var pi = form.querySelector("#pitch"); if (pi) pi.value = Math.round(input.pitch);
    }
    var pitchRow = document.getElementById("pitch-row");
    if (pitchRow) pitchRow.hidden = input.shape === "flat";
    var thRow = document.getElementById("thickness-row");
    var woodOnly = val("scope") === "wood";
    if (thRow) thRow.hidden = woodOnly || S.profiles[input.profile].unit !== "sheet";
    var profRow = document.getElementById("profile-row");
    if (profRow) profRow.hidden = woodOnly;

    if (input.shape === "complex") {
      out.innerHTML = '<div class="card result-card"><span class="eyebrow">Complex roof</span><h2>Send us your plan</h2><p>For L-shaped roofs, valleys and roofs on more than one level, we work the materials out from your building plan. Send a picture of it on WhatsApp.</p>' +
        '<p style="margin-top:16px"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + window.HTWhatsApp("Hello HolyTouch, my roof is L-shaped or complex. I am sending my building plan.") + '">Send my plan on WhatsApp</a></p></div>';
      return;
    }
    if (!(Number(input.length) > 0) || !(Number(input.width) > 0)) {
      out.innerHTML = '<div class="card result-card empty"><span class="eyebrow">Your estimate</span><h2>Put in your measurements</h2><p>Type the length and width of the building to see the roof size, the materials and a rough materials cost.</p></div>';
      return;
    }
    var r;
    try { r = window.HTEstimate(input, S); } catch (e) {
      out.innerHTML = '<div class="card"><p class="error">' + e.message + "</p></div>"; return;
    }
    var P = S.profiles[r.inputs.profile];
    var isSheet = P.unit === "sheet";
    var shapeName = { gable: "Gable", hip: "Hip", flat: "Flat / low-slope" }[r.inputs.shape];
    var matName = P.label + (isSheet ? " " + r.inputs.thickness + " mm" : "");

    var scope = val("scope") || "both";
    var wantRoof = scope !== "wood", wantWood = scope !== "roof";
    var scopeName = { both: "Roofing and wood work", roof: "Roofing only", wood: "Wood work only" }[scope];

    var h = '<div class="card result-card">';
    h += '<span class="eyebrow">Your estimate · ' + scopeName + '</span>';
    h += '<p class="disclaimer" style="margin:2px 0 0">' + shapeName + ' roof, ' + fmt(r.inputs.pitchDeg, 0) + '° slope, ' + fmt(r.inputs.overhang, 2) + ' m overhang</p>';

    // ---- Price summary ----
    var rp = wantRoof ? r.price : null, wp = wantWood ? r.woodPrice : null;
    if (rp || wp) {
      h += '<div class="price-box"><span>Materials cost (estimate)</span><table class="price-table">';
      if (wantRoof) h += '<tr><td>Roofing</td><td>' + (rp ? naira(rp.low) + " – " + naira(rp.high) : "Ask us") + "</td></tr>";
      if (wantWood) h += '<tr><td>Wood work</td><td>' + (wp ? naira(wp.low) + " – " + naira(wp.high) : "Ask us") + "</td></tr>";
      if (wantRoof && wantWood && rp && wp) h += '<tr class="total"><td>Total</td><td>' + naira(rp.low + wp.low) + " – " + naira(rp.high + wp.high) + "</td></tr>";
      h += "</table><small>Using our prices from " + (rp || wp).asOf + ". Workmanship and transport are added in the quotation.</small></div>";
    }

    // ---- 1. Roofing ----
    if (wantRoof) {
      h += '<div class="est-block"><h3><span class="num">1</span> Roofing materials</h3><table>';
      if (r.sheets) h += row(matName, r.sheets.exact ? r.sheets.count + " sheets × " + fmt(r.sheets.lengthM) + " m = " + fmt(r.sheets.totalM) + " m" : fmt(r.sheets.totalM) + " m");
      if (r.tiles) h += row(matName, fmt(r.tiles.count, 0) + " tiles");
      if (r.lines.ridgeCaps) h += row("Ridge cap" + (r.lines.hips ? " (ridge + hips)" : ""), fmt(r.lines.ridgeCaps) + " m");
      if (r.lines.verge) h += row("Barge board", fmt(r.lines.verge) + " m");
      h += row("Fascia cladding", fmt(r.lines.eaves) + " m");
      h += row("Eaves angle", fmt(r.lines.eaves) + " m");
      if (isSheet) {
        h += row("Drive screws", r.fixings.screwPackets + " packets");
        h += row("Seam bolts", r.fixings.seamBoltPackets + " packets");
        h += row("Rivet nails", r.fixings.rivetPackets + " packets");
        h += row("Silicone sealant", r.fixings.siliconeTubes + " tubes");
        h += row("Flash band", r.fixings.flashBandRolls + " roll");
      }
      h += row("Gutter (if needed, priced separately)", fmt(r.lines.gutter) + " m");
      h += "</table>";
      if (rp) h += '<p class="subtotal">Roofing materials: <strong>' + naira(rp.low) + " – " + naira(rp.high) + "</strong></p>";
      r.notes.forEach(function (n) { h += '<p class="disclaimer">' + n + "</p>"; });
      h += "</div>";
    }

    // ---- 2. Wood work ----
    if (wantWood) {
      h += '<div class="est-block"><h3><span class="num">' + (wantRoof ? 2 : 1) + '</span> Wood work (carpentry)</h3><table>';
      r.timber.items.forEach(function (w) { h += row(w[0] + " (" + w[1] + ")", fmt(w[2], 0) + " pieces"); });
      h += "</table>";
      if (wp) h += '<p class="subtotal">Wood: <strong>' + naira(wp.low) + " – " + naira(wp.high) + "</strong></p>";
      h += "<p class='disclaimer'>Based on " + r.timber.trusses + " trusses, counted in 12 ft lengths. Nails and ceiling noggins are not included. We confirm the wood on site.</p></div>";
    }

    if (!rp && !wp) h += "<p>Send this to us on WhatsApp and we will reply with a price.</p>";

    var msg = [
      "Hello HolyTouch, I used the roof calculator on your website.",
      "Building: " + fmt(r.inputs.L) + " m x " + fmt(r.inputs.W) + " m",
      "Roof: " + shapeName + ", " + fmt(r.inputs.pitchDeg, 0) + "°, overhang " + fmt(r.inputs.overhang, 2) + " m",
      "I need: " + scopeName,
      wantRoof ? "Material: " + matName : "",
      "Roof size: " + fmt(r.roofArea) + " m²",
      wantRoof ? (r.sheets ? "Sheets: " + fmt(r.sheets.totalM) + " m" : "Tiles: " + r.tiles.count) : "",
      rp ? "Roofing materials estimate: " + naira(rp.low) + " – " + naira(rp.high) : "",
      wantWood ? "Wood: " + r.timber.items.map(function (w) { return w[2] + " " + w[1] + " (" + w[0].toLowerCase() + ")"; }).join(", ") : "",
      wp ? "Wood estimate: " + naira(wp.low) + " – " + naira(wp.high) : "",
      "Job type: " + val("job"),
      "Location: " + (val("location") || "(not given)"),
      "Please send me a quotation.",
    ].filter(Boolean).join("\n");
    h += '<div class="btn-row" style="margin-top:20px"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + window.HTWhatsApp(msg) + '">Send this to HolyTouch on WhatsApp</a></div>';
    h += '<p class="disclaimer" style="margin-top:14px">This is an estimate from the measurements you entered. We confirm everything on site before giving you a final price.</p>';
    h += "</div>";
    out.innerHTML = h;
  }

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
  render();
})();
