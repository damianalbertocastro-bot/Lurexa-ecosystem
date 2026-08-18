import type { PopulationCorpusPattern } from "@lurexa/types";

export interface DominicanCorpusCatalogSource {
  load(): Promise<readonly PopulationCorpusPattern[]>;
}

/**
 * Read-only access to the versioned Dominican English population corpus.
 *
 * The source may load validated JSON, a CMS artifact, or another approved
 * population-knowledge store. Learner-specific state must never be written
 * through this service.
 */
export class DominicanCorpusCatalogService {
  constructor(private readonly source: DominicanCorpusCatalogSource) {}

  async list(): Promise<readonly PopulationCorpusPattern[]> {
    return this.source.load();
  }

  async getByPatternId(patternId: string): Promise<PopulationCorpusPattern | undefined> {
    const patterns = await this.source.load();
    return patterns.find((pattern) => pattern.patternId === patternId);
  }

  async findByPrimaryDomain(primaryDomain: string): Promise<PopulationCorpusPattern[]> {
    const patterns = await this.source.load();
    return patterns.filter((pattern) => pattern.primaryDomain === primaryDomain);
  }
}
