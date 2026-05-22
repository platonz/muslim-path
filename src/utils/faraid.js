export function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
export function reduce(n, d) { if (d === 0) return [0,1]; const g = gcd(Math.abs(n), Math.abs(d)); return [Math.round(n/g), Math.round(d/g)]; }
export function fracAdd(a, b) { return reduce(a[0]*b[1] + b[0]*a[1], a[1]*b[1]); }
export function fracVal(f) { return f[1] === 0 ? 0 : f[0]/f[1]; }
export function fmtFrac(f) { if (f[0]===0) return "0"; if (f[1]===1) return `${f[0]}`; return `${f[0]}/${f[1]}`; }

export function calcFaraid(h, madhab) {
  const {
    husband=false, wives=0, sons=0, daughters=0,
    father=false, mother=false, paternalGF=false,
    maternalGM=false, paternalGM=false,
    fullBrothers=0, fullSisters=0,
    paternalHB=0, paternalHS=0, uterine=0
  } = h;

  const results = [];
  const hasDesc = sons > 0 || daughters > 0;
  const hasMaleDesc = sons > 0;
  const totalSiblings = fullBrothers + fullSisters + paternalHB + paternalHS + uterine;

  const pGFActive = paternalGF && !father;
  const fullSibsBlocked = hasMaleDesc || father || (pGFActive && madhab !== "maliki");
  const pHSibsBlocked = fullSibsBlocked || fullBrothers > 0;
  const uterineBlocked = hasDesc || father || pGFActive;
  const mGMActive = maternalGM && !mother;
  const pGMActive = paternalGM && !father && !pGFActive;

  let totalFard = [0, 1];

  function addShare(heir, count, frac, each, note) {
    totalFard = fracAdd(totalFard, frac);
    results.push({ heir, count, frac, each: each || frac, note: note || "" });
  }

  if (husband) addShare("Husband", 1, hasDesc ? [1,4] : [1,2]);
  if (wives > 0) {
    const wF = hasDesc ? [1,8] : [1,4];
    addShare("Wife" + (wives > 1 ? "s" : ""), wives, wF, reduce(wF[0], wF[1]*wives));
  }
  if (father && hasDesc) addShare("Father", 1, [1,6]);
  if (mother) {
    const hasManyBros = totalSiblings >= 2;
    let mF;
    if (hasDesc || hasManyBros) {
      mF = [1,6];
    } else if ((husband || wives > 0) && father) {
      if (madhab === "hanafi") {
        mF = [1,3];
      } else {
        const sF = husband ? [1,2] : [1,4];
        const rem = reduce(sF[1]-sF[0], sF[1]);
        mF = reduce(rem[0], rem[1]*3);
      }
    } else {
      mF = [1,3];
    }
    const note = ((husband||wives>0) && father && !hasDesc && !hasManyBros && madhab !== "hanafi")
      ? "1/3 of remainder (ʿUmariyyatain — Mālikī/Shāfiʿī/Ḥanbalī)" : "";
    addShare("Mother", 1, mF, mF, note);
  }
  if (daughters > 0 && sons === 0) {
    if (daughters === 1) addShare("Daughter", 1, [1,2]);
    else addShare("Daughters", daughters, [2,3], reduce(2, 3*daughters));
  }
  if (pGFActive && hasDesc) addShare("Paternal Grandfather", 1, [1,6]);
  if (mGMActive && pGMActive) addShare("Grandmothers", 2, [1,6], [1,12]);
  else if (mGMActive) addShare("Maternal Grandmother", 1, [1,6]);
  else if (pGMActive) addShare("Paternal Grandmother", 1, [1,6]);
  if (!fullSibsBlocked && fullBrothers === 0 && sons === 0 && daughters === 0 && fullSisters > 0) {
    if (fullSisters === 1) addShare("Full Sister", 1, [1,2]);
    else addShare("Full Sisters", fullSisters, [2,3], reduce(2, 3*fullSisters));
  }
  if (!pHSibsBlocked && fullSisters === 0 && sons === 0 && daughters === 0 && paternalHB === 0 && paternalHS > 0) {
    if (paternalHS === 1) addShare("Paternal Half-Sister", 1, [1,2]);
    else addShare("Paternal Half-Sisters", paternalHS, [2,3], reduce(2, 3*paternalHS));
  } else if (!pHSibsBlocked && fullSisters === 1 && sons === 0 && daughters === 0 && paternalHB === 0 && paternalHS > 0) {
    addShare("Paternal Half-Sisters", paternalHS, [1,6], reduce(1, 6*paternalHS), "Completes two-thirds with one full sister");
  }
  if (!uterineBlocked && uterine > 0) {
    if (uterine === 1) addShare("Uterine Sibling", 1, [1,6]);
    else addShare("Uterine Siblings", uterine, [1,3], reduce(1, 3*uterine));
  }

  const remFrac = reduce(totalFard[1] - totalFard[0], totalFard[1]);
  const hasRemainder = remFrac[0] > 0;

  // AWL check (total fard > 1)
  if (totalFard[0] > totalFard[1]) {
    const total = totalFard[0];
    const denom = totalFard[1];
    results.forEach(r => {
      r.frac = reduce(r.frac[0] * denom, total * r.frac[1]);
      r.each = reduce(r.each[0] * denom, total * r.each[1]);
      r.note = (r.note ? r.note + " · " : "") + "ʿAwl applied";
    });
    return results;
  }

  if (sons > 0 && hasRemainder) {
    const parts = sons * 2 + daughters;
    if (daughters > 0) {
      const di = results.findIndex(r => r.heir.startsWith("Daughter"));
      if (di > -1) {
        totalFard = fracAdd(reduce(totalFard[0]-results[di].frac[0]*totalFard[1], totalFard[1]*results[di].frac[1]), [0,1]);
        results.splice(di, 1);
      }
      const newRem = reduce(totalFard[1]-totalFard[0], totalFard[1]);
      results.push({ heir: "Sons", count: sons, frac: reduce(newRem[0]*2*sons, newRem[1]*parts), each: reduce(newRem[0]*2, newRem[1]*parts), note: "Residuary — each son = 2× daughter" });
      results.push({ heir: "Daughters", count: daughters, frac: reduce(newRem[0]*daughters, newRem[1]*parts), each: reduce(newRem[0], newRem[1]*parts), note: "Residuary with sons" });
    } else {
      results.push({ heir: "Sons", count: sons, frac: remFrac, each: reduce(remFrac[0], remFrac[1]*sons), note: "Residuary" });
    }
    return results;
  }

  if (father && sons === 0 && hasRemainder) {
    const fi = results.findIndex(r => r.heir === "Father");
    if (fi > -1) {
      const newFrac = fracAdd(results[fi].frac, remFrac);
      results[fi].frac = newFrac;
      results[fi].each = newFrac;
      results[fi].note = "1/6 fixed share + residuary";
    } else {
      results.push({ heir: "Father", count: 1, frac: remFrac, each: remFrac, note: "Residuary (no children)" });
    }
    return results;
  }

  if (pGFActive && sons === 0 && hasRemainder) {
    if (madhab === "maliki" && !fullSibsBlocked && (fullBrothers > 0 || fullSisters > 0)) {
      const sibParts = fullBrothers * 2 + fullSisters;
      const totalParts = sibParts + 2;
      const gfMuq = reduce(remFrac[0]*2, remFrac[1]*totalParts);
      const gfThird = reduce(remFrac[0], remFrac[1]*3);
      const useThird = fracVal(gfThird) > fracVal(gfMuq);
      const gfFrac = useThird ? gfThird : gfMuq;
      const sibRem = reduce(remFrac[0]*remFrac[1] - gfFrac[0]*remFrac[1], remFrac[1]*gfFrac[1]);
      results.push({ heir: "Paternal Grandfather", count: 1, frac: gfFrac, each: gfFrac, note: "Muqasama (Mālikī)" });
      if (fullBrothers > 0) {
        const bParts = fullBrothers*2 + fullSisters;
        results.push({ heir: "Full Brothers", count: fullBrothers, frac: reduce(sibRem[0]*fullBrothers*2, sibRem[1]*bParts), each: reduce(sibRem[0]*2, sibRem[1]*bParts), note: "Residuary (Mālikī — not blocked by grandfather)" });
        if (fullSisters > 0) results.push({ heir: "Full Sisters", count: fullSisters, frac: reduce(sibRem[0]*fullSisters, sibRem[1]*bParts), each: reduce(sibRem[0], sibRem[1]*bParts), note: "Residuary (Mālikī)" });
      } else if (fullSisters > 0) {
        results.push({ heir: "Full Sisters", count: fullSisters, frac: sibRem, each: reduce(sibRem[0], sibRem[1]*fullSisters), note: "Residuary (Mālikī)" });
      }
    } else {
      results.push({ heir: "Paternal Grandfather", count: 1, frac: remFrac, each: remFrac, note: "Residuary (acts as father)" });
    }
    return results;
  }

  if (!fullSibsBlocked && (fullBrothers > 0 || fullSisters > 0) && hasRemainder) {
    if (daughters > 0 && fullBrothers === 0 && fullSisters > 0) {
      results.push({ heir: "Full Sisters", count: fullSisters, frac: remFrac, each: reduce(remFrac[0], remFrac[1]*fullSisters), note: "Asabah bil-Ghayr — with daughters" });
    } else if (fullBrothers > 0) {
      const parts = fullBrothers*2 + fullSisters;
      results.push({ heir: "Full Brothers", count: fullBrothers, frac: reduce(remFrac[0]*fullBrothers*2, remFrac[1]*parts), each: reduce(remFrac[0]*2, remFrac[1]*parts), note: "Residuary" });
      if (fullSisters > 0) results.push({ heir: "Full Sisters", count: fullSisters, frac: reduce(remFrac[0]*fullSisters, remFrac[1]*parts), each: reduce(remFrac[0], remFrac[1]*parts), note: "Residuary with brothers" });
    }
    return results;
  }

  if (!pHSibsBlocked && (paternalHB > 0 || paternalHS > 0) && hasRemainder) {
    if (paternalHB > 0) {
      const parts = paternalHB*2 + paternalHS;
      results.push({ heir: "Paternal Half-Brothers", count: paternalHB, frac: reduce(remFrac[0]*paternalHB*2, remFrac[1]*parts), each: reduce(remFrac[0]*2, remFrac[1]*parts), note: "Residuary" });
      if (paternalHS > 0) results.push({ heir: "Paternal Half-Sisters", count: paternalHS, frac: reduce(remFrac[0]*paternalHS, remFrac[1]*parts), each: reduce(remFrac[0], remFrac[1]*parts), note: "Residuary with brothers" });
    }
    return results;
  }

  // Radd — distribute remainder proportionally to fard heirs (excluding spouse)
  if (hasRemainder) {
    const raddHeirs = results.filter(r => r.heir !== "Husband" && !r.heir.startsWith("Wife"));
    if (raddHeirs.length > 0) {
      const raddTotal = raddHeirs.reduce((s, r) => fracAdd(s, r.frac), [0,1]);
      const mNum = raddTotal[0] * remFrac[1] + remFrac[0] * raddTotal[1];
      const mDen = raddTotal[0] * remFrac[1];
      raddHeirs.forEach(r => {
        const newFrac = reduce(r.frac[0] * mNum, r.frac[1] * mDen);
        r.frac = newFrac;
        r.each = r.count > 1 ? reduce(newFrac[0], newFrac[1] * r.count) : newFrac;
        r.note = (r.note ? r.note + " · " : "") + "Radd applied";
      });
    }
  }

  return results;
}
