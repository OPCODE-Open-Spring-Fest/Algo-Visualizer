export function computeLPSSteps(pattern) {
    const m = pattern.length;
    const lps = Array(m).fill(0);
    const steps = [];
    let len = 0; 
    let i = 1;
  
    steps.push({
      lps: [...lps],
      i: 1,
      len: 0,
      message: "Initializing LPS table. lps[0] is always 0. Starting from i = 1.",
      highlight: { i: 1, len: 0, lps: -1 },
    });
  
    while (i < m) {
      steps.push({
        lps: [...lps],
        i: i,
        len: len,
        message: `Comparing pattern[${i}] ('${pattern[i]}') and pattern[${len}] ('${pattern[len]}').`,
        highlight: { i: i, len: len, lps: -1 },
      });
  
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        steps.push({
          lps: [...lps],
          i: i,
          len: len,
          message: `Match! lps[${i}] = ${len}. Increment i and len.`,
          highlight: { i: i, len: len, lps: i, state: 'match' },
        });
        i++;
      } else { 
        if (len !== 0) {
          len = lps[len - 1];
          steps.push({
            lps: [...lps],
            i: i,
            len: len,
            message: `Mismatch. Falling back: len = lps[${len - 1}] = ${len}.`,
            highlight: { i: i, len: len, lps: -1, state: 'mismatch' },
          });
        } else {
          lps[i] = 0;
          steps.push({
            lps: [...lps],
            i: i,
            len: len,
            message: `Mismatch. No fallback. lps[${i}] = 0. Increment i.`,
            highlight: { i: i, len: len, lps: i, state: 'mismatch' },
          });
          i++;
        }
      }
    }
  
    steps.push({
      lps: [...lps],
      i: m,
      len: len,
      message: "LPS table computation complete.",
      highlight: { i: m, len: len, lps: -1, state: 'done' },
    });
    return { steps, lpsTable: lps };
  }
  
  export function kmpSearchSteps(text, pattern, lps) {
    const n = text.length;
    const m = pattern.length;
    const steps = [];
    const matches = [];
    let i = 0; 
    let j = 0; 
  
    steps.push({
      i: i,
      j: j,
      matches: [...matches],
      message: "Starting KMP search. i = 0 (text), j = 0 (pattern).",
      highlight: { i: 0, j: 0, state: 'idle' }
    });
  
    while (i < n) {
      if (j === 0) {
        steps.push({
          i: i,
          j: j,
          matches: [...matches],
          message: `Comparing text[${i}] ('${text[i]}') and pattern[${j}] ('${pattern[j]}').`,
          highlight: { i: i, j: j, state: 'compare' }
        });
      } else {
           steps.push({
          i: i,
          j: j,
          matches: [...matches],
          message: `Comparing text[${i}] ('${text[i]}') and pattern[${j}] ('${pattern[j]}').`,
          highlight: { i: i, j: j, state: 'compare' }
        });
      }
  
  
      if (pattern[j] === text[i]) {
        i++;
        j++;
      }
  
      if (j === m) {
        const matchIndex = i - j;
        matches.push(matchIndex);
        steps.push({
          i: i,
          j: j,
          matches: [...matches],
          message: `PATTERN FOUND! at index ${matchIndex}.`,
          highlight: { i: i, j: j, state: 'match', matchIndex: matchIndex }
        });
        j = lps[j - 1];
         steps.push({
          i: i,
          j: j,
          matches: [...matches],
          message: `Jumping pattern pointer using LPS: j = lps[${m - 1}] = ${j}.`,
          highlight: { i: i, j: j, state: 'jump' }
        });
      } else if (i < n && pattern[j] !== text[i]) {
        if (j !== 0) {
          j = lps[j - 1];
          steps.push({
            i: i,
            j: j,
            matches: [...matches],
            message: `Mismatch. Jumping pattern pointer using LPS: j = lps[${j - 1}] = ${j}.`,
            highlight: { i: i, j: j, state: 'jump' }
          });
        } else {
          i++;
           steps.push({
            i: i,
            j: j,
            matches: [...matches],
            message: `Mismatch at j=0. Incrementing text pointer i to ${i}.`,
            highlight: { i: i, j: j, state: 'mismatch' }
          });
        }
      }
    }
  
    steps.push({
      i: n,
      j: j,
      matches: [...matches],
      message: `Search complete. ${matches.length} match(es) found.`,
      highlight: { i: n, j: j, state: 'done' }
    });
  
    return { steps, matches };
  }