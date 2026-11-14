interface Candidate {
  name: string;
  currentRole: string;
  company: string;
  location: string;
  summary: string;
  highlights: string[];
  website: string;
  resumePdf: string;
}

interface Contact {
  email: string;
  github: string;
  linkedin: string;
  website: string;
  resumePdf: string;
}

interface Project {
  slug: string;
  title: string;
  description: string;
  type: 'product' | 'scale';
  featured: boolean;
  date: string;
  tags: string[];
  page: string;
  externalUrl: string | null;
}

interface Role {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  tags: string[];
  summary: string[];
}

interface ToolkitGroup {
  category: string;
  items: string[];
}

interface PortfolioData {
  candidate: Candidate;
  contact: Contact;
  projects: Project[];
  experience: Role[];
  toolkit: ToolkitGroup[];
}

const PROJECT_TYPES = ['product', 'scale'] as const;

function readPortfolioData(): PortfolioData | null {
  const source = document.getElementById('portfolio-data')?.textContent;
  if (!source) return null;
  try {
    return JSON.parse(source) as PortfolioData;
  } catch {
    return null;
  }
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function registerPortfolioTools(): void {
  if (typeof document === 'undefined' || !('modelContext' in document) || !document.modelContext) return;

  const modelContext = document.modelContext;
  const data = readPortfolioData();
  if (!data) return;

  const controller = new AbortController();
  window.addEventListener('pagehide', () => controller.abort(), { once: true });
  const options = { signal: controller.signal };

  const registrations = [
    modelContext.registerTool(
      {
        name: 'get_candidate_summary',
        title: 'Candidate summary',
        description:
          "Returns Saul Herman's professional summary: current role, employer, location, career highlights, and links to the website and resume. Use when someone asks who Saul is or what he does.",
        inputSchema: { type: 'object', properties: {} },
        execute(_input) {
          return data.candidate;
        },
        annotations: { readOnlyHint: true },
      },
      options,
    ),

    modelContext.registerTool(
      {
        name: 'list_projects',
        title: 'List projects',
        description:
          "Lists Saul Herman's portfolio projects with descriptions, technologies, dates, and page links. Use to find case studies or examples of his work.",
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: PROJECT_TYPES,
              description: 'Kind of project: a shipped product, or platform work that operates at organisational scale.',
            },
            featuredOnly: {
              type: 'boolean',
              description: 'Return only the projects highlighted on the home page.',
            },
          },
        },
        execute(input) {
          const { type, featuredOnly } = input as { type?: unknown; featuredOnly?: unknown };
          if (type !== undefined && !PROJECT_TYPES.includes(type as (typeof PROJECT_TYPES)[number])) {
            return { error: `Unknown project type "${String(type)}".`, projectTypes: PROJECT_TYPES };
          }
          if (featuredOnly !== undefined && typeof featuredOnly !== 'boolean') {
            return { error: 'featuredOnly must be true or false.' };
          }
          const projects = data.projects.filter(
            (project) => (type === undefined || project.type === type) && (featuredOnly !== true || project.featured),
          );
          return { count: projects.length, projects };
        },
        annotations: { readOnlyHint: true },
      },
      options,
    ),

    modelContext.registerTool(
      {
        name: 'search_experience',
        title: 'Search experience',
        description:
          "Searches Saul Herman's work history and returns matching roles with dates, location, technologies, and responsibilities. Use to check experience with a tool, skill, or employer.",
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Keyword or phrase to match against role titles, technologies, and responsibilities, for example "Okta" or "Jamf".',
            },
            company: {
              type: 'string',
              description: 'Employer name to limit results to, for example "Atlassian".',
            },
          },
        },
        execute(input) {
          const { query, company } = input as { query?: unknown; company?: unknown };
          if (query !== undefined && typeof query !== 'string') {
            return { error: 'query must be text.' };
          }
          if (company !== undefined && typeof company !== 'string') {
            return { error: 'company must be text.' };
          }
          const needle = typeof query === 'string' ? normalize(query) : '';
          const employer = typeof company === 'string' ? normalize(company) : '';
          const roles = data.experience.filter((role) => {
            if (employer && !normalize(role.company).includes(employer)) return false;
            if (!needle) return true;
            return [role.role, role.company, role.location, ...role.tags, ...role.summary].some((text) =>
              normalize(text).includes(needle),
            );
          });
          if (roles.length === 0) {
            return {
              count: 0,
              roles: [],
              companies: [...new Set(data.experience.map((role) => role.company))],
            };
          }
          return { count: roles.length, roles };
        },
        annotations: { readOnlyHint: true },
      },
      options,
    ),

    modelContext.registerTool(
      {
        name: 'get_toolkit',
        title: 'Get toolkit',
        description:
          'Returns the platforms, cloud services, languages, and domains Saul Herman works with, grouped by category. Use to check familiarity with a technology.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Category name to return on its own, for example "Platforms".',
            },
          },
        },
        execute(input) {
          const { category } = input as { category?: unknown };
          if (category === undefined) return { categories: data.toolkit };
          if (typeof category !== 'string') {
            return { error: 'category must be text.', categories: data.toolkit.map((group) => group.category) };
          }
          const wanted = normalize(category);
          const groups = data.toolkit.filter((group) => normalize(group.category).includes(wanted));
          if (groups.length === 0) {
            return {
              error: `No toolkit category matches "${category}".`,
              categories: data.toolkit.map((group) => group.category),
            };
          }
          return { categories: groups };
        },
        annotations: { readOnlyHint: true },
      },
      options,
    ),

    modelContext.registerTool(
      {
        name: 'get_contact_info',
        title: 'Get contact details',
        description:
          'Returns how to contact Saul Herman: email address, GitHub and LinkedIn profiles, website, and resume PDF link.',
        inputSchema: { type: 'object', properties: {} },
        execute(_input) {
          return data.contact;
        },
        annotations: { readOnlyHint: true },
      },
      options,
    ),
  ];

  Promise.allSettled(registrations).then((results) => {
    for (const result of results) {
      if (result.status === 'rejected') console.warn('WebMCP tool registration failed:', result.reason);
    }
  });
}

registerPortfolioTools();

// pagehide aborts the registrations, so a page restored from the back/forward cache registers them again.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) registerPortfolioTools();
});
