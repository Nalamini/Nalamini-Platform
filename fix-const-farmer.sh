#!/bin/bash
# Make a backup of the file
cp server/routes.ts server/routes.ts.bak

# Replace all occurrences of 'const farmerDetail =' with 'let farmerDetail ='
sed -i 's/const farmerDetail =/let farmerDetail =/g' server/routes.ts
