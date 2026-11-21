/*
  HolyTouch Roofing: roof calculator maths (no page code here, so it can be tested).
  Geometry: for a gable or equal-pitch hip roof, sloped area = plan area (with overhangs) / cos(pitch).
*/
(function (root) {
  function ceilTo(x, step) {
    return Math.ceil(x / step - 1e-9) * step;
  }
  function r1(x) { return Math.round(x * 10) / 10; }

  function estimate(input, S) {
    var L = Number(input.length), W = Number(input.width);
    if (!(L > 0) || !(W > 0)) throw new Error("Enter the building length and width.");
    if (W > L) { var t = L; L = W; W = t; } // L is always the longer side
    var shape = input.shape || "gable";
    var o = input.overhang === "" || input.overhang == null ? S.defaultOverhangM : Number(input.overhang);
    var pitchDeg = shape === "flat" ? S.lowSlopePitchDeg : Number(input.pitch || S.defaultPitchDeg);
    var th = pitchDeg * Math.PI / 180;
    var cos = Math.cos(th), tan = Math.tan(th);
    var profileKey = input.profile || "longspan";
    var P = S.profiles[profileKey];

    var Lp = L + 2 * o, Wp = W + 2 * o;          // plan with overhangs
    var planArea = L * W;
    var roofArea = (Lp * Wp) / cos;

    var res = {
      inputs: { L: L, W: W, overhang: o, pitchDeg: pitchDeg, shape: shape, profile: profileKey },
      planArea: r1(planArea),
      roofArea: r1(roofArea),
      lines: {},
      sheets: null,
      tiles: null,
      timber: null,
      notes: [],
    };

    // ---- Lines: ridge, hips, gutters, verges ----
    var run = shape === "flat" ? Wp : Wp / 2;      // horizontal distance eave to ridge
    var slopeLen = run / cos;                       // eave to ridge along the roof
    var ridge = 0, hips = 0, gutter = 0, verge = 0;
    if (shape === "gable") {
      ridge = Lp;
      gutter = 2 * Lp;
      verge = 4 * slopeLen;
    } else if (shape === "hip") {
      ridge = Lp - Wp;
      hips = 4 * run * Math.sqrt(2 + tan * tan);
      gutter = 2 * Lp + 2 * Wp;
    } else if (shape === "flat") {
      gutter = Lp;
      verge = 2 * slopeLen;
    }
    res.lines = { ridge: r1(ridge), hips: r1(hips), ridgeCaps: r1(ridge + hips), gutter: r1(gutter), verge: r1(verge), slopeLength: r1(slopeLen) };

    // ---- Roofing material ----
    if (P.unit === "sheet") {
      var len = ceilTo(slopeLen, P.roundLengthToM);
      var cw = P.coverWidthM;
      if (shape === "gable") {
        var perSlope = Math.ceil(Lp / cw - 1e-9);
        res.sheets = { count: perSlope * 2, lengthM: r1(len), totalM: r1(perSlope * 2 * len), perSlope: perSlope, exact: true };
      } else if (shape === "flat") {
        var n = Math.ceil(Lp / cw - 1e-9);
        res.sheets = { count: n, lengthM: r1(len), totalM: r1(n * len), perSlope: n, exact: true };
      } else {
        // hip: two trapezoid slopes + two triangular ends; sheets get shorter towards the hips
        var count = 2 * Math.ceil(Lp / cw - 1e-9) + 2 * Math.ceil(Wp / cw - 1e-9);
        var totalM = (roofArea / cw) * (1 + S.hipCuttingAllowance);
        res.sheets = { count: count, lengthM: r1(len), totalM: r1(totalM), exact: false };
        res.notes.push("On a hip roof the sheets get shorter towards the hips, so the total is given in running metres including a cutting allowance.");
      }
    } else {
      var waste = S.tileWaste + (shape === "hip" ? S.hipCuttingAllowance : 0);
      res.tiles = { count: Math.ceil(roofArea * P.tilesPerM2 * (1 + waste)) };
    }

    res.screws = Math.ceil(roofArea * S.accessories.screwsPerM2);

    // ---- Timber (indicative) ----
    var T = S.timber;
    var rafterM = roofArea / T.rafterSpacingM + hips;   // common rafters plus hip rafters
    var purlinM = roofArea / T.purlinSpacingM;
    var wallPlateM = 2 * (L + W);
    var ridgeBoardM = ridge;
    function pieces(m) { return Math.ceil((m * (1 + T.waste)) / T.pieceLengthM - 1e-9); }
    res.timber = {
      rafters: { size: T.rafterSize, metres: r1(rafterM), pieces: pieces(rafterM + ridgeBoardM) },
      purlins: { size: T.purlinSize, metres: r1(purlinM), pieces: pieces(purlinM) },
      wallPlate: { size: T.wallPlateSize, metres: r1(wallPlateM), pieces: pieces(wallPlateM) },
      pieceLengthM: T.pieceLengthM,
    };

    // ---- Price range (only if a price list is set) ----
    if (S.prices && S.prices.perM2 && S.prices.perM2[profileKey]) {
      var pr = S.prices.perM2[profileKey];
      if (pr.low > 0 && pr.high > 0) {
        res.price = {
          low: Math.round((roofArea * pr.low) / 10000) * 10000,
          high: Math.round((roofArea * pr.high) / 10000) * 10000,
          asOf: S.prices.asOf,
        };
      }
    }
    return res;
  }

  root.HTEstimate = estimate;
  if (typeof module !== "undefined" && module.exports) module.exports = estimate;
})(typeof window !== "undefined" ? window : globalThis);
