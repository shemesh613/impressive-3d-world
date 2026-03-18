#!/bin/bash
FILE="index.html"

# ══════════════════════════════════════════════
# 1. START SCREEN - PREMIUM LOOK
# ══════════════════════════════════════════════

# Cleaner background gradient
sed -i "s|background:radial-gradient(ellipse at center,#0a3020 0%,#001510 70%)|background:radial-gradient(ellipse at 50% 30%,#0d2818 0%,#040d08 60%,#000 100%)|g" "$FILE"

# Title - remove pulse animation, add letterSpacing
sed -i "s|animation:pulse 2s ease-in-out infinite;||g" "$FILE"

# Play button - remove glow animation, cleaner style
sed -i "s|animation:btnGlow 1.5s ease-in-out infinite alternate||g" "$FILE"
sed -i "s|box-shadow:0 0 40px rgba(34,197,94,.4),0 8px 25px rgba(0,0,0,.4);|box-shadow:0 4px 20px rgba(34,197,94,.3);|g" "$FILE"

echo "✅ Step 1: Premium start screen"

# ══════════════════════════════════════════════
# 2. HUD - CLEANER, MORE READABLE
# ══════════════════════════════════════════════

# HUD items - cleaner backgrounds
sed -i "s|background:rgba(0,0,20,.75);border-radius:15px;padding:8px 16px;|background:rgba(0,8,16,.85);border-radius:10px;padding:6px 14px;|g" "$FILE"
sed -i "s|border:2px solid rgba(255,255,255,.12);|border:1px solid rgba(255,255,255,.08);|g" "$FILE"

echo "✅ Step 2: Cleaner HUD"

# ══════════════════════════════════════════════
# 3. SCENARIO POPUP - MORE POLISHED
# ══════════════════════════════════════════════

# Scenario - refined
sed -i "s|background:rgba(0,10,20,.92);border:2px solid rgba(74,222,128,.3);border-radius:24px;|background:rgba(4,12,20,.95);border:1px solid rgba(74,222,128,.2);border-radius:18px;|g" "$FILE"

# Choice buttons - cleaner radius
sed -i "s|border-radius:16px;border:none;|border-radius:12px;border:none;|g" "$FILE"

echo "✅ Step 3: Polished scenario popup"

# ══════════════════════════════════════════════
# 4. GAME OVER - CLEANER
# ══════════════════════════════════════════════

sed -i "s|background:rgba(0,0,0,.88);backdrop-filter:blur(8px)|background:rgba(0,0,0,.92);backdrop-filter:blur(12px)|g" "$FILE"

echo "✅ Step 4: Cleaner game over screen"

# ══════════════════════════════════════════════
# 5. MOBILE CONTROLS - MORE POLISHED
# ══════════════════════════════════════════════

sed -i "s|background:rgba(255,255,255,.1);backdrop-filter:blur(4px);|background:rgba(255,255,255,.08);backdrop-filter:blur(8px);|g" "$FILE"

echo "✅ Step 5: Polished mobile controls"

echo ""
echo "🎉 Green Folder premium UI complete!"
