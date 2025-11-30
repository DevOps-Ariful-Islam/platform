
export interface ApiParameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ApiSpecification {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  summary: string;
  parameters?: ApiParameter[];
  response: string; // Simplified JSON representation or type name
}

export interface SchemaColumn {
  name: string;
  type: string;
  constraints?: string[];
  description?: string;
}

export interface DataSchema {
  tableName: string;
  description?: string;
  columns: SchemaColumn[];
}

export interface HierarchyNode {
  name: string;
  type: 'platform' | 'domain' | 'module' | 'component' | 'service' | 'data';
  code?: string;
  children?: HierarchyNode[];
  description?: string;
  details?: Record<string, string | number>;
  dependencies?: string[]; // List of codes that this node depends on
  apiSpecs?: ApiSpecification[];
  dataSchema?: DataSchema;
}

export interface ProjectPhase {
  id: number;
  name: string;
  startWeek: number;
  endWeek: number;
  budget: number;
  status: string;
  description: string;
  deliverables: string[];
}

export interface Metric {
  label: string;
  value: string | number;
  icon: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DomainInfo {
  id: string;
  name: string;
  description: string;
  modules: number;
  color: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  hierarchy?: string;
  related?: string[];
}

export interface DevOpsStep {
  title: string;
  description: string;
  command?: string;
  image?: string; // Placeholder for icon name
  tip?: string;
}

export interface DevOpsGuide {
  id: string;
  title: string;
  icon: string;
  description: string;
  steps: DevOpsStep[];
}
