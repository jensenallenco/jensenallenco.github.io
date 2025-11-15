import re
import sys

# Path to the data file
DATA_FILE = r"d:\Dev\repos\cultivation_simulator\CultivationSimulator\features\upgrade-calculator\upgrade-data.js"

# The user's provided list for levels 1..99 (one-based index)
provided = [
10996,10999,11114,11117,16088,16092,17207,20154,20750,21205,21415,21498,21731,22250,22483,22780,23291,23495,23760,23921,24056,24204,24830,24908,26403,27234,28673,30966,31023,31031,31277,31285,31710,31718,36707,38570,40191,41513,43792,45726,48879,49862,53618,54643,59769,63575,68882,89113,112000,122000,158000,167000,173000,181000,188000,196000,203000,253000,449000,481000,514000,554000,591000,620000,648000,677000,737000,766000,778000,796000,825000,847000,1623000,1722000,1737000,1751000,1766000,1781000,1796000,1810000,1824000,1839000,1853000,1867000,1881000,1896000,1910000,1924000,1938000,1953000,1967000,1981000,1995000,2009000,2024000,2038000,2052000,2066000,2081000
]

# Read file
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    text = f.read()

# Extract farmsCosts block
m = re.search(r"const\s+farmsCosts\s*=\s*\{([\s\S]*?)\};", text)
if not m:
    print('ERROR: farmsCosts block not found in file')
    sys.exit(2)
block = m.group(1)

# Parse lines like '  1: 10996,' or '100: 2095000'
pattern = re.compile(r"\s*(\d+)\s*:\s*(\d+)\s*,?\s*$", re.MULTILINE)
found = {int(k): int(v) for k, v in pattern.findall(block)}

# Compare levels 1..99
mismatches = []
missing = []
extra = []
for lvl in range(1, 100):
    prov_val = provided[lvl-1]
    file_val = found.get(lvl)
    if file_val is None:
        missing.append(lvl)
    elif file_val != prov_val:
        mismatches.append((lvl, prov_val, file_val))

# Find any extra levels present in file beyond 99 (not an error, just report)
for k in sorted(found.keys()):
    if k not in range(1, 100):
        extra.append((k, found[k]))

# Output results
if not mismatches and not missing:
    print('All levels 1-99 match the provided list.')
else:
    if missing:
        print('Missing levels in file:', missing)
    if mismatches:
        print('Mismatched values (level, provided, file):')
        for lvl, prov, filev in mismatches:
            print(f'  {lvl}: provided={prov}, file={filev}')

if extra:
    print('\nAdditional levels present in file (beyond 1-99):')
    for k,v in extra:
        print(f'  {k}: {v}')

# Exit code 0
sys.exit(0)
