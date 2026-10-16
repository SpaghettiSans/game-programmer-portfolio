import { validateContent } from '../data/validate-content.mjs';
import { normalizeContent } from '../data/normalize-content.mjs';
import type { PortfolioContent, Project } from '../data/portfolio';

const root = document.querySelector<HTMLElement>('[data-editor]')!;
const initial: PortfolioContent = JSON.parse(root.dataset.initial!);
const key = 'sandee-portfolio-editor-v1';
const fingerprint = (value: unknown): string => JSON.stringify(value);
const baseline = fingerprint(initial);
let data: PortfolioContent = structuredClone(initial);
let stale = false;
const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const alert = byId('editor-alert');
function message(text: string) { alert.textContent = text; alert.hidden = !text; }
try {
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved?.data) {
    // If the draft is now published, start from that published version.
    if (fingerprint(saved.data) !== baseline) {
      data = saved.data;
      stale = saved.base !== baseline;
      if (stale) message('The live content has changed since this draft started. Download your draft as a backup, then reset to the current content before publishing.');
    }
  }
} catch { message('Your saved draft could not be loaded. Starting with the published content.'); }
data = normalizeContent(data);
function save() {
  data.projects.forEach((project,index) => project.number = String(index + 1).padStart(2,'0'));
  try {
    localStorage.setItem(key,JSON.stringify({base: stale ? 'outdated' : baseline,data}));
    byId('save-status').textContent = fingerprint(data) === baseline ? 'Published content loaded · no changes' : 'Draft saved in this browser · not published yet';
  } catch { byId('save-status').textContent = 'Browser storage unavailable. Download a backup to keep your changes.'; }
}
type Spec = [string,string,string?,string?];
function field(target: Record<string, any>, [name,label,kind='text',hint='']: Spec, after?: () => void) {
  const wrap = document.createElement('label'); wrap.className = 'editor-field';
  const caption = document.createElement('span'); caption.textContent = label; wrap.append(caption);
  let input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  if (kind.includes('|')) {
    input = document.createElement('select');
    kind.split('|').forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; input.append(option); });
  } else if (['long','lines','nullable-long'].includes(kind)) {
    input = document.createElement('textarea'); input.rows = 4; wrap.classList.add('wide');
  } else {
    input = document.createElement('input'); input.type = kind === 'check' ? 'checkbox' : kind === 'email' ? 'email' : 'text';
  }
  if (kind === 'check') { (input as HTMLInputElement).checked = Boolean(target[name]); wrap.classList.add('check'); }
  else input.value = kind === 'lines' ? target[name].join('\n') : target[name] ?? '';
  input.addEventListener('input',() => {
    target[name] = kind === 'check' ? (input as HTMLInputElement).checked : kind === 'lines' ? input.value.split('\n').map(x=>x.trim()).filter(Boolean) : ['nullable','nullable-long','email'].includes(kind) ? input.value || null : input.value;
    after?.(); save();
  });
  wrap.append(input);
  if(hint) { const help=document.createElement('small'); help.textContent=hint;wrap.append(help); }
  return wrap;
}
function button(text: string, action: () => void, disabled = false) {
  const b=document.createElement('button');b.type='button';b.className='editor-small';b.textContent=text;b.disabled=disabled;b.addEventListener('click',action);return b;
}
function card(title: string, open: boolean) {
  const box=document.createElement('details');box.className='editor-card';box.open=open;
  const summary=document.createElement('summary');summary.textContent=title;box.append(summary);
  const body=document.createElement('div');body.className='editor-card-body';box.append(body);
  return {box,summary,body};
}
function fields(parent: HTMLElement, target: Record<string, any>, specs: Spec[], after?: () => void) {
  const grid=document.createElement('div');grid.className='field-grid';specs.forEach(spec=>grid.append(field(target,spec,after)));parent.append(grid);
}
const projectBasics: Spec[] = [
  ['title','Project title'],['slug','Page address','text','Use a unique address such as my-first-game. Changing it changes the project URL.'],
  ['category','Category'],['description','Short description','long'],['sample','Mark as sample content','check'],
  ['role','Your role'],['engine','Engine'],['language','Programming language'],['type','Project type'],['team','Team size'],['duration','Duration'],
  ['media','Homepage card preview URL (optional)','nullable'],['mediaType','Media type','image|video'],['mediaAlt','Media description'],['theme','Placeholder style','terrain|logic|tools'],
];
const projectDetails: Spec[] = [
  ['contributions','Technical Contributions','lines','One contribution per line. Describe what you personally built.'],
  ['challengesTakeaways','Challenges & Takeaways','long','Write about a challenge, how you handled it, and what you learned. Use blank lines between paragraphs.'],
];
const projectLinks: Spec[] = [
  ['play','Playable build URL','nullable'],['source','Source repository URL','nullable'],['trailer','Trailer URL','nullable'],['documentation','Documentation URL','nullable'],
];
function renderShowcase(parent: HTMLElement, project: Project) {
  const box = document.createElement('fieldset');
  const legend = document.createElement('legend');legend.textContent = 'Showcase';box.append(legend);
  const help = document.createElement('p');help.textContent = 'Images appear at the bottom of the project page in this order. Add a screenshot, gameplay clip, or diagram.';box.append(help);
  const items = document.createElement('div');
  const renderItems = () => {
    items.replaceChildren();
    project.showcase!.forEach((item,index) => {
      const {box: cardBox, body}=card(`Showcase item ${index + 1}`,true);
      const actions=document.createElement('div');actions.className='editor-actions';
      const move=(delta:number)=>{const list=project.showcase!;[list[index],list[index+delta]]=[list[index+delta],list[index]];save();renderItems();};
      actions.append(button('Move up',()=>move(-1),index===0),button('Move down',()=>move(1),index===project.showcase!.length-1),button('Remove media',()=>{
        if(confirm('Remove this showcase item from your draft?')){project.showcase!.splice(index,1);save();renderItems();}
      }));body.append(actions);
      fields(body,item,[['src','Image or video file URL','text','Use a full https:// URL or /game-programmer-portfolio/filename.webp.'],['type','Media type','image|video'],['alt','Image / video description','text','Describe what the screenshot or clip shows.'],['caption','Caption (optional)'],['captions','Video captions URL (.vtt, optional)','nullable'],['transcript','Video transcript (optional)','nullable-long']]);
      items.append(cardBox);
    });
  };
  box.append(items);
  box.append(button('＋ Add showcase media',()=>{
    if(project.showcase!.length>=30)return message('You can add up to 30 showcase items per project.');
    project.showcase!.push({src:'',type:'image',alt:'',caption:'',captions:null,transcript:null});save();renderItems();items.lastElementChild?.querySelector('input')?.focus();
  }));renderItems();parent.append(box);
}
function renderProjects(openIndex = -1) {
  const list=byId('project-list');list.replaceChildren();
  if(!data.projects.length) { const p=document.createElement('p');p.className='editor-empty';p.textContent='No projects yet. Add your first project above.';list.append(p); }
  data.projects.forEach((p,index) => {
    const {box,summary,body}=card(`${index+1}. ${p.title || 'Untitled project'}`,index===openIndex);
    const actions=document.createElement('div');actions.className='editor-actions';
    const move=(delta:number)=>{[data.projects[index],data.projects[index+delta]]=[data.projects[index+delta],data.projects[index]];save();renderProjects(index+delta);};
    actions.append(button('Move up',()=>move(-1),index===0),button('Move down',()=>move(1),index===data.projects.length-1),button('Remove project',()=>{
      if(confirm(`Remove “${p.title}” from your draft? Your live site stays unchanged until you publish.`)){data.projects.splice(index,1);save();renderProjects();byId('add-project').focus();}
    }));body.append(actions);
    fields(body,p,projectBasics,()=>summary.textContent=`${index+1}. ${p.title || 'Untitled project'}`);
    const more=document.createElement('details');more.className='editor-card';const heading=document.createElement('summary');heading.textContent='Contributions, takeaways & showcase';more.append(heading);
    const detailsBody=document.createElement('div');detailsBody.className='editor-card-body';fields(detailsBody,p,projectDetails);renderShowcase(detailsBody,p);fields(detailsBody,p,projectLinks);more.append(detailsBody);body.append(more);list.append(box);
  });
}
function renderProfile() {
  const holder=byId('profile-fields');holder.replaceChildren();
  const specs: Spec[] = [
    ['name','Your name'],['headline','Headline'],['intro','Short introduction','long'],['about','About you','long'],['approach','Your approach','long'],
    ['aboutConfirmed','My biography is ready (hide draft notice)','check'],['skillsConfirmed','My skills are confirmed (hide sample notice)','check'],
    ['email','Email','email'],['github','GitHub URL','nullable'],['itch','itch.io URL','nullable'],['linkedin','LinkedIn URL','nullable'],['resume','Resume PDF URL','nullable'],['portrait','Portrait URL','nullable'],
    ['heroMedia','Hero image or video URL','nullable'],['heroMediaType','Hero media type','image|video'],['heroMediaAlt','Hero media description'],['heroCaptions','Hero captions URL (.vtt)','nullable'],['heroTranscript','Hero video transcript','nullable-long'],
  ];specs.forEach(spec=>holder.append(field(data.profile,spec)));
}
function renderSkills() {
  const list=byId('skill-list');list.replaceChildren();
  data.skills.forEach((group,index)=>{
    const {box,summary,body}=card(group.title || 'New skill group',true);
    body.append(button('Remove group',()=>{if(confirm(`Remove “${group.title}” from this draft?`)){data.skills.splice(index,1);save();renderSkills();byId('add-skill').focus();}}));
    fields(body,group,[['title','Group title'],['items','Skills','lines','One skill per line. Remove a line to remove that skill.']],()=>summary.textContent=group.title||'New skill group');list.append(box);
  });
}
function render() { renderProjects();renderProfile();renderSkills();save(); }
byId('add-project').addEventListener('click',()=>{
  if(data.projects.length>=50) return message('You can add up to 50 projects.');
  let i=1;while(data.projects.some(p=>p.slug===`new-project-${i}`))i++;
  const p: Project={slug:`new-project-${i}`,number:'',category:'Gameplay',title:'New project',description:'',role:'',engine:'',language:'',type:'',team:'',duration:'',theme:'terrain',media:null,mediaType:'image',mediaAlt:'Gameplay preview',play:null,source:null,trailer:null,documentation:null,sample:false,overview:'',contributions:[],problem:'',solution:'',outcome:'',learned:'',diagram:null,code:null,captions:null,transcript:null,challengesTakeaways:'',showcase:[]};
  data.projects.push(p);save();renderProjects(data.projects.length-1);byId('project-list').lastElementChild?.querySelector('input')?.focus();
});
byId('add-skill').addEventListener('click',()=>{if(data.skills.length>=20)return message('You can add up to 20 skill groups.');data.skills.push({title:'New skill group',items:[]});save();renderSkills();byId('skill-list').lastElementChild?.querySelector('input')?.focus();});
byId('content-form').addEventListener('submit',event=>event.preventDefault());
byId('download').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
byId<HTMLInputElement>('import').addEventListener('change',async event=>{
  const input=event.target as HTMLInputElement;const file=input.files?.[0];if(!file)return;
  try {if(file.size>2000000)throw Error('Choose a backup under 2 MB.');const imported=validateContent(JSON.parse(await file.text()));if(confirm('Replace this browser draft with the imported content?')){data=normalizeContent(imported);stale=false;message('Backup imported. Review it before publishing.');render();}}
  catch(error){message(error instanceof Error?error.message:'Could not import that file.');}finally{input.value='';}
});
byId('reset').addEventListener('click',()=>{if(confirm('Discard this browser draft and restore the content loaded with this page?')){data=normalizeContent(initial);stale=false;message('');render();}});
const dialog=byId<HTMLDialogElement>('publish-dialog');
byId('close-publish').addEventListener('click',()=>dialog.close());
byId('publish').addEventListener('click',async()=>{
  const steps=byId('publish-steps');
  const feedback=byId('publish-feedback');
  steps.hidden=true;
  feedback.textContent='Checking your draft…';
  dialog.showModal();
  try {
    validateContent(data);
    if(stale) throw Error('This draft is based on an older version. Download a backup, then reset and reapply your changes to the current content.');
    const b=byId<HTMLButtonElement>('publish');b.disabled=true;b.textContent='Checking current content…';feedback.textContent='Checking the latest GitHub content…';
    try {
      const response=await fetch(`https://raw.githubusercontent.com/SpaghettiSans/game-programmer-portfolio/main/src/data/content.json?t=${Date.now()}`,{cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!response.ok)throw Error('Could not check the latest GitHub content. Please try again.');
      const latest=await response.json();
      if(fingerprint(latest)!==baseline && fingerprint(latest)!==fingerprint(data))throw Error('GitHub has newer content. Download your draft as a backup and reload this editor before publishing to avoid overwriting it.');
      byId<HTMLTextAreaElement>('publish-json').value=JSON.stringify(data,null,2)+'\n';byId('copy-status').textContent='';message('');feedback.textContent='Your draft is ready. Follow these steps to publish it.';steps.hidden=false;
    } finally {b.disabled=false;b.textContent='Publish changes ↗';}
  } catch(error){const reason=error instanceof Error?error.message:'Unable to prepare publishing.';feedback.textContent=reason+' Your draft has been kept. Close this window to continue editing or download a backup.';message(reason);}
});
byId('copy-content').addEventListener('click',async()=>{
  const text=byId<HTMLTextAreaElement>('publish-json');
  try {await navigator.clipboard.writeText(text.value);byId('copy-status').textContent='Copied! Open GitHub, replace the file text, then commit.';}
  catch {text.focus();text.select();byId('copy-status').textContent='Text selected. Press Ctrl+C (or Command+C), then open GitHub.';}
});
render();
