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
    var pitchRow = document.getElementById("pitch-row");
    if (pitchRow) pitchRow.hidden = input.shape === "flat";
    var thRow = document.getElementById("thickness-row");
    if (thRow) thRow.hidden = S.profiles[input.profile].unit !== "sheet";

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

    var h = '<div class="card result-card">';
    h += '<span class="eyebrow">Your estimate</span>';
    h += '<div class="big">' + fmt(r.roofArea) + ' m²</div><p class="disclaimer" style="margin-top:6px">Roof size, including ' + fmt(r.inputs.overhang, 2) + ' m overhang · ' + shapeName + ' roof, ' + fmt(r.inputs.pitchDeg, 0) + '° · floor plan ' + fmt(r.planArea) + ' m²</p>';

    if (r.price) {
      h += '<div class="price-box"><span>Materials cost (estimate)</span><strong>' + naira(r.price.low) + " – " + naira(r.price.high) + '</strong><small>Using our prices from ' + r.price.asOf + '. Workmanship and transport are added in the quotation.</small></div>';
    }

    h += '<h3>Materials</h3><table>';
    if (r.sheets) {
      h += row(matName, r.sheets.exact ? r.sheets.count + " sheets × " + fmt(r.sheets.lengthM) + " m = " + fmt(r.sheets.totalM) + " m" : fmt(r.sheets.totalM) + " m");
    }
    if (r.tiles) h += row(matName, fmt(r.tiles.count, 0) + " tiles");
    if (r.lines.ridgeCaps) h += row("Ridge cap" + (r.lines.hips ? " (ridge + hips)" : ""), fmt(r.lines.ridgeCaps) + " m");
    if (r.lines.verge) h += row("Barge board", fmt(r.lines.verge) + " m");
    h += row("Fascia cladding", fmt(r.lines.eaves) + " m");
    h += row("Eaves angle", fmt(r.lines.eaves) + " m");
    h += row("Gutter (if needed)", fmt(r.lines.gutter) + " m");
    h += "</table>";
    r.notes.forEach(function (n) { h += '<p class="disclaimer">' + n + "</p>"; });

    if (isSheet) {
      h += '<h3>Screws and sealant</h3><table>';
      h += row("Drive screws", r.fixings.screwPackets + " packets");
      h += row("Seam bolts", r.fixings.seamBoltPackets + " packets");
      h += row("Rivet nails", r.fixings.rivetPackets + " packets");
      h += row("Silicone sealant", r.fixings.siliconeTubes + " tubes");
      h += row("Flash band", r.fixings.flashBandRolls + " roll");
      h += "</table>";
    }

    h += '<h3>Wood (rough guide)</h3><table>';
    h += row("Rafters (" + r.timber.rafters.size + ")", fmt(r.timber.rafters.pieces, 0) + " pcs");
    h += row("Purlins (" + r.timber.purlins.size + ")", fmt(r.timber.purlins.pieces, 0) + " pcs");
    h += row("Wall plate (" + r.timber.wallPlate.size + ")", fmt(r.timber.wallPlate.pieces, 0) + " pcs");
    h += "</table><p class='disclaimer'>Counted in 12 ft lengths. Truss members and wall flashing depend on your building, so we confirm them on site.</p>";

    if (!r.price) h += "<h3>Price</h3><p>Send this to HolyTouch on WhatsApp and we will reply with a price.</p>";

    var msg = [
      "Hello HolyTouch, I used the roof calculator on your website.",
      "Building: " + fmt(r.inputs.L) + " m x " + fmt(r.inputs.W) + " m",
      "Roof: " + shapeName + ", " + fmt(r.inputs.pitchDeg, 0) + "°, overhang " + fmt(r.inputs.overhang, 2) + " m",
      "Material: " + matName,
      "Roof area: " + fmt(r.roofArea) + " m²",
      r.sheets ? "Sheets: " + fmt(r.sheets.totalM) + " m" : "Tiles: " + r.tiles.count,
      r.price ? "Materials estimate: " + naira(r.price.low) + " – " + naira(r.price.high) : "",
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
