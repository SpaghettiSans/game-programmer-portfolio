// Keep old saved drafts and published content usable with the simpler project layout.
export function normalizeContent(content) {
  const copy = structuredClone(content);
  copy.projects.forEach(project => {
    if (project.challengesTakeaways === undefined) {
      project.challengesTakeaways = [project.problem, project.solution, project.outcome, project.learned].filter(Boolean).join('\n\n');
    }
    if (project.showcase === undefined) {
      project.showcase = [];
      if (project.media) project.showcase.push({ src: project.media, type: project.mediaType || 'image', alt: project.mediaAlt || 'Gameplay preview', caption: '', captions: project.captions || null, transcript: project.transcript || null });
      if (project.diagram && project.diagram !== project.media) project.showcase.push({ src: project.diagram, type: 'image', alt: 'Project architecture diagram', caption: '', captions: null, transcript: null });
    }
  });
  return copy;
}
