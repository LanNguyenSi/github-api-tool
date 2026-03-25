import { describe, it, expect } from 'vitest';

describe('GitHub API Tool Smoke Tests', () => {
  it('should import github module without errors', async () => {
    const github = await import('../github');
    
    expect(github).toBeDefined();
  });

  it('should import index module without errors', async () => {
    const index = await import('../index');
    
    expect(index).toBeDefined();
  });
});
