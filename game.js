// FORCE kill old service workers and caches
if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(regs){regs.forEach(function(r){r.unregister()})})}
if('caches' in window){caches.keys().then(function(names){names.forEach(function(n){caches.delete(n)})})}

'use strict';

window.addEventListener('DOMContentLoaded',()=>{if(typeof _loadSettings==='function')_loadSettings()});

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{})}



// ---- SCENARIOS DATABASE ----

const SCENARIOS = [

  {

    situation: "אתה וחבר שלך — שניכם רוצים להיות שוער. מה עושים?",

    green: {text: "🟢 משחק ראשון אני, שני אתה!", points: 15},

    red: {text: "🔴 אני שוער ונקודה! אני הגעתי ראשון!", points: -5},

    greenFeedback: "🌊 יופי! פשרה מהירה — כולם משחקים!",

    redFeedback: "🛑 עכשיו כולם מחכים בגלל הויכוח..."

  },

  {

    situation: "בטיול — רצית תיק אחר אבל אמא ארזה לך את הישן. מה עושים?",

    green: {text: "🟢 קצת מבאס, אבל יאללה לטיול!", points: 15},

    red: {text: "🔴 לא נוסע! רציתי את התיק הכחול!", points: -5},

    greenFeedback: "🌊 כל הכבוד! התיק לא חשוב — הטיול כן!",

    redFeedback: "🛑 כל הכיתה מחכה באוטובוס בגללך..."

  },

  {

    situation: "משחקים כדורגל וחבר אומר שהכדור יצא לקו. אתה חושב שלא.",

    green: {text: "🟢 אוקיי, בואו נמשיך — זה לא גמר גביע", points: 15},

    red: {text: "🔴 אני צודק! אני לא משחק ככה!", points: -5},

    greenFeedback: "🌊 זרימה! ויתרת על קטנות ומשחקים הלאה",

    redFeedback: "🛑 כולם עומדים ומחכים שתפסיק לריב..."

  },

  {

    situation: "בהפסקה — חברים רוצים לשחק מחבואים, אבל אתה רצית תופסת.",

    green: {text: "🟢 מחבואים? סבבה, גם כיף!", points: 15},

    red: {text: "🔴 רק תופסת! אחרת לא משחק!", points: -5},

    greenFeedback: "🌊 גמישות! כיף לכולם ואתה חלק מהחבורה",

    redFeedback: "🛑 נשארת לבד כי כולם הלכו לשחק..."

  },

  {

    situation: "חילקו ארטיק והחבר שלך קיבל טעם שאתה רצית.",

    green: {text: "🟢 גם הטעם שלי טוב, יאללה!", points: 15},

    red: {text: "🔴 זה לא הוגן! אני רוצה להחליף!", points: -5},

    greenFeedback: "🌊 מעולה! לא נתקעת על ארטיק — נהנית!",

    redFeedback: "🛑 עד שסיימת לריב — הארטיק נמס..."

  },

  {

    situation: "בכיתה חילקו צוותים ואתה לא עם החבר הכי טוב שלך.",

    green: {text: "🟢 אכיר חברים חדשים — יהיה בסדר!", points: 15},

    red: {text: "🔴 אני רוצה להחליף! רק עם יוסי!", points: -5},

    greenFeedback: "🌊 פתיחות! גילית חברים חדשים מגניבים",

    redFeedback: "🛑 המורה עצרה את כולם בגללך..."

  },

  {

    situation: "במסיבה — אתה רצית לשבת ליד החלון, אבל מישהו כבר שם.",

    green: {text: "🟢 לא נורא, יש מקומות טובים אחרים", points: 15},

    red: {text: "🔴 אני תמיד יושב שם! תזוז!", points: -5},

    greenFeedback: "🌊 גמישות! כיף גם ממקום אחר",

    redFeedback: "🛑 מסיבה שכולם נהנים ואתה רב על כיסא..."

  },

  {

    situation: "אתה בתור למגלשה והילד שלפניך לוקח המון זמן.",

    green: {text: "🟢 סבלנות, עוד רגע התור שלי", points: 15},

    red: {text: "🔴 מספיק! אני דוחף אותו!", points: -5},

    greenFeedback: "🌊 סבלנות! עוד שנייה התור שלך — שווה לחכות",

    redFeedback: "🛑 דחפת ועכשיו שניכם בצד בלי מגלשה..."

  },

  {

    situation: "רצית מקום ראשון בתור, אבל חברה הגיעה לפניך.",

    green: {text: "🟢 היא הגיעה קודם, פייר — אני שני", points: 15},

    red: {text: "🔴 אני תמיד ראשון! זה המקום שלי!", points: -5},

    greenFeedback: "🌊 הוגנות! כולם רואים שאתה מלך",

    redFeedback: "🛑 ויכוח על מקום בתור — כולם מתעכבים..."

  },

  {

    situation: "המורה שינתה את מקומות הישיבה ואתה לא אוהב את המקום החדש.",

    green: {text: "🟢 אנסה כמה ימים, אולי דווקא טוב", points: 15},

    red: {text: "🔴 אני לא מוכן! מחזירים אותי!", points: -5},

    greenFeedback: "🌊 אלוף! נתת צ'אנס — וגילית שדווקא כיף",

    redFeedback: "🛑 כל הכיתה מחכה שתשב כבר..."

  },

  {

    situation: "במשחק קלפים — חבר אומר שהוא ניצח, אתה לא בטוח.",

    green: {text: "🟢 אוקיי, כל הכבוד! עוד סיבוב?", points: 15},

    red: {text: "🔴 אתה רמאי! אני לא משחק יותר!", points: -5},

    greenFeedback: "🌊 יופי! ויתרת על סיבוב אחד — המשחק נמשך!",

    redFeedback: "🛑 קראת לחבר רמאי — עכשיו הוא עצוב..."

  },

  {

    situation: "ביום כיף — כולם רוצים טרמפולינה, אתה רצית קיר טיפוס.",

    green: {text: "🟢 טרמפולינה? גם מגניב! יאללה!", points: 15},

    red: {text: "🔴 קיר טיפוס או שאני לא בא!", points: -5},

    greenFeedback: "🌊 זרמת עם החבורה — כיף כפול!",

    redFeedback: "🛑 כולם בטרמפולינה ואתה לבד בפינה..."

  },

  // ---- גמישות כשתוכניות משתנות ----

  {

    situation: "תכננת ללכת לפארק עם חברים, אבל ירד גשם פתאום.",

    green: {text: "🟢 נשחק משחק קופסה בבית — גם כיף!", points: 15},

    red: {text: "🔴 אני לא בא! רציתי פארק ונקודה!", points: -5},

    greenFeedback: "🌊 זרימה! הפכת גשם ליום מגניב עם חברים",

    redFeedback: "🛑 כולם נהנים בפנים ואתה כועס בבית לבד..."

  },

  {

    situation: "אמא הבטיחה פיצה לארוחת ערב, אבל בסוף הכינה פסטה.",

    green: {text: "🟢 גם פסטה זה טעים! תודה אמא!", points: 15},

    red: {text: "🔴 רציתי פיצה! אני לא אוכל!", points: -5},

    greenFeedback: "🌊 גמישות! נהנית מארוחה טעימה בלי דרמה",

    redFeedback: "🛑 הלכת לישון רעב בגלל פסטה..."

  },

  {

    situation: "הטיול השנתי השתנה מלונה-פארק לגן חיות.",

    green: {text: "🟢 גן חיות? מגניב! אראה חיות!", points: 15},

    red: {text: "🔴 רציתי לונה-פארק! לא הולך!", points: -5},

    greenFeedback: "🌊 זרמת! והנמרים היו שווים את זה!",

    redFeedback: "🛑 כל הכיתה בטיול ואתה נשארת בבית..."

  },

  // ---- גמישות במשחקים עם חברים ----

  {

    situation: "רצית לשחק כדורגל אבל אין מספיק ילדים — מציעים כדורעף.",

    green: {text: "🟢 כדורעף? יאללה ננסה!", points: 15},

    red: {text: "🔴 רק כדורגל! לא משחק שום דבר אחר!", points: -5},

    greenFeedback: "🌊 פתיחות! גילית משחק חדש שאהבת!",

    redFeedback: "🛑 כולם משחקים ואתה יושב בצד עקשן..."

  },

  {

    situation: "במשחק מחבואים — רצית להיות המחפש, אבל נפל לך להתחבא.",

    green: {text: "🟢 גם להתחבא כיף! אמצא מקום מטורף!", points: 15},

    red: {text: "🔴 אני רק מחפש! אחרת לא משחק!", points: -5},

    greenFeedback: "🌊 גמישות! מצאת מקום גאוני ונהנית!",

    redFeedback: "🛑 עצרת את המשחק לכולם בגלל תפקיד..."

  },

  {

    situation: "חבר הביא משחק חדש שאתה לא מכיר במקום המשחק הרגיל.",

    green: {text: "🟢 מעניין! תלמד אותי את החוקים!", points: 15},

    red: {text: "🔴 לא רוצה! בואו נשחק את מה שתמיד!", points: -5},

    greenFeedback: "🌊 פתיחות! המשחק החדש הפך לאהוב שלך!",

    redFeedback: "🛑 כולם נהנים מהמשחק החדש ואתה בצד..."

  },

  // ---- גמישות בבית הספר ----

  {

    situation: "המורה שינתה את הזוג שלך בעבודה — במקום יוסי, קיבלת דנה.",

    green: {text: "🟢 אכיר את דנה! בטח יהיה מעניין", points: 15},

    red: {text: "🔴 רק עם יוסי! אני לא עובד עם אף אחד אחר!", points: -5},

    greenFeedback: "🌊 זרימה! דנה הפכה לחברה חדשה מעולה!",

    redFeedback: "🛑 ישבת לבד ולא עשית את העבודה..."

  },

  {

    situation: "שיעור ספורט בוטל והמורה שמה במקומו שיעור אמנות.",

    green: {text: "🟢 אמנות? גם כיף! אצייר משהו מגניב!", points: 15},

    red: {text: "🔴 רציתי ספורט! אמנות משעממת!", points: -5},

    greenFeedback: "🌊 גמישות! הציור שלך תלוי עכשיו על הקיר!",

    redFeedback: "🛑 ישבת עם ידיים שלובות כל השיעור..."

  },

  {

    situation: "ההפסקה התקצרה היום בגלל אירוע מיוחד אחר כך.",

    green: {text: "🟢 הפסקה קצרה? בסדר, האירוע בטח שווה!", points: 15},

    red: {text: "🔴 זה לא פייר! אני רוצה הפסקה מלאה!", points: -5},

    greenFeedback: "🌊 סבלנות וגמישות! האירוע היה מטורף!",

    redFeedback: "🛑 התלוננת כל היום ופספסת את הכיף..."

  },

  // ---- גמישות חברתית ----

  {

    situation: "הזמנת חברים הביתה, אבל הם רוצים לשחק בחוץ במקום בפנים.",

    green: {text: "🟢 חוץ? למה לא! שנחליף תוכנית!", points: 15},

    red: {text: "🔴 אצלי בבית — אצלי החוקים!", points: -5},

    greenFeedback: "🌊 זרימה! משחק בחוץ היה כיף כפול!",

    redFeedback: "🛑 החברים הלכו הביתה כי לא נעים להם..."

  },

  {

    situation: "תכננת לשבת ליד החלון באוטובוס, אבל חבר ביקש לשבת שם.",

    green: {text: "🟢 קדימה! אשב פה, גם פה נוף!", points: 15},

    red: {text: "🔴 אני תמיד שם! המקום שלי!", points: -5},

    greenFeedback: "🌊 גמישות! ויתרת ברגע — חיזקת חברות!",

    redFeedback: "🛑 רבתם על מקום כל הנסיעה..."

  },

  {

    situation: "סיכמתם לשחק בשלוש, אבל הגיע עוד ילד ורוצה להצטרף.",

    green: {text: "🟢 ברור! עוד אחד — יותר כיף!", points: 15},

    red: {text: "🔴 סיכמנו שלוש! הוא לא מוזמן!", points: -5},

    greenFeedback: "🌊 פתיחות! עכשיו יש לכם חבר חדש בחבורה!",

    redFeedback: "🛑 הילד הלך עצוב... ואתה הרגשת לא נעים אחר כך"

  },

  // ---- גמישות עם אכזבות יומיומיות ----

  {

    situation: "הגלידה שרצית נגמרה — נשאר רק טעם שלא ניסית.",

    green: {text: "🟢 ננסה טעם חדש! אולי אגלה משהו!", points: 15},

    red: {text: "🔴 אני לא רוצה כלום! רק שוקולד!", points: -5},

    greenFeedback: "🌊 הרפתקנות! הטעם החדש הפך לאהוב!",

    redFeedback: "🛑 כולם אוכלים גלידה ואתה בלי..."

  },

  {

    situation: "הסרט שרצית לראות לא מוקרן היום — יש סרט אחר.",

    green: {text: "🟢 בטח גם הוא מעניין! בוא ננסה!", points: 15},

    red: {text: "🔴 רק הסרט שלי! חוזרים הביתה!", points: -5},

    greenFeedback: "🌊 גמישות! הסרט האחר היה מצחיק בטירוף!",

    redFeedback: "🛑 חזרת הביתה ופספסת ערב כיף..."

  },

  {

    situation: "בקניון — החנות שרצית סגורה. חבר מציע חנות אחרת.",

    green: {text: "🟢 בוא נראה! אולי יש שם דברים מגניבים!", points: 15},

    red: {text: "🔴 רציתי את החנות הזאת! הולך הביתה!", points: -5},

    greenFeedback: "🌊 זרימה! מצאת משהו אפילו יותר טוב!",

    redFeedback: "🛑 הלכת הביתה בלי כלום והחבר נשאר לבד..."

  },

  // ---- גמישות בתחרויות ומשחקים ----

  {

    situation: "הפסדת בתחרות ריצה. חבר שלך ניצח.",

    green: {text: "🟢 כל הכבוד! פעם הבאה אתאמן יותר!", points: 15},

    red: {text: "🔴 בטח הוא רימה! זה לא הוגן!", points: -5},

    greenFeedback: "🌊 ספורטיביות! ברכת את החבר — כולם מעריצים!",

    redFeedback: "🛑 האשמת חבר שניצח ביושר... הוא נפגע"

  },

  {

    situation: "במשחק קלפים — חבר רוצה לשנות את החוקים באמצע.",

    green: {text: "🟢 אוקיי ננסה! אם לא כיף — נחזיר!", points: 15},

    red: {text: "🔴 לא משנים חוקים! ככה זה!", points: -5},

    greenFeedback: "🌊 גמישות! החוקים החדשים היו כיפיים!",

    redFeedback: "🛑 התעקשת ואף אחד לא נהנה..."

  },

  {

    situation: "רצית להיות קפטן, אבל הכיתה בחרה מישהו אחר.",

    green: {text: "🟢 מגניב! אשחק הכי טוב שאני יכול!", points: 15},

    red: {text: "🔴 אם אני לא קפטן — אני לא משחק!", points: -5},

    greenFeedback: "🌊 זרימה! שיחקת מעולה ולא צריך תואר!",

    redFeedback: "🛑 נשארת בצד ופספסת משחק מטורף..."

  },

  // ---- גמישות במשפחה ----

  {

    situation: "אבא הבטיח פארק שעשועים בשבת, אבל קמה סבתא חולה.",

    green: {text: "🟢 בסדר, נלך לסבתא — הפארק לא בורח!", points: 15},

    red: {text: "🔴 הבטחת!! אני רוצה פארק!!", points: -5},

    greenFeedback: "🌊 גמישות והבנה! סבתא שמחה לראות אותך!",

    redFeedback: "🛑 צרחת על אבא ועדיין לא הלכת לפארק..."

  },

  {

    situation: "חבר הביא משחק חדש שאתה לא מכיר במקום המשחק הרגיל.",

    green: {text: "🟢 מעניין! תלמד אותי את החוקים!", points: 15},

    red: {text: "🔴 לא רוצה! בואו נשחק את מה שתמיד!", points: -5},

    greenFeedback: "🌊 גמישות! החוקים החדשים היו כיפיים!",

    redFeedback: "🛑 כולם משחקים ואתה לבד בצד..."

  },

  {

    situation: "בחוג יום הולדת — אמא הכינה ארוחת צהריים ואתה רצית ערב.",

    green: {text: "🟢 צהריים גם טוב — אמא השתדלה!", points: 15},

    red: {text: "🔴 אני רוצה ערב! למה היא מחליטה?!", points: -5},

    greenFeedback: "🌊 אלוף! אמא שמחה והצהריים דווקא היו כיפיים!",

    redFeedback: "🛑 עכשיו אמא עצובה ואין לא ערב ולא צהריים..."

  },

  {

    situation: "בציור — רצית לצייר פרפר, אבל המורה אמרה לצייר נוף.",

    green: {text: "🟢 נוף גם יפה! אנסה משהו חדש", points: 15},

    red: {text: "🔴 אני רוצה פרפר! לא מצייר נוף!", points: -5},

    greenFeedback: "🌊 יצירתיות! הנוף יצא מדהים!",

    redFeedback: "🛑 כולם ציירו נוף ואתה נשארת לבד..."

  },

  {

    situation: "בהפסקה חבר ביקש לשחק במחשב שלך, ואתה רצית לקרוא.",

    green: {text: "🟢 בטח! נשחק קצת ואחר כך נקרא", points: 15},

    red: {text: "🔴 לא! אני רוצה לקרוא עכשיו!", points: -5},

    greenFeedback: "🌊 נדיבות! החבר נהנה ואחר כך קראתם יחד!",

    redFeedback: "🛑 החבר הלך עצוב ואתה גם לא קראת..."

  },

  {

    situation: "בשיעור — המורה נתנה לך תפקיד שלא רצית, אבל זה חשוב לכיתה.",

    green: {text: "🟢 אעשה כמיטב שלי — זה לכיתה!", points: 15},

    red: {text: "🔴 לא רוצה! למה אני צריך?!", points: -5},

    greenFeedback: "🌊 אחריות! המורה ראתה שאתה אחראי!",

    redFeedback: "🛑 המורה הסבירה ועכשיו כולם מסתכלים עליך..."

  }



];



// ---- AUDIO ----

const AudioCtx = window.AudioContext || window.webkitAudioContext;

let audioCtx;

function initAudio(){

  // Engine ambient sound

  try{

    const eng=new (window.AudioContext||window.webkitAudioContext)();

    const osc=eng.createOscillator();

    const gain=eng.createGain();

    osc.type='sawtooth';

    osc.frequency.value=60;

    gain.gain.value=0.02;

    osc.connect(gain);

    gain.connect(eng.destination);

    osc.start();

    window._engineAudio={ctx:eng,osc:osc,gain:gain};
    const osc2=eng.createOscillator();const g2=eng.createGain();osc2.type='triangle';osc2.frequency.value=130;g2.gain.value=0.01;osc2.connect(g2);g2.connect(eng.destination);osc2.start();window._engineAudio.osc2=osc2;window._engineAudio.gain2=g2;

  }catch(e){}

if(!audioCtx)audioCtx=new AudioCtx()}

let _masterVol=0.7;let _muted=false;let _preMuteVol=0.7;

function _toggleMute(){_muted=!_muted;if(_muted){_preMuteVol=_masterVol;_masterVol=0}else{_masterVol=_preMuteVol}

  const mb=document.getElementById('muteBtn');if(mb)mb.querySelector('.icon').textContent=_muted?'🔇':'🔊';updateBgMusicVol()}

function _loadSettings(){

  try{const s=JSON.parse(localStorage.getItem('gf_settings')||'{}');

  if(s.name){const ni=document.getElementById('playerName');if(ni)ni.value=s.name}

  if(s.vol!==undefined){_masterVol=s.vol/100;const vs=document.getElementById('volumeSlider');if(vs)vs.value=s.vol}}catch(e){}

  const tg=parseInt(localStorage.getItem('gf_totalGames')||'0');const hs=_getHighScores();

  const sl=document.getElementById('statsLine');if(sl&&tg>0)sl.textContent='🎮 '+tg+' משחקים'+(hs.length>0?' | 🏆 שיא: '+hs[0].score:'');

}

function _saveSettings(){

  const name=(document.getElementById('playerName')||{}).value||'';

  const vol=parseInt((document.getElementById('volumeSlider')||{}).value)||70;

  _masterVol=vol/100;localStorage.setItem('gf_settings',JSON.stringify({name:name,vol:vol}))

}

function playTone(freq,dur,type,vol){

  if(!audioCtx||_masterVol<=0)return;

  const o=audioCtx.createOscillator(),g=audioCtx.createGain();

  o.type=type||'sine';o.frequency.value=freq;

  const v=(vol||.12)*_masterVol;

  g.gain.setValueAtTime(v,audioCtx.currentTime);

  g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);

  o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur);

}

function sfxGreen(){

  [523,659,784,1047].forEach((f,i)=>setTimeout(()=>{playTone(f,.18,'sine',.1);playTone(f*1.5,.12,'triangle',.04)},i*70));

  setTimeout(()=>playTone(1319,.25,'sine',.06),300)

}

function sfxRed(){

  playTone(150,.35,'sawtooth',.1);playTone(110,.4,'square',.07);

  setTimeout(()=>playTone(80,.3,'sawtooth',.08),120);

  setTimeout(()=>playTone(60,.4,'square',.05),200)

}

function sfxCollect(){

  playTone(880,.1,'sine',.09);setTimeout(()=>playTone(1100,.08,'sine',.07),50);

  setTimeout(()=>playTone(1320,.12,'triangle',.05),100)

}

function sfxBoost(){

  [500,700,900,1100,1400].forEach((f,i)=>setTimeout(()=>{playTone(f,.14,'sine',.08);playTone(f*0.5,.1,'triangle',.03)},i*50));

  setTimeout(()=>playTone(1760,.3,'sine',.05),280)

}

function sfxLevelUp(){

  [523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>{playTone(f,.25,'sine',.1);playTone(f*2,.15,'triangle',.04)},i*90));

  setTimeout(()=>{playTone(1568,.4,'sine',.08);playTone(784,.3,'triangle',.05)},500)

}

function screenFlash(cls){const el=document.getElementById("screenFlash");el.className=cls;el.style.opacity="1";setTimeout(()=>{el.style.opacity="0";el.className=""},300);

  if(cls==='flash-red'){const c=document.querySelector('canvas');if(c){c.style.transition='none';c.style.transform='translateX(4px)';setTimeout(()=>{c.style.transform='translateX(-4px)';setTimeout(()=>{c.style.transform='translateX(2px)';setTimeout(()=>{c.style.transform='';},50)},50)},50)}}

}

function confettiBurst(){

  const c=document.getElementById('confetti');if(!c)return;

  const colors=['#4ade80','#22c55e','#86efac','#fbbf24','#60a5fa','#f472b6','#a78bfa'];

  const frag=document.createDocumentFragment();

  for(let i=0;i<25;i++){const p=document.createElement('div');p.className='confetti-piece';

    p.style.left=Math.random()*100+'%';p.style.top='-10px';

    p.style.background=colors[Math.floor(Math.random()*colors.length)];

    p.style.animationDelay=(Math.random()*0.3)+'s';

    p.style.width=(6+Math.random()*8)+'px';p.style.height=(6+Math.random()*8)+'px';

    p.style.borderRadius=Math.random()>.5?'50%':'2px';

    frag.appendChild(p)}

  c.appendChild(frag);setTimeout(()=>{while(c.firstChild)c.removeChild(c.firstChild)},1500)

}



function sfxWhoosh(){if(!audioCtx)return;const n=audioCtx.createBufferSource();const sr=audioCtx.sampleRate;const buf=audioCtx.createBuffer(1,sr*.3,sr);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++){const t=i/sr;d[i]=(Math.random()*2-1)*Math.max(0,1-t*4)*0.15}n.buffer=buf;const f=audioCtx.createBiquadFilter();f.type='bandpass';f.frequency.value=800;f.Q.value=0.5;n.connect(f);f.connect(audioCtx.destination);n.start()}

function sfxScenario(){

  playTone(440,.12,'triangle',.09);setTimeout(()=>playTone(554,.12,'triangle',.07),80);

  setTimeout(()=>playTone(659,.18,'sine',.06),160)

}

function sfxHonk(){

  playTone(350,.12,'square',.1);setTimeout(()=>playTone(440,.18,'square',.09),80);

  setTimeout(()=>playTone(350,.1,'square',.06),200)

}



// ---- BACKGROUND MUSIC (synthesized, royalty-free) ----

let _bgMusic=null;

function startBgMusic(){

  if(_bgMusic||!audioCtx)return;

  const ctx=audioCtx;

  // C major happy melody loop - kid-friendly

  const notes=[262,294,330,349,392,349,330,294,262,330,392,523,392,330,294,262];

  const bass=[131,131,165,165,175,175,196,196,131,131,165,165,175,175,196,131];

  const tempo=0.25;// seconds per note

  let noteIdx=0;

  const melGain=ctx.createGain();melGain.gain.value=0;melGain.connect(ctx.destination);

  const bassGain=ctx.createGain();bassGain.gain.value=0;bassGain.connect(ctx.destination);

  const padGain=ctx.createGain();padGain.gain.value=0;padGain.connect(ctx.destination);

  // Pad (sustained chord)

  const pad1=ctx.createOscillator();pad1.type='sine';pad1.frequency.value=262;pad1.connect(padGain);pad1.start();

  const pad2=ctx.createOscillator();pad2.type='sine';pad2.frequency.value=330;pad2.connect(padGain);pad2.start();

  const pad3=ctx.createOscillator();pad3.type='sine';pad3.frequency.value=392;pad3.connect(padGain);pad3.start();

  function playNote(){

    if(!_bgMusic)return;

    const now=ctx.currentTime;

    // Melody

    const mOsc=ctx.createOscillator();const mG=ctx.createGain();

    mOsc.type='triangle';mOsc.frequency.value=notes[noteIdx%notes.length];

    mG.gain.setValueAtTime(0.06*_masterVol,now);mG.gain.exponentialRampToValueAtTime(0.001,now+tempo*0.9);

    mOsc.connect(mG);mG.connect(melGain);mOsc.start(now);mOsc.stop(now+tempo);

    // Bass

    const bOsc=ctx.createOscillator();const bG=ctx.createGain();

    bOsc.type='sine';bOsc.frequency.value=bass[noteIdx%bass.length];

    bG.gain.setValueAtTime(0.04*_masterVol,now);bG.gain.exponentialRampToValueAtTime(0.001,now+tempo*0.9);

    bOsc.connect(bG);bG.connect(bassGain);bOsc.start(now);bOsc.stop(now+tempo);

    noteIdx++;

    _bgMusic.timer=setTimeout(playNote,tempo*1000);

  }

  // Fade in

  melGain.gain.setValueAtTime(0,ctx.currentTime);melGain.gain.linearRampToValueAtTime(1,ctx.currentTime+2);

  bassGain.gain.setValueAtTime(0,ctx.currentTime);bassGain.gain.linearRampToValueAtTime(1,ctx.currentTime+2);

  padGain.gain.setValueAtTime(0,ctx.currentTime);padGain.gain.linearRampToValueAtTime(0.02*_masterVol,ctx.currentTime+2);

  _bgMusic={timer:null,melGain,bassGain,padGain,pad1,pad2,pad3};

  playNote();

}

function _shareResult(){

  const s=document.getElementById('finalScore').textContent;

  const g=document.getElementById('finalGreen').textContent;

  const r=document.getElementById('finalRed').textContent;

  const stars=document.getElementById('finalStars').textContent;

  const d=document.getElementById('finalDist').textContent;

  const txt='🟢 תיקיה ירוקה — זרימה בכביש!\n'+stars+'\nניקוד: '+s+' | 🟢'+g+' 🔴'+r+' | מרחק: '+d+'m\nשחקו גם: https://shemesh613.github.io/impressive-3d-world/';

  if(navigator.share){navigator.share({title:'תיקיה ירוקה',text:txt}).catch(()=>{})}

  else if(navigator.clipboard){navigator.clipboard.writeText(txt).then(()=>{const b=event.target;b.textContent='✅ הועתק!';setTimeout(()=>b.textContent='📤 שתף תוצאה',2000)})}

}

function stopBgMusic(){

  if(!_bgMusic)return;

  clearTimeout(_bgMusic.timer);

  try{_bgMusic.pad1.stop();_bgMusic.pad2.stop();_bgMusic.pad3.stop()}catch(e){}

  _bgMusic=null;

}

function updateBgMusicVol(){

  if(!_bgMusic)return;

  _bgMusic.padGain.gain.value=0.02*_masterVol;

}



// ---- RENDERER ----

let renderer;try{

renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance',stencil:true,alpha:false});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

renderer.setSize(innerWidth,innerHeight);

renderer.setClearColor(0x1a1a2e);

renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

renderer.toneMappingExposure=1.6;

document.body.prepend(renderer.domElement);

renderer.domElement.addEventListener('webglcontextlost',function(e){e.preventDefault();console.error('WebGL CONTEXT LOST');document.getElementById('startScreen').innerHTML='<h1 style="color:#ef4444;margin:20px">GPU overloaded - refresh page</h1>'});}catch(e){document.getElementById('startScreen').innerHTML='<h1 style="color:#ef4444;margin:20px">😔 WebGL לא נתמך</h1><p style="color:#fff;font-size:20px;text-align:center">נסו דפדפן אחר או הפעילו האצת חומרה</p>';throw e}



const scene=new THREE.Scene();

const cam=new THREE.PerspectiveCamera(68,innerWidth/innerHeight,0.5,700);

cam.position.set(0,8.5,16);
// ---- POST-PROCESSING ----
const composer=new THREE.EffectComposer(renderer);
const renderPass=new THREE.RenderPass(scene,cam);
composer.addPass(renderPass);
// SSAO removed for performance

const bloomPass=new THREE.UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),0.6,0.35,0.85);
composer.addPass(bloomPass);
window._bloomPass=bloomPass;

// ChromaticAberration removed for performance

// FXAA anti-aliasing
const fxaaPass=new THREE.ShaderPass(THREE.FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1/innerWidth,1/innerHeight);
composer.addPass(fxaaPass);

// Color Grading
const colorPass=new THREE.ShaderPass(THREE.ColorGradingShader);
colorPass.uniforms['contrast'].value=1.12;
colorPass.uniforms['saturation'].value=1.15;
colorPass.uniforms['vignetteAmount'].value=0.42;
colorPass.uniforms['vignetteFalloff'].value=0.45;
composer.addPass(colorPass);

// Film Grain removed — cleaner image

scene.fog=new THREE.FogExp2(0x141422,.0006);

