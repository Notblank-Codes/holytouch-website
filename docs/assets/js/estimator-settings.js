/*
  HolyTouch Roofing: roof calculator settings
  ------------------------------------------------
  Every number the calculator uses lives here, so results follow HolyTouch's
  own practice. Unit prices and packet rates come from HolyTouch quotations
  (July–August 2026). Values marked DEFAULT are common figures still to be
  confirmed.
*/
window.HT_SETTINGS = {
  defaultPitchDeg: 18,          // DEFAULT
  lowSlopePitchDeg: 5,          // DEFAULT
  defaultOverhangM: 0.6,        // DEFAULT

  profiles: {
    longspan: {
      label: "Longspan aluminium",
      unit: "sheet",
      coverWidthM: 0.686,       // effective cover width after side lap (DEFAULT)
      roundLengthToM: 0.1,
      thicknesses: ["0.40", "0.45", "0.50", "0.55", "0.60", "0.70"],
    },
    steptile: {
      label: "Step tile aluminium",
      unit: "sheet",
      coverWidthM: 1.0,         // DEFAULT, confirm with supplier
      roundLengthToM: 0.1,
      thicknesses: ["0.40", "0.45", "0.50", "0.55", "0.60", "0.70"],
    },
    stonecoated: {
      label: "Stone coated tiles",
      unit: "tile",
      tilesPerM2: 2.1,          // DEFAULT
    },
  },

  hipCuttingAllowance: 0.08,    // extra sheet for cutting at hips
  // Internal: extra added to every quantity (0.10–0.15). Not shown to visitors.
  q: 0.12,
  tileWaste: 0.05,

  // Fixings and sealants, from HolyTouch quotations (per metre of roofing sheet)
  fixings: {
    sheetMetresPerScrewPacket: 20,   // 276 m → 12 pkts, 495 m → 25 pkts
    sheetMetresPerSeamBoltPacket: 165,
    sheetMetresPerRivetPacket: 100,
    sheetMetresPerSiliconeTube: 250,
    flashBandRolls: 1,
  },

  // Roof wood work, Nigerian truss method: trusses at 1.2 m centres, each with
  // a tie beam, two rafters, a king post and two struts; purlins across the
  // rafters; wall plate on the walls; fascia board round the edge.
  timber: {
    trussSpacingM: 1.2,         // DEFAULT
    purlinSpacingM: 0.9,        // DEFAULT
    pieceLengthM: 3.6,          // 12 ft lengths as sold
    wallPlateWallFactor: 2.0,   // all walls ≈ 2 × outside perimeter (internal walls carry the wall plate too) DEFAULT
    sizes: { tieBeam: "2x6", rafter: "3x4", kingPost: "2x6", strut: "3x4", purlin: "2x2", wallPlate: "3x4", fascia: "1x12", hipRafter: "3x4" },
  },

  /*
    Material prices in naira, from HolyTouch quotations.
    Shown as a materials-only range; installation and transport are quoted
    after inspection. Set prices to null to hide prices on the site.
  */
  prices: {
    asOf: "August 2026",
    rangeLow: 0.95,             // range shown = materials total × low … × high
    rangeHigh: 1.1,
    // ridge cap rate assumed equal to flashing rate: confirm with HolyTouch
    longspan: {
      // 0.45 and 0.55: HolyTouch quotations. Others: ESTIMATES, from Lagos dealer
      // price lists (Nov 2026) scaled to HolyTouch's price level. CONFIRM with HolyTouch.
      "0.40": { sheetPerM: 6900, ridgePerM: 1050, bargePerM: 1050, fasciaPerM: 6900, eavesAnglePerM: 1900 },
      "0.45": { sheetPerM: 7300, ridgePerM: 1100, bargePerM: 1100, fasciaPerM: 7300, eavesAnglePerM: 1900 },
      "0.50": { sheetPerM: 8400, ridgePerM: 1750, bargePerM: 1750, fasciaPerM: 8400, eavesAnglePerM: 1900 },
      "0.55": { sheetPerM: 9500, ridgePerM: 2425, bargePerM: 2425, fasciaPerM: 9500, eavesAnglePerM: 1900 },
      "0.60": { sheetPerM: 11500, ridgePerM: 2950, bargePerM: 2950, fasciaPerM: 11500, eavesAnglePerM: 1900 },
      "0.70": { sheetPerM: 15300, ridgePerM: 3900, bargePerM: 3900, fasciaPerM: 15300, eavesAnglePerM: 1900 },
    },
    screwPacket: 3000,
    seamBoltPacket: 2500,
    rivetPacket: 2500,
    siliconeTube: 3000,
    flashBandRoll: 2000,
    // Wood, per 12 ft piece. 2x4 from HolyTouch quotation (₦2,500); the others are
    // estimated from it using usual market ratios between sizes. CONFIRM with HolyTouch.
    wood: { "2x2": 1100, "2x3": 1600, "2x4": 2500, "2x6": 3400, "3x4": 3400, "1x12": 6500 },
  },
};
