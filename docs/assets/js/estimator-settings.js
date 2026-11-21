/*
  HolyTouch Roofing: roof calculator settings
  ------------------------------------------------
  Every number the calculator uses lives here, so the results follow
  HolyTouch's own practice. Values marked DEFAULT are common Nigerian
  figures used until they are confirmed with HolyTouch.
*/
window.HT_SETTINGS = {
  // Roof slope in degrees offered by default (DEFAULT)
  defaultPitchDeg: 18,
  // Slope used for "flat / low-slope" roofs (DEFAULT)
  lowSlopePitchDeg: 5,
  // Eave overhang in metres (DEFAULT)
  defaultOverhangM: 0.6,

  profiles: {
    longspan: {
      label: "Long-span aluminium",
      unit: "sheet",            // sold as sheets cut to length, priced per metre
      coverWidthM: 0.686,       // effective cover width after side lap (DEFAULT)
      roundLengthToM: 0.1,      // sheets are cut up to the next 0.1 m
    },
    steptile: {
      label: "Step-tile aluminium",
      unit: "sheet",
      coverWidthM: 1.0,         // DEFAULT, confirm with supplier
      roundLengthToM: 0.1,
    },
    stonecoated: {
      label: "Stone-coated tiles",
      unit: "tile",
      tilesPerM2: 2.1,          // about 2.1 tiles per m² (DEFAULT)
    },
  },

  // Extra material for cutting at hips and other angled edges (fraction)
  hipCuttingAllowance: 0.08,
  // Extra tiles for breakage and cutting (fraction)
  tileWaste: 0.05,

  accessories: {
    screwsPerM2: 7,             // DEFAULT
  },

  timber: {
    rafterSpacingM: 0.6,        // DEFAULT
    purlinSpacingM: 0.9,        // DEFAULT
    pieceLengthM: 3.66,         // 12 ft pieces
    rafterSize: "2x4",
    purlinSize: "2x3",
    wallPlateSize: "2x4",
    waste: 0.1,                 // 10% for offcuts (DEFAULT)
  },

  /*
    Price ranges in naira per m² of roof, materials and labour.
    Leave as null until HolyTouch's price list is ready; the calculator
    then shows "price on request" instead of a range.
    Example:
    prices: {
      asOf: "2026-12-01",
      perM2: {
        longspan:    { low: 0, high: 0 },
        steptile:    { low: 0, high: 0 },
        stonecoated: { low: 0, high: 0 },
      },
    },
  */
  prices: null,
};