// Environment map for reflections
var _pmremGen=new THREE.PMREMGenerator(renderer);
_pmremGen.compileEquirectangularShader();
var _envScene=new THREE.Scene();
_envScene.background=new THREE.Color(0x0d0d1e);
var _envL1=new THREE.DirectionalLight(0xffeedd,1.5);_envL1.position.set(1,1.5,0.5);_envScene.add(_envL1);
_envScene.add(new THREE.HemisphereLight(0x4466aa,0x0a0a1a,1.0));
// City reflection geometry — buildings, ground, sky
[{p:[12,4,0],c:0x1a2a44,s:[25,12,25]},{p:[-12,4,0],c:0x1a2a44,s:[25,12,25]},{p:[0,-6,0],c:0x111118,s:[40,4,40]},{p:[0,15,0],c:0x141428,s:[40,8,40]},{p:[8,2,8],c:0x1a3322,s:[15,8,15]},{p:[-8,2,-8],c:0x332211,s:[15,8,15]},{p:[0,6,12],c:0x223344,s:[20,15,8]},{p:[0,6,-12],c:0x223344,s:[20,15,8]},{p:[5,1,0],c:0xffdd55,s:[0.5,0.5,0.5]},{p:[-5,1,0],c:0xffdd55,s:[0.5,0.5,0.5]}].forEach(function(b){var bm=new THREE.Mesh(new THREE.BoxGeometry(b.s[0],b.s[1],b.s[2]),new THREE.MeshBasicMaterial({color:b.c}));bm.position.set(b.p[0],b.p[1],b.p[2]);_envScene.add(bm)});
var _envRT=_pmremGen.fromScene(_envScene,0,0.1,100);
scene.environment=_envRT.texture;

const ambLight=new THREE.AmbientLight(0x111822,0.25);scene.add(ambLight);
var hemiLight=new THREE.HemisphereLight(0x1a2244,0x050a05,0.2);scene.add(hemiLight);

const dirLight=new THREE.DirectionalLight(0xffeedd,1.8);dirLight.position.set(30,50,40);
dirLight.castShadow=true;
dirLight.shadow.mapSize.width=2048;dirLight.shadow.mapSize.height=2048;
dirLight.shadow.camera.near=1;dirLight.shadow.camera.far=150;
dirLight.shadow.camera.left=-30;dirLight.shadow.camera.right=30;
dirLight.shadow.camera.top=30;dirLight.shadow.camera.bottom=-30;
dirLight.shadow.bias=-0.002;
dirLight.shadow.normalBias=0.02;
scene.add(dirLight);scene.add(dirLight.target);

// Moon

const moonGeo=new THREE.SphereGeometry(8,12,12);

const moonMat=new THREE.MeshBasicMaterial({color:0xeeeeff});

const moon=new THREE.Mesh(moonGeo,moonMat);

moon.position.set(-80,120,500);scene.add(moon);

// Moon glow

const moonGlowGeo=new THREE.SphereGeometry(14,12,12);

const moonGlowMat=new THREE.MeshBasicMaterial({color:0xaabbdd,transparent:true,opacity:0.08});

const moonGlow=new THREE.Mesh(moonGlowGeo,moonGlowMat);

moonGlow.position.copy(moon.position);scene.add(moonGlow);



// ---- SKY SPHERE with panoramic backgrounds ----

const _skyTextures=[];

const _skyPaths=['sky_city.jpg','sky_mountains.jpg','sky_desert.jpg','sky_ocean.jpg','sky_forest.jpg'];

const _skyZoneMap=[0,1,2,3,4,4,1];

const _skyLoader=new THREE.TextureLoader();

let _skyReady=false,_currentSkyIdx=-1;

const skyGeo=new THREE.SphereGeometry(340,48,24);

// Procedural gradient sky texture
var _skyCanvas=document.createElement('canvas');_skyCanvas.width=1;_skyCanvas.height=512;
var _skyCtx=_skyCanvas.getContext('2d');
var _skyGrad=_skyCtx.createLinearGradient(0,0,0,512);
_skyGrad.addColorStop(0,'#050510');     // top: near-black space
_skyGrad.addColorStop(0.15,'#0a0a20');  // upper: very dark blue
_skyGrad.addColorStop(0.35,'#12123a');  // mid-upper: deep blue
_skyGrad.addColorStop(0.55,'#1e1a3e');  // mid: muted purple
_skyGrad.addColorStop(0.72,'#2a1e35');  // lower: dark wine
_skyGrad.addColorStop(0.85,'#3a2530');  // horizon: subtle warmth
_skyGrad.addColorStop(0.95,'#4a3028');  // near-bottom: muted amber
_skyGrad.addColorStop(1.0,'#3a2520');   // bottom: dark warm
_skyCtx.fillStyle=_skyGrad;_skyCtx.fillRect(0,0,1,512);
var _skyGradTex=new THREE.CanvasTexture(_skyCanvas);
_skyGradTex.needsUpdate=true;
const skyMat=new THREE.MeshBasicMaterial({side:THREE.BackSide,fog:false,map:_skyGradTex});

const skyMesh=new THREE.Mesh(skyGeo,skyMat);

skyMesh.rotation.x=-0.25;

scene.add(skyMesh);
const _v=new THREE.Vector3();
const _cv=new THREE.Vector3();
const _ct=new THREE.Vector3();
const _col=new THREE.Color();
var dummy=new THREE.Object3D();
// ---- STARS ----
{
  var starGeo=new THREE.BufferGeometry();
  var starPositions=new Float32Array(500*3);
  for(var si=0;si<500;si++){
    var theta=Math.random()*Math.PI*2;
    var phi=Math.random()*Math.PI*0.6;// only upper hemisphere
    var r=300;
    starPositions[si*3]=r*Math.sin(phi)*Math.cos(theta);
    starPositions[si*3+1]=r*Math.cos(phi)+50;
    starPositions[si*3+2]=r*Math.sin(phi)*Math.sin(theta);
  }


let _skyLoaded=0;

// Sky textures disabled - using procedural gradient
if(false)_skyPaths.forEach(function(p,i){

_skyLoader.load('./'+p,function(tex){

tex.colorSpace=THREE.SRGBColorSpace;

_skyTextures[i]=tex;_skyLoaded++;

if(_skyLoaded===_skyPaths.length){_skyReady=true;skyMat.map=_skyTextures[0];skyMat.color.set(0xffffff);skyMat.needsUpdate=true;_currentSkyIdx=0}

},undefined,function(){_skyTextures[i]=null;_skyLoaded++; if(_skyLoaded===_skyPaths.length&&_skyTextures.some(function(t){return t})){_skyReady=true;

for(var j=0;j<5;j++){if(_skyTextures[j]){skyMat.map=_skyTextures[j];skyMat.color.set(0xffffff);skyMat.needsUpdate=true;_currentSkyIdx=j;break}}}})

})








// Trail marks mesh

const _trailGeo=new THREE.PlaneGeometry(1,1);

const _trailMat=new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:0.4,side:THREE.DoubleSide});

const _trailInst=new THREE.InstancedMesh(_trailGeo,_trailMat,30);

_trailInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(30*3),3);

for(let i=0;i<30;i++){dummy.position.set(0,-100,0);dummy.updateMatrix();_trailInst.setMatrixAt(i,dummy.matrix)}

_trailInst.instanceMatrix.needsUpdate=true;scene.add(_trailInst);window._trailInst=_trailInst;



// ---- ROAD CURVE FUNCTION ----

function roadY(z){return Math.sin(z*.006)*3.5+Math.sin(z*.017)*1.8+Math.sin(z*.003)*2.0+Math.sin(z*.04)*0.6}

function roadX(z){

  if(z<0)return 0;

  const s=z%600;

  const base=Math.sin(z*.005)*10+Math.sin(z*.013)*6+Math.sin(z*.003)*4;

  const sharp=(s<120)?0:(s<200)?((s-120)/80)*12:(s<350)?12-((s-200)/150)*24:(s<450)?-12+((s-350)/100)*12:0;

  const twist=Math.floor(z/600)%2===0?1:-1;

  return base+sharp*twist*1.0;

}




// ---- PROCEDURAL ROAD TEXTURE ----
var _roadTex=(function(){
  var cv=document.createElement('canvas');cv.width=512;cv.height=512;
  var ctx=cv.getContext('2d');
  // Dark asphalt base with warm tint
  ctx.fillStyle='#22222e';ctx.fillRect(0,0,512,512);
  // Multi-layer asphalt noise (fine + coarse grain)
  for(var i=0;i<12000;i++){var x=Math.random()*512,y=Math.random()*512,v=22+Math.random()*28;ctx.fillStyle='rgb('+v+','+(v+1)+','+(v+5)+')';ctx.fillRect(x,y,1+Math.random()*1.5,1+Math.random()*1.5)}
  for(var i=0;i<3000;i++){var x=Math.random()*512,y=Math.random()*512,v=35+Math.random()*20;ctx.globalAlpha=0.3;ctx.fillStyle='rgb('+v+','+(v+2)+','+(v+6)+')';ctx.fillRect(x,y,2+Math.random()*4,2+Math.random()*4)}
  ctx.globalAlpha=1;
  // Subtle tire marks
  ctx.globalAlpha=0.08;ctx.strokeStyle='#111111';ctx.lineWidth=12;
  for(var t=0;t<6;t++){ctx.beginPath();var tx=150+Math.random()*200;ctx.moveTo(tx,0);ctx.lineTo(tx+Math.random()*20-10,512);ctx.stroke()}
  ctx.globalAlpha=1;
  // Center dashed line (softer white with glow)
  ctx.shadowColor='rgba(255,255,255,0.4)';ctx.shadowBlur=6;
  ctx.strokeStyle='#e8e8e8';ctx.lineWidth=4;ctx.setLineDash([45,30]);ctx.beginPath();ctx.moveTo(256,0);ctx.lineTo(256,512);ctx.stroke();
  ctx.shadowBlur=0;
  // Edge lines (solid)
  ctx.setLineDash([]);ctx.lineWidth=2.5;ctx.strokeStyle='#dddddd';ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(22,512);ctx.moveTo(490,0);ctx.lineTo(490,512);ctx.stroke();
  var t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,35);
  if(renderer.capabilities&&renderer.capabilities.getMaxAnisotropy)t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  return t;
})();

// ---- PROCEDURAL GROUND TEXTURE ----
var _groundTex=(function(){
  var cv=document.createElement('canvas');cv.width=256;cv.height=256;
  var ctx=cv.getContext('2d');
  // Very dark grass base for night
  ctx.fillStyle='#060806';ctx.fillRect(0,0,256,256);
  // Subtle grass variation — very dark greens only
  for(var i=0;i<2000;i++){var x=Math.random()*256,y=Math.random()*256,v=6+Math.random()*10|0;ctx.fillStyle='rgb('+(v-1)+','+(v+2)+','+(v-1)+')';ctx.fillRect(x,y,2+Math.random()*3,1+Math.random()*2)}
  // Very dark patches
  ctx.globalAlpha=0.2;
  for(var i=0;i<250;i++){var x=Math.random()*256,y=Math.random()*256;ctx.fillStyle='#040604';ctx.fillRect(x,y,5+Math.random()*15,5+Math.random()*15)}
  // Subtle blue-green moonlight highlights
  ctx.globalAlpha=0.06;
  for(var i=0;i<100;i++){var x=Math.random()*256,y=Math.random()*256;ctx.fillStyle='#060a08';ctx.fillRect(x,y,4+Math.random()*10,4+Math.random()*10)}
  ctx.globalAlpha=1;
  var t=new THREE.CanvasTexture(cv);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(80,200);
  if(renderer.capabilities&&renderer.capabilities.getMaxAnisotropy)t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  return t;
})();

// ---- GROUND ----

scene.add((() => {

  const m=new THREE.Mesh(new THREE.PlaneGeometry(400,14000),new THREE.MeshBasicMaterial({color:0x050705,map:_groundTex}));

  m.rotation.x=-Math.PI/2;m.position.y=-0.5;m.position.z=3500;m.receiveShadow=false;return m;

})());
// ---- LOW GROUND FOG ----scene.add((function(){var fogMat=new THREE.MeshBasicMaterial({color:0x141422,transparent:true,opacity:0.25,side:THREE.DoubleSide,fog:true,depthWrite:false});var fogPlane=new THREE.Mesh(new THREE.PlaneGeometry(400,14000),fogMat);fogPlane.rotation.x=-Math.PI/2;fogPlane.position.set(0,0.1,3500);fogPlane.renderOrder=1;return fogPlane})());scene.add((function(){var fm2=new THREE.MeshBasicMaterial({color:0x0a0a18,transparent:true,opacity:0.12,side:THREE.DoubleSide,fog:true,depthWrite:false});var fp2=new THREE.Mesh(new THREE.PlaneGeometry(400,14000),fm2);fp2.rotation.x=-Math.PI/2;fp2.position.set(0,0.5,3500);fp2.renderOrder=2;return fp2})());





// ---- CURVED ROAD ----

{

  const RSEGS=900,SLEN=9;

  const _roadMat=new THREE.MeshStandardMaterial({roughness:0.38,metalness:0.25,color:0x2a2a38,envMapIntensity:1.2});window._roadMat=_roadMat;_roadMat.map=_roadTex;_roadMat.color.set(0xffffff);_roadMat.needsUpdate=true;

  const roadInst=new THREE.InstancedMesh(new THREE.PlaneGeometry(16,SLEN+2.5),_roadMat,RSEGS);

  const edgeMat=new THREE.MeshStandardMaterial({color:0x1a8844,emissive:0x0eaa33,emissiveIntensity:1.5,roughness:0.2,metalness:0.15});window._edgeMat=edgeMat;

  const edgeGeo=new THREE.PlaneGeometry(.5,SLEN+2);

  const edgeL=new THREE.InstancedMesh(edgeGeo,edgeMat,RSEGS);

  const edgeR=new THREE.InstancedMesh(edgeGeo,edgeMat,RSEGS);

  const glowMat=new THREE.MeshStandardMaterial({color:0x0a3318,emissive:0x052210,emissiveIntensity:0.2,roughness:0.7,metalness:0.05});

  const glowGeo=new THREE.PlaneGeometry(3,SLEN+2);

  const glowL=new THREE.InstancedMesh(glowGeo,glowMat,RSEGS);

  const glowR=new THREE.InstancedMesh(glowGeo,glowMat,RSEGS);

  for(let i=0;i<RSEGS;i++){

    const z=-50+i*SLEN,zc=z+SLEN/2,x=roadX(zc),hy=roadY(zc);

    const ca=Math.atan2(roadX(zc+2)-roadX(zc-2),4);const hillA=Math.atan2(roadY(zc+SLEN/2)-roadY(zc-SLEN/2),SLEN);

    const cosA=Math.cos(ca),sinA=Math.sin(ca);

    dummy.rotation.order='YXZ';dummy.rotation.set(-Math.PI/2+hillA,ca,0);dummy.scale.setScalar(1);

    dummy.position.set(x,hy+.01,zc);dummy.updateMatrix();roadInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x-5.2*cosA,hy+.02,zc+5.2*sinA);dummy.updateMatrix();edgeL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x+5.2*cosA,hy+.02,zc-5.2*sinA);dummy.updateMatrix();edgeR.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x-6.8*cosA,hy+.005,zc+6.8*sinA);dummy.updateMatrix();glowL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x+6.8*cosA,hy+.005,zc-6.8*sinA);dummy.updateMatrix();glowR.setMatrixAt(i,dummy.matrix);

  }

  roadInst.receiveShadow=true;
  [roadInst,edgeL,edgeR,glowL,glowR].forEach(m=>{m.instanceMatrix.needsUpdate=true;scene.add(m)});
// ---- SIDEWALKS ----
{
  var swGeo=new THREE.PlaneGeometry(10,SLEN+2.5);
  var swMat=new THREE.MeshStandardMaterial({color:0x333340,roughness:0.85,metalness:0.05});
  var swInstL=new THREE.InstancedMesh(swGeo,swMat,RSEGS);
  var swInstR=new THREE.InstancedMesh(swGeo,swMat,RSEGS);
  for(var si=0;si<RSEGS;si++){
    var sz=-50+si*SLEN,szc=sz+SLEN/2,sx=roadX(szc),sy=roadY(szc);
    var sca=Math.atan2(roadX(szc+2)-roadX(szc-2),4);
    var sha=Math.atan2(roadY(szc+SLEN/2)-roadY(szc-SLEN/2),SLEN);
    dummy.rotation.order='YXZ';dummy.rotation.set(-Math.PI/2+sha,sca,0);dummy.scale.setScalar(1);
    dummy.position.set(sx-13*Math.cos(sca),sy+0.02,szc+13*Math.sin(sca));dummy.updateMatrix();swInstL.setMatrixAt(si,dummy.matrix);
    dummy.position.set(sx+13*Math.cos(sca),sy+0.02,szc-13*Math.sin(sca));dummy.updateMatrix();swInstR.setMatrixAt(si,dummy.matrix);
  }

// ---- CURBS ----
{
  var curbGeo=new THREE.BoxGeometry(0.4,0.3,SLEN+1);
  var curbMat=new THREE.MeshStandardMaterial({color:0xbbbbbb,roughness:0.6,metalness:0.15,emissive:0x222222,emissiveIntensity:0.1});
  var curbL=new THREE.InstancedMesh(curbGeo,curbMat,RSEGS);
  var curbR=new THREE.InstancedMesh(curbGeo,curbMat,RSEGS);
  for(var ci=0;ci<RSEGS;ci++){
    var cz=-50+ci*SLEN,czc=cz+SLEN/2,cx=roadX(czc),cy=roadY(czc);
    var cca=Math.atan2(roadX(czc+2)-roadX(czc-2),4);
    dummy.position.set(cx-7.2*Math.cos(cca),cy+0.12,czc+7.2*Math.sin(cca));
    dummy.rotation.set(0,cca,0);dummy.scale.setScalar(1);dummy.updateMatrix();
    curbL.setMatrixAt(ci,dummy.matrix);
    dummy.position.set(cx+7.2*Math.cos(cca),cy+0.12,czc-7.2*Math.sin(cca));
    dummy.updateMatrix();
    curbR.setMatrixAt(ci,dummy.matrix);
  }

}
  curbL.instanceMatrix.needsUpdate=true;curbR.instanceMatrix.needsUpdate=true;
  scene.add(curbL);scene.add(curbR);
}

// ---- GRASS STRIPS ----
{
  var grGeo=new THREE.PlaneGeometry(8,SLEN+1);
  var grMat=new THREE.MeshStandardMaterial({color:0x1e4412,roughness:0.95,metalness:0.0});
  var grInstL=new THREE.InstancedMesh(grGeo,grMat,RSEGS);
  var grInstR=new THREE.InstancedMesh(grGeo,grMat,RSEGS);
  for(var gi=0;gi<RSEGS;gi++){
    var gz=-50+gi*SLEN,gzc=gz+SLEN/2,gx=roadX(gzc),gy=roadY(gzc);
    var gca=Math.atan2(roadX(gzc+2)-roadX(gzc-2),4);
    var gha=Math.atan2(roadY(gzc+SLEN/2)-roadY(gzc-SLEN/2),SLEN);
    dummy.rotation.order='YXZ';dummy.rotation.set(-Math.PI/2+gha,gca,0);dummy.scale.setScalar(1);
    dummy.position.set(gx-12*Math.cos(gca),gy+0.005,gzc+12*Math.sin(gca));dummy.updateMatrix();grInstL.setMatrixAt(gi,dummy.matrix);
    dummy.position.set(gx+12*Math.cos(gca),gy+0.005,gzc-12*Math.sin(gca));dummy.updateMatrix();grInstR.setMatrixAt(gi,dummy.matrix);
  }
  grInstL.instanceMatrix.needsUpdate=true;grInstR.instanceMatrix.needsUpdate=true;
  scene.add(grInstL);scene.add(grInstR);
}
  swInstL.instanceMatrix.needsUpdate=true;swInstR.instanceMatrix.needsUpdate=true;
  swInstL.receiveShadow=true;swInstR.receiveShadow=true;
  scene.add(swInstL);scene.add(swInstR);
}


// Grass strips alongside road

{

  const _gMat=new THREE.MeshStandardMaterial({color:0x1a4a2e,roughness:0.9,metalness:0});

  const _gGeo=new THREE.PlaneGeometry(8,6.5);

  const _gL=new THREE.InstancedMesh(_gGeo,_gMat,600);

  const _gR=new THREE.InstancedMesh(_gGeo,_gMat,600);

  for(let i=0;i<600;i++){

    const z=-50+i*6+3;const x=roadX(z);const y=roadY(z);

    dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);

    dummy.position.set(x-9.5,y-0.3,z);dummy.updateMatrix();_gL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x+9.5,y-0.3,z);dummy.updateMatrix();_gR.setMatrixAt(i,dummy.matrix);

  }

  _gL.instanceMatrix.needsUpdate=true;_gR.instanceMatrix.needsUpdate=true;

  scene.add(_gL);scene.add(_gR);

}

}



// ---- ROAD MARKS ----

{

  const g=new THREE.PlaneGeometry(.2,3);const m=new THREE.MeshStandardMaterial({color:0xfbbf24,emissive:0xfbbf24,emissiveIntensity:0.15,roughness:0.5,metalness:0.0});

  const inst=new THREE.InstancedMesh(g,m,600);

  for(let i=0;i<600;i++){

    const _z=-50+i*6;dummy.position.set(roadX(_z),roadY(_z)+.03,_z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();

    inst.setMatrixAt(i,dummy.matrix);

  }

  inst.instanceMatrix.needsUpdate=true;scene.add(inst);

  // White edge dashes

  const edgeDG=new THREE.PlaneGeometry(.12,2);

  const edgeDM=new THREE.MeshStandardMaterial({color:0xcccccc,emissive:0xaaaaaa,emissiveIntensity:0.1,roughness:0.5});

  const edgeDL=new THREE.InstancedMesh(edgeDG,edgeDM,300);

  const edgeDR=new THREE.InstancedMesh(edgeDG,edgeDM,300);

  for(let i=0;i<300;i++){

    const _z=-50+i*12;const rx=roadX(_z);const ry=roadY(_z);

    dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);

    dummy.position.set(rx-4.8,ry+.025,_z);dummy.updateMatrix();edgeDL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(rx+4.8,ry+.025,_z);dummy.updateMatrix();edgeDR.setMatrixAt(i,dummy.matrix);

  }

  edgeDL.instanceMatrix.needsUpdate=true;edgeDR.instanceMatrix.needsUpdate=true;

  scene.add(edgeDL);scene.add(edgeDR);

}



// ---- PARKS ----

{

  const parkGeo=new THREE.PlaneGeometry(4,6);

  const parkMat=new THREE.MeshPhongMaterial({color:0x1a7a40,shininess:2});

  const parkN=45;

  const parkInst=new THREE.InstancedMesh(parkGeo,parkMat,parkN);

  for(let i=0;i<parkN;i++){

    const _pz=i*60+30;const side=i%2===0?roadX(_pz)-14:roadX(_pz)+14;

    dummy.position.set(side,roadY(_pz)+.02,_pz);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();

    parkInst.setMatrixAt(i,dummy.matrix);

  }

  parkInst.instanceMatrix.needsUpdate=true;scene.add(parkInst);

}



// ---- PARK BENCHES ----

{

  const benchGeo=new THREE.BoxGeometry(.8,.3,.4);

  const benchMat=new THREE.MeshPhongMaterial({color:0x8B5A2B,shininess:5});

  const benchN=45;

  const benchInst=new THREE.InstancedMesh(benchGeo,benchMat,benchN);

  for(let i=0;i<benchN;i++){

    const _bz=i*60+32;const side=i%2===0?roadX(_bz)-13:roadX(_bz)+13;

    dummy.position.set(side,roadY(_bz)+.25,_bz);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    benchInst.setMatrixAt(i,dummy.matrix);

  }

  benchInst.instanceMatrix.needsUpdate=true;scene.add(benchInst);

}

// ---- SIDEWALKS ----

{

  const swMat=new THREE.MeshStandardMaterial({roughness:0.8,metalness:0.05,color:0x4a5a6a});

  const SW_SEGS=400,SW_LEN=7.5;

  const swL=new THREE.InstancedMesh(new THREE.BoxGeometry(1.2,.15,SW_LEN),swMat,SW_SEGS);

  const swR=new THREE.InstancedMesh(new THREE.BoxGeometry(1.2,.15,SW_LEN),swMat,SW_SEGS);

  for(let i=0;i<SW_SEGS;i++){

    const z=-50+i*SW_LEN,rx=roadX(z+SW_LEN/2);

    dummy.position.set(rx-5.8,roadY(z+SW_LEN/2)+.08,z+SW_LEN/2);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();swL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(rx+5.8,roadY(z+SW_LEN/2)+.08,z+SW_LEN/2);dummy.updateMatrix();swR.setMatrixAt(i,dummy.matrix);

  }

  swL.instanceMatrix.needsUpdate=true;swR.instanceMatrix.needsUpdate=true;scene.add(swL);scene.add(swR);

}



// ---- STREET LAMPS (emissive glow, no PointLight = zero GPU cost) ----

{

  const LAMP_N=25;

  const lampPoleGeo=new THREE.CylinderGeometry(.05,.07,5,4);

  const lampPoleMat=new THREE.MeshPhongMaterial({color:0x555566,shininess:10});

  const lampPoleInst=new THREE.InstancedMesh(lampPoleGeo,lampPoleMat,LAMP_N);

  const lampGlowGeo=new THREE.SphereGeometry(.2,6,6);

  const lampGlowMat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffdd66,emissiveIntensity:1.2,roughness:0.1});

  const lampGlowInst=new THREE.InstancedMesh(lampGlowGeo,lampGlowMat,LAMP_N);

  const lampArmGeo=new THREE.BoxGeometry(1.2,.06,.06);

  const lampArmInst=new THREE.InstancedMesh(lampArmGeo,lampPoleMat,LAMP_N);

  for(let i=0;i<LAMP_N;i++){

    const z=30+i*110;const rx=roadX(z);const ry=roadY(z);

    const side=i%2===0?-5.5:5.5;

    dummy.position.set(rx+side,ry+2.5,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    lampPoleInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(rx+side+(side>0?-0.5:0.5),ry+5.1,z);dummy.updateMatrix();

    lampGlowInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(rx+side+(side>0?-0.3:0.3),ry+5,z);dummy.updateMatrix();

    lampArmInst.setMatrixAt(i,dummy.matrix);

  }

  lampPoleInst.instanceMatrix.needsUpdate=true;lampGlowInst.instanceMatrix.needsUpdate=true;lampArmInst.instanceMatrix.needsUpdate=true;

  scene.add(lampPoleInst);scene.add(lampGlowInst);scene.add(lampArmInst);

}



// ---- ROAD SIGNS ----

{

  const signN=10;

  const poleGeo=new THREE.CylinderGeometry(.04,.04,2.5,4);

  const poleMat=new THREE.MeshPhongMaterial({color:0x999999,shininess:30});

  const poleInst=new THREE.InstancedMesh(poleGeo,poleMat,signN);

  const signGeo=new THREE.BoxGeometry(.8,.6,.05);

  const signMat=new THREE.MeshPhongMaterial({color:0x22c55e,emissive:0x11aa44,emissiveIntensity:0.3,shininess:10});

  const signInst=new THREE.InstancedMesh(signGeo,signMat,signN);

  for(let i=0;i<signN;i++){

    const x=i%2===0?-5.5:5.5;

    const z=i*160+80;

    dummy.position.set(x,roadY(z)+1.25,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    poleInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x,roadY(z)+2.7,z);dummy.updateMatrix();

    signInst.setMatrixAt(i,dummy.matrix);

  }

  poleInst.instanceMatrix.needsUpdate=true;signInst.instanceMatrix.needsUpdate=true;

  scene.add(poleInst);scene.add(signInst);

}

// ---- TRAFFIC LIGHTS ----

{  const TL_N=30;  const tlPoleGeo=new THREE.CylinderGeometry(.06,.06,4,6);  const tlPoleMat=new THREE.MeshPhongMaterial({color:0x444444,shininess:5});  const tlPoleInst=new THREE.InstancedMesh(tlPoleGeo,tlPoleMat,TL_N);  const tlBoxGeo=new THREE.BoxGeometry(.5,1.2,.3);  const tlBoxMat=new THREE.MeshPhongMaterial({color:0x222222,shininess:5});  const tlBoxInst=new THREE.InstancedMesh(tlBoxGeo,tlBoxMat,TL_N);  const tlLightGeo=new THREE.SphereGeometry(.15,8,8);  const tlRedMat=new THREE.MeshStandardMaterial({color:0xff0000,emissive:0xff0000,emissiveIntensity:0.7,roughness:0.2,metalness:0.1});  const tlYelMat=new THREE.MeshStandardMaterial({color:0xffcc00,emissive:0xffcc00,emissiveIntensity:0.7,roughness:0.2,metalness:0.1});  const tlGrnMat=new THREE.MeshStandardMaterial({color:0x00ff00,emissive:0x00ff00,emissiveIntensity:0.7,roughness:0.2,metalness:0.1});  const tlRedInst=new THREE.InstancedMesh(tlLightGeo,tlRedMat,TL_N);  const tlYelInst=new THREE.InstancedMesh(tlLightGeo,tlYelMat,TL_N);  const tlGrnInst=new THREE.InstancedMesh(tlLightGeo,tlGrnMat,TL_N);  const tlPositions=[];  for(let i=0;i<TL_N;i++){    const z=i*200+100;const _tlrx=roadX(z);const side=i%2===0?_tlrx-8:_tlrx+8;    tlPositions.push({x:side,z:z});    dummy.position.set(side,roadY(z)+2,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();    tlPoleInst.setMatrixAt(i,dummy.matrix);    dummy.position.set(side,roadY(z)+4.2,z);dummy.updateMatrix();    tlBoxInst.setMatrixAt(i,dummy.matrix);    dummy.position.set(side,roadY(z)+4.55,z);dummy.updateMatrix();tlRedInst.setMatrixAt(i,dummy.matrix);    dummy.position.set(side,roadY(z)+4.2,z);dummy.updateMatrix();tlYelInst.setMatrixAt(i,dummy.matrix);    dummy.position.set(side,roadY(z)+3.85,z);dummy.updateMatrix();tlGrnInst.setMatrixAt(i,dummy.matrix);  }  tlPoleInst.instanceMatrix.needsUpdate=true;tlBoxInst.instanceMatrix.needsUpdate=true;  tlRedInst.instanceMatrix.needsUpdate=true;tlYelInst.instanceMatrix.needsUpdate=true;tlGrnInst.instanceMatrix.needsUpdate=true;  scene.add(tlPoleInst);scene.add(tlBoxInst);scene.add(tlRedInst);scene.add(tlYelInst);scene.add(tlGrnInst);  window._tlData={redInst:tlRedInst,yelInst:tlYelInst,grnInst:tlGrnInst,positions:tlPositions,n:TL_N};

}

// ---- FLOATING BALLOONS ----

{  const BLN_N=12;const blnColors=[0xff6b9d,0x4ecdc4,0xffe66d,0xa855f7,0x06b6d4,0xf97316];  const blnGeo=new THREE.SphereGeometry(.6,8,8);  const blnMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff});  const blnInst=new THREE.InstancedMesh(blnGeo,blnMat,BLN_N);  blnInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(BLN_N*3),3);  const blnData=[];  const _bc=new THREE.Color();  for(let i=0;i<BLN_N;i++){    const x=-20+Math.random()*40;    const z=Math.random()*2500;    const baseY=10+Math.random()*8;    blnData.push({x,z,baseY,phase:Math.random()*Math.PI*2,spd:.01+Math.random()*.02});    _bc.setHex(blnColors[i%blnColors.length]);    blnInst.instanceColor.setXYZ(i,_bc.r,_bc.g,_bc.b);    dummy.position.set(x,baseY,z);dummy.scale.setScalar(.8+Math.random()*.5);dummy.rotation.set(0,0,0);dummy.updateMatrix();    blnInst.setMatrixAt(i,dummy.matrix);  }  blnInst.instanceMatrix.needsUpdate=true;blnInst.instanceColor.needsUpdate=true;  scene.add(blnInst);  window._blnData={inst:blnInst,data:blnData,n:BLN_N};}



