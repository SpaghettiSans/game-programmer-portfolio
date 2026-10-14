import content from './content.json';
import { validateContent } from './validate-content.mjs';
export interface Profile {
  name: string; headline: string; intro: string; about: string; approach: string;
  email: string | null; github: string | null; itch: string | null; linkedin: string | null;
  resume: string | null; portrait: string | null; heroMedia: string | null;
  heroMediaType: 'image' | 'video'; heroMediaAlt: string; heroCaptions: string | null;
  heroTranscript: string | null; aboutConfirmed: boolean; skillsConfirmed: boolean; siteUrl: string;
}
export interface Project {
  slug: string; number: string; category: string; title: string; description: string;
  role: string; engine: string; language: string; type: string; team: string; duration: string;
  theme: string; media: string | null; mediaType: 'image' | 'video'; mediaAlt: string;
  play: string | null; source: string | null; trailer: string | null; documentation: string | null;
  sample: boolean; overview: string; contributions: string[]; problem: string; solution: string;
  outcome: string; learned: string; diagram: string | null; code: string | null;
  captions: string | null; transcript: string | null;
}
export interface PortfolioContent { profile: Profile; projects: Project[]; skills: { title: string; items: string[] }[]; }
validateContent(content);
export const { profile, projects, skills } = content as PortfolioContent;
