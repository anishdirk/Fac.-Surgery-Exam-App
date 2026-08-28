import { ClinicalCase } from '../../types';
import { appendicitisCases } from './appendicitis';
import { pancreatitisCases } from './pancreatitis';
import { arterialCases } from './arterial';
import { venousCases } from './venous';
import { obstructionCases } from './obstruction';
import { gastricCancerCases } from './gastric_cancer';
import { esophagusCases } from './esophagus';
import { herniasCases } from './hernias';
import { proctologyCases } from './proctology';
import { thoracicSuppurationCases } from './thoracic_suppuration';
import { pleuralCases } from './pleural';
import { lungCancerCases } from './lung_cancer';
import { biliaryCases } from './biliary';
import { ulcerCases } from './ulcer';
import { peritonitisCases } from './peritonitis';
import { thyroidCases } from './thyroid';

export const allCases: ClinicalCase[] = [
  ...appendicitisCases,
  ...pancreatitisCases,
  ...arterialCases,
  ...venousCases,
  ...obstructionCases,
  ...gastricCancerCases,
  ...esophagusCases,
  ...herniasCases,
  ...proctologyCases,
  ...thoracicSuppurationCases,
  ...pleuralCases,
  ...lungCancerCases,
  ...biliaryCases,
  ...ulcerCases,
  ...peritonitisCases,
  ...thyroidCases,
].sort((a, b) => a.id - b.id);

export function getCasesByTopic(topicId: string): ClinicalCase[] {
  return allCases.filter(
    (c) => c.topicId === topicId || (c.crossTopicIds && c.crossTopicIds.includes(topicId))
  );
}

export function getCaseById(id: number): ClinicalCase | undefined {
  return allCases.find((c) => c.id === id);
}

export {
  appendicitisCases,
  pancreatitisCases,
  arterialCases,
  venousCases,
  obstructionCases,
  gastricCancerCases,
  esophagusCases,
  herniasCases,
  proctologyCases,
  thoracicSuppurationCases,
  pleuralCases,
  lungCancerCases,
  biliaryCases,
  ulcerCases,
  peritonitisCases,
  thyroidCases,
};
