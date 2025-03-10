export type TagType = 'favorite' | 'opensource' | 'product' | 'design' | 'i18n' | 'versioning' | 'large' | 'meta' | 'personal' | 'templates' | 'portfolio' | 'blog' | 'other';

export interface Tag {
  label: string;
  color: string;
  description: string;
}

export const Tags: Record<TagType, Tag> = {
  favorite: {
    label: '收藏',
    color: '#e9669e',
    description: '我最喜欢的项目',
  },
  opensource: {
    label: '开源',
    color: '#39ca30',
    description: '开源项目',
  },
  product: {
    label: '产品',
    color: '#dfd545',
    description: '产品项目',
  },
  design: {
    label: '设计',
    color: '#a44fb7',
    description: '设计项目',
  },
  i18n: {
    label: '国际化',
    color: '#127f82',
    description: '国际化项目',
  },
  versioning: {
    label: '版本控制',
    color: '#fe6829',
    description: '版本控制项目',
  },
  large: {
    label: '大型',
    color: '#8c2f00',
    description: '大型项目',
  },
  meta: {
    label: '元数据',
    color: '#b36605',
    description: '元数据项目',
  },
  personal: {
    label: '个人',
    color: '#14cfc3',
    description: '个人项目',
  },
  templates: {
    label: '模板',
    color: '#ffcfc3',
    description: '模板项目',
  },
  portfolio: {
    label: '作品集',
    color: '#ffcfc3',
    description: '作品集项目',
  },
  blog: {
    label: '博客',
    color: '#ffcfc3',
    description: '博客项目',
  },
  other: {
    label: '其他',
    color: '#8c8c8c',
    description: '其他项目',
  },
};

export const TagList: TagType[] = Object.keys(Tags) as TagType[];

export interface Project {
  title: string;
  description: string;
  preview?: string;
  website?: string;
  source?: string;
  tech?: string[];
  pinned?: boolean;
  type: string;
  tags: TagType[];
}

export const projectTypeMap: Record<string, string> = {
  web: 'Web 应用',
  mobile: '移动应用',
  desktop: '桌面应用',
  other: '其他项目',
};

export const projects: Project[] = [
  {
    title: 'PDF Word Counter',
    description: '一款在线PDF文档字数统计工具，支持多语言，快速准确',
    type: 'web',
    tech: ['React', 'TypeScript'],
    tags: ['favorite', 'opensource'],
  },
];

export const groupByProjects = projects.reduce((acc, project) => {
  const type = project.type.toLowerCase();
  if (!acc[type]) {
    acc[type] = [];
  }
  acc[type].push(project);
  return acc;
}, {} as Record<string, Project[]>); 