// ---- CROSSWALK STRIPES ----

{

  const CW_N=15;

  const cwGeo=new THREE.PlaneGeometry(9,0.4);

  const cwMat=new THREE.MeshStandardMaterial({color:0x666666,emissive:0x333333,emissiveIntensity:0.02,roughness:0.7,transparent:true,opacity:0.4});

  const cwInst=new THREE.InstancedMesh(cwGeo,cwMat,CW_N*5);

  let ci=0;

  for(let i=0;i<CW_N;i++){

    const z=80+i*200;const rx=roadX(z);const ry=roadY(z);

    for(let s=0;s<5;s++){

      dummy.position.set(rx,ry+0.03,z+s*0.8);

      dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);dummy.updateMatrix();

      cwInst.setMatrixAt(ci++,dummy.matrix);

    }

  }

  cwInst.count=ci;cwInst.instanceMatrix.needsUpdate=true;scene.add(cwInst);

}



// ---- ROAD BARRIERS (chicanes/turns) ----

{

  const BARRIER_N=30;

  const barrierGeo=new THREE.BoxGeometry(3,.6,.8);

  const barrierMat=new THREE.MeshPhongMaterial({color:0xff6600,emissive:0xff4400,emissiveIntensity:0.3,shininess:5});

  const barrierInst=new THREE.InstancedMesh(barrierGeo,barrierMat,BARRIER_N);

  const barrierData=[];

  for(let i=0;i<BARRIER_N;i++){

    const z=150+i*120;

    const _brx=roadX(z);const side=_brx+(i%3===0?-3:(i%3===1?3:0));

    const width=i%3===2?1.5:3;

    barrierData.push({x:side,z:z,w:width});

    dummy.position.set(side,roadY(z)+.4,z);dummy.scale.set(width/3,1,1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    barrierInst.setMatrixAt(i,dummy.matrix);

  }

  barrierInst.instanceMatrix.needsUpdate=true;scene.add(barrierInst);

  window._barrierData={inst:barrierInst,data:barrierData,n:BARRIER_N};

}



// ---- ROAD CURB EDGES (subtle) ----

{

  const RED_EDGE_N=10;

  const redEdgeGeo=new THREE.PlaneGeometry(0.3,25);

  const redEdgeMat=new THREE.MeshBasicMaterial({color:0x555566});

  const redEdgeL=new THREE.InstancedMesh(redEdgeGeo,redEdgeMat,RED_EDGE_N);

  const redEdgeR=new THREE.InstancedMesh(redEdgeGeo,redEdgeMat,RED_EDGE_N);

  const redEdgeData=[];

  for(let i=0;i<RED_EDGE_N;i++){

    const z=200+i*140+Math.random()*40;

    const rx=roadX(z);

    redEdgeData.push({z:z,len:25});

    dummy.rotation.order='YXZ';

    const ca=Math.atan2(roadX(z+2)-roadX(z-2),4);

    dummy.rotation.set(-Math.PI/2,ca,0);dummy.scale.setScalar(1);

    dummy.position.set(rx-5,roadY(z)+.025,z);dummy.updateMatrix();redEdgeL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(rx+5,roadY(z)+.025,z);dummy.updateMatrix();redEdgeR.setMatrixAt(i,dummy.matrix);

  }

  redEdgeL.instanceMatrix.needsUpdate=true;redEdgeR.instanceMatrix.needsUpdate=true;

  scene.add(redEdgeL);scene.add(redEdgeR);

  window._redEdges={data:redEdgeData,n:RED_EDGE_N};

}



// ---- ROAD ARROWS (turn indicators) ----

{

  const ARROW_N=10;

  const arrowGeo=new THREE.ConeGeometry(.6,1.5,3);

  const arrowMat=new THREE.MeshBasicMaterial({color:0x44ff44});

  const arrowInst=new THREE.InstancedMesh(arrowGeo,arrowMat,ARROW_N);

  for(let i=0;i<ARROW_N;i++){

    const z=130+i*120;

    const side=i%3===0?1:(i%3===1?-1:0);

    dummy.position.set(roadX(z)+side*2,roadY(z)+2.5,z);dummy.rotation.set(0,0,side*Math.PI/2);dummy.scale.setScalar(1);dummy.updateMatrix();

    arrowInst.setMatrixAt(i,dummy.matrix);

  }

  arrowInst.instanceMatrix.needsUpdate=true;scene.add(arrowInst);

  window._arrowData={inst:arrowInst,n:ARROW_N,positions:[]};

  for(let i=0;i<ARROW_N;i++){const z=130+i*120;const side=i%3===0?1:(i%3===1?-1:0);window._arrowData.positions.push({x:roadX(z)+side*2,y:roadY(z)+2.5,z:z,side:side})}

}

// ---- SPEED BUMPS ----

{

  const BUMP_N=12;

  const bumpGeo=new THREE.CylinderGeometry(2.5,.5,.2,12);

  const bumpMat=new THREE.MeshPhongMaterial({color:0xffdd00,emissive:0xffbb00,emissiveIntensity:0.3,shininess:10});

  const bumpInst=new THREE.InstancedMesh(bumpGeo,bumpMat,BUMP_N);

  for(let i=0;i<BUMP_N;i++){

    const _bz=200+i*250;dummy.position.set(roadX(_bz),roadY(_bz)+.15,_bz);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    bumpInst.setMatrixAt(i,dummy.matrix);

  }

  bumpInst.instanceMatrix.needsUpdate=true;scene.add(bumpInst);

}



// ---- CROSS STREETS (intersections) ----

{

  const crossN=40;

  const crossGeo=new THREE.PlaneGeometry(40,5);

  const crossMat=new THREE.MeshStandardMaterial({color:0x22222e,roughness:0.5,metalness:0.15});

  const crossInst=new THREE.InstancedMesh(crossGeo,crossMat,crossN);

  const zebraGeo=new THREE.PlaneGeometry(1.4,.6);

  const zebraMat=new THREE.MeshStandardMaterial({roughness:0.7,metalness:0.05,color:0x777777,transparent:true,opacity:0.35});

  const zebraInst=new THREE.InstancedMesh(zebraGeo,zebraMat,crossN*5);

  const sideRoadGeo=new THREE.PlaneGeometry(8,30);

  const sideRoadMat=new THREE.MeshStandardMaterial({color:0x22222e,roughness:0.55,metalness:0.1});

  const sideRoadL=new THREE.InstancedMesh(sideRoadGeo,sideRoadMat,crossN);

  const sideRoadR=new THREE.InstancedMesh(sideRoadGeo,sideRoadMat,crossN);

  for(let i=0;i<crossN;i++){

    const z=70+i*80,x=roadX(z),ihy=roadY(z);

    dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.setScalar(1);

    dummy.position.set(x,ihy+.013,z);dummy.updateMatrix();crossInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x-12,ihy+.011,z);dummy.rotation.set(-Math.PI/2,0,Math.PI/2);dummy.updateMatrix();sideRoadL.setMatrixAt(i,dummy.matrix);

    dummy.position.set(x+12,ihy+.011,z);dummy.updateMatrix();sideRoadR.setMatrixAt(i,dummy.matrix);

    for(let j=0;j<10;j++){

      dummy.rotation.set(-Math.PI/2,0,0);

      dummy.position.set(x-4.5+j*1,ihy+.025,z);dummy.updateMatrix();

      zebraInst.setMatrixAt(i*10+j,dummy.matrix);

    }

  }

  crossInst.instanceMatrix.needsUpdate=true;zebraInst.instanceMatrix.needsUpdate=true;

  sideRoadL.instanceMatrix.needsUpdate=true;sideRoadR.instanceMatrix.needsUpdate=true;

  scene.add(crossInst);scene.add(zebraInst);scene.add(sideRoadL);scene.add(sideRoadR);

}





















// ---- CROSS TRAFFIC ----

{

  const CT_N=6;

  const ctGeo=new THREE.BoxGeometry(2,0.6,1.1);

  const ctRoofGeo=new THREE.BoxGeometry(1.4,0.35,0.85);

  const ctColors=[0xe74c3c,0xf1c40f,0x3498db,0xe67e22,0x9b59b6,0x1abc9c];

  const ctBodyInst=new THREE.InstancedMesh(ctGeo,new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4,color:0xffffff}),CT_N);

  ctBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(CT_N*3),3);

  const ctRoofInst=new THREE.InstancedMesh(ctRoofGeo,new THREE.MeshStandardMaterial({roughness:0.15,metalness:0.7,color:0x1a2a3a}),CT_N);

  const _ctc=new THREE.Color();

  const ctData=[];

  for(let i=0;i<CT_N;i++){

    _ctc.setHex(ctColors[i%ctColors.length]);

    ctBodyInst.instanceColor.setXYZ(i,_ctc.r,_ctc.g,_ctc.b);

    ctData.push({x:0,z:0,dir:1,spd:0.15+Math.random()*0.1,active:false,crossZ:0});

  }

  ctBodyInst.instanceColor.needsUpdate=true;

  scene.add(ctBodyInst);

  scene.add(ctRoofInst);

  // Cross traffic wheels

  const ctWheelGeo=new THREE.CylinderGeometry(0.18,0.18,0.12,6);

  const ctWheelMat=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:0.9,metalness:0.15});

  const ctWheelInst=new THREE.InstancedMesh(ctWheelGeo,ctWheelMat,CT_N*4);

  ctWheelInst.instanceMatrix.needsUpdate=true;

  scene.add(ctWheelInst);

  const ctHlGeo=new THREE.BoxGeometry(0.15,0.08,0.04);

  const ctHlMat=new THREE.MeshStandardMaterial({color:0xffffdd,emissive:0xffff88,emissiveIntensity:0.7,roughness:0.2,metalness:0.5});

  const ctHlInst=new THREE.InstancedMesh(ctHlGeo,ctHlMat,CT_N*2);

  ctHlInst.instanceMatrix.needsUpdate=true;

  scene.add(ctHlInst);

  const ctTlGeo=new THREE.BoxGeometry(0.12,0.06,0.04);

  const ctTlMat=new THREE.MeshStandardMaterial({color:0xff4444,emissive:0xff2200,emissiveIntensity:0.8,roughness:0.3,metalness:0.2});

  const ctTlInst=new THREE.InstancedMesh(ctTlGeo,ctTlMat,CT_N*2);

  ctTlInst.instanceMatrix.needsUpdate=true;

  scene.add(ctTlInst);

  window._ctData={bodyInst:ctBodyInst,roofInst:ctRoofInst,wheelInst:ctWheelInst,hlInst:ctHlInst,tlInst:ctTlInst,data:ctData,n:CT_N};

}



// ---- CURVE MARKERS ----

{

  const CMARK_N=50;

  const cmarkGeo=new THREE.BoxGeometry(0.3,0.1,2);

  const cmarkMatL=new THREE.MeshBasicMaterial({color:0xffcc00});

  const cmarkMatR=new THREE.MeshBasicMaterial({color:0xffffff});

  const cmarkLInst=new THREE.InstancedMesh(cmarkGeo,cmarkMatL,CMARK_N);

  const cmarkRInst=new THREE.InstancedMesh(cmarkGeo,cmarkMatR,CMARK_N);

  for(let i=0;i<CMARK_N;i++){

    const z=i*30;

    const curve=roadX(z);

    dummy.position.set(-5+curve,roadY(z)+0.02,z);

    dummy.scale.setScalar(1);

    dummy.rotation.set(-Math.PI/2,0,0);

    dummy.updateMatrix();

    cmarkLInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(5+curve,roadY(z)+0.02,z);

    dummy.updateMatrix();

    cmarkRInst.setMatrixAt(i,dummy.matrix);

  }

  cmarkLInst.instanceMatrix.needsUpdate=true;

  cmarkRInst.instanceMatrix.needsUpdate=true;

  scene.add(cmarkLInst);

  scene.add(cmarkRInst);

  window._cmarkData={lInst:cmarkLInst,rInst:cmarkRInst,n:CMARK_N};

}



// ---- PEDESTRIANS ----

{

  const PED_N=20;

  const pedBodyGeo=new THREE.CylinderGeometry(0.12,0.16,0.5,6);

  const pedHeadGeo=new THREE.SphereGeometry(0.2,6,6);

  const pedColors=[0xffccaa,0xddaa88,0xeebb99,0xcc9977,0xffddbb];

  const pedBodyInst=new THREE.InstancedMesh(pedBodyGeo,new THREE.MeshPhongMaterial({color:0x4488cc,shininess:5}),PED_N);

  const pedHeadInst=new THREE.InstancedMesh(pedHeadGeo,new THREE.MeshPhongMaterial({color:0xffffff,shininess:5}),PED_N);

  pedHeadInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PED_N*3),3);

  const _pedc=new THREE.Color();

  const pedData=[];

  for(let i=0;i<PED_N;i++){

    const z=Math.random()*2500;

    const side=i%2===0?roadX(z)-7:roadX(z)+7;

    const dir=Math.random()>0.5?1:-1;

    const spd=0.005+Math.random()*0.01;

    pedData.push({x:side+Math.random()*1.5-0.75,z:z,dir:dir,spd:spd,phase:Math.random()*Math.PI*2});

    _pedc.setHex(pedColors[i%pedColors.length]);

    pedHeadInst.instanceColor.setXYZ(i,_pedc.r,_pedc.g,_pedc.b);

    dummy.position.set(side,0.5,z);

    dummy.scale.setScalar(1);

    dummy.rotation.set(0,0,0);

    dummy.updateMatrix();

    pedBodyInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,1.1,z);

    dummy.updateMatrix();

    pedHeadInst.setMatrixAt(i,dummy.matrix);

  }

  pedBodyInst.instanceMatrix.needsUpdate=true;

  pedHeadInst.instanceMatrix.needsUpdate=true;

  pedHeadInst.instanceColor.needsUpdate=true;

  scene.add(pedBodyInst);

  scene.add(pedHeadInst);

  // Pedestrian legs

  const pedLegGeo=new THREE.CylinderGeometry(0.05,0.06,0.35,4);

  const pedLegMat=new THREE.MeshStandardMaterial({color:0x2a2a4a,roughness:0.8,metalness:0.05});

  const pedLegLI=new THREE.InstancedMesh(pedLegGeo,pedLegMat,PED_N);

  const pedLegRI=new THREE.InstancedMesh(pedLegGeo,pedLegMat,PED_N);

  for(let i=0;i<PED_N;i++){

    const pd=pedData[i];const hy=roadY(pd.z);

    dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);

    dummy.position.set(pd.x-0.07,hy+0.18,pd.z);dummy.updateMatrix();pedLegLI.setMatrixAt(i,dummy.matrix);

    dummy.position.set(pd.x+0.07,hy+0.18,pd.z);dummy.updateMatrix();pedLegRI.setMatrixAt(i,dummy.matrix);

  }

  pedLegLI.instanceMatrix.needsUpdate=true;pedLegRI.instanceMatrix.needsUpdate=true;

  scene.add(pedLegLI);scene.add(pedLegRI);

  window._pedData={bodyInst:pedBodyInst,headInst:pedHeadInst,legL:pedLegLI,legR:pedLegRI,data:pedData,n:PED_N};

}



// ---- PARKED CARS ----

{

  const PARKED_N=25;

  const pCarBodyGeo=new THREE.BoxGeometry(1.1,0.55,2);

  const pCarRoofGeo=new THREE.BoxGeometry(0.85,0.35,1.1);

  const pCarColors=[0x2c3e50,0x7f8c8d,0xbdc3c7,0x34495e,0x95a5a6,0xc0392b,0x2980b9,0x27ae60,0xf1c40f,0x8e44ad];

  const pCarBodyInst=new THREE.InstancedMesh(pCarBodyGeo,new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4,color:0xffffff}),PARKED_N);

  pCarBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(PARKED_N*3),3);

  const pCarRoofInst=new THREE.InstancedMesh(pCarRoofGeo,new THREE.MeshStandardMaterial({roughness:0.15,metalness:0.7,color:0x1a2a3a}),PARKED_N);

  const _pc=new THREE.Color();

  for(let i=0;i<PARKED_N;i++){

    const z=30+i*100+Math.random()*40;

    const side=i%2===0?roadX(z)-5.8:roadX(z)+5.8;

    const angle=i%2===0?0.05:-0.05;

    _pc.setHex(pCarColors[i%pCarColors.length]);

    pCarBodyInst.instanceColor.setXYZ(i,_pc.r,_pc.g,_pc.b);

    dummy.position.set(side,0.35,z);

    dummy.scale.setScalar(1);

    dummy.rotation.set(0,angle,0);

    dummy.updateMatrix();

    pCarBodyInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,0.7,z-0.1);

    dummy.updateMatrix();

    pCarRoofInst.setMatrixAt(i,dummy.matrix);

  }

  pCarBodyInst.instanceMatrix.needsUpdate=true;

  pCarBodyInst.instanceColor.needsUpdate=true;

  pCarRoofInst.instanceMatrix.needsUpdate=true;

  scene.add(pCarBodyInst);

  scene.add(pCarRoofInst);

  // Parked car wheels

  const pWhlGeo=new THREE.CylinderGeometry(0.16,0.16,0.1,6);

  const pWhlMat=new THREE.MeshStandardMaterial({color:0x1a1a1a,roughness:0.9,metalness:0.15});

  const pWhlInst=new THREE.InstancedMesh(pWhlGeo,pWhlMat,PARKED_N*4);

  for(let i=0;i<PARKED_N;i++){

    const _pz2=30+i*100+Math.random()*40;

    const _ps2=i%2===0?roadX(_pz2)-5.8:roadX(_pz2)+5.8;

    const _phy=roadY(_pz2);

    [[-0.45,_phy+0.16,_pz2+0.7],[0.45,_phy+0.16,_pz2+0.7],[-0.45,_phy+0.16,_pz2-0.7],[0.45,_phy+0.16,_pz2-0.7]].forEach((p,wi)=>{

      dummy.position.set(_ps2+p[0],p[1],p[2]);dummy.rotation.set(0,0,Math.PI/2);dummy.scale.setScalar(1);dummy.updateMatrix();

      pWhlInst.setMatrixAt(i*4+wi,dummy.matrix);

    });

  }

  pWhlInst.instanceMatrix.needsUpdate=true;scene.add(pWhlInst);

}



// ---- COLORFUL SHOPS ----

{

  const SHOP_N=20;

  const shopColors=[0xe63946,0x457b9d,0xf4a261,0x2a9d8f,0xe76f51,0x6d6875,0x48cae4,0xf72585];

  const awningGeo=new THREE.BoxGeometry(2.5,0.2,1.5);

  const awningMat=new THREE.MeshPhongMaterial({color:0xffffff,shininess:5});

  const awningInst=new THREE.InstancedMesh(awningGeo,awningMat,SHOP_N);

  awningInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(SHOP_N*3),3);

  const shopFrontGeo=new THREE.BoxGeometry(2.5,2,0.1);

  const shopFrontMat=new THREE.MeshBasicMaterial({color:0xffeedd,transparent:true,opacity:0.3});

  const shopFrontInst=new THREE.InstancedMesh(shopFrontGeo,shopFrontMat,SHOP_N);

  const shopLightGeo=new THREE.SphereGeometry(0.2,4,4);

  const shopLightMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff});

  const shopLightInst=new THREE.InstancedMesh(shopLightGeo,shopLightMat,SHOP_N);

  shopLightInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(SHOP_N*3),3);

  const _sc=new THREE.Color();

  for(let i=0;i<SHOP_N;i++){

    const z=50+i*80;

    const side=i%2===0?roadX(z)-8.5:roadX(z)+8.5;const _shy=roadY(z);

    _sc.setHex(shopColors[i%shopColors.length]);

    awningInst.instanceColor.setXYZ(i,_sc.r,_sc.g,_sc.b);

    shopLightInst.instanceColor.setXYZ(i,_sc.r,_sc.g,_sc.b);

    dummy.position.set(side,_shy+3.2,z);

    dummy.scale.setScalar(1);

    dummy.rotation.set(0.15*(i%2===0?1:-1),0,0);

    dummy.updateMatrix();

    awningInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,_shy+2,z);

    dummy.rotation.set(0,0,0);

    dummy.updateMatrix();

    shopFrontInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,roadY(z)+3.5,z);

    dummy.scale.setScalar(1);

    dummy.updateMatrix();

    shopLightInst.setMatrixAt(i,dummy.matrix);

  }

  awningInst.instanceMatrix.needsUpdate=true;

  awningInst.instanceColor.needsUpdate=true;

  shopFrontInst.instanceMatrix.needsUpdate=true;

  shopLightInst.instanceMatrix.needsUpdate=true;

  shopLightInst.instanceColor.needsUpdate=true;

  scene.add(awningInst);

  scene.add(shopFrontInst);

  scene.add(shopLightInst);

  window._shopData={lightInst:shopLightInst,n:SHOP_N};

}



// ---- TWINKLING STARS ----

{

  const STAR_N=50;

  const starGeo=new THREE.SphereGeometry(0.12,4,4);

  const starMat=new THREE.MeshBasicMaterial({color:0xffffff});

  const starInst=new THREE.InstancedMesh(starGeo,starMat,STAR_N);

  const starData=[];

  for(let i=0;i<STAR_N;i++){

    const x=-60+Math.random()*120;

    const y=20+Math.random()*25;

    const z=Math.random()*3000-200;

    const phase=Math.random()*Math.PI*2;

    const twinkleSpd=0.02+Math.random()*0.05;

    starData.push({x,y,z,phase,twinkleSpd});

    dummy.position.set(x,y,z);

    dummy.scale.setScalar(0.5+Math.random()*0.8);

    dummy.rotation.set(0,0,0);

    dummy.updateMatrix();

    starInst.setMatrixAt(i,dummy.matrix);

  }

  starInst.instanceMatrix.needsUpdate=true;

  scene.add(starInst);

  window._starData={inst:starInst,data:starData,n:STAR_N};

}



// ---- BRIDGES ----

{

  const BRIDGE_N=4;

  const bridgeDeckGeo=new THREE.BoxGeometry(14,0.4,4);

  const bridgeDeckMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x556677});

  const bridgeDeckInst=new THREE.InstancedMesh(bridgeDeckGeo,bridgeDeckMat,BRIDGE_N);

  const pillarGeo=new THREE.CylinderGeometry(0.3,0.4,7,6);

  const pillarMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x667788});

  const pillarInst=new THREE.InstancedMesh(pillarGeo,pillarMat,BRIDGE_N*4);

  const railGeo=new THREE.BoxGeometry(14,0.8,0.15);

  const railMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x88aacc});

  const railInst=new THREE.InstancedMesh(railGeo,railMat,BRIDGE_N*2);

  const archGeo=new THREE.TorusGeometry(3.5,0.2,6,12,Math.PI);

  const archMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x7799bb});

  const archInst=new THREE.InstancedMesh(archGeo,archMat,BRIDGE_N*2);

  for(let i=0;i<BRIDGE_N;i++){

    const z=800+i*700;const _brx=roadX(z);const _bhy=roadY(z);

    dummy.position.set(_brx,_bhy+6.8,z);

    dummy.scale.setScalar(1);

    dummy.rotation.set(0,0,0);

    dummy.updateMatrix();

    bridgeDeckInst.setMatrixAt(i,dummy.matrix);

    const pillars=[[_brx-6,z-1.5],[_brx-6,z+1.5],[_brx+6,z-1.5],[_brx+6,z+1.5]];

    for(let j=0;j<4;j++){

      dummy.position.set(pillars[j][0],_bhy+3.5,pillars[j][1]);

      dummy.updateMatrix();

      pillarInst.setMatrixAt(i*4+j,dummy.matrix);

    }

    dummy.position.set(_brx,_bhy+7.2,z-1.8);

    dummy.updateMatrix();

    railInst.setMatrixAt(i*2,dummy.matrix);

    dummy.position.set(_brx,_bhy+7.2,z+1.8);

    dummy.updateMatrix();

    railInst.setMatrixAt(i*2+1,dummy.matrix);

    dummy.position.set(_brx-6,_bhy+6.8,z);

    dummy.rotation.set(0,Math.PI/2,0);

    dummy.updateMatrix();

    archInst.setMatrixAt(i*2,dummy.matrix);

    dummy.position.set(_brx+6,_bhy+6.8,z);

    dummy.updateMatrix();

    archInst.setMatrixAt(i*2+1,dummy.matrix);

  }

  bridgeDeckInst.instanceMatrix.needsUpdate=true;

  pillarInst.instanceMatrix.needsUpdate=true;

  railInst.instanceMatrix.needsUpdate=true;

  archInst.instanceMatrix.needsUpdate=true;

  scene.add(bridgeDeckInst);

  scene.add(pillarInst);

  scene.add(railInst);

  scene.add(archInst);

}



// ---- ONCOMING TRAFFIC ----

{

  const ONC_N=8;

  const oncBodyGeo=new THREE.BoxGeometry(1.8,0.9,3);

  const oncRoofGeo=new THREE.BoxGeometry(1.3,0.5,1.6);

  const oncColors=[0xe74c3c,0x3498db,0xf39c12,0x9b59b6,0x1abc9c,0xe67e22,0x2ecc71,0xecf0f1];

  const oncBodyInst=new THREE.InstancedMesh(oncBodyGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffff}),ONC_N);

  oncBodyInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(ONC_N*3),3);

  const oncRoofInst=new THREE.InstancedMesh(oncRoofGeo,new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x222222}),ONC_N);

  const oncLightInst=new THREE.InstancedMesh(new THREE.SphereGeometry(0.4,6,6),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffff44}),ONC_N*2);

  const _oc=new THREE.Color();

  const oncData=[];

  for(let i=0;i<ONC_N;i++){

    _oc.setHex(oncColors[i%oncColors.length]);

    oncBodyInst.instanceColor.setXYZ(i,_oc.r,_oc.g,_oc.b);

    oncData.push({x:-3.5+Math.random()*1.5,z:0,spd:0.12+Math.random()*0.15,active:false});

  }

  oncBodyInst.instanceColor.needsUpdate=true;

  scene.add(oncBodyInst);scene.add(oncRoofInst);scene.add(oncLightInst);

  window._oncData={bodyInst:oncBodyInst,roofInst:oncRoofInst,lightInst:oncLightInst,data:oncData,n:ONC_N};

}



// ---- TUNNELS ----

{

  const TUNNEL_N=5;

  const tunnelWallGeo=new THREE.BoxGeometry(1,5,20);

  const tunnelWallMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x333344});

  const tunnelRoofGeo=new THREE.BoxGeometry(12,0.5,20);

  const tunnelRoofMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x222233});

  const tunnelLWall=new THREE.InstancedMesh(tunnelWallGeo,tunnelWallMat,TUNNEL_N);

  const tunnelRWall=new THREE.InstancedMesh(tunnelWallGeo,tunnelWallMat,TUNNEL_N);

  const tunnelRoof=new THREE.InstancedMesh(tunnelRoofGeo,tunnelRoofMat,TUNNEL_N);

  const tunnelLightGeo=new THREE.SphereGeometry(0.3,6,6);

  const tunnelLightMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffaa44});

  const LIGHTS_PER_TUNNEL=4;

  const tunnelLightInst=new THREE.InstancedMesh(tunnelLightGeo,tunnelLightMat,TUNNEL_N*LIGHTS_PER_TUNNEL);

  const tunnelPositions=[];window._tunnelPositions=tunnelPositions;

  for(let i=0;i<TUNNEL_N;i++){

    const z=400+i*600;

    tunnelPositions.push(z);const _trx=roadX(z);const _thy=roadY(z);

    dummy.position.set(_trx-6,_thy+2.5,z);

    dummy.scale.setScalar(1);

    dummy.rotation.set(0,0,0);

    dummy.updateMatrix();

    tunnelLWall.setMatrixAt(i,dummy.matrix);

    dummy.position.set(_trx+6,_thy+2.5,z);

    dummy.updateMatrix();

    tunnelRWall.setMatrixAt(i,dummy.matrix);

    dummy.position.set(_trx,_thy+5,z);

    dummy.updateMatrix();

    tunnelRoof.setMatrixAt(i,dummy.matrix);

    for(let j=0;j<LIGHTS_PER_TUNNEL;j++){

      dummy.position.set(_trx,_thy+4.7,z-8+j*5.3);

      dummy.scale.setScalar(1);

      dummy.updateMatrix();

      tunnelLightInst.setMatrixAt(i*LIGHTS_PER_TUNNEL+j,dummy.matrix);

    }

  }

  tunnelLWall.instanceMatrix.needsUpdate=true;

  tunnelRWall.instanceMatrix.needsUpdate=true;

  tunnelRoof.instanceMatrix.needsUpdate=true;

  tunnelLightInst.instanceMatrix.needsUpdate=true;

  scene.add(tunnelLWall);

  scene.add(tunnelRWall);

  scene.add(tunnelRoof);

  scene.add(tunnelLightInst);

  window._tunnelData={lights:tunnelLightInst,positions:tunnelPositions,n:TUNNEL_N,lpt:LIGHTS_PER_TUNNEL};

}



// ---- BUILDINGS (varied zones) ----

const bdata=[];window._bdata=bdata;

