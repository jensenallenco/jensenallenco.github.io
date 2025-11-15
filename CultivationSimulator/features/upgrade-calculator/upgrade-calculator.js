// Upgrade Calculator Logic
(function () {
  "use strict";

  // Wait for DOM and data to load
  document.addEventListener("DOMContentLoaded", function () {
    if (
      typeof farmsCosts === "undefined" ||
      typeof furnaceCosts === "undefined"
    ) {
      console.error("Upgrade data not loaded");
      return;
    }

    // Get DOM elements
    const farmsCurrentInput = document.getElementById("farms-current");
    const farmsTargetInput = document.getElementById("farms-target");
    const farmsQtyInput = document.getElementById("farms-qty");
    const furnaceCurrentInput = document.getElementById("furnace-current");
    const furnaceTargetInput = document.getElementById("furnace-target");

    const farmsCostDisplay = document.getElementById("farms-cost");
    const furnaceCostDisplay = document.getElementById("furnace-cost");
    const totalCostDisplay = document.getElementById("total-cost");

    const tableBody = document.getElementById("cost-table-body");
    const tableToggle = document.getElementById("table-toggle");
    const tableSection = document.getElementById("table-section");
  const resetBtn = document.getElementById("reset-btn");
  const farmsSet80Btn = document.getElementById("farms-set-80");
  const farmsSetMaxBtn = document.getElementById("farms-set-max");
  const furnaceSet80Btn = document.getElementById("furnace-set-80");
  const furnaceSetMaxBtn = document.getElementById("furnace-set-max");
    // Max All button removed per UX change

    // Determine maximum level from data so the UI adapts to added entries
    const MAX_LEVEL = Math.max(
      ...Object.keys(farmsCosts).map((k) => parseInt(k, 10)),
      ...Object.keys(furnaceCosts).map((k) => parseInt(k, 10))
    );

    // Adjust input attributes and UI labels to reflect MAX_LEVEL
    if (farmsCurrentInput) farmsCurrentInput.max = Math.max(1, MAX_LEVEL - 1);
    if (farmsTargetInput) {
      farmsTargetInput.max = MAX_LEVEL;
      farmsTargetInput.placeholder = `e.g. ${MAX_LEVEL}`;
    }
    if (furnaceCurrentInput)
      furnaceCurrentInput.max = Math.max(1, MAX_LEVEL - 1);
    if (furnaceTargetInput) {
      furnaceTargetInput.max = MAX_LEVEL;
      furnaceTargetInput.placeholder = `e.g. ${MAX_LEVEL}`;
    }

  // Update quick-set button labels: left button remains Set 80, right button is Set MAX
  if (farmsSet80Btn) farmsSet80Btn.textContent = `80`;
  if (farmsSetMaxBtn) farmsSetMaxBtn.textContent = `100`;
  if (furnaceSet80Btn) furnaceSet80Btn.textContent = `80`;
  if (furnaceSetMaxBtn) furnaceSetMaxBtn.textContent = `100`;

    // Update initial toggle label to reflect dynamic max level
    if (tableToggle) {
      const initialSpan = tableToggle.querySelector("span");
      if (initialSpan)
        initialSpan.textContent = `▼ View Full Cost Table (Lvl 1-${MAX_LEVEL})`;
    }

    // Update support text in the UI to reflect the data-driven supported range
    const supportRangeEl = document.getElementById("support-range");
    if (supportRangeEl) {
      supportRangeEl.textContent = `🚧 This calculator currently supports levels 1–${MAX_LEVEL}.`;
    }

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
      return num.toLocaleString("en-US");
    }

    // Update all calculations
    function updateCalculations() {
      const farmsCurrent = parseInt(farmsCurrentInput.value) || 1;
      const farmsTarget =
        farmsTargetInput.value === ""
          ? null
          : parseInt(farmsTargetInput.value) || null;
      let farmsQty =
        farmsQtyInput.value === ""
          ? null
          : parseInt(farmsQtyInput.value) || null;
      if (farmsQty !== null) {
        if (farmsQty < 1) farmsQty = 1;
        if (farmsQty > 5) farmsQty = 5; // enforce max 5 farms
      }
      const furnaceCurrent = parseInt(furnaceCurrentInput.value) || 1;
      const furnaceTarget =
        furnaceTargetInput.value === ""
          ? null
          : parseInt(furnaceTargetInput.value) || null;

      // If any required fields are missing, show 0 and skip calculations until user inputs
      const hasFarms = farmsTarget !== null && farmsQty !== null;
      const hasFurnace = furnaceTarget !== null;

      let farmsTotalCost = 0;
      let furnaceTotalCost = 0;

      if (hasFarms) {
        const farmsSingleCost = calculateUpgradeCost(
          farmsCurrent,
          farmsTarget,
          farmsCosts
        );
        farmsTotalCost = farmsSingleCost * Math.max(1, farmsQty);
      }
      if (hasFurnace) {
        furnaceTotalCost = calculateUpgradeCost(
          furnaceCurrent,
          furnaceTarget,
          furnaceCosts
        );
      }
      const grandTotal = farmsTotalCost + furnaceTotalCost;

      // Update displays
      farmsCostDisplay.textContent = formatNumber(farmsTotalCost);
      furnaceCostDisplay.textContent = formatNumber(furnaceTotalCost);
      totalCostDisplay.textContent = formatNumber(grandTotal);

      // Update table highlights if visible and we have valid ranges
      if (!tableSection.classList.contains("hidden")) {
        populateTable();
        updateTableHighlights(
          farmsCurrent,
          hasFarms ? farmsTarget : farmsCurrent,
          furnaceCurrent,
          hasFurnace ? furnaceTarget : furnaceCurrent
        );
      }
    }

    // Populate the full cost table with running totals
    function populateTable() {
      tableBody.innerHTML = "";

      // Calculate running totals
      let farmsRunningTotal = 0;
      let furnaceRunningTotal = 0;

      for (let lvl = 1; lvl <= MAX_LEVEL; lvl++) {
        const farmCost = farmsCosts[lvl] || 0;
        const furnaceCost = furnaceCosts[lvl] || 0;

        farmsRunningTotal += farmCost;
        furnaceRunningTotal += furnaceCost;

        const row = document.createElement("tr");
        row.className =
          "border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors";
        row.dataset.level = lvl;

        row.innerHTML = `
          <td class="py-2 px-3 text-slate-300 font-medium">${lvl}</td>
          <td class="py-2 px-3 text-green-400 font-mono text-xs md:text-sm">${formatNumber(
            farmCost
          )}</td>
          <td class="py-2 px-3 text-orange-400 font-mono text-xs md:text-sm">${formatNumber(
            furnaceCost
          )}</td>
        `;
        tableBody.appendChild(row);
      }
    }

    // Highlight table rows based on current/target levels and show reactive cost ranges
    function updateTableHighlights(
      farmsCurrent,
      farmsTarget,
      furnaceCurrent,
      furnaceTarget
    ) {
      const rows = tableBody.querySelectorAll("tr");
      const farmsQty = parseInt(farmsQtyInput.value) || 5;

      rows.forEach((row) => {
        const lvl = parseInt(row.dataset.level);
        row.classList.remove(
          "bg-sky-900/20",
          "ring-1",
          "ring-sky-500/30",
          "bg-green-900/10",
          "ring-green-500/20",
          "bg-orange-900/10",
          "ring-orange-500/20"
        );

        const inFarmsRange = lvl >= farmsCurrent && lvl < farmsTarget;
        const inFurnaceRange = lvl >= furnaceCurrent && lvl < furnaceTarget;

        // Highlight based on which upgrade path includes this level
        if (inFarmsRange && inFurnaceRange) {
          row.classList.add("bg-sky-900/20", "ring-1", "ring-sky-500/30");
        } else if (inFarmsRange) {
          row.classList.add("bg-green-900/10", "ring-1", "ring-green-500/20");
        } else if (inFurnaceRange) {
          row.classList.add("bg-orange-900/10", "ring-1", "ring-orange-500/20");
        }
      });
    }

    // Toggle table visibility
    if (tableToggle) {
      tableToggle.addEventListener("click", function () {
        const isHidden = tableSection.classList.contains("hidden");
        const toggleSpan = tableToggle.querySelector("span");
        if (isHidden) {
          tableSection.classList.remove("hidden");
          tableToggle.innerHTML = `▲ Hide Full Cost Table (Lvl 1-${MAX_LEVEL})`;
          if (tableBody.children.length === 0) {
            populateTable();
          }
          updateCalculations(); // Refresh highlights
        } else {
          tableSection.classList.add("hidden");
          tableToggle.innerHTML = `▼ View Full Cost Table (Lvl 1-${MAX_LEVEL})`;
        }
      });
    }

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        farmsCurrentInput.value = 1;
        farmsTargetInput.value = "";
        farmsQtyInput.value = "";
        furnaceCurrentInput.value = 1;
        furnaceTargetInput.value = "";
        updateCalculations();
      });
    }

    // Quick set buttons: set to 80 (left) or to MAX_LEVEL (right)
    if (farmsSet80Btn) {
      farmsSet80Btn.addEventListener("click", function () {
        farmsTargetInput.value = 80;
        updateCalculations();
        farmsTargetInput.focus();
      });
    }
    if (farmsSetMaxBtn) {
      farmsSetMaxBtn.addEventListener("click", function () {
        farmsTargetInput.value = MAX_LEVEL+1;
        updateCalculations();
        farmsTargetInput.focus();
      });
    }
    if (furnaceSet80Btn) {
      furnaceSet80Btn.addEventListener("click", function () {
        furnaceTargetInput.value = 80;
        updateCalculations();
        furnaceTargetInput.focus();
      });
    }
    if (furnaceSetMaxBtn) {
      furnaceSetMaxBtn.addEventListener("click", function () {
        furnaceTargetInput.value = MAX_LEVEL+1;
        updateCalculations();
        furnaceTargetInput.focus();
      });
    }

    // Max All button removed

    // Attach input listeners
    [
      farmsCurrentInput,
      farmsTargetInput,
      farmsQtyInput,
      furnaceCurrentInput,
      furnaceTargetInput,
    ].forEach((input) => {
      if (input) {
        input.addEventListener("input", updateCalculations);
      }
    });

    // Reflect clamped farms quantity in the UI immediately
    if (farmsQtyInput) {
      function clampFarmsQty() {
        if (farmsQtyInput.value === "") return; // allow empty
        let v = parseInt(farmsQtyInput.value, 10);
        if (isNaN(v)) {
          farmsQtyInput.value = "";
          return;
        }
        if (v < 1) v = 1;
        if (v > 5) v = 5;
        farmsQtyInput.value = v;
      }
      farmsQtyInput.addEventListener("input", clampFarmsQty);
      farmsQtyInput.addEventListener("blur", clampFarmsQty);
    }

    // Initial state: show zeros until user inputs targets
    updateCalculations();
  });
})();
