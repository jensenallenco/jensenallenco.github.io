// Upgrade Calculator Logic
(function() {
  'use strict';

  // Wait for DOM and data to load
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof farmsCosts === 'undefined' || typeof furnaceCosts === 'undefined') {
      console.error('Upgrade data not loaded');
      return;
    }

    // Get DOM elements
    const farmsCurrentInput = document.getElementById('farms-current');
    const farmsTargetInput = document.getElementById('farms-target');
    const farmsQtyInput = document.getElementById('farms-qty');
    const furnaceCurrentInput = document.getElementById('furnace-current');
    const furnaceTargetInput = document.getElementById('furnace-target');

    const farmsCostDisplay = document.getElementById('farms-cost');
    const furnaceCostDisplay = document.getElementById('furnace-cost');
    const totalCostDisplay = document.getElementById('total-cost');

    const tableBody = document.getElementById('cost-table-body');
    const tableToggle = document.getElementById('table-toggle');
    const tableSection = document.getElementById('table-section');
    const resetBtn = document.getElementById('reset-btn');
    const maxAllBtn = document.getElementById('max-all-btn');

    // Calculate upgrade cost from current to target level
    // Each entry in costsTable[level] is the cost to upgrade FROM that level TO the next
    function calculateUpgradeCost(currentLvl, targetLvl, costsTable) {
      if (currentLvl >= targetLvl) return 0;
      let total = 0;
      for (let i = parseInt(currentLvl); i < parseInt(targetLvl); i++) {
        total += costsTable[i] || 0;
      }
      return total;
    }

    // Format number with commas
    function formatNumber(num) {
      return num.toLocaleString('en-US');
    }

    // Update all calculations
    function updateCalculations() {
      const farmsCurrent = parseInt(farmsCurrentInput.value) || 1;
      const farmsTarget = parseInt(farmsTargetInput.value) || 80;
      const farmsQty = parseInt(farmsQtyInput.value) || 5;
      const furnaceCurrent = parseInt(furnaceCurrentInput.value) || 1;
      const furnaceTarget = parseInt(furnaceTargetInput.value) || 80;

      // Calculate costs
      const farmsSingleCost = calculateUpgradeCost(farmsCurrent, farmsTarget, farmsCosts);
      const farmsTotalCost = farmsSingleCost * farmsQty;
      const furnaceTotalCost = calculateUpgradeCost(furnaceCurrent, furnaceTarget, furnaceCosts);
      const grandTotal = farmsTotalCost + furnaceTotalCost;

      // Update displays
      farmsCostDisplay.textContent = formatNumber(farmsTotalCost);
      furnaceCostDisplay.textContent = formatNumber(furnaceTotalCost);
      totalCostDisplay.textContent = formatNumber(grandTotal);

      // Update table highlights if visible
      if (!tableSection.classList.contains('hidden')) {
        // Rebuild table so it stays in sync with any changes to costs or range
        populateTable();
        updateTableHighlights(farmsCurrent, farmsTarget, furnaceCurrent, furnaceTarget);
      }
    }

    // Populate the full cost table with running totals
    function populateTable() {
      tableBody.innerHTML = '';
      
      // Calculate running totals
      let farmsRunningTotal = 0;
      let furnaceRunningTotal = 0;
      
      for (let lvl = 1; lvl <= 80; lvl++) {
        const farmCost = farmsCosts[lvl] || 0;
        const furnaceCost = furnaceCosts[lvl] || 0;
        
        farmsRunningTotal += farmCost;
        furnaceRunningTotal += furnaceCost;
        
        const row = document.createElement('tr');
        row.className = 'border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors';
        row.dataset.level = lvl;
        
        row.innerHTML = `
          <td class="py-2 px-3 text-slate-300 font-medium">${lvl}</td>
          <td class="py-2 px-3 text-green-400 font-mono text-xs md:text-sm">${formatNumber(farmCost)}</td>
          <td class="py-2 px-3 text-orange-400 font-mono text-xs md:text-sm">${formatNumber(furnaceCost)}</td>
        `;
        tableBody.appendChild(row);
      }
    }

    // Highlight table rows based on current/target levels and show reactive cost ranges
    function updateTableHighlights(farmsCurrent, farmsTarget, furnaceCurrent, furnaceTarget) {
      const rows = tableBody.querySelectorAll('tr');
      const farmsQty = parseInt(farmsQtyInput.value) || 5;
      
      rows.forEach(row => {
        const lvl = parseInt(row.dataset.level);
        row.classList.remove('bg-sky-900/20', 'ring-1', 'ring-sky-500/30', 'bg-green-900/10', 'ring-green-500/20', 'bg-orange-900/10', 'ring-orange-500/20');
        
        const inFarmsRange = lvl >= farmsCurrent && lvl < farmsTarget;
        const inFurnaceRange = lvl >= furnaceCurrent && lvl < furnaceTarget;
        
        // Highlight based on which upgrade path includes this level
        if (inFarmsRange && inFurnaceRange) {
          row.classList.add('bg-sky-900/20', 'ring-1', 'ring-sky-500/30');
        } else if (inFarmsRange) {
          row.classList.add('bg-green-900/10', 'ring-1', 'ring-green-500/20');
        } else if (inFurnaceRange) {
          row.classList.add('bg-orange-900/10', 'ring-1', 'ring-orange-500/20');
        }
      });
    }

    // Toggle table visibility
    if (tableToggle) {
      tableToggle.addEventListener('click', function() {
        const isHidden = tableSection.classList.contains('hidden');
        if (isHidden) {
          tableSection.classList.remove('hidden');
          tableToggle.innerHTML = '▲ Hide Full Cost Table (Lvl 1-80)';
          if (tableBody.children.length === 0) {
            populateTable();
          }
          updateCalculations(); // Refresh highlights
        } else {
          tableSection.classList.add('hidden');
          tableToggle.innerHTML = '▼ View Full Cost Table (Lvl 1-80)';
        }
      });
    }

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        farmsCurrentInput.value = 1;
        farmsTargetInput.value = 80;
        farmsQtyInput.value = 5;
        furnaceCurrentInput.value = 1;
        furnaceTargetInput.value = 80;
        updateCalculations();
      });
    }

    // Max All button
    if (maxAllBtn) {
      maxAllBtn.addEventListener('click', function() {
        farmsTargetInput.value = 80;
        furnaceTargetInput.value = 80;
        updateCalculations();
      });
    }

    // Attach input listeners
    [farmsCurrentInput, farmsTargetInput, farmsQtyInput, furnaceCurrentInput, furnaceTargetInput].forEach(input => {
      if (input) {
        input.addEventListener('input', updateCalculations);
      }
    });

    // Initial calculation
    updateCalculations();
  });
})();