for(let z=-100;z<=7000;z+=10){

  const _rx=roadX(z);

  const zone=Math.floor(z/300)%7;

  // Zone types: 0=downtown tall, 1=suburban low, 2=mixed, 3=park(sparse), 4=industrial, 5=residential, 6=commercial

  const zoneH=[18,6,12,4,10,7,14];

  const zoneBase=[6,2,3,1,4,2,5];

  const zoneSkip=[0.0,0.1,0.05,0.5,0.08,0.15,0.03];

  if(Math.random()>zoneSkip[zone]){

    const h=zoneBase[zone]+Math.random()*zoneH[zone];

    bdata.push([_rx-16,z,2.5+Math.random()*2,h,2.5+Math.random()*2]);

    bdata.push([_rx+16,z,2.5+Math.random()*2,h*(.5+Math.random()*.5),2.5+Math.random()*2]);

  }

  if(Math.random()>.4&&zone!==3)bdata.push([_rx-22,z,2+Math.random()*2,zoneBase[zone]+Math.random()*zoneH[zone]*.6,2+Math.random()*2]);

  if(Math.random()>.4&&zone!==3)bdata.push([_rx+22,z,2+Math.random()*2,zoneBase[zone]+Math.random()*zoneH[zone]*.6,2+Math.random()*2]);

}

{

  const geo=new THREE.BoxGeometry(1,1,1);const mat=new THREE.MeshStandardMaterial({roughness:0.55,metalness:0.25,envMapIntensity:1.8});

  const inst=new THREE.InstancedMesh(geo,mat,bdata.length);

  const biomes=[[0x1a2a3a,0x223344,0x182838,0x2a3a4a],[0x3a2218,0x44332a,0x331a10,0x4a3322],[0x1a1a3a,0x222244,0x151530,0x2a2a44],[0x152a22,0x1a3a2a,0x10281a,0x224433],[0x3a1522,0x442233,0x30101a,0x553344],[0x102a3a,0x1a3a44,0x0e2830,0x1a3a44],[0x3a3018,0x443622,0x332810,0x443a2a]];

  function biomeColor(z,i){const idx=((Math.floor(z/180)%biomes.length)+biomes.length)%biomes.length;const b=biomes[idx];return b[i%b.length]}

  const colors=[0x22c55e,0x10b981,0x059669,0x34d399,0x6ee7b7,0x14b8a6,0x0d9488,0x2dd4bf];

  bdata.forEach((b,i)=>{

    dummy.position.set(b[0],roadY(b[1])+b[3]/2,b[1]);dummy.scale.set(b[2],b[3],b[4]);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    inst.setMatrixAt(i,dummy.matrix);inst.setColorAt(i,_col.setHex(biomeColor(b[1],i)));

  });

  inst.instanceMatrix.needsUpdate=true;inst.instanceColor.needsUpdate=true;
  inst.castShadow=true;inst.receiveShadow=true;
  scene.add(inst);

  // Building windows (emissive glow)

  const WIN_N=Math.min(600,bdata.length*3);

  const winGeo=new THREE.PlaneGeometry(0.4,0.5);

  const winMat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffdd55,emissiveIntensity:3.5,roughness:0.05,side:THREE.DoubleSide});

  const winInst=new THREE.InstancedMesh(winGeo,winMat,WIN_N);

  let wi=0;

  for(let i=0;i<bdata.length&&wi<WIN_N;i++){

    const b=bdata[i];if(b[3]<3)continue;// skip short buildings

    const bx=b[0],bz=b[1],bh=b[3],bw=b[2];

    const ry=roadY(bz);

    const facing=bx<roadX(bz)?1:-1;// face toward road

    for(let row=0;row<Math.min(3,Math.floor(bh/3));row++){

      if(Math.random()>.75)continue;// some windows dark

      const wy=ry+2+row*2.5;

      const wx=bx+facing*(bw/2+0.01);

      dummy.position.set(wx,wy,bz+(Math.random()-.5)*b[4]*.6);

      dummy.rotation.set(0,facing>0?-Math.PI/2:Math.PI/2,0);

      dummy.scale.setScalar(1);dummy.updateMatrix();

      winInst.setMatrixAt(wi,dummy.matrix);wi++;

      if(wi>=WIN_N)break;

    }

  }

  winInst.count=wi;winInst.instanceMatrix.needsUpdate=true;scene.add(winInst);

  // Neon signs on buildings

  const neonColors=[0xff3388,0x33ff88,0x3388ff,0xff8833,0x88ff33,0xff33ff];

  const NEON_N=20;

  const neonGeo=new THREE.PlaneGeometry(1.8,0.6);

  const neonInst=new THREE.InstancedMesh(neonGeo,new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:1.0,roughness:0.0,side:THREE.DoubleSide}),NEON_N);

  neonInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(NEON_N*3),3);

  const _nc=new THREE.Color();

  for(let ni=0;ni<NEON_N;ni++){

    const bi=Math.floor(Math.random()*bdata.length);

    const b=bdata[bi];if(b[3]<5)continue;

    const facing=b[0]<roadX(b[1])?1:-1;

    _nc.setHex(neonColors[ni%neonColors.length]);

    neonInst.instanceColor.setXYZ(ni,_nc.r,_nc.g,_nc.b);

    dummy.position.set(b[0]+facing*(b[2]/2+0.02),roadY(b[1])+b[3]*0.6,b[1]);

    dummy.rotation.set(0,facing>0?-Math.PI/2:Math.PI/2,0);

    dummy.scale.setScalar(1);dummy.updateMatrix();

    neonInst.setMatrixAt(ni,dummy.matrix);

  }

  neonInst.instanceMatrix.needsUpdate=true;neonInst.instanceColor.needsUpdate=true;scene.add(neonInst);

}



// Building roof accents + antennas

{

  const roofN=Math.min(bdata.length,200);

  const antN=Math.floor(roofN/3);

  const antGeo=new THREE.CylinderGeometry(0.02,0.02,2,3);

  const antMat=new THREE.MeshStandardMaterial({color:0x888888,roughness:0.4,metalness:0.8});

  const antInst=new THREE.InstancedMesh(antGeo,antMat,antN);

  const antLGeo=new THREE.SphereGeometry(0.08,4,4);

  const antLMat=new THREE.MeshStandardMaterial({color:0xff0000,emissive:0xff0000,emissiveIntensity:1.0,roughness:0.1});

  const antLInst=new THREE.InstancedMesh(antLGeo,antLMat,antN);

  for(let i=0;i<antN;i++){

    const b=bdata[i*3];

    dummy.position.set(b[0]+0.5,roadY(b[1])+b[3]+1,b[1]);

    dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    antInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(b[0]+0.5,roadY(b[1])+b[3]+2.05,b[1]);dummy.updateMatrix();

    antLInst.setMatrixAt(i,dummy.matrix);

  }

  antInst.instanceMatrix.needsUpdate=true;antLInst.instanceMatrix.needsUpdate=true;

  scene.add(antInst);scene.add(antLInst);

}

// Wider glowing windows

{

  const wp=[];

  bdata.forEach(b=>{for(let y=0;y<Math.floor(b[3]/2);y++){for(let x=-1;x<=1;x++){if(Math.random()>.25)wp.push(b[0]+x*.8,y*1.2+1.2,b[1]+b[4]/2+.01)}}});

  const n=wp.length/3;const geo=new THREE.PlaneGeometry(.4,.5);const mat=new THREE.MeshStandardMaterial({color:0xffeeaa,emissive:0xffcc55,emissiveIntensity:1.2,roughness:0.1,metalness:0.0});

  const inst=new THREE.InstancedMesh(geo,mat,n);

  for(let i=0;i<n;i++){dummy.position.set(wp[i*3],wp[i*3+1],wp[i*3+2]);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix)}

  inst.instanceMatrix.needsUpdate=true;scene.add(inst);

}




// ---- BUILDING LEDGES (horizontal floor lines) ----
{
  var ledgeGeo=new THREE.BoxGeometry(1.08,0.08,1.08);
  var ledgeMat=new THREE.MeshStandardMaterial({color:0x555566,roughness:0.6,metalness:0.3});
  var LEDGE_N=Math.min(400,bdata.length);
  var ledgeInst=new THREE.InstancedMesh(ledgeGeo,ledgeMat,LEDGE_N);
  var li=0;
  for(var bi=0;bi<bdata.length&&li<LEDGE_N;bi++){
    var bd=bdata[bi];
    if(bd[3]<5)continue;// skip short buildings
    // Add 2 ledges per tall building (at 1/3 and 2/3 height)
    for(var fl=1;fl<=2&&li<LEDGE_N;fl++){
      var ly=roadY(bd[1])+bd[3]*fl/3;
      dummy.position.set(bd[0],ly,bd[1]);
      dummy.scale.set(bd[2],1,bd[4]);
      dummy.rotation.set(0,0,0);
      dummy.updateMatrix();
      ledgeInst.setMatrixAt(li,dummy.matrix);
      li++;
    }
  }
  ledgeInst.count=li;
  ledgeInst.instanceMatrix.needsUpdate=true;
  scene.add(ledgeInst);
}

// ---- ROOFTOP CAPS ----
{
  var roofGeo=new THREE.BoxGeometry(1,0.15,1);
  var roofMat=new THREE.MeshStandardMaterial({color:0x2a2a3a,roughness:0.8,metalness:0.1});
  var ROOF_N=Math.min(400,bdata.length);
  var roofInst=new THREE.InstancedMesh(roofGeo,roofMat,ROOF_N);
  roofInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(ROOF_N*3),3);
  var roofColors=[0x2a2a3a,0x3a2a2a,0x2a3a2a,0x3a3a2a,0x2a2a4a];
  var ri2=0;
  for(var bi2=0;bi2<bdata.length&&ri2<ROOF_N;bi2++){
    var bd2=bdata[bi2];
    if(bd2[3]<3)continue;
    dummy.position.set(bd2[0],roadY(bd2[1])+bd2[3]+0.07,bd2[1]);
    dummy.scale.set(bd2[2]*1.05,1,bd2[4]*1.05);
    dummy.rotation.set(0,0,0);
    dummy.updateMatrix();
    roofInst.setMatrixAt(ri2,dummy.matrix);
    var rc=new THREE.Color(roofColors[ri2%roofColors.length]);
    roofInst.instanceColor.setXYZ(ri2,rc.r,rc.g,rc.b);
    ri2++;
  }
  roofInst.count=ri2;
  roofInst.instanceMatrix.needsUpdate=true;
  roofInst.instanceColor.needsUpdate=true;
  scene.add(roofInst);
}
// ---- DISTANT CITY SKYLINE (silhouettes) ----
{
  var skyGeo2=new THREE.BoxGeometry(1,1,1);
  var skyMat2=new THREE.MeshBasicMaterial({color:0x0a0a18,fog:true});
  var SKY_N=120;
  var skyInst2=new THREE.InstancedMesh(skyGeo2,skyMat2,SKY_N);
  for(var si2=0;si2<SKY_N;si2++){
    var sz2=si2*60-100;
    var side2=si2%2===0?-1:1;
    var sx2=roadX(sz2)+side2*(35+Math.random()*30);
    var sh2=8+Math.random()*25;
    var sw2=3+Math.random()*5;
    dummy.position.set(sx2,roadY(sz2)+sh2/2,sz2);
    dummy.scale.set(sw2,sh2,sw2);
    dummy.rotation.set(0,Math.random()*0.3,0);
    dummy.updateMatrix();
    skyInst2.setMatrixAt(si2,dummy.matrix);
  }
  skyInst2.instanceMatrix.needsUpdate=true;
  scene.add(skyInst2);
}


// ---- GROUND FLOOR STOREFRONTS ----
{
  var sfGeo=new THREE.BoxGeometry(1,0.4,0.05);
  var sfMat=new THREE.MeshStandardMaterial({roughness:0.3,metalness:0.1,emissive:0x553318,emissiveIntensity:1.2});
  var SF_N=Math.min(200,bdata.length);
  var sfInst=new THREE.InstancedMesh(sfGeo,sfMat,SF_N);
  sfInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(SF_N*3),3);
  var sfColors=[0xdd8844,0x44aa88,0x8866cc,0xcc5555,0x55aadd,0xaaaa44];
  var si3=0;
  for(var bi3=0;bi3<bdata.length&&si3<SF_N;bi3++){
    var bd3=bdata[bi3];
    if(bd3[3]<4||Math.random()>0.5)continue;
    var sy3=roadY(bd3[1])+1.5;
    // Face toward road
    var rx3=roadX(bd3[1]);
    var facing=bd3[0]<rx3?1:-1;
    dummy.position.set(bd3[0]+facing*bd3[2]*0.5,sy3,bd3[1]);
    dummy.scale.set(bd3[2]*0.8,1,1);
    dummy.rotation.set(0,facing>0?0:Math.PI,0);
    dummy.updateMatrix();
    sfInst.setMatrixAt(si3,dummy.matrix);
    var sc3=new THREE.Color(sfColors[si3%sfColors.length]);
    sfInst.instanceColor.setXYZ(si3,sc3.r,sc3.g,sc3.b);
    si3++;
  }
  sfInst.count=si3;
  sfInst.instanceMatrix.needsUpdate=true;
  sfInst.instanceColor.needsUpdate=true;
  scene.add(sfInst);
}

// ---- TREES removed ----// ---- STREET LAMPS ----{  const lampPositions=[];  for(let z=-60;z<=7000;z+=18){const _lrx=roadX(z);lampPositions.push([_lrx-6,z],[_lrx+6,z])}  const poleGeo=new THREE.CylinderGeometry(.06,.06,4,4);  const poleMat=new THREE.MeshPhongMaterial({color:0x888888,shininess:20});  const poleInst=new THREE.InstancedMesh(poleGeo,poleMat,lampPositions.length);  const glowGeo=new THREE.SphereGeometry(.4,6,6);  const glowMat2=new THREE.MeshStandardMaterial({color:0xffffcc,emissive:0xffdd66,emissiveIntensity:2.5,roughness:0.1,metalness:0.3});  const glowInst=new THREE.InstancedMesh(glowGeo,glowMat2,lampPositions.length);  lampPositions.forEach(([x,z],i)=>{    dummy.position.set(x,roadY(z)+2,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();    poleInst.setMatrixAt(i,dummy.matrix);    dummy.position.set(x,roadY(z)+4.2,z);dummy.updateMatrix();    glowInst.setMatrixAt(i,dummy.matrix);  });  poleInst.instanceMatrix.needsUpdate=true;glowInst.instanceMatrix.needsUpdate=true;  scene.add(poleInst);scene.add(glowInst);}

// ---- ELECTRIC POLES WITH WIRES ----

{

  const EP_N=40;

  const epPoleGeo=new THREE.CylinderGeometry(0.05,0.08,6,4);

  const epPoleMat=new THREE.MeshStandardMaterial({color:0x555555,roughness:0.5,metalness:0.6});

  const epPoleInst=new THREE.InstancedMesh(epPoleGeo,epPoleMat,EP_N);

  const epArmGeo=new THREE.BoxGeometry(2,0.06,0.06);

  const epArmMat=new THREE.MeshStandardMaterial({color:0x444444,roughness:0.5,metalness:0.6});

  const epArmInst=new THREE.InstancedMesh(epArmGeo,epArmMat,EP_N);

  for(let i=0;i<EP_N;i++){

    const z=i*75+20;

    const side=roadX(z)+(i%2===0?-12:12);

    const hy=roadY(z);

    dummy.position.set(side,hy+3,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    epPoleInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,hy+6.2,z);dummy.updateMatrix();

    epArmInst.setMatrixAt(i,dummy.matrix);

  }

  epPoleInst.instanceMatrix.needsUpdate=true;epArmInst.instanceMatrix.needsUpdate=true;

  scene.add(epPoleInst);scene.add(epArmInst);

}

// ---- ROAD FENCES/GUARDRAILS ----

{

  const FENCE_N=80;

  const fencePostGeo=new THREE.BoxGeometry(0.08,0.8,0.08);

  const fenceRailGeo=new THREE.BoxGeometry(0.04,0.04,4);

  const fenceMat=new THREE.MeshStandardMaterial({color:0x888899,roughness:0.5,metalness:0.5});

  const fencePostInst=new THREE.InstancedMesh(fencePostGeo,fenceMat,FENCE_N);

  const fenceRailInst=new THREE.InstancedMesh(fenceRailGeo,fenceMat,FENCE_N);

  for(let i=0;i<FENCE_N;i++){

    const z=i*40+10;

    const rx=roadX(z);

    const side=i%2===0?rx-6.5:rx+6.5;

    const hy=roadY(z);

    dummy.position.set(side,hy+0.5,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    fencePostInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,hy+0.8,z);dummy.updateMatrix();

    fenceRailInst.setMatrixAt(i,dummy.matrix);

  }

  fencePostInst.instanceMatrix.needsUpdate=true;fenceRailInst.instanceMatrix.needsUpdate=true;

  scene.add(fencePostInst);scene.add(fenceRailInst);

}

// ---- BILLBOARDS (advertising signs) ----

{

  const BB_N=12;

  const bbPoleGeo=new THREE.CylinderGeometry(0.1,0.12,8,4);

  const bbPoleMat=new THREE.MeshStandardMaterial({color:0x666666,roughness:0.4,metalness:0.7});

  const bbPoleInst=new THREE.InstancedMesh(bbPoleGeo,bbPoleMat,BB_N);

  const bbBoardGeo=new THREE.BoxGeometry(4,2.5,0.15);

  const bbBoardMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.6,metalness:0.1});

  const bbBoardInst=new THREE.InstancedMesh(bbBoardGeo,bbBoardMat,BB_N);

  bbBoardInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(BB_N*3),3);

  const bbColors=[0x2563eb,0x059669,0xd97706,0x7c3aed,0xdc2626,0x0891b2];

  const _bbc=new THREE.Color();

  for(let i=0;i<BB_N;i++){

    const z=i*250+100;

    const side=roadX(z)+(i%2===0?-16:16);

    const hy=roadY(z);

    _bbc.setHex(bbColors[i%bbColors.length]);

    bbBoardInst.instanceColor.setXYZ(i,_bbc.r,_bbc.g,_bbc.b);

    dummy.position.set(side,hy+4,z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

    bbPoleInst.setMatrixAt(i,dummy.matrix);

    dummy.position.set(side,hy+9,z);dummy.rotation.set(0,i%2===0?0.3:-0.3,0);dummy.updateMatrix();

    bbBoardInst.setMatrixAt(i,dummy.matrix);

  }

  bbPoleInst.instanceMatrix.needsUpdate=true;bbBoardInst.instanceMatrix.needsUpdate=true;

  bbBoardInst.instanceColor.needsUpdate=true;

  scene.add(bbPoleInst);scene.add(bbBoardInst);

}

// Sky + Stars + Moon

// ---- CLOUDS ----

const cloudGeo=new THREE.SphereGeometry(1,6,4);const cloudMat=new THREE.MeshBasicMaterial({color:0x2a3a5a,transparent:true,opacity:.4});const CLOUD_N=15;const cloudInst=new THREE.InstancedMesh(cloudGeo,cloudMat,CLOUD_N);const cloudData=[];for(let i=0;i<CLOUD_N;i++){cloudData.push({x:(Math.random()-.5)*80,y:18+Math.random()*12,z:Math.random()*400-50,sx:4+Math.random()*6,sy:.8+Math.random()*.5,sz:2+Math.random()*3,spd:.002+Math.random()*.003})}function updateClouds(){cloudData.forEach((c,i)=>{c.x+=c.spd;if(c.x>50)c.x=-50;dummy.position.set(c.x,c.y,c.z);dummy.scale.set(c.sx,c.sy,c.sz);dummy.rotation.set(0,0,0);dummy.updateMatrix();cloudInst.setMatrixAt(i,dummy.matrix)});cloudInst.instanceMatrix.needsUpdate=true}updateClouds();scene.add(cloudInst);

scene.add(new THREE.Mesh(new THREE.SphereGeometry(200,8,4),new THREE.MeshBasicMaterial({color:0x0c1828,side:THREE.BackSide})));

{const p=new Float32Array(200*3);for(let i=0;i<600;i++){p[i*3]=(Math.random()-.5)*240;p[i*3+1]=Math.random()*60+10;p[i*3+2]=(Math.random()-.5)*240}

const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:.15})))}

{const m=new THREE.Mesh(new THREE.SphereGeometry(4,8,8),new THREE.MeshStandardMaterial({color:0xeef4ff,emissive:0xccddff,emissiveIntensity:0.5,roughness:0.1,metalness:0.0}));m.position.set(-40,50,-80);scene.add(m)}



// ---- CAR (player) ----
const car=new THREE.Group();
window._wheels=[];
window._glbLoaded=false;

// === Enhanced Primitive Car ===
function buildPrimitiveCar(){
  while(car.children.length)car.remove(car.children[0]);
  const _p=new THREE.MeshStandardMaterial({color:0x22c55e,roughness:0.06,metalness:0.9,envMapIntensity:3.5});
  const _d=new THREE.MeshStandardMaterial({color:0x111111,roughness:0.4,metalness:0.3});
  const _g=new THREE.MeshStandardMaterial({color:0xccddff,roughness:0.02,metalness:0,transparent:true,opacity:0.65,side:THREE.DoubleSide,envMapIntensity:1.5});
  const _ch=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.01,metalness:1.0,envMapIntensity:4});
  // Sporty body - lower, wider
  const _bs=new THREE.Shape();
  _bs.moveTo(-1.15,0.08);_bs.lineTo(-1.2,0.35);_bs.quadraticCurveTo(-1.2,0.72,-0.9,0.76);
  _bs.lineTo(0.9,0.76);_bs.quadraticCurveTo(1.2,0.72,1.2,0.35);_bs.lineTo(1.15,0.08);_bs.lineTo(-1.15,0.08);
  var body=new THREE.Mesh(new THREE.ExtrudeGeometry(_bs,{depth:4.8,bevelEnabled:true,bevelThickness:0.14,bevelSize:0.12,bevelSegments:6}),_p);
  body.position.set(0,0,-2.4);body.castShadow=true;car.add(body);window._carBodyMat=_p;
  // Cabin
  const _cs=new THREE.Shape();
  _cs.moveTo(-0.68,0);_cs.quadraticCurveTo(-0.72,0.36,-0.25,0.4);
  _cs.lineTo(0.25,0.4);_cs.quadraticCurveTo(0.72,0.36,0.68,0);_cs.lineTo(-0.68,0);
  var cab=new THREE.Mesh(new THREE.ExtrudeGeometry(_cs,{depth:1.7,bevelEnabled:true,bevelThickness:0.07,bevelSize:0.05,bevelSegments:5}),
    new THREE.MeshStandardMaterial({color:0x0d4020,roughness:0.04,metalness:0.9}));
  cab.position.set(0,0.76,-0.85);cab.castShadow=true;car.add(cab);
  // Glass
  var ws=new THREE.Mesh(new THREE.PlaneGeometry(1.3,.4),_g);ws.position.set(0,1.0,.78);ws.rotation.x=-.38;car.add(ws);
  var rw=new THREE.Mesh(new THREE.PlaneGeometry(1.15,.3),_g);rw.position.set(0,1.0,-.98);rw.rotation.x=.33;car.add(rw);
  [-0.74,0.74].forEach(function(x){var sw=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.26),_g);sw.position.set(x,0.96,-.12);sw.rotation.set(0,x<0?-Math.PI/2:Math.PI/2,0);car.add(sw)});
  // Front splitter + rear diffuser
  car.add(new THREE.Mesh(new THREE.BoxGeometry(2.4,.06,.15),_d)).position.set(0,.1,2.35);
  car.add(new THREE.Mesh(new THREE.BoxGeometry(2.0,.08,.2),_d)).position.set(0,.1,-2.35);
  // Chrome trim
  car.add(new THREE.Mesh(new THREE.BoxGeometry(2.35,.06,.08),_ch)).position.set(0,.22,2.35);
  car.add(new THREE.Mesh(new THREE.BoxGeometry(2.35,.06,.08),_ch)).position.set(0,.22,-2.35);
  // Side skirts
  [-1.22,1.22].forEach(function(x){var sk=new THREE.Mesh(new THREE.BoxGeometry(.06,.12,3.8),_d);sk.position.set(x,.15,0);car.add(sk)});
  // Spoiler
  var spBase=new THREE.Mesh(new THREE.BoxGeometry(1.6,.04,.25),_ch);spBase.position.set(0,1.02,-2.15);car.add(spBase);
  [-0.55,0.55].forEach(function(x){var sp=new THREE.Mesh(new THREE.BoxGeometry(.06,.2,.06),_ch);sp.position.set(x,.92,-2.15);car.add(sp)});
  // Side mirrors
  [-1.22,1.22].forEach(function(x){var mir=new THREE.Mesh(new THREE.BoxGeometry(.14,.08,.12),_p);mir.position.set(x,.88,.3);car.add(mir)});
  // Racing stripe
  car.add(new THREE.Mesh(new THREE.BoxGeometry(.18,.01,4.8),new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.15,metalness:0.6}))).position.set(0,.78,0);
  // LED Headlights
  var hlG=new THREE.BoxGeometry(.4,.08,.04);var hlM=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffee,emissiveIntensity:2.5,roughness:0.05,metalness:0.5});
  [-.6,.6].forEach(function(x){var hl=new THREE.Mesh(hlG,hlM);hl.position.set(x,.42,2.38);car.add(hl)});
  // DRL strip
  var drlG=new THREE.BoxGeometry(.55,.03,.03);var drlM=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:2.0});
  [-.55,.55].forEach(function(x){var d=new THREE.Mesh(drlG,drlM);d.position.set(x,.35,2.38);car.add(d)});
  // Taillights LED strip
  var tlG=new THREE.BoxGeometry(.4,.06,.04);var tlM=new THREE.MeshStandardMaterial({color:0xff3333,emissive:0xff1100,emissiveIntensity:2.0,roughness:0.15,metalness:0.2});window._brakeMat=tlM;
  [-.65,.65].forEach(function(x){var tl=new THREE.Mesh(tlG,tlM);tl.position.set(x,.42,-2.38);car.add(tl)});
  var tlStrip=new THREE.Mesh(new THREE.BoxGeometry(1.1,.03,.03),new THREE.MeshStandardMaterial({color:0xff2222,emissive:0xff0000,emissiveIntensity:1.5}));
  tlStrip.position.set(0,.42,-2.38);car.add(tlStrip);
  // Wheels with rims + spokes
  window._wheels=[];
  var wG=new THREE.CylinderGeometry(.4,.4,.28,24);var wM=new THREE.MeshStandardMaterial({color:0x0a0a0a,roughness:0.85,metalness:0.15});
  var rM=new THREE.MeshStandardMaterial({color:0xdddddd,roughness:0.06,metalness:0.97});
  [[-1.22,.36,1.55],[1.22,.36,1.55],[-1.22,.36,-1.55],[1.22,.36,-1.55]].forEach(function(p){
    var wGr=new THREE.Group();wGr.position.set(p[0],p[1],p[2]);
    var t=new THREE.Mesh(wG,wM);t.rotation.set(0,0,Math.PI/2);t.castShadow=true;wGr.add(t);
    var rim=new THREE.Mesh(new THREE.TorusGeometry(.28,.04,6,16),rM);rim.rotation.set(0,0,Math.PI/2);wGr.add(rim);
    var hub=new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.3,8),rM);hub.rotation.set(0,0,Math.PI/2);wGr.add(hub);
    for(var s=0;s<8;s++){var spoke=new THREE.Mesh(new THREE.BoxGeometry(.28,.015,.025),rM);spoke.rotation.set(0,0,Math.PI/2+s*Math.PI/4);wGr.add(spoke)}
    car.add(wGr);window._wheels.push(wGr);
  });
  // Headlight beam cone
  var _cbG=new THREE.ConeGeometry(3.5,14,8,1,true);
  var _cbM=new THREE.MeshBasicMaterial({color:0xfffff0,transparent:true,opacity:0.04,side:THREE.DoubleSide,depthWrite:false});
  var beam=new THREE.Mesh(_cbG,_cbM);beam.position.set(0,0.3,9);beam.rotation.x=Math.PI/2;
  car.add(beam);window._carBeam=beam;
// Underglow  var ugMat=new THREE.MeshBasicMaterial({color:0x22c55e,transparent:true,opacity:0.15,side:THREE.DoubleSide,depthWrite:false});  var ugMesh=new THREE.Mesh(new THREE.PlaneGeometry(3,5.5),ugMat);  ugMesh.rotation.x=-Math.PI/2;ugMesh.position.set(0,-0.05,0);  car.add(ugMesh);window._underGlow=ugMat;
  // Real shadows via DirectionalLight (fake circle shadow removed)
}
buildPrimitiveCar();

// Real SpotLight headlights
var headlightL=new THREE.SpotLight(0xffffee,4,60,Math.PI/4.5,0.5,1.0);
headlightL.position.set(-0.6,0.42,2.4);headlightL.target.position.set(-0.6,0,20);
car.add(headlightL);car.add(headlightL.target);
var headlightR=new THREE.SpotLight(0xffffee,4,60,Math.PI/4.5,0.5,1.0);
headlightR.position.set(0.6,0.42,2.4);headlightR.target.position.set(0.6,0,20);
car.add(headlightR);car.add(headlightR.target);

// === Setup DRACOLoader for compressed GLB ===
var _dracoLoader=null;
if(typeof THREE.DRACOLoader!=='undefined'){
  _dracoLoader=new THREE.DRACOLoader();
  _dracoLoader.setDecoderPath('./draco/');
  _dracoLoader.preload();
}

