export interface ASTPattern {
  id: string;
  description: string;
  test: (node: any, code: string) => boolean;
}

export const PATTERN_REGISTRY: ASTPattern[] = [
  {
    id: 'typeofGlobal',
    description: 'Detection of typeof global checks',
    test: (n, code) => {
      if (n.type === 'BinaryExpression' && (n.operator === '===' || n.operator === '==')) {
        const left = code.substring(n.left.start, n.left.end);
        const right = code.substring(n.right.start, n.right.end);
        return left.includes('typeof global') || right.includes('typeof global');
      }
      return false;
    }
  },
  {
    id: 'typeofSelf',
    description: 'Detection of typeof self checks',
    test: (n, code) => {
      if (n.type === 'BinaryExpression' && (n.operator === '===' || n.operator === '==')) {
        const left = code.substring(n.left.start, n.left.end);
        const right = code.substring(n.right.start, n.right.end);
        return left.includes('typeof self') || right.includes('typeof self');
      }
      return false;
    }
  },
  {
    id: 'typeofSymbol',
    description: 'Detection of typeof Symbol checks',
    test: (n, code) => {
      if (n.type === 'UnaryExpression' && n.operator === 'typeof') {
        const arg = code.substring(n.argument.start, n.argument.end);
        return arg === 'Symbol';
      }
      return false;
    }
  },
  {
    id: 'objectToString',
    description: 'Detection of Object.prototype.toString usage',
    test: (n, code) => {
      if (n.type === 'MemberExpression') {
        const member = code.substring(n.start, n.end);
        return member.includes('Object.prototype.toString');
      }
      return false;
    }
  }
];
