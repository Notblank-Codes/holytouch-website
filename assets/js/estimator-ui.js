(function () {
  var S = window.HT_SETTINGS;
  var form = document.getElementById("calc-form");
  var out = document.getElementById("calc-results");
  if (!form || !out) return;

  var pitch = form.querySelector("#pitch");
  var overhang = form.querySelector("#overhang");
  if (pitch && !pitch.value) pitch.value = S.defaultPitchDeg;
  if (overhang && !overhang.value) overhang.value = S.defaultOverhangM;

  function fmt(n, d) {
    return Number(n).toLocaleString("en-NG", { maximumFractionDigits: d == null ? 1 : d });
  }
  function naira(n) { return "₦" + Number(n).toLocaleString("en-NG"); }
  function val(name) {
    var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]');
    return el ? el.value : "";
  }

  function render() {
    var input = {
      length: val("length"), width: val("width"), shape: val("shape"),
      pitch: val("pitch"), overhang: val("overhang"), profile: val("profile"),
    };
    var pitchRow = document.getElementById("pitch-row");
    if (pitchRow) pitchRow.hidden = input.shape === "flat";
    if (input.shape === "complex") {
      out.innerHTML = '<div class="card"><h2>Complex roof</h2><p>L-shaped and T-shaped roofs, valleys and roofs on several levels need a proper take-off. Send us a photo of your building plan on WhatsApp and we will work out the quantities for you, free.</p>' +
        '<p style="margin-top:16px"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + window.HTWhatsApp("Hello HolyTouch Roofing, I have an L-shaped or complex roof. I will send my building plan here for a take-off.") + '">Send my plan on WhatsApp</a></p></div>';
      return;
    }
    if (!(Number(input.length) > 0) || !(Number(input.width) > 0)) {
      out.innerHTML = '<div class="card"><h2>Your estimate</h2><p>Enter the building length and width to see the roof area, sheets and timber.</p></div>';
      return;
    }
    var r;
    try { r = window.HTEstimate(input, S); } catch (e) {
      out.innerHTML = '<div class="card"><p class="error">' + e.message + "</p></div>"; return;
    }
    var P = S.profiles[r.inputs.profile];
    var shapeName = { gable: "Gable", hip: "Hip", flat: "Flat / low-slope" }[r.inputs.shape];
    var h = '<div class="card">';
    h += '<span class="eyebrow">Preliminary estimate</span>';
    h += '<div class="big">' + fmt(r.roofArea) + ' m²</div><p class="disclaimer" style="margin-top:6px">Sloped roof area including ' + fmt(r.inputs.overhang, 2) + ' m overhangs (' + shapeName + ', ' + fmt(r.inputs.pitchDeg, 0) + '°). Floor plan area: ' + fmt(r.planArea) + ' m².</p>';

    h += '<h3>Roofing <span class="badge ok">reliable</span></h3><table>';
    h += "<tr><td>Material</td><td>" + P.label + "</td></tr>";
    if (r.sheets) {
      if (r.sheets.exact) {
        h += "<tr><td>Sheets</td><td>" + r.sheets.count + " × " + fmt(r.sheets.lengthM) + " m</td></tr>";
        h += "<tr><td>Total running length</td><td>" + fmt(r.sheets.totalM) + " m</td></tr>";
      } else {
        h += "<tr><td>Total running length (incl. cutting)</td><td>" + fmt(r.sheets.totalM) + " m</td></tr>";
        h += "<tr><td>Longest sheet</td><td>" + fmt(r.sheets.lengthM) + " m</td></tr>";
      }
    }
    if (r.tiles) h += "<tr><td>Tiles (incl. waste)</td><td>" + fmt(r.tiles.count, 0) + "</td></tr>";
    if (r.lines.ridge) h += "<tr><td>Ridge</td><td>" + fmt(r.lines.ridge) + " m</td></tr>";
    if (r.lines.hips) h += "<tr><td>Hips (all four)</td><td>" + fmt(r.lines.hips) + " m</td></tr>";
    if (r.lines.ridgeCaps) h += "<tr><td>Ridge caps</td><td>" + fmt(r.lines.ridgeCaps) + " m</td></tr>";
    h += "<tr><td>Gutter / fascia</td><td>" + fmt(r.lines.gutter) + " m</td></tr>";
    if (r.lines.verge) h += "<tr><td>Verge / barge flashing</td><td>" + fmt(r.lines.verge) + " m</td></tr>";
    h += "</table>";
    r.notes.forEach(function (n) { h += '<p class="disclaimer">' + n + "</p>"; });

    h += '<h3>Fixings and timber <span class="badge ind">indicative</span></h3><table>';
    h += "<tr><td>Roofing screws</td><td>about " + fmt(r.screws, 0) + "</td></tr>";
    h += "<tr><td>Rafters (" + r.timber.rafters.size + ")</td><td>" + fmt(r.timber.rafters.pieces, 0) + " pieces</td></tr>";
    h += "<tr><td>Purlins (" + r.timber.purlins.size + ")</td><td>" + fmt(r.timber.purlins.pieces, 0) + " pieces</td></tr>";
    h += "<tr><td>Wall plate (" + r.timber.wallPlate.size + ")</td><td>" + fmt(r.timber.wallPlate.pieces, 0) + " pieces</td></tr>";
    h += "</table><p class='disclaimer'>Timber counted in 12 ft (" + r.timber.pieceLengthM + " m) pieces with 10% for offcuts. Truss members (ties, struts, king posts) and fascia boards are added after our site check.</p>";

    h += "<h3>Price</h3>";
    if (r.price) {
      h += '<p><strong>' + naira(r.price.low) + " to " + naira(r.price.high) + "</strong><br><span class='disclaimer'>Rough range for materials and labour, based on prices as of " + r.price.asOf + ". The final price follows a site inspection.</span></p>";
    } else {
      h += "<p>Price on request. Our price list is being updated; send this estimate on WhatsApp and we will reply with a price range.</p>";
    }

    var msg = [
      "Hello HolyTouch Roofing, I used the roof calculator on your website.",
      "Building: " + fmt(r.inputs.L) + " m x " + fmt(r.inputs.W) + " m",
      "Roof: " + shapeName + ", " + fmt(r.inputs.pitchDeg, 0) + "°, overhang " + fmt(r.inputs.overhang, 2) + " m",
      "Material: " + P.label,
      "Estimated roof area: " + fmt(r.roofArea) + " m²",
      r.sheets ? "Sheets: " + (r.sheets.exact ? r.sheets.count + " x " + fmt(r.sheets.lengthM) + " m" : fmt(r.sheets.totalM) + " running metres") : "Tiles: " + r.tiles.count,
      "Job type: " + val("job"),
      "Location: " + (val("location") || "(not given)"),
      "Please send me an exact quote.",
    ].join("\n");
    h += '<div class="btn-row" style="margin-top:18px"><a class="btn btn-wa" target="_blank" rel="noopener" href="' + window.HTWhatsApp(msg) + '">Send this estimate on WhatsApp</a></div>';
    h += '<p class="disclaimer" style="margin-top:14px">This is a preliminary estimate from the dimensions you entered. Walls are rarely perfectly square and plans can differ from what was built, so HolyTouch checks measurements, timber, structure and prices before giving a final quote.</p>';
    h += "</div>";
    out.innerHTML = h;
  }

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  form.addEventListener("submit", function (e) { e.preventDefault(); render(); });
  render();
})();