// === Load Ferrari 458 GLB model ===
if(typeof THREE.GLTFLoader!=='undefined'){
  try{
    var _glbLoader=new THREE.GLTFLoader();
    if(_dracoLoader)_glbLoader.setDRACOLoader(_dracoLoader);
    _glbLoader.load('./ferrari.glb',function(gltf){
      var model=gltf.scene;
      // Scale to fit our car dimensions
      var box=new THREE.Box3().setFromObject(model);
      var size=new THREE.Vector3();box.getSize(size);
      var targetLength=4.8;// match our primitive car length
      var sc=targetLength/size.z;
      model.scale.setScalar(sc);
      // Re-center
      box.setFromObject(model);
      var center=new THREE.Vector3();box.getCenter(center);
      model.position.x=-center.x;
      model.position.z=-center.z;
      model.position.y=-box.min.y+0.02;model.rotation.y=Math.PI;// face forward
      // Upgrade materials
      model.traverse(function(child){
        if(child.isMesh){
          child.castShadow=true;child.receiveShadow=true;
          var mats=Array.isArray(child.material)?child.material:[child.material];
          mats.forEach(function(mat){
            if(!mat)return;
            if(mat.envMapIntensity!==undefined)mat.envMapIntensity=2.5;
            // Color body parts green
            if(mat.color&&child.name){
              var n=child.name.toLowerCase();
              if(n.indexOf('body')>=0||n.indexOf('paint')>=0||n.indexOf('car')>=0||n.indexOf('hood')>=0||n.indexOf('door')>=0||n.indexOf('fender')>=0){
                mat.color.setHex(0x22c55e);
                mat.roughness=0.08;
                mat.metalness=0.85;
                if(!window._carBodyMat)window._carBodyMat=mat;
              }
            }
          });
        }
      });
      // Find wheels for rotation
      window._glbWheels=[];
      model.traverse(function(child){
        if(child.name&&child.name.toLowerCase().indexOf('wheel')>=0){
          window._glbWheels.push(child);
        }
      });
      // Remove primitive car children but keep lights
      var keep=[headlightL,headlightR,headlightL.target,headlightR.target];
      var toRemove=[];
      car.children.forEach(function(c){if(keep.indexOf(c)===-1)toRemove.push(c)});
      toRemove.forEach(function(c){car.remove(c)});
      car.add(model);
      // Re-add shadow
      var sg=new THREE.CircleGeometry(3,16);
      var sm=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0.4,side:THREE.DoubleSide});
      var cs2=new THREE.Mesh(sg,sm);cs2.rotation.x=-Math.PI/2;cs2.position.y=0.01;car.add(cs2);
      // Re-add beam
      var bg=new THREE.ConeGeometry(3.5,14,8,1,true);
      var bm=new THREE.MeshBasicMaterial({color:0xffffee,transparent:true,opacity:0.06,side:THREE.DoubleSide});
      var bMesh=new THREE.Mesh(bg,bm);bMesh.position.set(0,0.3,9);bMesh.rotation.x=Math.PI/2;
      car.add(bMesh);window._carBeam=bMesh;
      window._glbLoaded=true;
      console.log('Ferrari GLB loaded, meshes:',model.children.length,'wheels:',window._glbWheels.length);
    },null,function(err){
      console.warn('Ferrari failed, trying Kenney:',err);
      // Fallback to Kenney race car
      _glbLoader.load('./kenney-racecar.gltf',function(gltf2){
        var m2=gltf2.scene;
        var b2=new THREE.Box3().setFromObject(m2);var s2=new THREE.Vector3();b2.getSize(s2);
        m2.scale.setScalar(4.5/Math.max(s2.x,s2.y,s2.z));
        b2.setFromObject(m2);var c2=new THREE.Vector3();b2.getCenter(c2);
        m2.position.sub(c2);m2.position.y=-b2.min.y+0.02;
        m2.traverse(function(ch){if(ch.isMesh){ch.castShadow=true;if(ch.material)ch.material.envMapIntensity=2}});
        car.add(m2);window._glbLoaded=true;
        console.log('Kenney car loaded as fallback');
      },null,function(){console.warn('All GLB models failed, keeping primitives')});
    });
  }catch(e){console.warn('GLTFLoader error:',e)}
}

scene.add(car);



// ---- OPPONENT CAR (multiplayer) ----

const opCar=new THREE.Group();

{

  const body=new THREE.Mesh(new THREE.BoxGeometry(2,.7,4),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xf59e0b}));body.position.y=.5;opCar.add(body);

  const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.6,.5,2.2),new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x92400e}));cabin.position.set(0,1.1,-.1);opCar.add(cabin);

  const hlGeo2=new THREE.BoxGeometry(.3,.14,.04);const hlMat2=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0xffffcc});

  const hlInst2=new THREE.InstancedMesh(hlGeo2,hlMat2,2);

  [-.6,.6].forEach((x,i)=>{dummy.position.set(x,.5,2.01);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();hlInst2.setMatrixAt(i,dummy.matrix)});

  hlInst2.instanceMatrix.needsUpdate=true;opCar.add(hlInst2);

  const wGeo2=new THREE.CylinderGeometry(.35,.35,.28,6);const wMat2=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x222222});

  const wInst2=new THREE.InstancedMesh(wGeo2,wMat2,4);

  [[-1.1,.35,1.3],[1.1,.35,1.3],[-1.1,.35,-1.3],[1.1,.35,-1.3]].forEach((p,i)=>{

    dummy.position.set(p[0],p[1],p[2]);dummy.rotation.set(0,0,Math.PI/2);dummy.scale.setScalar(1);dummy.updateMatrix();wInst2.setMatrixAt(i,dummy.matrix)});

  wInst2.instanceMatrix.needsUpdate=true;opCar.add(wInst2);

}

opCar.visible=false;

scene.add(opCar);



// ---- FOLLOWER CARS ----

const FOLLOWER_N=5;

const followerColors=[0x60a5fa,0xfbbf24,0xf472b6,0xa78bfa,0x34d399];

const followerInst=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.5,3),new THREE.MeshStandardMaterial({roughness:0.35,metalness:0.4}),FOLLOWER_N);

for(let i=0;i<FOLLOWER_N;i++){

  dummy.position.set(0,-100,0);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();

  followerInst.setMatrixAt(i,dummy.matrix);followerInst.setColorAt(i,_col.setHex(followerColors[i]));

}

followerInst.instanceMatrix.needsUpdate=true;

    const fEl=document.getElementById('followers');

    fEl.textContent='🚗🚗🚗🚗🚗 חברים נוסעים אחריך!';followerInst.instanceColor.needsUpdate=true;

followerInst.frustumCulled=false;scene.add(followerInst);

const followerPos=[];

for(let i=0;i<FOLLOWER_N;i++)followerPos.push({x:0,z:-(i+1)*6,y:.4});



// ---- GREEN COLLECTIBLES ----

const MAX_GREENS=3;

const greens=[];

const greenInst=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.9,1),new THREE.MeshStandardMaterial({color:0x22ff66,emissive:0x11ff44,emissiveIntensity:1.5,roughness:0.05,metalness:0.7,transparent:true,opacity:0.95}),MAX_GREENS);

greenInst.frustumCulled=false;scene.add(greenInst);



// ---- COLLECTIBLE BEAMS ----

const beamGeo=new THREE.CylinderGeometry(.08,.08,6,4);

const beamMat=new THREE.MeshStandardMaterial({color:0x44ff66,emissive:0x22ff44,emissiveIntensity:0.5,roughness:0.1,metalness:0.05,transparent:true,opacity:0.7});

const beamInst=new THREE.InstancedMesh(beamGeo,beamMat,MAX_GREENS);

beamInst.frustumCulled=false;scene.add(beamInst);

window._beamInst=beamInst;



// ---- COLLECTIBLE RINGS ----

const ringGeo=new THREE.RingGeometry(1.5,2,16);

const ringMat=new THREE.MeshStandardMaterial({roughness:0.75,metalness:0.05,color:0x55ff77,transparent:true,opacity:0.5,side:THREE.DoubleSide});

const ringInst=new THREE.InstancedMesh(ringGeo,ringMat,MAX_GREENS);

ringInst.frustumCulled=false;scene.add(ringInst);

window._ringInst=ringInst;







function spawnGreen(){

  if(greens.length>=MAX_GREENS)return;

  const z=car.position.z+(25+Math.random()*35);const rx=roadX(z);

  const x=rx+(Math.random()-.5)*8;

  greens.push({x,z,y:3,active:true});

}



// ---- POWER-UPS (golden diamonds) ----

const MAX_POWERUPS=3;const powerups=[];const powerupInst=new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.6,0),new THREE.MeshStandardMaterial({color:0x66bbff,emissive:0x3399ff,emissiveIntensity:1.0,roughness:0.05,metalness:0.7,transparent:true,opacity:0.85}),MAX_POWERUPS);powerupInst.frustumCulled=false;scene.add(powerupInst);function spawnPowerup(){  if(powerups.length>=MAX_POWERUPS)return;  const z=car.position.z+(60+Math.random()*40);const rx=roadX(z);const x=rx+(Math.random()-.5)*7;  powerups.push({x,z,y:2.5,active:true,type:Math.random()>.5?"shield":"turbo"});}

// ---- OBSTACLES (red) ----

const MAX_OBS=2;

const obstacles=[];

const obsInst=new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.9,0),new THREE.MeshStandardMaterial({color:0xff1111,emissive:0xff0000,emissiveIntensity:2.0,roughness:0.02,metalness:0.8,transparent:true,opacity:0.9}),MAX_OBS);

obsInst.frustumCulled=false;scene.add(obsInst);



const obsRingGeo=new THREE.RingGeometry(1.2,1.8,16);

const obsRingMat=new THREE.MeshBasicMaterial({color:0xff2222,transparent:true,opacity:0.4,side:THREE.DoubleSide});

const obsRingInst=new THREE.InstancedMesh(obsRingGeo,obsRingMat,MAX_OBS);

obsRingInst.frustumCulled=false;scene.add(obsRingInst);

window._obsRingInst=obsRingInst;





function spawnObstacle(){

  if(obstacles.length>=MAX_OBS)return;

  const z=car.position.z+(25+Math.random()*40);const rx=roadX(z);

  const x=rx+(Math.random()-.5)*8;

  obstacles.push({x,z,y:2,active:true});

}



function updateInstances(arr,inst,max,rotSpeed){

  for(let i=0;i<max;i++){

    if(i<arr.length&&arr[i].active){

      const o=arr[i];dummy.position.set(o.x,o.y,o.z);dummy.scale.setScalar(1);

      dummy.rotation.set(rotSpeed?fc*.002:0,fc*.003,0);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);

    }else{dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix)}

  }

  inst.instanceMatrix.needsUpdate=true;

}



// ---- PARTICLES ----

const PART_MAX=200;const particles=[];

const partInst=new THREE.InstancedMesh(new THREE.SphereGeometry(.3,5,5),new THREE.MeshStandardMaterial({roughness:0.9,metalness:0.0,transparent:true,opacity:0.7}),PART_MAX);

partInst.frustumCulled=false;scene.add(partInst);

function emitParticles(x,y,z,color,n){for(let i=0;i<n&&particles.length<PART_MAX;i++){particles.push({x,y,z,vx:(Math.random()-.5)*.3,vy:Math.random()*.3+.1,vz:(Math.random()-.5)*.3,life:1,color})}}

function updateParticles(){

  for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.vx*=0.96;p.vz*=0.96;p.vy=p.isSmoke?(p.vy*0.98+0.005):(p.vy-0.01);p.life-=p.isSmoke?0.008:0.03;if(p.life<=0)particles.splice(i,1)}

  for(let i=0;i<PART_MAX;i++){

    if(i<particles.length){const p=particles[i];dummy.position.set(p.x,p.y,p.z);dummy.scale.setScalar(p.life*.8);dummy.updateMatrix();partInst.setMatrixAt(i,dummy.matrix);partInst.setColorAt(i,_col.setHex(p.color))}

    else{dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();partInst.setMatrixAt(i,dummy.matrix)}

  }

  partInst.instanceMatrix.needsUpdate=true;if(partInst.instanceColor)partInst.instanceColor.needsUpdate=true;

}




// ---- TREES (instanced) ----
{
  var TREE_N=400;
  var trunkGeo=new THREE.CylinderGeometry(0.15,0.2,1.5,5);
  var trunkMat=new THREE.MeshStandardMaterial({color:0x4a2a15,roughness:0.9,metalness:0.05});
  var trunkInst=new THREE.InstancedMesh(trunkGeo,trunkMat,TREE_N);
  trunkInst.castShadow=true;
  var leafGeo=new THREE.IcosahedronGeometry(1.2,1);
  var leafMat=new THREE.MeshStandardMaterial({color:0x1a4a1a,roughness:0.85,metalness:0.08});
  var leafInst=new THREE.InstancedMesh(leafGeo,leafMat,TREE_N);
  leafInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(TREE_N*3),3);
  leafInst.castShadow=true;
  var _treeColors=[0x0f3f0f,0x153a28,0x003200,0x1a4a1a,0x1a4028,0x2a3a1a,0x354a1a,0x004000];
  var _ti2=0;
  for(var tz=-50;tz<=7000;tz+=5){
    if(_ti2>=TREE_N)break;
    var _trx=roadX(tz);
    var zone2=Math.floor(tz/300)%7;
    // More trees in parks(3) and residential(5), fewer in downtown(0) and industrial(4)
    var treeChance=[0.08,0.2,0.15,0.5,0.05,0.3,0.12][zone2];
    if(Math.random()>treeChance)continue;
    // Place on both sides of road
    var sides=[-1,1];
    for(var si=0;si<sides.length&&_ti2<TREE_N;si++){
      var tx=_trx+sides[si]*(8+Math.random()*18);
      var ty=roadY(tz);
      var tScale=0.6+Math.random()*0.8;
      // Trunk
      dummy.position.set(tx,ty+tScale*0.75,tz);
      dummy.scale.set(tScale,tScale,tScale);
      dummy.rotation.set(0,Math.random()*Math.PI*2,0);
      dummy.updateMatrix();
      trunkInst.setMatrixAt(_ti2,dummy.matrix);
      // Leaves
      dummy.position.set(tx,ty+tScale*2.0,tz);
      dummy.scale.set(tScale*(0.8+Math.random()*0.4),tScale*(0.8+Math.random()*0.5),tScale*(0.8+Math.random()*0.4));
      dummy.updateMatrix();
      leafInst.setMatrixAt(_ti2,dummy.matrix);
      var _tc=new THREE.Color(_treeColors[Math.floor(Math.random()*_treeColors.length)]);
      leafInst.instanceColor.setXYZ(_ti2,_tc.r,_tc.g,_tc.b);
      _ti2++;
    }
  }
  trunkInst.count=_ti2;leafInst.count=_ti2;
  trunkInst.instanceMatrix.needsUpdate=true;
  leafInst.instanceMatrix.needsUpdate=true;
  leafInst.instanceColor.needsUpdate=true;
  // Mid leaf layer
  var leafGeo2=new THREE.IcosahedronGeometry(0.9,1);
  var leafInst2=new THREE.InstancedMesh(leafGeo2,leafMat,TREE_N);
  leafInst2.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(TREE_N*3),3);
  leafInst2.castShadow=true;
  // Top leaf layer
  var leafGeo3=new THREE.IcosahedronGeometry(0.6,0);
  var leafInst3=new THREE.InstancedMesh(leafGeo3,leafMat,TREE_N);
  leafInst3.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(TREE_N*3),3);
  leafInst3.castShadow=true;
  // Copy positions with vertical offset
  for(var tci=0;tci<_ti2;tci++){
    // Get position from first layer
    leafInst.getMatrixAt(tci,dummy.matrix);
    dummy.matrix.decompose(dummy.position,dummy.quaternion,dummy.scale);
    // Mid layer: higher and smaller
    dummy.position.y+=1.4*dummy.scale.y;
    dummy.scale.multiplyScalar(0.8);
    dummy.updateMatrix();
    leafInst2.setMatrixAt(tci,dummy.matrix);
    var mc2=new THREE.Color(_treeColors[Math.floor(Math.random()*_treeColors.length)]);
    mc2.multiplyScalar(0.9);// slightly darker
    leafInst2.instanceColor.setXYZ(tci,mc2.r,mc2.g,mc2.b);
    // Top layer: even higher and smaller
    dummy.position.y+=1.0*dummy.scale.y;
    dummy.scale.multiplyScalar(0.7);
    dummy.updateMatrix();
    leafInst3.setMatrixAt(tci,dummy.matrix);
    var mc3=new THREE.Color(_treeColors[Math.floor(Math.random()*_treeColors.length)]);
    mc3.multiplyScalar(0.85);
    leafInst3.instanceColor.setXYZ(tci,mc3.r,mc3.g,mc3.b);
  }
  leafInst2.count=_ti2;leafInst3.count=_ti2;
  leafInst2.instanceMatrix.needsUpdate=true;leafInst3.instanceMatrix.needsUpdate=true;
  leafInst2.instanceColor.needsUpdate=true;leafInst3.instanceColor.needsUpdate=true;
  scene.add(trunkInst);scene.add(leafInst);scene.add(leafInst2);scene.add(leafInst3);
  console.log('Trees planted:',_ti2);
}

// Tire mark fade function
function fadeTireMarks(){
  if(!window._tireMarks)return;
  var tm=window._tireMarks,changed=false;
  for(var i=0;i<tm.max;i++){
    if(tm.ages[i]>0){
      tm.ages[i]+=0.004;// age speed
      if(tm.ages[i]>1){
        // fully faded - hide
        tm.ages[i]=0;
        dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();
        tm.inst.setMatrixAt(i,dummy.matrix);
        changed=true;
      }else{
        // fade color from dark to transparent
        var fade=1-tm.ages[i];
        var c=0.07*fade;
        tm.inst.instanceColor.setXYZ(i,c,c,c);
        changed=true;
      }
    }
  }
  if(changed){tm.inst.instanceMatrix.needsUpdate=true;tm.inst.instanceColor.needsUpdate=true}
}

// ---- ROOFTOP DETAILS ----
{var _rtMax=80,_rtGeo=new THREE.CylinderGeometry(0.3,0.4,1.2,6),_rtMat=new THREE.MeshStandardMaterial({color:0x556677,roughness:0.6,metalness:0.4});
var _rtInst=new THREE.InstancedMesh(_rtGeo,_rtMat,_rtMax);
var _antGeo=new THREE.CylinderGeometry(0.03,0.03,2,4),_antMat=new THREE.MeshStandardMaterial({color:0x999999,roughness:0.3,metalness:0.9,emissive:0xff0000,emissiveIntensity:0.3});
var _antInst=new THREE.InstancedMesh(_antGeo,_antMat,_rtMax);var _rti=0;
if(typeof bdata!=="undefined"){for(var bi=0;bi<Math.min(bdata.length,_rtMax);bi++){var b=bdata[bi];if(!b||!b.x)continue;
if(b.h>8&&_rti<_rtMax){dummy.position.set(b.x+(Math.random()-0.5)*b.w*0.4,b.y+b.h+0.6,b.z+(Math.random()-0.5)*b.d*0.4);dummy.scale.set(1+Math.random(),1,1+Math.random());dummy.rotation.set(0,Math.random()*Math.PI,0);dummy.updateMatrix();_rtInst.setMatrixAt(_rti,dummy.matrix);dummy.position.y+=1.5;dummy.scale.set(1,1+Math.random()*2,1);dummy.updateMatrix();_antInst.setMatrixAt(_rti,dummy.matrix);_rti++}}}
_rtInst.count=_rti;_antInst.count=_rti;scene.add(_rtInst);scene.add(_antInst)}
// ---- TIRE MARKS ----
{var _tmGeo=new THREE.PlaneGeometry(0.3,0.8),_tmMat=new THREE.MeshBasicMaterial({color:0x111111,transparent:true,opacity:0.6,depthWrite:false});
var _tmInst=new THREE.InstancedMesh(_tmGeo,_tmMat,300);_tmInst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
_tmInst.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(300*3),3);
var _tmD=new THREE.Object3D();_tmD.position.set(0,-100,0);_tmD.updateMatrix();for(var i=0;i<300;i++){_tmInst.setMatrixAt(i,_tmD.matrix);_tmInst.instanceColor.setXYZ(i,0.07,0.07,0.07)}
_tmInst.instanceColor.needsUpdate=true;
scene.add(_tmInst);window._tireMarks={inst:_tmInst,idx:0,max:300,ages:new Float32Array(300)}}
// Drift tire screech
window._driftOsc=null;
window._startDriftSound=function(){if(!window._audioCtx||window._driftOsc)return;try{var ctx=window._audioCtx,osc=ctx.createOscillator(),osc2=ctx.createOscillator(),gain=ctx.createGain(),flt=ctx.createBiquadFilter();osc.type="sawtooth";osc.frequency.value=200+Math.random()*100;osc2.type="sine";osc2.frequency.value=2800+Math.random()*700;flt.type="bandpass";flt.frequency.value=2000;flt.Q.value=5;gain.gain.value=0;osc.connect(flt);osc2.connect(flt);flt.connect(gain);gain.connect(ctx.destination);osc.start();osc2.start();window._driftOsc=osc;window._driftOsc2=osc2;window._driftGain=gain}catch(e){}};
window._updateDriftSound=function(intensity){if(!window._driftGain)return;try{window._driftGain.gain.linearRampToValueAtTime(intensity*0.08,window._audioCtx.currentTime+0.05)}catch(e){}};
window._stopDriftSound=function(){if(!window._driftOsc)return;try{window._driftGain.gain.linearRampToValueAtTime(0,window._audioCtx.currentTime+0.1);var o=window._driftOsc,g=window._driftGain;window._driftOsc=null;window._driftGain=null;setTimeout(function(){try{o.stop();o.disconnect()}catch(e){}},150)}catch(e){window._driftOsc=null}};

// ---- GAME STATE ----

let score=0,lives=5,level=1,flow=85,greenCount=0,redCount=0,streak=0,bestStreak=0,shieldTimer=0,turboTimer=0,topSpeed=0;

let gameActive=false,spd=0,dir=0,fc=0,boostTimer=0,lastMilestone=0;

let scenarioActive=false,scenarioTimer=0,scenarioTimeout=null,usedScenarios=[];

let nextScenarioAt=0,scenariosAnswered=0;
let lateralVel=0,driftAngle=0,isDrifting=false,driftIntensity=0,handbrake=false,driftChain=0,driftChainTimer=0;



// ---- INPUT ----

const keys={};

let _paused=false;

addEventListener('keydown',e=>{if(document.activeElement&&document.activeElement.tagName==='INPUT')return;keys[e.code]=true;

  if(e.code==='KeyH'&&gameActive)sfxHonk();

  if(e.code==='KeyM')_toggleMute();

  if(e.code==='KeyP'&&gameActive){_paused=!_paused;const pe=document.getElementById('pauseOverlay');if(pe)pe.style.display=_paused?'flex':'none'}

  e.preventDefault()});

addEventListener('keyup',e=>{keys[e.code]=false});

window._gkeys=keys;window._gcar=()=>typeof car!=='undefined'?car:null;



// Screenshot mode: expose globals when ?auto=1 (no auto-drive)

if(location.search.includes('auto=1')){

  window._autoMode=true;

  setTimeout(()=>{

    // Click start button

    document.querySelectorAll('button').forEach(b=>{if(b.textContent.includes('בואו'))b.click()});

    // Auto-drive disabled

    // Capture at various distances

    let captured=0;

    setInterval(()=>{

      if(car&&car.position.z>100&&captured<5){

        captured++;

        const c=document.querySelector('canvas');

        if(c){

          const link=document.createElement('a');

          link.download='curve_'+Math.floor(car.position.z)+'m.png';

          // Store dataURL for Puppeteer

          window._lastCapture=c.toDataURL('image/png');

          window._captureReady=true;

          window._captureDist=Math.floor(car.position.z);

        }

      }

    },3000);

  },2000);

}





const isMobile='ontouchstart'in window||navigator.maxTouchPoints>0;

if(isMobile){

  document.getElementById('mobileControls').style.display='none';window._mobileSteer=0;window._isMobileDevice=true; // mobile detected

  const bind=(id,code)=>{const el=document.getElementById(id);

    el.addEventListener('touchstart',e=>{e.preventDefault();keys[code]=true},{passive:false});

    el.addEventListener('touchend',e=>{e.preventDefault();keys[code]=false},{passive:false});

    el.addEventListener('touchcancel',()=>{keys[code]=false})};

  bind('btnUp','KeyW');bind('btnDown','KeyS');bind('btnLeft','KeyA');bind('btnRight','KeyD');

  // Touch-to-steer: auto-drive, touch left/right half to steer

  let _touchActive=false,_touchX=0;

  document.addEventListener('touchstart',function(e){

    if(!gameActive)return;

    _touchActive=true;

    _touchX=e.touches[0].clientX;

    keys.KeyW=true; // auto-drive on touch

    const w3=innerWidth/3;

    if(_touchX<w3){keys.KeyA=true;keys.KeyD=false}

    else if(_touchX>w3*2){keys.KeyD=true;keys.KeyA=false}

    else{keys.KeyA=false;keys.KeyD=false}

  },{passive:true});

  document.addEventListener('touchmove',function(e){

    if(!_touchActive||!gameActive)return;

    _touchX=e.touches[0].clientX;

    const w3=innerWidth/3;

    if(_touchX<w3){keys.KeyA=true;keys.KeyD=false}

    else if(_touchX>w3*2){keys.KeyD=true;keys.KeyA=false}

    else{keys.KeyA=false;keys.KeyD=false}

  },{passive:true});

  document.addEventListener('touchend',function(){

    _touchActive=false;keys.KeyA=false;keys.KeyD=false;

    // Keep driving forward

  },{passive:true});

  // Show touch hint

  const _tHint=document.createElement('div');

  _tHint.innerHTML='👆 גע במסך כדי לנהוג | שמאל/ימין לכיוון';

  _tHint.style.cssText='position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:30;color:#a7f3d0;font-size:14px;font-weight:600;text-align:center;direction:rtl;background:rgba(0,0,0,.6);padding:8px 16px;border-radius:12px;pointer-events:none;opacity:1;transition:opacity 2s';

  document.body.appendChild(_tHint);

  setTimeout(()=>{_tHint.style.opacity='0';setTimeout(()=>_tHint.remove(),2000)},5000);

}



let cTh=0,cPh=.6,mx=0,my=0,drag=false;

renderer.domElement.addEventListener('mousedown',e=>{drag=true;mx=e.clientX;my=e.clientY});

addEventListener('mouseup',()=>drag=false);

addEventListener('mousemove',e=>{if(!drag)return;cTh+=(e.clientX-mx)*.005;cPh=Math.max(.15,Math.min(1.3,cPh-(e.clientY-my)*.005));mx=e.clientX;my=e.clientY});



// ---- GATE SYSTEM (replaces popup scenarios) ----

// 3D gates: two arches on the road, player drives through one

const _gateMat=new THREE.MeshPhongMaterial({color:0xccddee,shininess:60,emissive:0x88aacc,emissiveIntensity:0.6});

const _gateGreenMat=new THREE.MeshPhongMaterial({color:0x22c55e,shininess:20,emissive:0x115522,transparent:true,opacity:0.9});

const _gateRedMat=new THREE.MeshPhongMaterial({color:0xef4444,shininess:20,emissive:0x551111,transparent:true,opacity:0.9});

const _pillarGeo=new THREE.BoxGeometry(0.4,5.5,0.4);

const _topGeo=new THREE.BoxGeometry(4.2,0.5,0.4);

// Left gate

const _gateL=new THREE.Group();

const _pillarL1=new THREE.Mesh(_pillarGeo,_gateMat);_pillarL1.position.set(-1.8,2.75,0);_gateL.add(_pillarL1);

const _pillarL2=new THREE.Mesh(_pillarGeo,_gateMat);_pillarL2.position.set(1.8,2.75,0);_gateL.add(_pillarL2);

const _topL=new THREE.Mesh(_topGeo,_gateMat);_topL.position.set(0,5.6,0);_gateL.add(_topL);

_gateL.visible=false;scene.add(_gateL);

// Right gate

const _gateR=new THREE.Group();

const _pillarR1=new THREE.Mesh(new THREE.BoxGeometry(0.4,5.5,0.4),_gateMat);_pillarR1.position.set(-1.8,2.75,0);_gateR.add(_pillarR1);

const _pillarR2=new THREE.Mesh(new THREE.BoxGeometry(0.4,5.5,0.4),_gateMat);_pillarR2.position.set(1.8,2.75,0);_gateR.add(_pillarR2);

const _topR=new THREE.Mesh(new THREE.BoxGeometry(4.2,0.5,0.4),_gateMat);_topR.position.set(0,5.6,0);_gateR.add(_topR);

_gateR.visible=false;scene.add(_gateR);



let _gateActive=false,_gateZ=0,_gateIsGreenLeft=true,_gateScenarioIdx=0;



function triggerScenario(){

  if(scenarioActive||!gameActive||_gateActive)return;

  let available=SCENARIOS.filter((_,i)=>!usedScenarios.includes(i));

  if(available.length===0){usedScenarios=[];available=SCENARIOS}

  const idx=SCENARIOS.indexOf(available[Math.floor(Math.random()*available.length)]);

  usedScenarios.push(idx);

  const s=SCENARIOS[idx];

  _gateScenarioIdx=idx;



  // Place gates 60m ahead

  _gateZ=car.position.z+120;

  const rx=roadX(_gateZ);const ry=roadY(_gateZ);

  _gateL.position.set(rx-3,ry,_gateZ);_gateL.visible=true;

  _gateR.position.set(rx+3,ry,_gateZ);_gateR.visible=true;

  // Reset to neutral color

  _pillarL1.material=_gateMat;_pillarL2.material=_gateMat;_topL.material=_gateMat;

  _pillarR1.material=_gateMat;_pillarR2.material=_gateMat;_topR.material=_gateMat;



  // Randomize which side is green (but don't reveal colors!)

  _gateIsGreenLeft=Math.random()>0.5;

  const greenText=s.green.text.replace('🟢 ','');

  const redText=s.red.text.replace('🔴 ','');



  // Show situation text

  const gs=document.getElementById('gateSituation');

  gs.textContent=s.situation;gs.style.display='block';gs.style.fontSize='';gs.style.padding='';gs.style.maxWidth='';gs.style.animation='gateSitPulse 1.5s ease-in-out infinite';



  // Set label texts — neutral white, no color hints!

  const gl1=document.getElementById('gateLabel1');

  const gl2=document.getElementById('gateLabel2');

  if(_gateIsGreenLeft){

    gl1.textContent=greenText;

    gl2.textContent=redText;

  } else {

    gl1.textContent=redText;

    gl2.textContent=greenText;

  }

  gl1.style.borderColor='rgba(200,220,255,.35)';gl1.style.color='#e0eaff';

  gl2.style.borderColor='rgba(200,220,255,.35)';gl2.style.color='#e0eaff';

  gl1.style.display='block';gl2.style.display='block';



  _gateActive=true;

  scenarioActive=true;
  // Speed brake disabled

  // Don't stop car for gates - player drives through!

  sfxScenario();



  // Hide old popup scenario

  document.getElementById('scenario').style.display='none';

}



// Update gate label positions (called in animate)

