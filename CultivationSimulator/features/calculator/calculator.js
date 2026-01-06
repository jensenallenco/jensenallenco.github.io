document.addEventListener('DOMContentLoaded', () => {
    const elixirData = {
        rarities: [
            { id: 'common', name: 'Common', value: 1, defaultChecked: false },
            { id: 'good', name: 'Good', value: 2, defaultChecked: false },
            { id: 'sturdy', name: 'Sturdy', value: 3, defaultChecked: false },
            { id: 'rare', name: 'Rare', value: 4, defaultChecked: false },
            { id: 'perfect', name: 'Perfect', value: 5, defaultChecked: true },
            { id: 'scarce', name: 'Scarce', value: 6, defaultChecked: false },
            { id: 'epic', name: 'Epic', value: 8, defaultChecked: false },
            { id: 'legendary', name: 'Legendary', value: 10, defaultChecked: false },
            { id: 'immortal', name: 'Immortal', value: 14, defaultChecked: false },
            { id: 'myth', name: 'Myth', value: 20, defaultChecked: false },
            { id: 'eternal', name: 'Eternal', value: 28, defaultChecked: false }
        ],
        stats: [
            { id: 'attack', name: 'Attack', shortName: 'ATK', isPercentage: false, decimals: 0 },
            { id: 'critdmg', name: 'Critical Hit Damage', shortName: 'Crit DMG', isPercentage: true, decimals: 3 },
            { id: 'talismanDmg', name: 'Talisman Damage', shortName: 'Talisman DMG', isPercentage: true, decimals: 3 },
            { id: 'hp', name: 'HP', shortName: 'HP', isPercentage: false, decimals: 0 },
            { id: 'skilldmg', name: 'Skill Damage', shortName: 'Skill DMG', isPercentage: true, decimals: 3 }
        ],
        colors: {
            common: { bg: '#9ca3af', text: '#1f2937' },
            good: { bg: '#10b981', text: '#ffffff' },
            sturdy: { bg: '#06b6d4', text: '#ffffff' },
            rare: { bg: '#22c55e', text: '#ffffff' },
            perfect: { bg: '#3b82f6', text: '#ffffff' },
            scarce: { bg: '#f472b6', text: '#ffffff' },
            epic: { bg: '#f97316', text: '#ffffff' },
            legendary: { bg: '#a855f7', text: '#ffffff' },
            immortal: { bg: '#ec4899', text: '#ffffff' },
            myth: { bg: '#ef4444', text: '#ffffff' },
            eternal: { bg: '#fbbf24', text: '#1f2937' }
        }
    };
    
    const elixirAbsorbData = {
        common:    { attack: 100,  critdmg: 0.01, talismanDmg: 0.001, hp: 10000,  skilldmg: 0.002 },
        good:      { attack: 200,  critdmg: 0.02, talismanDmg: 0.002, hp: 20000,  skilldmg: 0.004 },
        sturdy:    { attack: 300,  critdmg: 0.03, talismanDmg: 0.003, hp: 30000,  skilldmg: 0.006 },
        rare:      { attack: 400,  critdmg: 0.04, talismanDmg: 0.004, hp: 40000,  skilldmg: 0.008 },
        perfect:   { attack: 1075,  critdmg: 0.05, talismanDmg: 0.005, hp: 108000,  skilldmg: 0.01 },
        scarce:    { attack: 1290,  critdmg: 0.06, talismanDmg: 0.006, hp: 129000,  skilldmg: 0.012 },
        epic:      { attack: 1720, critdmg: 0.08, talismanDmg: 0.008, hp: 172000, skilldmg: 0.016 },
        legendary: { attack: 2150, critdmg: 0.10, talismanDmg: 0.010, hp: 215000, skilldmg: 0.020 },
        immortal:  { attack: 3010, critdmg: 0.14, talismanDmg: 0.014, hp: 301000, skilldmg: 0.028 },
        myth:      { attack: 4300, critdmg: 0.20, talismanDmg: 0.020, hp: 430000, skilldmg: 0.040 },
        // still uncertain about eternal stats
        eternal:   { attack: 6020, critdmg: 0.28, talismanDmg: 0.028, hp: 602000, skilldmg: 0.056 }
    };

    const checkboxContainer = document.getElementById('elixir-checkbox-container');
    const sectionsContainer = document.getElementById('elixir-sections-container');
    const totalsContainer = document.getElementById('elixir-totals-container');
    const absorbTotalsContainer = document.getElementById('elixir-absorb-totals-container');

    function formatStatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toLocaleString('id-ID');
    }

    function calculateElixirTotals() {
        const pointTotals = {};
        const absorbTotals = {};
        elixirData.stats.forEach(stat => {
            pointTotals[stat.id] = 0;
            absorbTotals[stat.id] = 0;
        });

        elixirData.rarities.forEach(rarity => {
            const checkbox = document.getElementById(`elixir-check-${rarity.id}`);
            if (checkbox && checkbox.checked) {
                elixirData.stats.forEach(stat => {
                    const input = document.getElementById(`elixir-${rarity.id}-${stat.id}`);
                    const count = parseInt(input.value) || 0;
                    pointTotals[stat.id] += count * rarity.value;
                    absorbTotals[stat.id] += count * elixirAbsorbData[rarity.id][stat.id];
                });
            }
        });

        elixirData.stats.forEach(stat => {
            const totalEl = document.getElementById(`elixir-total-${stat.id}`);
            if(totalEl) totalEl.textContent = formatStatNumber(pointTotals[stat.id]);
            const rawEl = document.getElementById(`elixir-total-raw-${stat.id}`);
            if(rawEl) rawEl.textContent = (pointTotals[stat.id]).toLocaleString('en-US');
            const absorbTotalEl = document.getElementById(`elixir-absorb-total-${stat.id}`);
            if(absorbTotalEl) {
                if (stat.isPercentage) {
                    absorbTotalEl.textContent = `${(absorbTotals[stat.id]).toFixed(stat.decimals)}%`;
                } else {
                    absorbTotalEl.textContent = absorbTotals[stat.id].toLocaleString('en-US');
                }
            }
        });
    }

    function initElixirCalculator() {
        if (!checkboxContainer) return;
        elixirData.rarities.forEach(rarity => {
            const div = document.createElement('div');
            const checkboxId = `elixir-check-${rarity.id}`;
            const colors = elixirData.colors[rarity.id] || { bg: '#374151', text: '#d1d5db' };
            div.innerHTML = `
                <input type="checkbox" id="${checkboxId}" class="elixir-checkbox hidden" ${rarity.defaultChecked ? 'checked' : ''}>
                <label for="${checkboxId}" class="elixir-checkbox-label" style="background-color: ${colors.bg}; color: ${colors.text};">
                    ${rarity.name}
                </label>
            `;
            checkboxContainer.appendChild(div);
        });

        elixirData.rarities.forEach(rarity => {
            const section = document.createElement('div');
            section.id = `elixir-section-${rarity.id}`;
            section.className = `card ${!rarity.defaultChecked ? 'hidden' : ''}`;
            let inputsHTML = '';
            elixirData.stats.forEach(stat => {
                inputsHTML += `
                    <div class="input-group">
                        <label for="elixir-${rarity.id}-${stat.id}" title="${stat.name}">${stat.shortName}</label>
                        <input type="number" id="elixir-${rarity.id}-${stat.id}" class="input-field" value="0" min="0">
                    </div>
                `;
            });
            const colors = elixirData.colors[rarity.id] || { bg: '#374151', text: '#d1d5db' };
            section.innerHTML = `
                <h3 class="section-title" style="color: ${colors.bg};">${rarity.name}</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                    ${inputsHTML}
                </div>
            `;
            sectionsContainer.appendChild(section);
        });

        elixirData.stats.forEach(stat => {
            const pointDiv = document.createElement('div');
            pointDiv.className = "p-3 bg-slate-800/50 rounded-lg border border-slate-700";
            pointDiv.innerHTML = `
                <div class="flex justify-between items-center" style="flex-direction:column; align-items:flex-start; gap:6px;">
                    <div class="text-xs text-gray-400 uppercase tracking-wide">${stat.name}</div>
                    <div style="display:flex;align-items:center;gap:0.75rem;">
                        <div id="elixir-total-${stat.id}" class="text-xl font-bold text-blue-400">0</div>
                        <div id="elixir-total-raw-${stat.id}" class="elixir-total-raw">0</div>
                    </div>
                </div>
            `;
            totalsContainer.appendChild(pointDiv);
            const absorbDiv = document.createElement('div');
            absorbDiv.className = "p-3 bg-slate-800/50 rounded-lg border border-slate-700";
            absorbDiv.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="text-xs text-gray-400 uppercase tracking-wide">${stat.name}</div>
                    <div id="elixir-absorb-total-${stat.id}" class="text-xl font-bold text-green-400">0</div>
                </div>
            `;
            absorbTotalsContainer.appendChild(absorbDiv);
        });

        elixirData.rarities.forEach(rarity => {
            const checkbox = document.getElementById(`elixir-check-${rarity.id}`);
            const section = document.getElementById(`elixir-section-${rarity.id}`);
            checkbox.addEventListener('change', () => {
                section.classList.toggle('hidden', !checkbox.checked);
                calculateElixirTotals();
            });

            elixirData.stats.forEach(stat => {
                const input = document.getElementById(`elixir-${rarity.id}-${stat.id}`);
                input.addEventListener('input', calculateElixirTotals);
                // select the whole value on focus so typing replaces the default "0"
                input.addEventListener('focus', function() { this.select(); });
                // prevent mouseup from deselecting the value after focus (keeps selection)
                input.addEventListener('mouseup', function(e) { e.preventDefault(); });
            });
        });

        calculateElixirTotals();
    }
    initElixirCalculator();

    // Target Calculator functionality
    function calculateTargetElixirs() {
        const targetValue = parseFloat(document.getElementById('target-value').value) || 0;
        const targetStat = document.getElementById('target-stat').value;
        const strategy = document.querySelector('input[name="target-strategy"]:checked').value;
        const resultsContainer = document.getElementById('target-results');
        const resultsContent = document.getElementById('target-results-content');

        if (targetValue <= 0) {
            resultsContainer.classList.add('hidden');
            return;
        }

        // Get current inventory from user inputs (using POINTS, not absorb stats)
        const inventory = {};
        elixirData.rarities.forEach(rarity => {
            const checkbox = document.getElementById(`elixir-check-${rarity.id}`);
            if (checkbox && checkbox.checked) {
                const input = document.getElementById(`elixir-${rarity.id}-${targetStat}`);
                const count = parseInt(input.value) || 0;
                if (count > 0) {
                    inventory[rarity.id] = {
                        count: count,
                        pointValue: rarity.value, // Use rarity point value (1, 2, 3, etc.)
                        rarity: rarity.name
                    };
                }
            }
        });

        // Sort rarities based on strategy (by point value)
        let sortedRarities = Object.keys(inventory).sort((a, b) => {
            if (strategy === 'highest') {
                return inventory[b].pointValue - inventory[a].pointValue; // Descending
            } else {
                return inventory[a].pointValue - inventory[b].pointValue; // Ascending
            }
        });

        // Calculate which elixirs to use
        let remaining = targetValue;
        const usedElixirs = [];
        let totalProvided = 0;

        for (const rarityId of sortedRarities) {
            const elixir = inventory[rarityId];
            if (remaining <= 0) break;

            const neededCount = Math.ceil(remaining / elixir.pointValue);
            const useCount = Math.min(neededCount, elixir.count);
            const provided = useCount * elixir.pointValue;

            if (useCount > 0) {
                usedElixirs.push({
                    rarity: elixir.rarity,
                    count: useCount,
                    points: provided,
                    available: elixir.count
                });
                totalProvided += provided;
                remaining -= provided;
            }
        }

        // Display results
        resultsContent.innerHTML = '';

        // Check if we have enough
        const hasEnough = totalProvided >= targetValue;
        
        if (!hasEnough) {
            resultsContent.innerHTML = `
                <div class="p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                    <div class="flex items-start gap-2">
                        <span class="text-red-400 text-lg">⚠️</span>
                        <div>
                            <div class="text-red-400 font-semibold mb-1">Insufficient Inventory</div>
                            <div class="text-xs text-red-300">You need ${formatStatNumber(targetValue)} but can only provide ${formatStatNumber(totalProvided)} from your current inventory.</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const statInfo = elixirData.stats.find(s => s.id === targetStat);
            const totalElixirs = usedElixirs.reduce((sum, e) => sum + e.count, 0);

            let resultHTML = `
                <div class="p-3 bg-green-900/20 border border-green-700/50 rounded-lg mb-3">
                    <div class="text-green-400 font-semibold mb-1">Target: ${formatStatNumber(targetValue)} ${statInfo.shortName} points</div>
                    <div class="text-xs text-green-300">Using ${totalElixirs.toLocaleString()} total elixirs</div>
                </div>
            `;

            usedElixirs.forEach(elixir => {
                resultHTML += `
                    <div class="p-2.5 bg-slate-800/50 border border-slate-700 rounded-lg">
                        <div class="flex justify-between items-center mb-1">
                            <span class="text-slate-300 font-medium">${elixir.rarity}:</span>
                            <span class="text-blue-400 font-semibold">${elixir.count.toLocaleString()} elixirs</span>
                        </div>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-slate-400">${formatStatNumber(elixir.points)} points</span>
                            <span class="text-slate-500">(have ${elixir.available.toLocaleString()})</span>
                        </div>
                    </div>
                `;
            });

            // Show if there's excess
            if (totalProvided > targetValue) {
                const excess = totalProvided - targetValue;
                    
                resultHTML += `
                    <div class="p-2 bg-yellow-900/20 border border-yellow-700/50 rounded-lg mt-2">
                        <div class="text-xs text-yellow-300">
                            ℹ️ Actual total: ${formatStatNumber(totalProvided)} points (excess: ${formatStatNumber(excess)})
                        </div>
                    </div>
                `;
            }

            resultsContent.innerHTML = resultHTML;
        }

        resultsContainer.classList.remove('hidden');
    }

    // Event listeners for target calculator
    const calculateTargetBtn = document.getElementById('calculate-target-btn');
    if (calculateTargetBtn) {
        calculateTargetBtn.addEventListener('click', calculateTargetElixirs);
    }
});
