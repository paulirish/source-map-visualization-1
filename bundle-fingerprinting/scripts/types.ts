export interface Fingerprint {
  totalNodes: number;
  nodeDist: Record<string, number>;
  avgDeclaratorsPerDeclaration: number;
  identifierRatio: number;
  ternaryRatio: number;
  assignmentChainRatio: number;
  patternRatios: Record<string, number>;
}

export interface PackageRecord {
  packageName: string;
  versions: Record<string, Fingerprint>;
}

export interface PackageSignatureRaw {
  packageName: string;
  nodeDist: Record<string, number>;
  totalNodes: number;
  avgDeclaratorsPerDeclaration: number;
  identifierRatio: number;
  ternaryRatio: number;
  assignmentChainRatio: number;
  patternRatios: Record<string, number>;
}