function _updateGateLabels(){

  if(!_gateActive)return;

  // Suppress overlapping notifications during gate mode

  const _achEl=document.getElementById('achievement');if(_achEl&&_achEl.style.display==='block')_achEl.style.display='none';

  const _tipEl=document.getElementById('tip');if(_tipEl&&_tipEl.style.display==='block')_tipEl.style.display='none';

  const _multEl=document.getElementById('multiplier');if(_multEl&&_multEl.style.display==='block')_multEl.style.display='none';

  const _fnEl=document.getElementById('friendNotify');if(_fnEl)_fnEl.style.opacity='0';

  const distToGate=_gateZ-car.position.z;

  const gl1=document.getElementById('gateLabel1');

  const gl2=document.getElementById('gateLabel2');

  const gs=document.getElementById('gateSituation');

  if(distToGate>85||distToGate<-2){

    gl1.style.display='none';gl2.style.display='none';return;

  }

  // Question banner at top

  if(gs){

    gs.style.display='block';

    const pulse=Math.sin(performance.now()*.003)*.5+.5;

    gs.style.borderColor='rgba('+(Math.round(34+205*pulse))+','+(Math.round(197-130*pulse))+','+(Math.round(94-60*pulse))+',.5)';

  }

  // Project each gate to screen — labels follow their gate exactly

  const rx=roadX(_gateZ);const ry=roadY(_gateZ);

  const opacity=distToGate<3?Math.max(.3,distToGate/3):Math.min(1,(85-distToGate)/25);

  const vecL=new THREE.Vector3(rx-3,ry+6.5,_gateZ).project(cam);

  const pxL=(vecL.x*.5+.5)*innerWidth;const pyL=(-(vecL.y*.5)+.5)*innerHeight;

  const vecR=new THREE.Vector3(rx+3,ry+6.5,_gateZ).project(cam);

  const pxR=(vecR.x*.5+.5)*innerWidth;const pyR=(-(vecR.y*.5)+.5)*innerHeight;

  const sc=Math.max(0.7,Math.min(1.4,22/Math.max(5,distToGate)));

  const lw=Math.round(Math.max(200,Math.min(320,sc*260)));

  const fs=Math.round(Math.max(18,sc*24));

  // Each label is centered on its gate's screen X, clamped to bounds

  // gl1 = LEFT gate, gl2 = RIGHT gate (always — regardless of curve direction)

  let x1=Math.round(Math.max(5,Math.min(innerWidth-lw-5,pxL-lw/2)));

  let x2=Math.round(Math.max(5,Math.min(innerWidth-lw-5,pxR-lw/2)));

  // If labels overlap, push them apart from their midpoint

  if(Math.abs(x2-x1)<lw+15){

    const mid=(x1+x2)/2;

    if(x1<=x2){x1=Math.round(Math.max(5,mid-lw/2-10));x2=Math.round(Math.min(innerWidth-lw-5,mid+lw/2+10-lw))}

    else{x2=Math.round(Math.max(5,mid-lw/2-10));x1=Math.round(Math.min(innerWidth-lw-5,mid+lw/2+10-lw))}

    // Re-fix: ensure x2 gets proper offset

    if(Math.abs(x2-x1)<lw+10){if(x1<=x2)x2=x1+lw+10;else x1=x2+lw+10}

    x1=Math.max(5,Math.min(innerWidth-lw-5,x1));

    x2=Math.max(5,Math.min(innerWidth-lw-5,x2));

  }

  // Y: position between question banner and road (upper third area)

  const yL=Math.round(Math.max(115,Math.min(innerHeight*.42,pyL-60)));

  const yR=Math.round(Math.max(115,Math.min(innerHeight*.42,pyR-60)));

  if(vecL.z<1&&vecR.z<1){

    gl1.style.cssText='display:block;position:fixed;left:'+x1+'px;top:'+yL+'px;opacity:'+opacity+';font-size:'+Math.max(18,fs+4)+'px;max-width:'+Math.max(200,lw+40)+'px;width:'+Math.max(200,lw+40)+'px;z-index:52;animation:gatePulse 2s ease-in-out infinite;background:rgba(5,15,30,.95);border:2px solid '+gl1.style.borderColor+';border-radius:16px;padding:12px 16px;color:'+gl1.style.color+';font-weight:800;text-align:center;direction:rtl;line-height:1.4;text-shadow:0 2px 4px rgba(0,0,0,.7);box-shadow:0 4px 20px rgba(0,0,0,.5);backdrop-filter:blur(6px);pointer-events:none;white-space:normal';

    gl2.style.cssText='display:block;position:fixed;left:'+x2+'px;top:'+yR+'px;opacity:'+opacity+';font-size:'+Math.max(18,fs+4)+'px;max-width:'+Math.max(200,lw+40)+'px;width:'+Math.max(200,lw+40)+'px;z-index:52;animation:gatePulse 2s ease-in-out infinite;background:rgba(5,15,30,.95);border:2px solid '+gl2.style.borderColor+';border-radius:16px;padding:12px 16px;color:'+gl2.style.color+';font-weight:800;text-align:center;direction:rtl;line-height:1.4;text-shadow:0 2px 4px rgba(0,0,0,.7);box-shadow:0 4px 20px rgba(0,0,0,.5);backdrop-filter:blur(6px);pointer-events:none;white-space:normal';

  }else{gl1.style.display='none';gl2.style.display='none'}



  // Check if car passed through a gate

  const dz=car.position.z-_gateZ;

  if(dz>-1&&dz<3&&_gateActive){

    const rx=roadX(_gateZ);

    const dx=car.position.x-rx;

    const wentLeft=dx<0;

    const isGreen=(wentLeft&&_gateIsGreenLeft)||(!wentLeft&&!_gateIsGreenLeft);

    // Reveal colors on gates AND labels

    const greenMat=_gateGreenMat;const redMat=_gateRedMat;

    const gl1=document.getElementById('gateLabel1');

    const gl2=document.getElementById('gateLabel2');

    if(_gateIsGreenLeft){

      _pillarL1.material=greenMat;_pillarL2.material=greenMat;_topL.material=greenMat;

      _pillarR1.material=redMat;_pillarR2.material=redMat;_topR.material=redMat;

      gl1.style.borderColor='rgba(74,222,128,.7)';gl1.style.color='#4ade80';

      gl2.style.borderColor='rgba(239,68,68,.7)';gl2.style.color='#f87171';

    } else {

      _pillarL1.material=redMat;_pillarL2.material=redMat;_topL.material=redMat;

      _pillarR1.material=greenMat;_pillarR2.material=greenMat;_topR.material=greenMat;

      gl1.style.borderColor='rgba(239,68,68,.7)';gl1.style.color='#f87171';

      gl2.style.borderColor='rgba(74,222,128,.7)';gl2.style.color='#4ade80';

    }

    _gateActive=false;

    sfxWhoosh();

    // Process choice

    _processGateChoice(isGreen);

  }



  // Hide gates when far behind

  if(car.position.z-_gateZ>30){

    _gateL.visible=false;_gateR.visible=false;

    document.getElementById('gateLabel1').style.display='none';

    document.getElementById('gateLabel2').style.display='none';

    document.getElementById('gateSituation').style.display='none';

  }

}



function _processGateChoice(isGreen){

  scenariosAnswered++;

  const s=SCENARIOS[_gateScenarioIdx];

  const fb=document.getElementById('feedback');

  const fbIcon=document.getElementById('fbIcon');

  const fbText=document.getElementById('fbText');



  if(isGreen){

    greenCount++;streak++;if(streak>bestStreak)bestStreak=streak;

    const mult=Math.min(4,1+Math.floor(streak/2));

    score+=s.green.points*mult;flow=Math.min(100,flow+20);boostTimer=120;lives=Math.min(5,lives+0.5);

    sfxGreen();screenFlash("flash-green");confettiBurst();

    emitParticles(car.position.x,2,car.position.z,0x22c55e,12);

    fbIcon.textContent='🟢';fbText.textContent=s.greenFeedback+(mult>=2?' (x'+mult+')':'');fbText.style.color='#4ade80';

    if(mult>=2){const me=document.getElementById('multiplier');if(me){me.textContent='x'+mult;me.style.display='block';me.style.animation='none';me.offsetWidth;me.style.animation='multPop .6s ease forwards';clearTimeout(window._multTimer);window._multTimer=setTimeout(()=>me.style.display='none',1500)}}

  } else {

    redCount++;score+=s.red.points;streak=0;if(score<0)score=0;flow=Math.max(0,flow-8);spd*=.5;lives=Math.max(0,lives-0.7);

    sfxRed();screenFlash("flash-red");

    emitParticles(car.position.x,2,car.position.z,0xef4444,12);

    fbIcon.textContent='🔴';fbText.textContent=s.redFeedback;fbText.style.color='#f87171';

  }



  // Hide gate labels immediately when showing feedback

  document.getElementById('gateLabel1').style.display='none';

  document.getElementById('gateLabel2').style.display='none';

  document.getElementById('gateSituation').style.display='none';

  fb.style.display='block';fb.style.animation='none';

  requestAnimationFrame(()=>{fb.style.animation='feedSlide .5s cubic-bezier(.22,1,.36,1)'});

  setTimeout(()=>{fb.style.display='none'},4000);



  scenarioActive=false;document.getElementById('gateSituation').style.display='none';

  nextScenarioAt=car.position.z+220+Math.random()*130;



  // Level up check

  if(scenariosAnswered>0&&scenariosAnswered%4===0){

    const _lvlTitles=['','🌱 מתחילים!','🌿 זורם יפה!','🌳 גמיש!','💪 מאסטר זרימה!','🏆 אלוף הגמישות!','⭐ כוכב חברתי!','🌟 אגדה!','👑 מלך הזרימה!'];

    level++;sfxLevelUp();confettiBurst();

    document.getElementById('levelUpText').textContent='שלב '+level+'! 🎉';

    document.getElementById('levelUpSub').textContent=_lvlTitles[Math.min(level,_lvlTitles.length-1)]||'ממשיכים!';

    document.getElementById('levelUp').style.display='flex';

    setTimeout(()=>{document.getElementById('levelUp').style.display='none'},2500);

  }

}



function choose(type){

  if(!scenarioActive)return;

  scenarioActive=false;

  clearTimeout(scenarioTimeout);

  document.getElementById('scenario').style.display='none';



  const idx=usedScenarios[usedScenarios.length-1];

  const s=SCENARIOS[idx];

  const fb=document.getElementById('feedback');

  const fbIcon=document.getElementById('fbIcon');

  const fbText=document.getElementById('fbText');



  // Check if clicked button was green or red

  let isGreen=false;

  if(type==='green'){

    // check which button has the green class

    isGreen=document.getElementById('choiceGreen').classList.contains('choice-green')||type==='green';

    // Actually we need to check based on click

  }



  // Simplified: the onclick passes 'green' for left button, check its class

  if(type==='timeout'){

    isGreen=false; // timeout = red

  } else {

    const btnEl=document.getElementById(type==='green'?'choiceGreen':'choiceRed');

    isGreen=btnEl.classList.contains('choice-green');

  }



  scenariosAnswered++;



  if(isGreen){

    greenCount++;score+=s.green.points;flow=Math.min(100,flow+20);boostTimer=120;streak++;if(streak>bestStreak)bestStreak=streak;lives=Math.min(5,lives+0.5);

    sfxGreen();screenFlash("flash-green");confettiBurst();

    emitParticles(car.position.x,2,car.position.z,0x22c55e,12);

    fbIcon.textContent='🟢';

    fbText.textContent=s.greenFeedback;

    fbText.style.color='#4ade80';

  } else {

    redCount++;score+=s.red.points;streak=0;if(score<0)score=0;flow=Math.max(0,flow-8);spd*=.5;lives=Math.max(0,lives-0.7);

    sfxRed();screenFlash("flash-red");

    emitParticles(car.position.x,2,car.position.z,0xef4444,12);

    fbIcon.textContent='🔴';

    fbText.textContent=type==='timeout'?'⏰ לא הספקת לבחור — כולם מחכים...':s.redFeedback;

    fbText.style.color='#f87171';

  }



  fb.style.display='block';

  fb.style.animation='none';

  requestAnimationFrame(()=>{fb.style.animation='feedSlide .5s cubic-bezier(.22,1,.36,1)'});

  setTimeout(()=>{fb.style.display='none';spd=window._preScenarioSpd||0.15},4500);const tipEl=document.getElementById('tip');const tips=['💡 טיפ: דברים קטנים — לא שווה לריב עליהם!','💡 טיפ: כשמתגמשים — כולם נהנים יותר!','💡 טיפ: לפעמים ויתור = ניצחון!','💡 טיפ: חברים אוהבים מי שזורם!','💡 טיפ: מה שחשוב — עוצרים. מה שלא — ממשיכים!','💡 טיפ: בכביש ובחיים — זרימה זה הכוח!'];tipEl.textContent=tips[Math.floor(Math.random()*tips.length)];tipEl.style.display='block';setTimeout(()=>{tipEl.style.display='none'},5500);



  // Level up check

  if(scenariosAnswered>0&&scenariosAnswered%4===0){

    level++;sfxLevelUp();confettiBurst();

    const lu=document.getElementById('levelUp');

    const _lvlTitles=['','🌱 מתחילים!','🌿 זורם יפה!','🌳 גמיש!','💪 מאסטר זרימה!','🏆 אלוף הגמישות!','⭐ כוכב חברתי!','🌟 אגדה!','👑 מלך הזרימה!'];

    document.getElementById('levelUpText').textContent='שלב '+level+'! 🎉';

    document.getElementById('levelUpSub').textContent=_lvlTitles[Math.min(level,_lvlTitles.length-1)]||'ממשיכים!';

    lu.style.display='flex';setTimeout(()=>{lu.style.display='none'},1500);

  }



  // Game over if flow hits 0

  if(flow<=0){

    gameActive=false;stopBgMusic();

    document.getElementById('finalScore').textContent=score;

    document.getElementById('finalGreen').textContent=greenCount;

    document.getElementById('finalRed').textContent=redCount;

    document.getElementById('finalStreak').textContent=bestStreak;

    const ratio=greenCount/(greenCount+redCount+.001);

    const _msgs3=['🌟 זורם מדהים! כולם רוצים לנסוע איתך!','🏆 אלוף הגמישות! חברים מתמיד!','🚀 מלך הזרימה! אף אחד לא נתקע איתך!'];

    const _msgs2=['👍 לא רע! עוד קצת ותהיה מושלם!','🌊 זורם יפה! המשך ככה!','😎 כמעט מושלם! עוד סיבוב?'];

    const _msgs1=['💪 כל תרגול הופך אותך יותר גמיש!','🌱 ההתחלה טובה! תנסה שוב!','🎯 עוד קצת אימון וזורם כמו מים!'];

    const _r=Math.floor(Math.random()*3);

    document.getElementById('finalMsg').textContent=ratio>.7?_msgs3[_r]:ratio>.4?_msgs2[_r]:_msgs1[_r];

    document.getElementById('finalDist').textContent=Math.floor(car.position.z);document.getElementById('finalTopSpeed').textContent=topSpeed;document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';mpGameOver();_saveHighScore(score);document.getElementById('gameOver').style.display='flex';

    return;

  }



  nextScenarioAt=car.position.z+250+Math.random()*150;

}



// ---- POPUP TEXT ----

function showPopup(text,x,y,color){

  const el=document.createElement('div');el.textContent=text;

  el.style.cssText=`position:fixed;left:${x}px;top:${y}px;z-index:35;font-size:clamp(20px,4vw,28px);font-weight:900;color:${color};pointer-events:none;transition:all 1s cubic-bezier(.22,1,.36,1);text-shadow:0 0 15px ${color},0 0 30px ${color}44;transform:scale(0.5);opacity:1;white-space:nowrap`;

  document.body.appendChild(el);requestAnimationFrame(()=>{el.style.transform='translateY(-60px) scale(1.1)';el.style.opacity='0'});

  setTimeout(()=>el.remove(),1000);

}



// ---- MULTIPLAYER (up to 4 players) ----

let isMultiplayer=false,isHost=false,peer=null,conn=null,mpRoomCode='';

let opData={x:0,z:0,dir:0,score:0,flow:50,level:1,gameActive:false};

// Multi-player support

const mpConns=[];// host keeps array of connections

const mpPlayers={};// all players data by id

const MP_COLORS=[0xf59e0b,0x3b82f6,0xec4899];// orange, blue, pink for players 2-4

const mpCars=[];// extra car meshes



