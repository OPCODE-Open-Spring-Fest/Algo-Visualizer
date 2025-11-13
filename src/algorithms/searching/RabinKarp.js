export function getRabinKarpSteps(text, pattern) {
    const steps = [];
    const n = text.length;
    const m = pattern.length;

    if (m === 0 || n < m) {
        return { steps, found: false };
    }

    const d = 256; 
    const q = 101; 
    let h = 1; 
    let pHash = 0;
    let tHash = 0; 
    let found = false;

    for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q;
    }

    steps.push({
        windowStart: 0,
        compareIndex: -1,
        status: 'calculating',
        pHash: 0,
        tHash: 0,
        message: `Starting. Pattern length=${m}, Text length=${n}. Prime q=${q}. Multiplier h=${h}.`
    });

    for (let i = 0; i < m; i++) {
        pHash = (d * pHash + pattern.charCodeAt(i)) % q;
        tHash = (d * tHash + text.charCodeAt(i)) % q;
        
        steps.push({
            windowStart: 0,
            compareIndex: i,
            status: 'calculating',
            pHash,
            tHash,
            message: `Calculating initial hashes. Index ${i}. Pattern Hash = ${pHash}, Window Hash = ${tHash}.`
        });
    }

    for (let i = 0; i <= n - m; i++) {
        steps.push({
            windowStart: i,
            compareIndex: -1,
            status: 'sliding',
            pHash,
            tHash,
            message: `Sliding window to index ${i}. Pattern Hash = ${pHash}, Window Hash = ${tHash}.`
        });

        if (pHash === tHash) {
            steps.push({
                windowStart: i,
                compareIndex: 0,
                status: 'hash_match',
                pHash,
                tHash,
                message: `Hash Match Found! Verifying character by character...`
            });

            let j = 0;
            for (j = 0; j < m; j++) {
                steps.push({
                    windowStart: i,
                    compareIndex: i + j,
                    patternCompareIndex: j,
                    status: 'verifying',
                    pHash,
                    tHash,
                    message: `Verifying: text[${i + j}] ('${text[i + j]}') === pattern[${j}] ('${pattern[j]}')?`
                });

                if (text[i + j] !== pattern[j]) {
                    steps.push({
                        windowStart: i,
                        compareIndex: i + j,
                        patternCompareIndex: j,
                        status: 'spurious_hit',
                        pHash,
                        tHash,
                        message: `Spurious Hit! Mismatch found. Resuming search.`
                    });
                    break;
                }
            }

            if (j === m) {
                found = true;
                steps.push({
                    windowStart: i,
                    compareIndex: -1,
                    status: 'found',
                    pHash,
                    tHash,
                    message: `Pattern Found at index ${i}!`
                });
            }
        }

        if (i < n - m) {
            const oldHash = tHash;
            const charToRemove = text.charCodeAt(i);
            const charToAdd = text.charCodeAt(i + m);
            
            tHash = (d * (tHash - charToRemove * h) + charToAdd) % q;
            if (tHash < 0) {
                tHash += q;
            }

            steps.push({
                windowStart: i,
                compareIndex: -1,
                status: 'rolling',
                removeIndex: i,
                addIndex: i + m,
                pHash,
                tHash: oldHash,
                message: `Rolling hash... Removing '${text[i]}' (val ${charToRemove}).`
            });
            
            steps.push({
                windowStart: i + 1,
                compareIndex: -1,
                status: 'rolling',
                removeIndex: i,
                addIndex: i + m,
                pHash,
                tHash,
                message: `Rolling hash... Adding '${text[i + m]}' (val ${charToAdd}). New Window Hash = ${tHash}.`
            });
        }
    }

    steps.push({
        windowStart: -1,
        compareIndex: -1,
        status: found ? 'finished_found' : 'finished_not_found',
        pHash,
        tHash,
        message: found ? "Search complete. Pattern was found." : "Search complete. Pattern was not found."
    });

    return { steps, found };
}