'use strict';
const message=document.querySelector('#demo-message');let messageTimer;
function say(text){message.textContent=text;message.classList.add('show');clearTimeout(messageTimer);messageTimer=setTimeout(()=>message.classList.remove('show'),2600);}
const found=new Set();
document.querySelectorAll('[data-pin]').forEach(pin=>pin.addEventListener('click',()=>{found.add(pin.dataset.pin);pin.classList.add('done');pin.textContent='✓';document.querySelector('#map-progress').textContent=found.size+' / 4 발견';const card=document.querySelector('#map-note');card.classList.remove('in');void card.offsetWidth;card.classList.add('in');card.replaceChildren();const title=document.createElement('strong');title.textContent=pin.dataset.pin;const p=document.createElement('p');p.textContent='표식에서 질문 카드가 열렸어요. 실제 앱에서는 이곳에서 답변을 쓰고 허브로 돌아옵니다.';card.append(title,p);}));
let drag=null;
document.querySelectorAll('.mini-handle').forEach(handle=>handle.addEventListener('pointerdown',e=>{e.preventDefault();const note=handle.closest('.mini-note');note.classList.add('dragging');drag={note,pointer:e.pointerId,x:e.clientX,y:e.clientY,left:parseFloat(note.style.left),top:parseFloat(note.style.top)};handle.setPointerCapture(e.pointerId);}));
document.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer)return;const area=document.querySelector('#mini-canvas');drag.note.style.left=Math.max(0,Math.min(area.clientWidth-drag.note.offsetWidth,drag.left+e.clientX-drag.x))+'px';drag.note.style.top=Math.max(0,Math.min(area.clientHeight-drag.note.offsetHeight,drag.top+e.clientY-drag.y))+'px';});
function release(e){if(!drag||e.pointerId!==drag.pointer)return;drag.note.classList.remove('dragging');drag=null;}
document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);
document.querySelector('#mini-arrange').addEventListener('click',()=>{document.querySelectorAll('.mini-note').forEach((n,i)=>{n.style.left=(i?110:9)+'px';n.style.top=(i?115:12)+'px';n.style.transform='rotate(0deg)';});say('자동 정리: 카드가 부드럽게 제자리로 이동합니다.');});
document.querySelector('#mini-sticker').addEventListener('click',()=>{const seal=document.querySelector('.sample-seal');seal.classList.remove('pop');void seal.offsetWidth;seal.classList.add('pop');seal.style.transform=`rotate(${Math.random()*30-15}deg)`;say('스티커가 종이에 붙는 짧은 착지 효과');});
let stamps=0;
document.querySelector('#stamp-add').addEventListener('click',()=>{if(stamps>=5){say('다섯 장면을 모두 모았어요. 실제 앱에서는 보고서로 이어집니다.');return;}document.querySelectorAll('.stamp-empty')[stamps].classList.add('collected');stamps++;document.querySelector('#stamp-progress').textContent=stamps+' / 5 장면';});
document.querySelector('#stamp-reset').addEventListener('click',()=>{stamps=0;document.querySelectorAll('.stamp-empty').forEach(el=>el.classList.remove('collected'));document.querySelector('#stamp-progress').textContent='0 / 5 장면';});
