import {test,expect} from '@playwright/test';
test.beforeEach(async({page})=>{await page.goto('/');await page.waitForFunction(()=>[...document.images].every(i=>i.complete));});
const key=async(page,text)=>{for(const k of text)await page.keyboard.press(k);};
const display=page=>page.locator('#display');
test('leading zeros are replaced for mouse and keyboard input',async({page})=>{
  await page.getByRole('button',{name:'0',exact:true}).click();
  await page.getByRole('button',{name:'5',exact:true}).click();
  await expect(display(page)).toHaveText('5');
  await key(page,'+007');await expect(display(page)).toHaveText('5+7');
  await page.keyboard.press('Escape');await key(page,'0.05+10');await expect(display(page)).toHaveText('0,05+10');
  await page.keyboard.press('Enter');await expect(display(page)).toHaveText('10,05');
});
test('typed digits are immediately visible without a reveal animation',async({page})=>{
  await page.keyboard.press('7');
  const state=await display(page).evaluate(el=>({text:el.textContent,opacity:getComputedStyle(el.firstElementChild).opacity,animations:el.getAnimations({subtree:true}).length}));
  expect(state).toEqual({text:'7',opacity:'1',animations:0});
});
test('empty initial state and local assets',async({page})=>{await expect(display(page)).toHaveText('');expect(await page.locator('img').evaluateAll(images=>images.every(i=>i.naturalWidth>0))).toBe(true);});
test('mouse and keyboard arithmetic parity',async({page})=>{
  await page.getByRole('button',{name:'2',exact:true}).click();await page.getByRole('button',{name:'Plus',exact:true}).click();await key(page,'3*4');await page.keyboard.press('Enter');await expect(display(page)).toHaveText('14');
  await page.keyboard.press('Escape');await key(page,'(2+3)*4');await page.keyboard.press('Enter');await expect(display(page)).toHaveText('20');
});
test('decimal comma, negation, nested parentheses',async({page})=>{
  await key(page,'0.1+0,2');await page.keyboard.press('Enter');await expect(display(page)).toHaveText('0,3');await page.keyboard.press('Escape');
  await key(page,'25+12');await page.getByRole('button',{name:'Vorzeichen wechseln'}).click();await expect(display(page)).toHaveText('25+(−12)');await page.keyboard.press('Enter');await expect(display(page)).toHaveText('13');
});
test('result continuation and fresh digit',async({page})=>{await key(page,'1/3');await page.keyboard.press('Enter');await expect(display(page)).not.toHaveText('1÷3');await key(page,'*3');await page.keyboard.press('Enter');await expect(display(page)).toHaveText('1');await page.keyboard.press('7');await expect(display(page)).toHaveText('7');});
test('hidden smoke count reverses without lost input',async({page})=>{await key(page,'123456789012');await expect(display(page)).toHaveText('456789012');await expect(page.locator('#orb')).toHaveAttribute('data-hidden','3');await page.keyboard.press('Backspace');await expect(display(page)).toHaveText('345678901');await expect(page.locator('#orb')).toHaveAttribute('data-hidden','2');});
test('repeated equals does not restart result vision',async({page})=>{await key(page,'2+2');await page.keyboard.press('Enter');await page.waitForTimeout(700);await page.keyboard.press('Enter');await expect(display(page)).toHaveText('4',{timeout:800});});
for(const delay of [80,700,1200])test('C cancels result at '+delay+'ms',async({page})=>{await key(page,'2+3');await page.keyboard.press('Enter');await page.waitForTimeout(delay);await page.keyboard.press('Escape');await expect(display(page)).toHaveText('');await page.waitForTimeout(1500);await expect(display(page)).toHaveText('');await key(page,'8');await expect(display(page)).toHaveText('8');});
for(const delay of [120,1100,2500])test('C cancels wizard and audio at '+delay+'ms',async({page})=>{await key(page,'5/(3-3)');await page.keyboard.press('Enter');await page.waitForTimeout(delay);await page.keyboard.press('Escape');await expect(page.locator('#wizard')).toHaveCSS('opacity','0');await expect(display(page)).toHaveText('');await key(page,'9');await page.waitForTimeout(1300);await expect(display(page)).toHaveText('9');});
test('wizard changes facial frames and returns to idle',async({page})=>{await key(page,'5/0');await page.keyboard.press('Enter');await page.waitForTimeout(1000);await expect(page.locator('#wizard')).not.toHaveCSS('opacity','0');const first=await page.locator('#wizard').evaluate(e=>e.style.backgroundPosition);await page.waitForTimeout(150);const second=await page.locator('#wizard').evaluate(e=>e.style.backgroundPosition);expect(first).not.toEqual(second);await expect(page.locator('#artifact')).toHaveAttribute('data-state','idle',{timeout:3500});await expect(display(page)).toHaveText('');});
test('sound persists across reload and keyboard toggles candle',async({page})=>{const candle=page.locator('#candle');await candle.click();await expect(candle).toHaveAttribute('aria-pressed','false');await page.reload();await expect(candle).toHaveAttribute('aria-pressed','false');await candle.focus();await page.keyboard.press('Enter');await expect(candle).toHaveAttribute('aria-pressed','true');});
test('geometry: symmetry, no hit overlap, viewport bounds, centered display',async({page})=>{
  await key(page,'123+456');
  const geometry=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
    return{controls:[...document.querySelectorAll('.sphere')].map(e=>({action:e.dataset.action,...rect(e)})),orb:rect(document.querySelector('#orb')),display:rect(document.querySelector('#display')),w:innerWidth,h:innerHeight};
  });
  const {controls,orb}=geometry;
  for(const c of controls){expect(c.x).toBeGreaterThanOrEqual(0);expect(c.y).toBeGreaterThanOrEqual(0);expect(c.x+c.w).toBeLessThanOrEqual(geometry.w);expect(c.y+c.h).toBeLessThanOrEqual(geometry.h);}
  for(let i=0;i<10;i++){const a=controls[i],b=controls[9-i];expect(Math.abs(a.y-b.y)).toBeLessThan(.1);expect(Math.abs((a.x+a.w/2+b.x+b.w/2)/2-(orb.x+orb.w/2))).toBeLessThan(.1);}
  for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];const distance=Math.hypot(a.x+a.w/2-b.x-b.w/2,a.y+a.h/2-b.y-b.h/2);expect(distance).toBeGreaterThanOrEqual((a.w+b.w)/2-.1);}
  expect(Math.abs(geometry.display.y+geometry.display.h/2-orb.y-orb.h/2)).toBeLessThan(.1);
});
test('no runtime errors during rapid interruptions',async({page})=>{const errors=[];page.on('pageerror',e=>errors.push(e.message));for(let i=0;i<12;i++){await key(page,'2+2');await page.keyboard.press('Enter');await page.keyboard.press('Escape');await key(page,'5/0');await page.keyboard.press('Enter');await page.keyboard.press('Escape');}expect(errors).toEqual([]);});
