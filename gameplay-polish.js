const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let ok = 0;

function safe(name, old, rep) {
  if (html.includes(old)) { html = html.replace(old, rep); ok++; console.log('  ✅ ' + name); }
  else console.log('  ⏭️ ' + name);
}

console.log('=== GAMEPLAY POLISH ===\n');

// 1. Round minimap
safe('Round minimap',
  '#minimap{position:fixed;bottom:15px;left:15px;width:130px;height:130px;z-index:25;',
  '#minimap{position:fixed;bottom:15px;left:15px;width:130px;height:130px;z-index:25;border-radius:50%;'
);

// 2. Scenario popup - more transparent, less blocking
safe('Transparent scenario popup',
  'background:rgba(4,12,20,.95);border:1px solid rgba(74,222,128,.2);border-radius:18px;',
  'background:rgba(4,12,20,.8);border:1px solid rgba(74,222,128,.25);border-radius:18px;'
);

// 3. Game over - epic glow
safe('Epic game over',
  '#gameOver h2{font-size:clamp(36px,7vw,60px);color:#4ade80;margin-bottom:10px;text-shadow:0 0 20px rgba(74,222,128,.5)}',
  '#gameOver h2{font-size:clamp(36px,7vw,60px);color:#4ade80;margin-bottom:10px;text-shadow:0 0 30px rgba(74,222,128,.7),0 0 60px rgba(74,222,128,.2)}'
);

// 4. Level up - epic glow
safe('Epic level up',
  '#levelUp h2{font-size:clamp(36px,7vw,60px);color:#4ade80;text-shadow:0 0 25px rgba(74,222,128,.5)}',
  '#levelUp h2{font-size:clamp(36px,7vw,60px);color:#4ade80;text-shadow:0 0 30px rgba(74,222,128,.7),0 0 80px rgba(74,222,128,.3)}'
);

// 5. Satisfying button press
safe('Button feel',
  '.choice-btn:active{transform:scale(.95)}',
  '.choice-btn:active{transform:scale(.92);filter:brightness(1.15)}'
);

// 6. Start screen button - remove pulse animation (cleaner)
safe('Clean play button',
  'animation:btnGlow 1.5s ease-in-out infinite alternate',
  ''
);

// 7. Scenario text - better readability
safe('Scenario text shadow',
  '#scenario .situation{color:#fff;font-size:clamp(17px,3.5vw,22px);font-weight:700;margin-bottom:18px;line-height:1.6;direction:rtl}',
  '#scenario .situation{color:#fff;font-size:clamp(17px,3.5vw,22px);font-weight:700;margin-bottom:18px;line-height:1.6;direction:rtl;text-shadow:0 1px 3px rgba(0,0,0,0.4)}'
);

// 8. Followers text - cleaner
safe('Clean followers',
  '#followers{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:none;',
  '#followers{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:20;pointer-events:none;font-size:14px;letter-spacing:1px;'
);

// 9. HUD shadow
safe('HUD shadow',
  '.hud-item{background:rgba(0,0,20,.75);border-radius:15px;padding:8px 16px;display:flex;align-items:center;gap:6px;',
  '.hud-item{background:rgba(0,8,16,.85);border-radius:12px;padding:8px 16px;display:flex;align-items:center;gap:6px;box-shadow:0 2px 8px rgba(0,0,0,0.3);'
);

fs.writeFileSync('index.html', html);
console.log('\nDone: ' + ok + ' gameplay polish changes');
