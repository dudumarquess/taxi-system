// scripts/injectPartials.ts
import type { TargetOptions } from '@angular-builders/custom-webpack';
import { getInitialStyles } from '@porsche-design-system/components-angular/partials';

export default (targetOptions: TargetOptions, indexHtml: string): string => {
  const partialContent = getInitialStyles();
  return indexHtml.replace(/<\/head>/, `${partialContent}</head>`);
};
