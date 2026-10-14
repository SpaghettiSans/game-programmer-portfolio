// Shared by the visual editor and Astro build. All prose is rendered as text.
export function validateContent(data) {
  const fail = message => { throw new Error(message); };
  const text = (value, label, required = false) => {
    if (typeof value !== 'string' || value.length > 20000 || (required && !value.trim())) fail(`${label}: please enter ${required ? 'non-empty ' : ''}text (under 20,000 characters).`);
  };
  const url = (value, label) => {
    if (value === null || value === '') return;
    text(value, label);
    if (/[\s\\\u0000-\u001f]/.test(value)) fail(`${label}: the URL must not contain spaces or backslashes.`);
    if (/^\/(?!\/)/.test(value)) return;
    try { const u = new URL(value); if (!['https:','http:'].includes(u.protocol)) fail('Invalid protocol'); }
    catch { fail(`${label}: use an https:// URL or a /game-programmer-portfolio/ file path.`); }
  };
  const list = (value, label) => {
    if (!Array.isArray(value) || value.length > 100) fail(`${label}: use a list with at most 100 entries.`);
    value.forEach(item => text(item,label,true));
  };
  if (!data || typeof data !== 'object' || !data.profile || !Array.isArray(data.projects) || !Array.isArray(data.skills)) fail('This is not a portfolio content file.');
  const p = data.profile;
  for (const key of ['name','headline','intro','about','approach','heroMediaAlt','siteUrl']) text(p[key],key,['name','headline','siteUrl'].includes(key));
  for (const key of ['github','itch','linkedin','resume','portrait','heroMedia','heroCaptions','siteUrl']) url(p[key],key);
  if (p.email !== null && (typeof p.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))) fail('Please enter a valid email address or leave it blank.');
  if (!['image','video'].includes(p.heroMediaType)) fail('Choose image or video for the hero.');
  for (const key of ['aboutConfirmed','skillsConfirmed']) if (typeof p[key] !== 'boolean') fail(`${key} must be checked or unchecked.`);
  if (p.heroTranscript !== null) text(p.heroTranscript,'Hero transcript');
  if (data.projects.length > 50 || data.skills.length > 20) fail('Limit the portfolio to 50 projects and 20 skill groups.');
  const slugs = new Set();
  data.projects.forEach((project,index) => {
    const label = `Project ${index + 1}`;
    for (const key of ['slug','number','category','title','description','role','engine','language','type','team','duration','mediaAlt','overview','problem','solution','outcome','learned']) text(project[key],`${label} ${key}`,['slug','title'].includes(key));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) fail(`${label}: page address must use lowercase letters, numbers, and single hyphens.`);
    if (slugs.has(project.slug)) fail(`Two projects use the page address “${project.slug}”. Choose a unique address.`);
    slugs.add(project.slug);
    for (const key of ['media','play','source','trailer','documentation','diagram','captions']) url(project[key],`${label} ${key}`);
    for (const key of ['code','transcript']) if (project[key] !== null) text(project[key],`${label} ${key}`);
    list(project.contributions,`${label} contributions`);
    if (typeof project.sample !== 'boolean') fail(`${label}: sample must be checked or unchecked.`);
    if (!['terrain','logic','tools'].includes(project.theme) || !['image','video'].includes(project.mediaType)) fail(`${label}: invalid preview style or media type.`);
  });
  data.skills.forEach(group => { text(group.title,'Skill group title',true); list(group.items,'Skills'); });
  return data;
}
