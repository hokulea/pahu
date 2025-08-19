export function renderFeatures(features: string[]): string {
  return `<ul>${features.map((f) => `<li>${f}</li>`).join('')}</ul>`;
}