function createRoom(){

  mpRoomCode='';

  var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  for(var i=0;i<4;i++)mpRoomCode+=chars[Math.floor(Math.random()*chars.length)];

  document.getElementById('roomCode').textContent=mpRoomCode;

  document.getElementById('roomCodeDisplay').style.display='block';

  document.getElementById('mpStartBtn').style.display='block';

  document.getElementById('joinSection').style.display='none';

  isHost=true;

  peer=new Peer('tikia-'+mpRoomCode+'-host',{debug:2,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'},{urls:'stun:stun.relay.metered.ca:80'},{urls:'turn:global.relay.metered.ca:80',username:'e8dd65e92de6315a1e54fce9',credential:'XY+Ga0FEJbGq88aS'},{urls:'turn:global.relay.metered.ca:443',username:'e8dd65e92de6315a1e54fce9',credential:'XY+Ga0FEJbGq88aS'},{urls:'turn:global.relay.metered.ca:443?transport=tcp',username:'e8dd65e92de6315a1e54fce9',credential:'XY+Ga0FEJbGq88aS'}]}});

  peer.on('open',function(){console.log('Host ready:',mpRoomCode)});

  peer.on('connection',function(c){

    conn=c;mpConns.push(c);

    const playerId=mpConns.length;

    function onConnOpen(){

      setupConn(c,playerId);isMultiplayer=true;

      // Notify existing players

      mpConns.forEach(cc=>{if(cc!==c&&cc.open)cc.send({type:'playerJoined',total:mpConns.length})});

      document.getElementById('roomCodeDisplay').querySelector('.waiting').textContent='👥 '+mpConns.length+' שחקנים מחוברים';

      document.getElementById('mpStartBtn').style.display='block';

    }

    if(c.open)onConnOpen();

    else c.on('open',onConnOpen);

  });

  peer.on('error',function(e){

    var w=document.getElementById('roomCodeDisplay').querySelector('.waiting');

    if(w)w.textContent='❌ שגיאה: '+(e.type||e.message||e)+' — נסה שוב';

    console.error('Peer error:',e);

  });

}



function showJoin(){

  document.getElementById('joinSection').style.display='block';

  document.getElementById('roomCodeDisplay').style.display='none';

  document.getElementById('joinInput').focus();

}



function joinRoom(){

  mpRoomCode=document.getElementById('joinInput').value.toUpperCase().trim();

  if(mpRoomCode.length<3){document.getElementById('joinStatus').textContent='הכנס קוד תקין';return}

  document.getElementById('joinStatus').textContent='⏳ מתחבר...';

  document.getElementById('joinStatus').style.color='#a7f3d0';

  isHost=false;

  const guestId='tikia-'+mpRoomCode+'-g'+Math.floor(Math.random()*9999);

  peer=new Peer(guestId,{debug:2,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'},{urls:'stun:stun.relay.metered.ca:80'},{urls:'turn:global.relay.metered.ca:80',username:'e8dd65e92de6315a1e54fce9',credential:'XY+Ga0FEJbGq88aS'},{urls:'turn:global.relay.metered.ca:443',username:'e8dd65e92de6315a1e54fce9',credential:'XY+Ga0FEJbGq88aS'},{urls:'turn:global.relay.metered.ca:443?transport=tcp',username:'e8dd65e92de6315a1e54fce9',credential:'XY+Ga0FEJbGq88aS'}]}});

  peer.on('open',function(){

    conn=peer.connect('tikia-'+mpRoomCode+'-host',{reliable:true});

    var jt=setTimeout(function(){

      document.getElementById('joinStatus').textContent='❌ לא הצליח להתחבר — נסה שוב';

      document.getElementById('joinStatus').style.color='#f87171';

      if(peer){peer.destroy();peer=null}

    },20000);

    function onJoinOpen(){clearTimeout(jt);setupConn();isMultiplayer=true;

      document.getElementById('joinStatus').textContent='✅ מחובר! ממתין שהמארח יתחיל...';document.getElementById('joinStatus').style.color='#4ade80'}

    if(conn.open)onJoinOpen();

    else conn.on('open',onJoinOpen);

    conn.on('error',function(){

      clearTimeout(jt);

      document.getElementById('joinStatus').textContent='❌ לא נמצא חדר';

      document.getElementById('joinStatus').style.color='#f87171';

    });

  });

  peer.on('error',function(e){

    document.getElementById('joinStatus').textContent='❌ שגיאת חיבור — נסה שוב';

    document.getElementById('joinStatus').style.color='#f87171';

    console.error('Peer error:',e);

  });

}



window.mpStartAll=function(){

  // Host starts game and tells all guests to start

  isMultiplayer=mpConns.length>0;

  mpConns.forEach((cc,i)=>{if(cc.open)cc.send({type:'start',playerId:i+1,total:mpConns.length})});

  initAudio();_realStartGame();

}



function setupConn(c,playerId){

  if(!c)c=conn;

  c.on('data',function(data){

    if(data.type==='start'&&!gameActive){initAudio();_realStartGame();return}

    if(data.type==='pos'){

      if(isHost){

        // Host: store player data and broadcast to all others

        mpPlayers[playerId||1]={x:data.x,z:data.z,dir:data.dir,score:data.score,flow:data.flow,level:data.level,ga:data.ga};

        // Broadcast all player positions to each connection

        const allData={type:'allPos',players:mpPlayers,hostX:car.position.x,hostZ:car.position.z,hostDir:dir,hostScore:score,hostFlow:flow,hostLevel:level,hostGa:gameActive};

        mpConns.forEach(cc=>{if(cc.open)cc.send(allData)});

      }

      opData.x=data.x;opData.z=data.z;opData.dir=data.dir;

      opData.score=data.score;opData.flow=data.flow;opData.level=data.level;

      opData.gameActive=data.ga;

    } else if(data.type==='allPos'){

      // Guest: received all player positions from host

      opData.x=data.hostX;opData.z=data.hostZ;opData.dir=data.hostDir;

      opData.score=data.hostScore;opData.flow=data.hostFlow;opData.level=data.hostLevel;

      opData.gameActive=data.hostGa;

      // Update other guest cars

      if(data.players){Object.assign(mpPlayers,data.players)}

    } else if(data.type==='gameOver'){

      opData.gameActive=false;

      if(gameActive){

        gameActive=false;

        document.getElementById('finalScore').textContent=score;

        document.getElementById('finalGreen').textContent=greenCount;

        document.getElementById('finalRed').textContent=redCount;

        document.getElementById('mpResult').textContent='🏆 ניצחת! היריב נפל!';

        document.getElementById('mpResult').style.display='block';

        document.getElementById('finalStreak').textContent=bestStreak;

        document.getElementById('finalDist').textContent=Math.floor(car.position.z);

        document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';

        document.getElementById('gameOver').style.display='flex';

      }

    }

  });

  conn.on('close',function(){

    if(isMultiplayer&&gameActive){

      opData.gameActive=false;gameActive=false;

      document.getElementById('finalScore').textContent=score;

      document.getElementById('finalGreen').textContent=greenCount;

      document.getElementById('finalRed').textContent=redCount;

      document.getElementById('mpResult').textContent='🏆 ניצחת! היריב התנתק';

      document.getElementById('mpResult').style.display='block';

      document.getElementById('finalStreak').textContent=bestStreak;

      document.getElementById('finalDist').textContent=Math.floor(car.position.z);

      document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';

      document.getElementById('gameOver').style.display='flex';

    }

    isMultiplayer=false;conn=null;

  });

}



function mpSend(){

  if(!conn||!conn.open)return;

  conn.send({type:'pos',x:car.position.x,z:car.position.z,dir:dir,

    score:score,flow:flow,level:level,ga:gameActive});

}



function mpGameOver(){

  if(isMultiplayer&&conn&&conn.open)conn.send({type:'gameOver',score:score});

  if(isMultiplayer){

    document.getElementById('mpResult').textContent='😢 הפסדת! היריב ניצח';

    document.getElementById('mpResult').style.display='block';

  }

}



function mpCleanup(){

  if(peer){peer.destroy();peer=null}

  conn=null;isMultiplayer=false;isHost=false;

  opCar.visible=false;

  document.getElementById('opponentHud').style.display='none';

  document.getElementById('mpResult').style.display='none';

}



// ---- GAME FUNCTIONS ----

// ---- HIGH SCORES ----

function _getHighScores(){try{return JSON.parse(localStorage.getItem('gf_scores')||'[]')}catch(e){return[]}}

function _saveHighScore(s){

  const hs=_getHighScores();const oldBest=hs.length>0?hs[0].score:0;

  const pn=(document.getElementById('playerName')||{}).value||'שחקן';

  hs.push({score:s,name:pn,date:new Date().toLocaleDateString('he-IL')});

  hs.sort((a,b)=>b.score-a.score);if(hs.length>5)hs.length=5;

  localStorage.setItem('gf_scores',JSON.stringify(hs));_showHighScores();

  localStorage.setItem('gf_totalGames',(parseInt(localStorage.getItem('gf_totalGames')||'0')+1).toString());

  if(s>oldBest&&oldBest>0){const nb=document.createElement('div');nb.textContent='🏆 שיא חדש! '+s+' נקודות!';

    nb.style.cssText='position:fixed;top:20%;left:50%;transform:translateX(-50%);z-index:65;font-size:clamp(24px,5vw,36px);font-weight:900;color:#fbbf24;text-shadow:0 0 30px rgba(251,191,36,.7),0 0 60px rgba(251,191,36,.3);pointer-events:none;animation:newRecord 2s ease forwards;text-align:center';

    document.body.appendChild(nb);setTimeout(()=>nb.remove(),2500)}

}

function _showHighScores(){

  const hs=_getHighScores();const el=document.getElementById('highScoreSection');const list=document.getElementById('highScoreList');

  if(!el||!list||!hs.length)return;el.style.display='block';

  list.innerHTML=hs.map((h,i)=>'<div>'+(i===0?'👑':'🏅')+' '+(h.name||'שחקן')+' — '+h.score+' נקודות ('+h.date+')</div>').join('')

}



let _tutStep=0;

function tutorialNext(){

  _tutStep++;

  if(_tutStep===2){document.getElementById('tutStep1').style.display='none';document.getElementById('tutStep2').style.display='block'}

  else if(_tutStep===3){document.getElementById('tutStep2').style.display='none';document.getElementById('tutStep3').style.display='block';document.getElementById('tutNext').textContent='יאללה! 🚗'}

  else if(_tutStep>=4){document.getElementById('tutorial').style.display='none';localStorage.setItem('gf_tutorial','done');_realStartGame()}

}

function startGame(){

  initAudio();_saveSettings();

  if(!localStorage.getItem('gf_tutorial')){_tutStep=1;document.getElementById('tutorial').style.display='flex';document.getElementById('tutStep1').style.display='block';document.getElementById('tutStep2').style.display='none';document.getElementById('tutStep3').style.display='none';document.getElementById('tutNext').textContent='הבא ➜';document.getElementById('startScreen').style.display='none';return}

  _realStartGame();

}

function _realStartGame(){

  const _ss=document.getElementById('startScreen');_ss.style.opacity='0';setTimeout(()=>_ss.style.display='none',400);

  const _hud=document.getElementById('hud');_hud.style.display='block';_hud.classList.remove('hud-enter');void _hud.offsetWidth;_hud.classList.add('hud-enter');

  document.getElementById('followers').style.display='block';

  gameActive=true;startBgMusic();

  score=0;lives=5;level=1;flow=85;greenCount=0;redCount=0;streak=0;bestStreak=0;topSpeed=0;

  spd=0;dir=0;boostTimer=0;shieldTimer=0;turboTimer=0;lastMilestone=0;scenarioActive=false;scenariosAnswered=0;

  usedScenarios=[];nextScenarioAt=300;

  car.position.set(0,roadY(200),200);

  greens.length=0;obstacles.length=0;powerups.length=0;particles.length=0;

  for(let i=0;i<FOLLOWER_N;i++){followerPos[i].x=0;followerPos[i].z=-(i+1)*6}

  spawnGreen();

  // obstacles spawn naturally

  updateHUD();

  // Show random flexibility tip

  const _tips=['💡 גמישות = כוח! מי שזורם — מגיע רחוק','💡 לא תמיד יוצא מה שתכננת — וזה בסדר!','💡 חבר גמיש = חבר שכיף להיות איתו','💡 ויתור על קטנות = ניצחון גדול','💡 שינוי תוכניות? הזדמנות להרפתקה!','💡 מי שלא נתקע — תמיד נהנה','💡 גמישות זה לא חולשה — זה גבורה!','💡 זרום עם החברים — הכיף כפול!'];

  const _tipEl=document.getElementById('tip');if(_tipEl){_tipEl.textContent=_tips[Math.floor(Math.random()*_tips.length)];_tipEl.style.display='block';_tipEl.style.opacity='1';_tipEl.style.transition='opacity 1s';setTimeout(()=>{_tipEl.style.opacity='0';setTimeout(()=>_tipEl.style.display='none',1000)},4000)}

  if(isMultiplayer){

    opCar.visible=true;opCar.position.set(2,0,0);

    opData={x:0,z:0,dir:0,score:0,flow:50,level:1,gameActive:true};

    document.getElementById('opponentHud').style.display='block';

  } else {

    opCar.visible=false;

    document.getElementById('opponentHud').style.display='none';

  }

  document.getElementById('mpResult').style.display='none';

}



function restartGame(){

  document.getElementById('gameOver').style.display='none';

  mpCleanup();

  const _ss2=document.getElementById('startScreen');_ss2.style.opacity='1';_ss2.style.display='flex';

  document.getElementById('roomCodeDisplay').style.display='none';

  document.getElementById('joinSection').style.display='none';

}



let _lastFriendCount=5;

function notifyFriend(gained){

  const el=document.getElementById('friendNotify');

  if(!el)return;

  el.className=gained?'show gained':'show lost';

  el.textContent=gained?'🧒 +חבר חדש הצטרף!':'😢 חבר עזב...';

  clearTimeout(el._t);

  el._t=setTimeout(()=>{el.className=''},1500);

}

function updateHUD(){

  const curFriends=Math.max(0,Math.round(lives));

  if(curFriends>_lastFriendCount)notifyFriend(true);

  else if(curFriends<_lastFriendCount)notifyFriend(false);

  _lastFriendCount=curFriends;

  document.getElementById('scoreVal').textContent=score;

  const friendsN=Math.max(0,Math.round(lives));

  document.getElementById('livesVal').innerHTML='<span style="color:#4ade80">'+('●').repeat(friendsN)+'</span>'+(lives<5?'<span style="color:#333">'+('●').repeat(5-friendsN)+'</span>':'');

  const fEl=document.getElementById('followers');

  if(fEl)fEl.innerHTML=friendsN>=5?'<span style="color:#4ade80">●●●●●</span> 5 חברים נוסעים אחריך!':friendsN>0?'<span style="color:#fbbf24">'+('●').repeat(friendsN)+'</span> '+friendsN+' חברים נשארו':'<span style="color:#ef4444">אין חברים...</span>';

  document.getElementById('levelVal').textContent=level;

  const _pt=document.getElementById('playerTag');if(_pt){

    const pn=(document.getElementById('playerName')||{}).value||'';

    const ranks=['🌱','🌿','🌳','💪','⭐','🌟','👑','💎'];

    const rankIdx=Math.min(ranks.length-1,Math.floor(score/30));

    _pt.textContent=ranks[rankIdx]+' '+(pn||'נהג')+' | שלב '+level+' | '+Math.floor(car.position.z)+'m'}

  const _sv=document.getElementById('streakVal');_sv.textContent=streak>0?'🔥'.repeat(Math.min(streak,5)):'';

  const _sp=_sv.parentElement;if(_sp){if(streak>=5){_sp.style.boxShadow='0 0 20px rgba(255,100,0,.6)';_sp.style.transform='scale(1.1)';_sp.style.borderColor='rgba(255,100,0,0.6)';

    if(!window._streakTurbo){window._streakTurbo=true;turboTimer=Math.max(turboTimer,180);sfxBoost()}}

    else if(streak>=3){_sp.style.boxShadow='0 0 '+(8+streak*3)+'px rgba(251,191,36,'+(0.3+streak*0.08)+')';_sp.style.transform='scale('+(1+streak*0.02)+')';_sp.style.borderColor='rgba(251,191,36,0.5)';window._streakTurbo=false}

    else{_sp.style.boxShadow='';_sp.style.transform='';_sp.style.borderColor='';window._streakTurbo=false}}

  const _ff=document.getElementById('flowFill');_ff.style.width=flow+'%';_ff.className=flow>70?'flow-high':'';;if(_ff&&flow>80)_ff.style.boxShadow='0 0 12px rgba(74,222,128,.6)';else if(_ff)_ff.style.boxShadow=''

  const _fg=document.getElementById('flowGlow');if(_fg)_fg.style.opacity=flow>=95?String((flow-95)/5*0.8):'0';document.getElementById('distVal').textContent=Math.floor(car.position.z)+'m';

  const _cc=document.getElementById('choiceCounter');if(_cc)_cc.textContent='🟢'+greenCount+' 🔴'+redCount;

  const _curSpd=Math.round(spd*500);if(_curSpd>topSpeed)topSpeed=_curSpd;
  if(window._drawSpeedo)window._drawSpeedo(_curSpd,210);

  document.getElementById('speedVal').textContent=_curSpd+'km/h';var _spEl=document.getElementById('speedVal').parentElement;if(_spEl){_spEl.style.transition='border-color .3s,transform .3s';if(_curSpd>140){_spEl.style.borderColor='rgba(239,68,68,.6)';_spEl.style.transform='scale('+(1+Math.sin(fc*0.2)*0.03)+')'}else if(_curSpd>100)_spEl.style.borderColor='rgba(251,191,36,.5)';else _spEl.style.borderColor=''}

  const _sn=document.getElementById('speedNeedle');if(_sn)_sn.style.transform='rotate('+(-90+spd*500)+'deg)';

  var _sl=document.getElementById('speedLines');if(_sl)_sl.style.opacity=spd>0.25?String(Math.min(1,(spd-0.25)*4)):'0';

  var _hl=document.getElementById('headlightGlow');if(_hl)_hl.style.opacity=spd>0.05?String(Math.min(1,spd*3)):'0';

  // Dynamic road reflectivity — more reflective at speed

  if(window._roadMat){window._roadMat.roughness=0.45-spd*0.12;window._roadMat.metalness=0.2+spd*0.1}

  var _sg=document.getElementById('speedGlow');if(_sg)_sg.style.opacity=spd>0.2?String(Math.min(0.8,(spd-0.2)*2)):'0';
  var _mb=document.getElementById('motionBlur');if(_mb)_mb.style.opacity=spd>0.12?String(Math.min(0.9,(spd-0.12)*2.5)):'0';

  if(window._carBeam)window._carBeam.material.opacity=spd>0.05?Math.min(0.06,spd*0.12):0;
    

  scene.fog.density=0.0008-spd*0.0003;scene.fog.color.setHex(spd>0.1?0x1e1e30:0x1a1a2e);if(scene.children[0]&&scene.children[0].isAmbientLight)scene.children[0].intensity=0.25+spd*0.15;if(scene.children[1]&&scene.children[1].isDirectionalLight)scene.children[1].intensity=1.5+spd*0.2;var _tFov=68+spd*25;cam.fov+=(Math.min(88,_tFov)-cam.fov)*0.03;cam.updateProjectionMatrix();
    // Dynamic vignette at speed
    if(typeof colorPass!=='undefined'&&colorPass.uniforms){colorPass.uniforms['vignetteAmount'].value=0.35+spd*0.3}// fog clears at speed

  moon.position.z=car.position.z+500;moonGlow.position.z=moon.position.z;

  skyMesh.position.set(cam.position.x,cam.position.y,cam.position.z);

  // Trees removed

  // Trail marks on road at high speed

  if(spd>0.15&&fc%8===0&&!window._trailMarks)window._trailMarks=[];

  if(window._trailMarks&&spd>0.15&&fc%8===0){

    window._trailMarks.push({x:car.position.x,y:car.position.y+0.04,z:car.position.z,life:1});

    if(window._trailMarks.length>30)window._trailMarks.shift();

  }

  if(window._trailMarks&&window._trailInst){

    const ti=window._trailInst;

    for(let i=0;i<30;i++){

      if(i<window._trailMarks.length){const t=window._trailMarks[i];t.life-=0.015;

        dummy.position.set(t.x,t.y,t.z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(0.3,1.5,1);dummy.updateMatrix();

        ti.setMatrixAt(i,dummy.matrix);ti.setColorAt(i,_col.setRGB(0.13*t.life,0.77*t.life,0.37*t.life));

      } else {dummy.position.set(0,-100,0);dummy.updateMatrix();ti.setMatrixAt(i,dummy.matrix)}

    }

    ti.instanceMatrix.needsUpdate=true;if(ti.instanceColor)ti.instanceColor.needsUpdate=true;

    window._trailMarks=window._trailMarks.filter(t=>t.life>0);

  }

  // Chromatic aberration on sharp turns

  const _lean=Math.abs(window._carLean||0);

  if(_lean>0.04){const ca=Math.min(3,_lean*30);document.querySelector('canvas').style.filter='contrast(1.05) saturate(1.15) hue-rotate('+(_lean>0?(ca):(-ca))+'deg)'}

  else{document.querySelector('canvas').style.filter='contrast(1.05) saturate(1.15)'}

  // Dust puff behind car at speed

  if(spd>0.15&&fc%8===0){
    // Exhaust heat particles (both sides)
    var _ecy=car.position.y+0.3,_ecz=car.position.z-2.3;
    for(var _ei=0;_ei<1&&particles.length<PART_MAX;_ei++){
      particles.push({x:car.position.x+(_ei===0?-0.4:0.4),y:_ecy,z:_ecz,vx:(Math.random()-.5)*0.05,vy:0.03+Math.random()*0.02,vz:-0.05-Math.random()*0.03,life:0.6+Math.random()*0.3,color:spd>0.3?0xffaa44:0x888888,isSmoke:true});
    }
    // Road spray at high speed
    if(spd>0.3&&fc%12===0){
      particles.push({x:car.position.x+(Math.random()-.5)*2,y:car.position.y+0.05,z:car.position.z-1.5,vx:(Math.random()-.5)*0.2,vy:Math.random()*0.1,vz:-0.1-Math.random()*0.1,life:0.4,color:0x667788,isSmoke:false});
    }
  }

  // Tire sparks on sharp turns at speed

  const _steerAmt=Math.abs((keys.ArrowLeft||keys.KeyA)?1:(keys.ArrowRight||keys.KeyD)?-1:0);
  if(_steerAmt>0&&spd>0.2&&fc%6===0){
    const sparkX=car.position.x+((keys.ArrowLeft||keys.KeyA)?1.1:-1.1);
    for(var _sp2=0;_sp2<1&&particles.length<PART_MAX;_sp2++){
      particles.push({x:sparkX+(Math.random()-.5)*0.3,y:car.position.y+0.15,z:car.position.z-1+Math.random()*0.5,vx:(Math.random()-.5)*0.3,vy:0.1+Math.random()*0.2,vz:(Math.random()-.5)*0.2,life:0.3+Math.random()*0.2,color:Math.random()>0.5?0xffcc44:0xff8833,isSmoke:false});
    }
  }

  // Brake lights — glow when decelerating or pressing brake

  if(window._brakeMat){const braking=(keys.ArrowDown||keys.KeyS)||(!keys.ArrowUp&&!keys.KeyW&&spd>0.05);

    window._brakeMat.emissiveIntensity=braking?1.5:0.3;window._brakeMat.color.setHex(braking?0xff2222:0xff4444)}

  var _bt=document.getElementById('boostTrail');if(_bt){if(boostTimer>0||turboTimer>0){_bt.style.opacity='1';_bt.style.height=Math.min(25,spd*80)+'vh';_bt.style.background=turboTimer>0?'linear-gradient(to top,rgba(251,191,36,.5),rgba(251,191,36,0))':'linear-gradient(to top,rgba(74,222,128,.5),rgba(74,222,128,0))'}else{_bt.style.opacity='0';_bt.style.height='0'}}

}



// ---- COLLISIONS ----

function checkCollisions(){

  const cx=car.position.x,cz=car.position.z;

  for(let i=greens.length-1;i>=0;i--){

    const g=greens[i];if(!g.active)continue;

    if((cx-g.x)**2+(cz-g.z)**2<5){

      g.active=false;if(!window._collectStreak)window._collectStreak=0;if(!window._lastCollect)window._lastCollect=0;

      const now=performance.now();window._collectStreak=now-window._lastCollect<2000?window._collectStreak+1:1;window._lastCollect=now;

      const combo=window._collectStreak;const bonus=Math.min(combo,5);score+=8+bonus;flow=Math.min(100,flow+6);lives=Math.min(5,lives+0.3);

      sfxCollect();emitParticles(g.x,g.y,g.z,0x22c55e,6+combo);

      const proj=_v.set(g.x,g.y+1,g.z).project(cam);

      const px=(proj.x*.5+.5)*innerWidth,py=(-(proj.y*.5)+.5)*innerHeight;

      if(combo>=3)showPopup('🔥 x'+combo+' קומבו! +'+(8+bonus),(px),(py-30),'#fbbf24');

      else showPopup('🟢 +'+(8+bonus),(px),(py),'#4ade80');

      greens.splice(i,1);

    }

  }



  // Red edge collision

  if(window._redEdges){const re=window._redEdges;for(let i=0;i<re.n;i++){const rd=re.data[i];const dz=car.position.z-rd.z;if(dz>-12&&dz<12){const rx=roadX(rd.z);const dx=car.position.x-rx;if(Math.abs(dx)>4){lives=Math.max(0,lives-0.02);if(fc%30===0){sfxRed();emitParticles(car.position.x,.5,car.position.z,0xff2222,3)}if(lives<=0){gameActive=false;document.getElementById('finalScore').textContent=score;document.getElementById('finalGreen').textContent=greenCount;document.getElementById('finalRed').textContent=redCount;document.getElementById('finalStreak').textContent=bestStreak;document.getElementById('finalMsg').textContent='😢 כל החברים עזבו... ננסה שוב?';document.getElementById('finalDist').textContent=Math.floor(car.position.z);document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';mpGameOver();document.getElementById('gameOver').style.display='flex';return}}}}}



// Power-ups

  for(let i=powerups.length-1;i>=0;i--){    const p=powerups[i];if(!p.active)continue;    if((cx-p.x)**2+(cz-p.z)**2<3){      p.active=false;screenFlash("flash-gold");      sfxBoost();emitParticles(p.x,p.y,p.z,0xfbbf24,10);      const proj=_v.set(p.x,p.y+1,p.z).project(cam);      if(p.type==="shield"){shieldTimer=300;showPopup("🛡️ מגן!",(proj.x*.5+.5)*innerWidth,(-(proj.y*.5)+.5)*innerHeight,"#60a5fa")}      else{turboTimer=180;showPopup("⚡ טורבו!",(proj.x*.5+.5)*innerWidth,(-(proj.y*.5)+.5)*innerHeight,"#fbbf24")}      powerups.splice(i,1);    }  }

  for(let i=obstacles.length-1;i>=0;i--){

    const o=obstacles[i];if(!o.active)continue;

    const oDist2=(cx-o.x)**2+(cz-o.z)**2;

    // Near miss detection (close but not hit)

    if(oDist2>4&&oDist2<12&&cz>o.z&&!o._nearMissed){

      o._nearMissed=true;score+=5;

      showPopup('😎 כמעט! +5',innerWidth/2,innerHeight*0.3,'#60a5fa');

      sfxCollect();emitParticles(car.position.x,1.5,car.position.z,0x60a5fa,4);

    }

    if(oDist2<4){

      o.active=false;if(shieldTimer>0){shieldTimer=0;emitParticles(o.x,o.y,o.z,0x60a5fa,8);sfxCollect();obstacles.splice(i,1);continue}flow=Math.max(0,flow-4);spd*=.5;lives=Math.max(0,lives-0.5);

      sfxRed();screenFlash("flash-red");emitParticles(o.x,o.y,o.z,0xef4444,10);

      const proj=_v.set(o.x,o.y+1,o.z).project(cam);

      showPopup('🔴 תיקיה אדומה — להיתקע זה לא נעים!',(proj.x*.5+.5)*innerWidth,(-(proj.y*.5)+.5)*innerHeight,'#ef4444');

      obstacles.splice(i,1);

      if(lives<=0){

        gameActive=false;

        document.getElementById('finalScore').textContent=score;

        document.getElementById('finalGreen').textContent=greenCount;

        document.getElementById('finalRed').textContent=redCount;

    document.getElementById('finalStreak').textContent=bestStreak;

        document.getElementById('finalMsg').textContent='😢 כל החברים עזבו... ננסה שוב?';

        document.getElementById('finalDist').textContent=Math.floor(car.position.z);document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';mpGameOver();document.getElementById('gameOver').style.display='flex';return;

      }

      spawnObstacle();

    }

  }

}




// ---- GRAPHICAL SPEEDOMETER ----
window._drawSpeedo=function(speed,maxSpeed){
var cv=document.getElementById("speedoCanvas");if(!cv)return;
if(!window._speedoCtx)window._speedoCtx=cv.getContext("2d");
var ctx=window._speedoCtx,w=cv.width,h=cv.height,cx=w/2,cy=h/2,r=w/2-10;
ctx.clearRect(0,0,w,h);
ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
var bg=ctx.createRadialGradient(cx,cy,r*0.3,cx,cy,r);bg.addColorStop(0,"rgba(20,20,40,0.85)");bg.addColorStop(1,"rgba(10,10,25,0.95)");ctx.fillStyle=bg;ctx.fill();
ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle="rgba(100,200,255,0.3)";ctx.lineWidth=3;ctx.stroke();
var sA=Math.PI*0.75,eA=Math.PI*2.25,sw=eA-sA,sr=Math.min(1,speed/maxSpeed),sa=sA+sw*sr;
ctx.beginPath();ctx.arc(cx,cy,r-8,sA,eA);ctx.strokeStyle="rgba(60,60,80,0.5)";ctx.lineWidth=8;ctx.stroke();
if(speed>2){ctx.beginPath();ctx.arc(cx,cy,r-8,sA,sa);ctx.strokeStyle=speed>140?"#ef4444":speed>80?"#eab308":"#22c55e";ctx.lineWidth=8;ctx.lineCap="round";ctx.stroke();
ctx.shadowColor=speed>140?"#ef4444":speed>80?"#eab308":"#22c55e";ctx.shadowBlur=15*sr;ctx.beginPath();ctx.arc(cx,cy,r-8,Math.max(sA,sa-0.3),sa);ctx.strokeStyle=ctx.shadowColor;ctx.lineWidth=4;ctx.stroke();ctx.shadowBlur=0}
for(var i=0;i<=10;i++){var a=sA+sw*(i/10),inn=i%2===0?r-22:r-18,out=r-12;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*inn,cy+Math.sin(a)*inn);ctx.lineTo(cx+Math.cos(a)*out,cy+Math.sin(a)*out);ctx.strokeStyle=i<=sr*10?"rgba(255,255,255,0.9)":"rgba(100,100,120,0.5)";ctx.lineWidth=i%2===0?2:1;ctx.stroke();
if(i%2===0){ctx.fillStyle=i<=sr*10?"#fff":"rgba(150,150,170,0.6)";ctx.font="bold 9px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(Math.round(maxSpeed*i/10),cx+Math.cos(a)*(r-32),cy+Math.sin(a)*(r-32))}}
ctx.save();ctx.translate(cx,cy);ctx.rotate(sa);ctx.beginPath();ctx.moveTo(0,-2);ctx.lineTo(r-25,0);ctx.lineTo(0,2);ctx.closePath();ctx.fillStyle="#ef4444";ctx.fill();ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fillStyle="#fff";ctx.fill();ctx.restore();
ctx.fillStyle="#fff";ctx.font="bold 28px Arial";ctx.textAlign="center";ctx.fillText(speed,cx,cy+25);
ctx.fillStyle="rgba(180,180,200,0.7)";ctx.font="11px Arial";ctx.fillText("km/h",cx,cy+40);
if(typeof isDrifting!=="undefined"&&isDrifting&&typeof driftIntensity!=="undefined"&&driftIntensity>0.15){var _da=0.5+driftIntensity*0.5;ctx.save();ctx.fillStyle="rgba(255,165,0,"+_da+")";ctx.font="bold "+(14+Math.floor(driftIntensity*10))+"px Arial";ctx.shadowColor="rgba(255,100,0,0.8)";ctx.shadowBlur=10+driftIntensity*15;ctx.fillText(handbrake?"HANDBRAKE!":"DRIFT!",cx,cy-25);if(driftIntensity>0.5){ctx.fillStyle="rgba(255,220,0,"+(driftIntensity*0.6)+")";ctx.font="bold "+(10+Math.floor(driftIntensity*6))+"px Arial";ctx.fillText("x"+Math.floor(driftIntensity*10)/10,cx,cy-8)}ctx.restore()}
cv.style.opacity="1"};

// ---- ANIMATE ----

function animate(){

  requestAnimationFrame(animate);

  if(_paused){renderer.toneMappingExposure=1.2+spd*0.3;composer.render();return}

  fc++;



  if(gameActive&&(!scenarioActive||_gateActive)){

    if(window._isMobileDevice)keys.KeyW=true;// mobile: always drive forward

    const _mob=!!window._isMobileDevice;

    const maxSpd=_gateActive?(_mob?.18:.33):turboTimer>0?(_mob?.4:.75):boostTimer>0?(_mob?.35:.6):(_mob?.25:.42);

    if(keys.ArrowUp||keys.KeyW)spd=Math.min(maxSpd,spd+(_mob?.008:.018));

    else if(keys.ArrowDown||keys.KeyS)spd=Math.max(-.12,spd-.012);

    else{spd*=_mob?.96:.975;if(Math.abs(spd)<.005)spd=0;else if(!_mob&&spd>0&&spd<.04)spd=.04}



    if(Math.abs(spd)>.003){

      if(!window._steerSmooth)window._steerSmooth=0;

      let steerTarget=(keys.ArrowLeft||keys.KeyA)?0.04:(keys.ArrowRight||keys.KeyD)?-0.04:0;

      // Analog mobile steer: proportional to finger position

      if(window._mobileSteer&&Math.abs(window._mobileSteer)>0.05){

        steerTarget=-window._mobileSteer*0.04;// analog range, smooth

      }

      window._steerSmooth+=(steerTarget-window._steerSmooth)*0.18;// smooth easing

      dir+=window._steerSmooth*Math.sign(spd)*(1+spd*0.3);// balanced steer-at-speed

    }

    dir*=.94;
    var _prevBrake=handbrake;handbrake=!!(keys.Space);
    if(handbrake&&spd>0.1){if(!_prevBrake){lateralVel+=(window._steerSmooth||0)*spd*6;spd*=0.97}else{lateralVel+=(window._steerSmooth||0)*spd*4.5}isDrifting=true;spd*=0.985}
    else if(Math.abs(spd)>0.12&&Math.abs(window._steerSmooth||0)>0.012){lateralVel+=(window._steerSmooth||0)*spd*3.2;isDrifting=true}
    else{isDrifting=Math.abs(lateralVel)>0.012}
    lateralVel*=isDrifting?(handbrake?0.975:0.96):0.86;
    driftIntensity=Math.min(1,Math.abs(lateralVel)*(handbrake?16:12));
    if(Math.abs(lateralVel)>0.002)car.position.x+=lateralVel;
    // Counter-steer: reward steering into drift direction
    var _csBonus=(Math.sign(window._steerSmooth||0)===Math.sign(lateralVel))?0.94:1.0;
    lateralVel*=_csBonus;
    driftAngle=lateralVel*(2.5+driftIntensity*1.5);



    // Car follows curve by position pull (NOT rotation) - curves stay visible!

    const curX=roadX(car.position.z);

    const aheadX=roadX(car.position.z+30);

    const _isMob=!!window._isMobileDevice;

    const curvePull=(curX-car.position.x)*(_isMob?.08:.008);

    car.position.x+=curvePull;

    const _offRoad=Math.abs(car.position.x-curX);
    // Hard road boundary - can't leave road area
    if(_offRoad>7){
      // Slow down when off road
      spd*=0.97;
      // Strong pull back
      car.position.x+=(curX-car.position.x)*0.08;
      // Visual feedback
      if(fc%20===0)emitParticles(car.position.x,0.3,car.position.z,0x886644,2);
    }
    if(_offRoad>10){
      // Hard wall - can't go further
      car.position.x=curX+Math.sign(car.position.x-curX)*10;
      lateralVel*=-0.3;
      spd*=0.8;
    }
    // Building collision
    if(window._bdata){
      var _cz2=car.position.z;
      for(var _bi=0;_bi<window._bdata.length;_bi++){
        var _b=window._bdata[_bi];
        var _bx=_b[0],_bz=_b[1],_bw=_b[2]/2+0.5,_bd=_b[4]/2+0.5;
        if(Math.abs(_cz2-_bz)<_bd&&Math.abs(car.position.x-_bx)<_bw){
          // Push car out of building
          var _pushX=car.position.x>_bx?_bx+_bw:_bx-_bw;
          car.position.x=_pushX;
          lateralVel*=-0.2;
          spd*=0.85;
          if(!window._lastBldgHit||fc-window._lastBldgHit>30){
            emitParticles(car.position.x,1,car.position.z,0xff8844,4);
            window._lastBldgHit=fc;
          }
          break;
        }
      }
    }
    // Tunnel wall collision
    if(window._tunnelPositions){
      for(var _ti=0;_ti<window._tunnelPositions.length;_ti++){
        var _tz=window._tunnelPositions[_ti];
        if(Math.abs(car.position.z-_tz)<10){
          var _trx2=roadX(_tz);
          if(Math.abs(car.position.x-_trx2)>5.5){
            car.position.x=_trx2+Math.sign(car.position.x-_trx2)*5.5;
            lateralVel*=-0.3;
            spd*=0.9;
          }
          break;
        }
      }
    }

    const _dv=document.getElementById('dangerVignette');if(_dv)_dv.style.opacity=_offRoad>3?String(Math.min(1,(_offRoad-3)*0.15)):'0';

    // Visual tilt only - slight lean into curves for feel

    const curveAngle=Math.atan2(aheadX-curX,30)*.12;

    car.rotation.y=dir+curveAngle+driftAngle;

    car.position.x+=Math.sin(dir)*spd;

    car.position.z+=Math.cos(dir)*spd;
    // Road loop: teleport when near end
    if(car.position.z>5000){car.position.z-=4500;car.position.x=roadX(car.position.z);car.position.y=roadY(car.position.z)+0.5;dir=Math.atan2(roadX(car.position.z+10)-roadX(car.position.z),10);lateralVel=0;driftAngle=0;isDrifting=false;if(typeof nextScenarioAt!=="undefined")nextScenarioAt-=4500}

    const _baseY=roadY(car.position.z);

    const hillSlope=Math.atan2(roadY(car.position.z+2)-roadY(car.position.z-2),4);

    // Suspension bounce on bumps

    if(!window._suspY)window._suspY=0;if(!window._suspVel)window._suspVel=0;

    const _hillChange=Math.abs(hillSlope-(window._prevSlope||0));window._prevSlope=hillSlope;

    window._suspVel+=_hillChange*spd*8;window._suspVel*=0.85;window._suspY=Math.sin(fc*0.3)*window._suspVel*0.5;

    car.position.y=_baseY+Math.abs(window._suspY)*0.3;

    car.rotation.x=-hillSlope;
    // Shadow camera follows car
    if(dirLight&&dirLight.shadow){dirLight.position.set(car.position.x+20,50,car.position.z+30);dirLight.target.position.set(car.position.x,0,car.position.z);dirLight.target.updateMatrixWorld()}

    // Body roll - lean into turns

    const steerInput=(keys.ArrowLeft||keys.KeyA)?1:(keys.ArrowRight||keys.KeyD)?-1:0;

    if(!window._carLean)window._carLean=0;

    const targetLean=steerInput*0.12+curveAngle*0.8;

    window._carLean+=(targetLean-window._carLean)*0.08;

    car.rotation.z=window._carLean;
    if(window._wheels){const wSpd=spd*8;window._wheels.forEach(w=>{w.children.forEach(c=>{c.rotation.x+=wSpd})})}if(window._glbWheels&&window._glbWheels.length){const _gws=spd*8;window._glbWheels.forEach(function(w){w.rotation.x+=_gws})}
    // Drift sound
    if(isDrifting&&driftIntensity>0.2){if(!window._driftOsc)window._startDriftSound();window._updateDriftSound(driftIntensity);driftChain+=driftIntensity*(handbrake?2:1);driftChainTimer=0}else{if(window._driftOsc)window._stopDriftSound();if(driftChain>30){score+=Math.floor(driftChain);var _dsc=document.createElement('div');_dsc.textContent='DRIFT +'+Math.floor(driftChain);_dsc.style.cssText='position:fixed;top:35%;left:50%;transform:translateX(-50%);z-index:55;font-size:clamp(20px,4vw,32px);font-weight:900;color:#fbbf24;text-shadow:0 0 20px rgba(251,191,36,.7);pointer-events:none;transition:all 1.5s;opacity:1';document.body.appendChild(_dsc);setTimeout(function(){_dsc.style.opacity='0';_dsc.style.top='25%'},50);setTimeout(function(){_dsc.remove()},1600);var _sv2=document.getElementById('scoreVal');if(_sv2)_sv2.textContent=score}driftChain=0}
    // Drift smoke
    if(isDrifting&&driftIntensity>0.15&&fc%2===0){var _dSx=car.position.x,_dSz=car.position.z-1.5,_dSy=car.position.y+0.05;var _sn=Math.ceil(driftIntensity*(handbrake?5:3));for(var _si=0;_si<_sn&&particles.length<PART_MAX;_si++){var _sv=0.08+driftIntensity*0.15;particles.push({x:_dSx-1.15+(Math.random()-.5)*.3,y:_dSy,z:_dSz+(Math.random()-.5)*.5,vx:(Math.random()-.5)*_sv,vy:0.02+Math.random()*0.04,vz:-Math.random()*_sv*0.5,life:1,color:0xdddddd,isSmoke:true});particles.push({x:_dSx+1.15+(Math.random()-.5)*.3,y:_dSy,z:_dSz+(Math.random()-.5)*.5,vx:(Math.random()-.5)*_sv,vy:0.02+Math.random()*0.04,vz:-Math.random()*_sv*0.5,life:1,color:0xdddddd,isSmoke:true})}}
    // Tire marks
    if(isDrifting&&driftIntensity>0.2&&window._tireMarks){var _tm=window._tireMarks,_ti=_tm.idx%_tm.max,_my=roadY(car.position.z)+0.015;var _mw=0.2+driftIntensity*0.25,_ml=0.8+spd*4;dummy.position.set(car.position.x-1.15,_my,car.position.z-1.5);dummy.rotation.set(-Math.PI/2,0,car.rotation.y);dummy.scale.set(_mw,_ml,1);dummy.updateMatrix();_tm.inst.setMatrixAt(_ti,dummy.matrix);var _mc=new THREE.Color(handbrake?0x222222:0x1a1a1a);_tm.inst.setColorAt(_ti,_mc);dummy.position.x=car.position.x+1.15;dummy.updateMatrix();_tm.inst.setMatrixAt((_ti+1)%_tm.max,dummy.matrix);_tm.inst.setColorAt((_ti+1)%_tm.max,_mc);if(_tm.ages){_tm.ages[_ti]=0.01;_tm.ages[(_ti+1)%_tm.max]=0.01}_tm.idx+=2;_tm.inst.instanceMatrix.needsUpdate=true;if(_tm.inst.instanceColor)_tm.inst.instanceColor.needsUpdate=true}




    const roadCurve=curX;

    const leftEdge=-3.5+roadCurve;

    const rightEdge=3.5+roadCurve;

    if(_isMob){

      if(car.position.x<leftEdge+.5)car.position.x+=(leftEdge+.5-car.position.x)*.9+.4;

      if(car.position.x>rightEdge-.5)car.position.x+=(rightEdge-.5-car.position.x)*.9-.4;

    }else{

      if(car.position.x<leftEdge)car.position.x+=(leftEdge-car.position.x)*.4+.2;

      if(car.position.x>rightEdge)car.position.x+=(rightEdge-car.position.x)*.4-.2;

    }



    if(boostTimer>0)boostTimer--;if(shieldTimer>0)shieldTimer--;if(turboTimer>0)turboTimer--;var _bodyMat=window._carBodyMat;if(_bodyMat){if(shieldTimer>0)_bodyMat.color.setHex(fc%10<5?0x60a5fa:0x3b82f6);else if(turboTimer>0)_bodyMat.color.setHex(fc%10<5?0xfbbf24:0xf59e0b);else if(boostTimer>0){_bodyMat.color.setHex(fc%10<5?0x4ade80:0x22c55e)}}
if(window._underGlow){var ug=window._underGlow;if(shieldTimer>0){ug.color.setHex(0x60a5fa);ug.opacity=0.25}else if(turboTimer>0){ug.color.setHex(0xfbbf24);ug.opacity=0.3}else{ug.color.setHex(0x22c55e);ug.opacity=0.1+flow/100*0.15}}

    else if(window._carBodyMat){window._carBodyMat.color.setHex(0x22c55e)}





  // Barrier collisions

  if(window._barrierData){const bd=window._barrierData;for(let i=0;i<bd.n;i++){const b=bd.data[i];const dz=Math.abs(car.position.z-b.z);if(dz<1){const dx=Math.abs(car.position.x-b.x);if(dx<b.w*.6){spd*=.5;if(!b._hit){b._hit=true;flow=Math.max(0,flow-1);emitParticles(car.position.x,1,car.position.z,0xff6600,4)}}}else{b._hit=false}}}



  // Obstacle sparks effect

  if(obstacles.length>0){

    for(let i=0;i<obstacles.length;i++){

      const ob=obstacles[i];

      if(ob.active&&Math.abs(car.position.z-ob.z)<50&&fc%8===0){

        emitParticles(ob.x+Math.random()*2-1,ob.y+1,ob.z+Math.random()*2-1,0xff6633,1);

      }

    }

  }

    // Follower cars

    for(let i=0;i<FOLLOWER_N;i++){

      const target=i===0?car.position:{x:followerPos[i-1].x,z:followerPos[i-1].z};

      followerPos[i].x+=(target.x-followerPos[i].x)*.04;

      followerPos[i].z+=(target.z-6-followerPos[i].z)*.04;

      const visible=i<Math.round(lives);

      dummy.position.set(followerPos[i].x,visible?roadY(followerPos[i].z)+followerPos[i].y:-100,followerPos[i].z);

      dummy.scale.setScalar(visible?1:0);dummy.rotation.set(0,dir*.5,0);dummy.updateMatrix();

      followerInst.setMatrixAt(i,dummy.matrix);

    }

    followerInst.instanceMatrix.needsUpdate=true;



    // Spawn

    if(fc%200===0){spawnGreen();if(Math.random()<.06)spawnObstacle();if(Math.random()<.08)spawnPowerup()}

    // Achievement system

  if(!window._achs)window._achs={};

  function _ach(id,text){if(window._achs[id])return;window._achs[id]=true;const a=document.getElementById('achievement');if(a){a.textContent='🏅 '+text;a.style.display='block';a.style.animation='none';a.offsetWidth;a.style.animation='achSlide .5s ease';clearTimeout(window._achT);window._achT=setTimeout(()=>a.style.display='none',3000);sfxLevelUp()}}

  if(score>=50&&!window._achs.s50)_ach('s50','50 נקודות!');

  if(score>=100&&!window._achs.s100)_ach('s100','100 נקודות — מגניב!');

  if(score>=200&&!window._achs.s200)_ach('s200','200 נקודות — אלוף!');

  if(Math.floor(car.position.z)>=500&&!window._achs.d500)_ach('d500','500 מטר — נוסע רחוק!');

  if(Math.floor(car.position.z)>=1000&&!window._achs.d1k)_ach('d1k','1,000 מטר — מרתון!');

  if(streak>=3&&!window._achs.st3)_ach('st3','רצף 3 ירוקים!');

  if(streak>=7&&!window._achs.st7)_ach('st7','רצף 7 — על אש!');

  // Rain effect — random weather

    const _rainEl=document.getElementById('rainOverlay');

    if(_rainEl){const rz=Math.floor(car.position.z/600)%3;_rainEl.style.opacity=rz===1?'0.7':'0'}

    // Speed zone — glowing road section

    if(!window._speedZone&&fc%500===0&&Math.random()<.3){

      window._speedZone={z:car.position.z+60+Math.random()*40,len:20};

    }

    if(window._speedZone){

      const sz=window._speedZone;const dz=car.position.z-sz.z;

      if(dz>0&&dz<sz.len){spd=Math.min(0.7,spd+0.01);// speed boost!

        if(fc%15===0)emitParticles(car.position.x,car.position.y+0.5,car.position.z,0xffd700,2);

        document.querySelector('canvas').style.filter='contrast(1.1) saturate(1.3) brightness(1.05)';

      }else if(dz>=sz.len){window._speedZone=null;document.querySelector('canvas').style.filter='contrast(1.05) saturate(1.15)'}

    }

    // Rare golden bonus (1% chance per cycle)

    if(fc%300===0&&Math.random()<.15&&!window._goldenActive){

      window._goldenActive=true;window._goldenZ=car.position.z+50+Math.random()*30;

      window._goldenX=roadX(window._goldenZ)+(Math.random()-.5)*5;

    }

    if(window._goldenActive){

      const gd=car.position.z-window._goldenZ;

      if(gd>-2&&gd<2&&Math.abs(car.position.x-window._goldenX)<3){

        score+=25;sfxLevelUp();confettiBurst();

        showPopup('💰 +25 בונוס!',innerWidth/2,innerHeight*0.35,'#fbbf24');

        emitParticles(car.position.x,2,car.position.z,0xffd700,15);

        window._goldenActive=false;

      }else if(gd>10){window._goldenActive=false}

    }



    // Clean

    for(let i=greens.length-1;i>=0;i--){if(greens[i].z<car.position.z-50)greens.splice(i,1)}

    for(let i=obstacles.length-1;i>=0;i--){if(obstacles[i].z<car.position.z-50)obstacles.splice(i,1)}

    for(let i=powerups.length-1;i>=0;i--){if(powerups[i].z<car.position.z-50)powerups.splice(i,1)}



    // Bob greens & powerups

    for(let i=0;i<greens.length;i++){greens[i].y=roadY(greens[i].z)+3+Math.sin(fc*.05+i)*.5}

if(window._beamInst){for(let i=0;i<MAX_GREENS;i++){if(i<greens.length&&greens[i].active){dummy.position.set(greens[i].x,roadY(greens[i].z)+1.5,greens[i].z);dummy.scale.setScalar(1);dummy.rotation.set(0,0,0);dummy.updateMatrix();window._beamInst.setMatrixAt(i,dummy.matrix)}else{dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();window._beamInst.setMatrixAt(i,dummy.matrix)}}window._beamInst.instanceMatrix.needsUpdate=true}

    if(window._ringInst){for(let i=0;i<MAX_GREENS;i++){if(i<greens.length&&greens[i].active){const pulse=1+Math.sin(fc*0.08+i)*0.3;dummy.position.set(greens[i].x,roadY(greens[i].z)+0.1,greens[i].z);dummy.scale.setScalar(pulse);dummy.rotation.set(-Math.PI/2,0,fc*0.02+i);dummy.updateMatrix();window._ringInst.setMatrixAt(i,dummy.matrix)}else{dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();window._ringInst.setMatrixAt(i,dummy.matrix)}}window._ringInst.instanceMatrix.needsUpdate=true}

    if(window._obsRingInst){for(let i=0;i<MAX_OBS;i++){if(i<obstacles.length&&obstacles[i].active){dummy.position.set(obstacles[i].x,roadY(obstacles[i].z)+0.1,obstacles[i].z);dummy.scale.setScalar(1+Math.sin(fc*0.1+i)*0.2);dummy.rotation.set(-Math.PI/2,0,fc*0.03);dummy.updateMatrix();window._obsRingInst.setMatrixAt(i,dummy.matrix)}else{dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();window._obsRingInst.setMatrixAt(i,dummy.matrix)}}window._obsRingInst.instanceMatrix.needsUpdate=true}

    for(let i=0;i<powerups.length;i++){powerups[i].y=roadY(powerups[i].z)+2.5+Math.sin(fc*.06+i)*.6}

    for(let i=0;i<obstacles.length;i++){obstacles[i].y=roadY(obstacles[i].z)+.7}



    checkCollisions();



    // Milestone celebration every 100m

    const dist=Math.floor(car.position.z);

    const milestone=Math.floor(dist/100)*100;

    if(milestone>0&&milestone>lastMilestone){lastMilestone=milestone;score+=10;sfxLevelUp();showPopup("🎉 "+milestone+"m!",innerWidth/2,innerHeight/2,"#fbbf24");emitParticles(car.position.x,3,car.position.z,0xfbbf24,15)}



    // Trigger scenario

    // Scenarios disabled for facelift
    // if(car.position.z>=nextScenarioAt)triggerScenario();



    // Dynamic scenery - colors change as you drive

    if(fc%30===0){

      const dist=car.position.z;

      const zone=Math.floor(dist/300)%7;

      const t=(dist%300)/300;

      // Day-night cycle: night→dawn→morning→midday→sunset→dusk→night

      const skyColors=[0x0c1a2e,0x12122e,0x0e1428,0x101830,0x1a1228,0x0e0e24,0x080818];

      const fogColors=[0x0c1a2e,0x12122e,0x0e1428,0x101830,0x1a1228,0x0e0e24,0x080818];

      const edgeColors=[0x22c55e,0xe040fb,0x00e5ff,0xff9100,0xff6b6b,0x40e0d0,0x536dfe];

      const nextZone=(zone+1)%7;

      const sc=_col.setHex(skyColors[zone]);const sn=new THREE.Color(skyColors[nextZone]);sc.lerp(sn,t);

      renderer.setClearColor(sc);

      scene.fog.color.copy(sc);

      // Adjust lighting for day-night cycle

      const ambIntensity=[0.25,0.28,0.3,0.32,0.3,0.28,0.25];

      const dirIntensity=[1.6,1.7,1.8,1.9,1.8,1.7,1.6];

      const aI=ambIntensity[zone]+(ambIntensity[nextZone]-ambIntensity[zone])*t;

      const dI=dirIntensity[zone]+(dirIntensity[nextZone]-dirIntensity[zone])*t;

      ambLight.intensity=aI;dirLight.intensity=dI;

      if(_skyReady){

        const skyIdx=_skyZoneMap[zone];

        if(false&&skyIdx!==_currentSkyIdx&&_skyTextures[skyIdx]){

          skyMat.map=_skyTextures[skyIdx];skyMat.needsUpdate=true;_currentSkyIdx=skyIdx;

        }

      }

      if(window._edgeMat){

        const ec=_col.setHex(edgeColors[zone]);const en=new THREE.Color(edgeColors[nextZone]);ec.lerp(en,t);

        const r=flow/100;

        if(r>.6)window._edgeMat.color.copy(ec);

        else if(r>.3)window._edgeMat.color.setHex(0xfbbf24);

        else window._edgeMat.color.setHex(0xef4444);

      }

    }



    // Flow decay

    if(fc%300===0){flow=Math.max(0,flow-1);if(flow<=0){

      gameActive=false;

      document.getElementById('finalScore').textContent=score;

      document.getElementById('finalGreen').textContent=greenCount;

      document.getElementById('finalRed').textContent=redCount;

    document.getElementById('finalStreak').textContent=bestStreak;

      document.getElementById('finalMsg').textContent='🌊 מד הזרימה התרוקן — ננסה שוב?';

      document.getElementById('finalDist').textContent=Math.floor(car.position.z);document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';mpGameOver();document.getElementById('gameOver').style.display='flex';

    }}

  } else if(scenarioActive&&!_gateActive){

    spd*=.95; // slow down during old popup scenario

  }



  if(window._tlData){const tld=window._tlData;const cycle=Math.floor(fc/120)%3;for(let i=0;i<tld.n;i++){const ph=(cycle+(i%3))%3;dummy.scale.setScalar(ph===0?1:.3);dummy.position.set(tld.positions[i].x,roadY(tld.positions[i].z)+4.55,tld.positions[i].z);dummy.rotation.set(0,0,0);dummy.updateMatrix();tld.redInst.setMatrixAt(i,dummy.matrix);dummy.scale.setScalar(ph===1?1:.3);dummy.position.set(tld.positions[i].x,roadY(tld.positions[i].z)+4.2,tld.positions[i].z);dummy.updateMatrix();tld.yelInst.setMatrixAt(i,dummy.matrix);dummy.scale.setScalar(ph===2?1:.3);dummy.position.set(tld.positions[i].x,roadY(tld.positions[i].z)+3.85,tld.positions[i].z);dummy.updateMatrix();tld.grnInst.setMatrixAt(i,dummy.matrix)}tld.redInst.instanceMatrix.needsUpdate=true;tld.yelInst.instanceMatrix.needsUpdate=true;tld.grnInst.instanceMatrix.needsUpdate=true}

if(window._blnData){const bd=window._blnData;for(let i=0;i<bd.n;i++){const b=bd.data[i];dummy.position.set(b.x+Math.sin(fc*.008+b.phase)*2,b.baseY+Math.sin(fc*b.spd+b.phase)*3,b.z);dummy.scale.setScalar(.8+Math.sin(fc*.01+b.phase)*.2);dummy.rotation.set(0,fc*.005,0);dummy.updateMatrix();bd.inst.setMatrixAt(i,dummy.matrix)}bd.inst.instanceMatrix.needsUpdate=true}





  // Oncoming traffic update

  if(window._oncData){

    const od=window._oncData;

    let activeCount=0;

    for(let i=0;i<od.n;i++){

      const o=od.data[i];

      if(o.active){

        activeCount++;

        o.z-=o.spd;

        if(o.z<car.position.z-40){o.active=false;}

        dummy.position.set(o.x,roadY(o.z)+0.6,o.z);dummy.scale.setScalar(1);dummy.rotation.set(0,Math.PI,0);dummy.updateMatrix();

        od.bodyInst.setMatrixAt(i,dummy.matrix);

        dummy.position.set(o.x,roadY(o.z)+1.15,o.z);dummy.updateMatrix();od.roofInst.setMatrixAt(i,dummy.matrix);

        dummy.position.set(o.x-0.5,0.6,o.z+1.6);dummy.scale.setScalar(1.2);dummy.updateMatrix();od.lightInst.setMatrixAt(i*2,dummy.matrix);

        dummy.position.set(o.x+0.5,0.6,o.z+1.6);dummy.updateMatrix();od.lightInst.setMatrixAt(i*2+1,dummy.matrix);

        if(o.z-car.position.z<25&&o.z>car.position.z){const _pr=_v.set(o.x,2,o.z).project(cam);if(_pr.z<1)showPopup('⚠️',((_pr.x*.5+.5)*innerWidth),((-_pr.y*.5+.5)*innerHeight),'#ffcc00')}

        if(Math.abs(car.position.x-o.x)<1.8&&Math.abs(car.position.z-o.z)<2.5){

          if(shieldTimer>0){shieldTimer=0;emitParticles(o.x,1,o.z,0x60a5fa,8);o.active=false;}

          else{lives=Math.max(0,lives-1);flow=Math.max(0,flow-8);spd*=0.2;sfxRed();screenFlash("flash-red");emitParticles(o.x,1,o.z,0xff4444,12);o.active=false;

            if(lives<=0){gameActive=false;document.getElementById('finalScore').textContent=score;document.getElementById('finalGreen').textContent=greenCount;document.getElementById('finalRed').textContent=redCount;document.getElementById('finalStreak').textContent=bestStreak;document.getElementById('finalMsg').textContent='😢 כל החברים עזבו... ננסה שוב?';document.getElementById('finalDist').textContent=Math.floor(car.position.z);document.getElementById('finalStars').textContent=greenCount>redCount*2?'⭐⭐⭐':greenCount>redCount?'⭐⭐':'⭐';mpGameOver();document.getElementById('gameOver').style.display='flex';return;}

          }

        }

      } else {

        dummy.position.set(0,-100,0);dummy.scale.setScalar(0);dummy.updateMatrix();

        od.bodyInst.setMatrixAt(i,dummy.matrix);od.roofInst.setMatrixAt(i,dummy.matrix);

        od.lightInst.setMatrixAt(i*2,dummy.matrix);od.lightInst.setMatrixAt(i*2+1,dummy.matrix);

      }

    }

    if(false&&fc%90===0&&activeCount<4){

      for(let i=0;i<od.n;i++){if(!od.data[i].active){od.data[i].active=true;od.data[i].z=car.position.z+60+Math.random()*30;od.data[i].x=roadX(od.data[i].z)-3.5+Math.random()*1.5;od.data[i].spd=0.08+Math.random()*0.1;break;}}

    }

    od.bodyInst.instanceMatrix.needsUpdate=true;od.roofInst.instanceMatrix.needsUpdate=true;od.lightInst.instanceMatrix.needsUpdate=true;

  }













  // Cross traffic update

  if(window._ctData){

    const ct=window._ctData;

    let activeCount=0;

    for(let i=0;i<ct.n;i++){

      const c=ct.data[i];

      if(c.active){

        activeCount++;

        c.x+=c.spd*c.dir;

        if(Math.abs(c.x)>25){c.active=false;}

        dummy.position.set(c.x,0.4,c.crossZ);

        dummy.scale.setScalar(1);

        dummy.rotation.set(0,Math.PI/2,0);

        dummy.updateMatrix();

        ct.bodyInst.setMatrixAt(i,dummy.matrix);

        dummy.position.set(c.x,0.75,c.crossZ);

        dummy.updateMatrix();

        ct.roofInst.setMatrixAt(i,dummy.matrix);

        if(Math.abs(car.position.x-c.x)<1.8&&Math.abs(car.position.z-c.crossZ)<1.5){

          if(shieldTimer>0){shieldTimer=0;emitParticles(c.x,1,c.crossZ,0x60a5fa,8);c.active=false;}

          else{lives=Math.max(0,lives-1);flow=Math.max(0,flow-8);spd*=0.2;sfxRed();screenFlash("flash-red");emitParticles(c.x,1,c.crossZ,0xff4444,12);c.active=false;}

        }

      } else {

        dummy.position.set(0,-100,0);

        dummy.scale.setScalar(0);

        dummy.updateMatrix();

        ct.bodyInst.setMatrixAt(i,dummy.matrix);

        ct.roofInst.setMatrixAt(i,dummy.matrix);

      }

    }

    if(false&&fc%150===0&&activeCount<3){

      const nextCrossZ=Math.ceil(car.position.z/80)*80+50;

      if(Math.abs(car.position.z-nextCrossZ)<60){

        for(let i=0;i<ct.n;i++){

          if(!ct.data[i].active){

            ct.data[i].active=true;

            ct.data[i].crossZ=nextCrossZ;

            ct.data[i].dir=Math.random()>0.5?1:-1;

            ct.data[i].x=-20*ct.data[i].dir;

            ct.data[i].spd=0.15+Math.random()*0.1;

            break;

          }

        }

      }

    }

    ct.bodyInst.instanceMatrix.needsUpdate=true;

    ct.roofInst.instanceMatrix.needsUpdate=true;

  }





  // Engine sound pitch

  if(window._engineAudio){

    const ea=window._engineAudio;

    const _rpm=65+spd*500;ea.osc.frequency.value=_rpm;if(ea.osc2){ea.osc2.frequency.value=_rpm*2;ea.gain2.gain.value=Math.min(0.03,spd*0.1)*_masterVol}

    ea.gain.gain.value=Math.min(0.055,spd*0.18)*_masterVol;

  }



  // Update curve markers around car

  if(window._cmarkData){

    const cm=window._cmarkData;

    const baseZ=Math.floor(car.position.z/30)*30-30*10;

    for(let i=0;i<cm.n;i++){

      const z=baseZ+i*30;

      const curve=roadX(z);

      dummy.position.set(-5+curve,0.02,z);

      dummy.scale.setScalar(1);

      dummy.rotation.set(-Math.PI/2,0,0);

      dummy.updateMatrix();

      cm.lInst.setMatrixAt(i,dummy.matrix);

      dummy.position.set(5+curve,0.02,z);

      dummy.updateMatrix();

      cm.rInst.setMatrixAt(i,dummy.matrix);

    }

    cm.lInst.instanceMatrix.needsUpdate=true;

    cm.rInst.instanceMatrix.needsUpdate=true;

  }



  // Pedestrian walking

  if(window._pedData){

    const pd=window._pedData;

    for(let i=0;i<pd.n;i++){

      const p=pd.data[i];

      p.z+=p.spd*p.dir;

      const bob=Math.sin(fc*0.1+p.phase)*0.05;

      dummy.position.set(p.x,roadY(p.z)+0.5+bob,p.z);

      dummy.scale.setScalar(1);

      dummy.rotation.set(0,p.dir>0?0:Math.PI,0);

      dummy.updateMatrix();

      pd.bodyInst.setMatrixAt(i,dummy.matrix);

      dummy.position.set(p.x,roadY(p.z)+1.1+bob,p.z);

      dummy.updateMatrix();

      pd.headInst.setMatrixAt(i,dummy.matrix);

    }

    pd.bodyInst.instanceMatrix.needsUpdate=true;

    pd.headInst.instanceMatrix.needsUpdate=true;

  }



  // Shop lights pulse

  if(window._shopData){

    const shd=window._shopData;

    for(let i=0;i<shd.n;i++){

      const side=i%2===0?-8.5:8.5;

      const z=50+i*80;

      const pulse=0.6+Math.sin(fc*0.03+i*1.7)*0.4;

      dummy.position.set(side,roadY(z)+3.5,z);

      dummy.scale.setScalar(pulse);

      dummy.rotation.set(0,0,0);

      dummy.updateMatrix();

      shd.lightInst.setMatrixAt(i,dummy.matrix);

    }

    shd.lightInst.instanceMatrix.needsUpdate=true;

  }



  // Star twinkling

  if(window._starData){

    const sd=window._starData;

    for(let i=0;i<sd.n;i++){

      const st=sd.data[i];

      const twinkle=0.3+Math.abs(Math.sin(fc*st.twinkleSpd+st.phase))*0.9;

      dummy.position.set(st.x,st.y,st.z);

      dummy.scale.setScalar(twinkle);

      dummy.rotation.set(0,0,0);

      dummy.updateMatrix();

      sd.inst.setMatrixAt(i,dummy.matrix);

    }

    sd.inst.instanceMatrix.needsUpdate=true;

  }



  // Tunnel lights flicker

  if(window._tunnelData){

    const td=window._tunnelData;

    for(let i=0;i<td.n;i++){

      for(let j=0;j<td.lpt;j++){

        const idx=i*td.lpt+j;

        const flicker=0.7+Math.sin(fc*0.1+idx*2.1)*0.3;

        dummy.position.set(0,4.7,td.positions[i]-8+j*5.3);

        dummy.scale.setScalar(flicker);

        dummy.rotation.set(0,0,0);

        dummy.updateMatrix();

        td.lights.setMatrixAt(idx,dummy.matrix);

      }

    }

    td.lights.instanceMatrix.needsUpdate=true;

  }



  updateClouds();updateInstances(greens,greenInst,MAX_GREENS,true);

  updateInstances(obstacles,obsInst,MAX_OBS,false);updateInstances(powerups,powerupInst,MAX_POWERUPS,true);

  updateParticles();fadeTireMarks();
    // Traffic light cycling
    if(fc%180===0&&window._tlData){var _tld=window._tlData;for(var _ti3=0;_ti3<_tld.n;_ti3++){var _phase=(_ti3+Math.floor(fc/180))%3;_tld.redInst.setColorAt(_ti3,_col.setRGB(_phase===0?1:0.1,0,0));_tld.yelInst.setColorAt(_ti3,_col.setRGB(_phase===1?1:0.1,_phase===1?0.8:0.08,0));_tld.grnInst.setColorAt(_ti3,_col.setRGB(0,_phase===2?1:0.1,0))}_tld.redInst.instanceColor.needsUpdate=true;_tld.yelInst.instanceColor.needsUpdate=true;_tld.grnInst.instanceColor.needsUpdate=true}
    // Animate city lights (subtle window flicker)
    if(fc%120===0&&window._winInst){var _fi=Math.floor(Math.random()*Math.min(400,window._winInst.count));for(var _fj=0;_fj<3&&_fi+_fj<window._winInst.count;_fj++){var _fv=0.5+Math.random()*0.5;window._winInst.instanceColor.setXYZ(_fi+_fj,_fv*1,_fv*0.87,_fv*0.33);window._winInst.instanceColor.needsUpdate=true}}

  if(fc%6===0){updateHUD();const pi=document.getElementById('powerIndicator');

    if(shieldTimer>0){pi.style.display='flex';pi.style.borderColor='rgba(96,165,250,.6)';pi.style.boxShadow='0 0 '+(10+Math.sin(fc*.1)*5)+'px rgba(96,165,250,.4)';document.getElementById('powerIcon').innerHTML='&#128737;';document.getElementById('powerTimer').textContent=Math.ceil(shieldTimer/60)+'s';

      const si=document.getElementById('shieldInd');if(si){si.style.display='block';si.textContent='🛡️ מגן '+Math.ceil(shieldTimer/60)+'s'}}

    else if(turboTimer>0){pi.style.display='flex';pi.style.borderColor='rgba(251,191,36,.6)';pi.style.boxShadow='0 0 '+(10+Math.sin(fc*.1)*5)+'px rgba(251,191,36,.4)';document.getElementById('powerIcon').innerHTML='&#9889;';document.getElementById('powerTimer').textContent=Math.ceil(turboTimer/60)+'s';

      const ti=document.getElementById('turboInd');if(ti){ti.style.display='block';ti.textContent='⚡ טורבו '+Math.ceil(turboTimer/60)+'s'}}

    else{pi.style.display='none';pi.style.boxShadow='';const si=document.getElementById('shieldInd');if(si)si.style.display='none';const ti=document.getElementById('turboInd');if(ti)ti.style.display='none'}

    if(window._edgeMat){const fc2=flow/100;window._edgeMat.color.setRGB(1-fc2,fc2,.2)}}



  // Camera - stays behind car on road, never swings into buildings

  const _cz=car.position.z;

  const _camDist=8+spd*5;// pull back at speed (closer)

  const _camHeight=3.5+spd*2.5;// rise at speed (lower)

  const _behindZ=_cz-_camDist;

  const _camRoadX=roadX(_behindZ);

  const _carOffsetX=car.position.x-roadX(_cz);

  const _camX=_camRoadX+_carOffsetX*0.5;

  const _hillCamY=roadY(_behindZ);

  const _lookAheadZ=_cz+15+spd*10;// look further at speed

  // Speed shake

  const _shakeAmt=spd>0.35?((spd-0.35)*0.03):0;

  const _shakeX=_shakeAmt*(Math.sin(fc*7.3)*.4+Math.sin(fc*13.1)*.2);

  const _shakeY=_shakeAmt*(Math.sin(fc*9.7)*.2+Math.sin(fc*11.3)*.15);

  _cv.set(_camX+_shakeX,_hillCamY+_camHeight+cPh*4+_shakeY,_behindZ);

  cam.position.lerp(_cv,.08);

  _ct.set(roadX(_lookAheadZ),roadY(_lookAheadZ)+0.5,_lookAheadZ);cam.lookAt(_ct);

  // Dynamic FOV - widens at high speed

  let _targetFov=68+spd*25;if(_gateActive){const gd=_gateZ-car.position.z;if(gd>0&&gd<40)_targetFov=Math.max(55,_targetFov-((40-gd)/40)*15)}

  cam.fov+=((_targetFov-cam.fov)*.06);

  cam.updateProjectionMatrix();



  // Minimap render

  if(gameActive){

    const mc=document.getElementById('minimapCanvas');

    if(mc){

      const ctx=mc.getContext('2d');

      ctx.clearRect(0,0,120,120);

      ctx.fillStyle='rgba(6,15,30,0.95)';

      ctx.beginPath();ctx.arc(60,60,60,0,Math.PI*2);ctx.fill();

      const scale=0.8;

      const cx=60,cy=75;

      // Road curve

      ctx.strokeStyle='#2a4050';ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();

      for(let dz=-60;dz<60;dz+=5){const rz=car.position.z+dz/scale;const rx=(roadX(rz)-car.position.x)*scale;ctx.lineTo(cx+rx,cy-dz)}ctx.stroke();

      // Road center line

      ctx.strokeStyle='#3a5a6a';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();

      for(let dz=-60;dz<60;dz+=5){const rz=car.position.z+dz/scale;const rx=(roadX(rz)-car.position.x)*scale;ctx.lineTo(cx+rx,cy-dz)}ctx.stroke();ctx.setLineDash([]);

      // Car (arrow)

      ctx.fillStyle='#4ade80';ctx.shadowColor='#4ade80';ctx.shadowBlur=6;

      ctx.beginPath();ctx.moveTo(cx,cy-6);ctx.lineTo(cx-4,cy+4);ctx.lineTo(cx+4,cy+4);ctx.closePath();ctx.fill();ctx.shadowBlur=0;

      // Greens

      ctx.fillStyle='#55ff77';

      for(let i=0;i<greens.length;i++){

        const g=greens[i];if(!g.active)continue;

        const dx=(g.x-car.position.x)*scale;

        const dz=(g.z-car.position.z)*scale;

        if(Math.abs(dz)<60&&Math.abs(dx)<60){

          ctx.beginPath();ctx.arc(cx+dx,cy-dz,3,0,Math.PI*2);ctx.fill();

        }

      }

      // Obstacles

      ctx.fillStyle='#ff4444';

      for(let i=0;i<obstacles.length;i++){

        const o=obstacles[i];if(!o.active)continue;

        const dx=(o.x-car.position.x)*scale;

        const dz=(o.z-car.position.z)*scale;

        if(Math.abs(dz)<60&&Math.abs(dx)<60){

          ctx.fillRect(cx+dx-3,cy-dz-3,6,6);

        }

      }

      // Powerups

      ctx.fillStyle='#fbbf24';

      for(let i=0;i<powerups.length;i++){

        const p=powerups[i];if(!p.active)continue;

        const dx=(p.x-car.position.x)*scale;

        const dz=(p.z-car.position.z)*scale;

        if(Math.abs(dz)<60&&Math.abs(dx)<60){

          ctx.beginPath();ctx.moveTo(cx+dx,cy-dz-4);ctx.lineTo(cx+dx+3,cy-dz);ctx.lineTo(cx+dx,cy-dz+4);ctx.lineTo(cx+dx-3,cy-dz);ctx.fill();

        }

      }

    }

  }



  // Multiplayer sync

  if(isMultiplayer){

    if(fc%3===0)mpSend();

    if(opData.gameActive){

      opCar.visible=true;

      opCar.position.x+=(opData.x-opCar.position.x)*.12;

      opCar.position.z+=(opData.z-opCar.position.z)*.12;

      opCar.position.y=roadY(opCar.position.z);

      opCar.rotation.y=opData.dir;

    } else if(!gameActive){

      opCar.visible=false;

    }

    if(fc%10===0){

      document.getElementById('opScore').textContent=opData.score;

      document.getElementById('opFlow').textContent=Math.round(opData.flow)+'%';

      document.getElementById('opLevel').textContent=opData.level;

      var dist=Math.round(opData.z-car.position.z);

      var distEl=document.getElementById('opDist');

      if(dist>5)distEl.textContent='⬆️ '+dist+'מ לפניך';

      else if(dist<-5)distEl.textContent='⬇️ '+(-dist)+'מ אחריך';

      else distEl.textContent='🤝 צמוד!';

    }

  }



  // Animate green arrows - float & spin

  if(window._arrowData&&fc%2===0){const ad=window._arrowData;const t=performance.now()*.001;for(let i=0;i<ad.n;i++){const p=ad.positions[i];dummy.position.set(p.x,p.y+Math.sin(t*2+i)*0.4,p.z);dummy.rotation.set(0,t*1.5+i,p.side*Math.PI/2);dummy.scale.setScalar(0.9+Math.sin(t*3+i)*0.15);dummy.updateMatrix();ad.inst.setMatrixAt(i,dummy.matrix)}ad.inst.instanceMatrix.needsUpdate=true}



  renderer.render(scene,cam);

}

animate();

// Dismiss loading screen

{const _lf=document.getElementById('loadFill');if(_lf)_lf.style.width='100%';

const _ls=document.getElementById('loadScreen');if(_ls)setTimeout(()=>{_ls.classList.add('done');setTimeout(()=>_ls.remove(),600)},400)}



addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);if(typeof composer!=='undefined')composer.setSize(innerWidth,innerHeight);if(typeof fxaaPass!=='undefined')fxaaPass.uniforms['resolution'].value.set(1/innerWidth,1/innerHeight)});

