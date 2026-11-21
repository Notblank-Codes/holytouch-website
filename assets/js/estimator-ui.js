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
      out.innerHTML = '<div class="card result-card"><span class="eyebrow">Complex roof</span><h2>We will do the take-off for you</h2><p>L-shaped and T-shaped roofs, valleys and roofs on several levels need a proper take-off. Send us a photo of your building plan on WhatsApp and we will work out the quantities.</p>' +
        '<p style="margin-top:16px"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + window.HTWhatsApp("Hello HolyTouch Roofing, I have an L-shaped or complex roof. I will send my building plan here for a take-off.") + '">Send my plan on WhatsApp</a></p></div>';
      return;
    }
    if (!(Number(input.length) > 0) || !(Number(input.width) > 0)) {
      out.innerHTML = '<div class="card result-card empty"><span class="eyebrow">Your estimate</span><h2>Enter your measurements</h2><p>Type the building length and width to see the roof area, the bill of quantities and a materials price range.</p></div>';
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
    h += '<span class="eyebrow">Preliminary estimate</span>';
    h += '<div class="big">' + fmt(r.roofArea) + ' m²</div><p class="disclaimer" style="margin-top:6px">Roof area including ' + fmt(r.inputs.overhang, 2) + ' m overhangs · ' + shapeName + ' roof, ' + fmt(r.inputs.pitchDeg, 0) + '° · floor plan ' + fmt(r.planArea) + ' m²</p>';

    if (r.price) {
      h += '<div class="price-box"><span>Materials estimate</span><strong>' + naira(r.price.low) + " – " + naira(r.price.high) + '</strong><small>Based on HolyTouch prices, ' + r.price.asOf + '. Installation and transport are quoted after inspection.</small></div>';
    }

    h += '<h3>Bill of quantities <span class="badge ok">from your measurements</span></h3><table>';
    if (r.sheets) {
      h += row(matName, r.sheets.exact ? r.sheets.count + " sheets × " + fmt(r.sheets.lengthM) + " m = " + fmt(r.sheets.totalM) + " m" : fmt(r.sheets.totalM) + " m (incl. cutting)");
    }
    if (r.tiles) h += row(matName, fmt(r.tiles.count, 0) + " tiles (incl. waste)");
    if (r.lines.ridgeCaps) h += row("Ridge cap" + (r.lines.hips ? " (ridge + hips)" : ""), fmt(r.lines.ridgeCaps) + " m");
    if (r.lines.verge) h += row("Barge board", fmt(r.lines.verge) + " m");
    h += row("Fascia cladding", fmt(r.lines.eaves) + " m");
    h += row("Eaves angle", fmt(r.lines.eaves) + " m");
    h += row("Gutter (if required)", fmt(r.lines.gutter) + " m");
    h += "</table>";
    r.notes.forEach(function (n) { h += '<p class="disclaimer">' + n + "</p>"; });

    if (isSheet) {
      h += '<h3>Fixings and sealants <span class="badge ok">HolyTouch rates</span></h3><table>';
      h += row("Drive screws", r.fixings.screwPackets + " pkts");
      h += row("Seam bolts", r.fixings.seamBoltPackets + " pkts");
      h += row("Rivet nails", r.fixings.rivetPackets + " pkts");
      h += row("Silicone sealant", r.fixings.siliconeTubes + " tubes");
      h += row("Flash band", r.fixings.flashBandRolls + " roll");
      h += "</table>";
    }

    h += '<h3>Timber <span class="badge ind">indicative</span></h3><table>';
    h += row("Rafters (" + r.timber.rafters.size + ")", fmt(r.timber.rafters.pieces, 0) + " pcs");
    h += row("Purlins (" + r.timber.purlins.size + ")", fmt(r.timber.purlins.pieces, 0) + " pcs");
    h += row("Wall plate (" + r.timber.wallPlate.size + ")", fmt(r.timber.wallPlate.pieces, 0) + " pcs");
    h += "</table><p class='disclaimer'>12 ft pieces with 10% for offcuts. Truss members and wall flashing depend on your building and are confirmed on site.</p>";

    if (!r.price) h += "<h3>Price</h3><p>Send this estimate on WhatsApp and we will reply with a price.</p>";

    var msg = [
      "Hello HolyTouch Roofing, I used the roof calculator on your website.",
      "Building: " + fmt(r.inputs.L) + " m x " + fmt(r.inputs.W) + " m",
      "Roof: " + shapeName + ", " + fmt(r.inputs.pitchDeg, 0) + "°, overhang " + fmt(r.inputs.overhang, 2) + " m",
      "Material: " + matName,
      "Roof area: " + fmt(r.roofArea) + " m²",
      r.sheets ? "Sheets: " + fmt(r.sheets.totalM) + " m" : "Tiles: " + r.tiles.count,
      r.price ? "Materials estimate: " + naira(r.price.low) + " – " + naira(r.price.high) : "",
      "Job type: " + val("job"),
      "Location: " + (val("location") || "(not given)"),
      "Please send me an exact quote.",
    ].filter(Boolean).join("\n");
    h += '<div class="btn-row" style="margin-top:20px"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + window.HTWhatsApp(msg) + '">Send this estimate on WhatsApp</a></div>';
    h += '<p class="disclaimer" style="margin-top:14px">A preliminary estimate from the dimensions you entered. HolyTouch confirms measurements, timber, structure and current prices before giving a final quotation.</p>';
    h += "</div>";
    out.innerHTML = h;
  }

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
  render();
})();
