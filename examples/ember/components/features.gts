import type { TOC } from '@ember/component/template-only';

export const Features: TOC<{ Args: { features: string[] } }> = <template>
  <ul>
    {{#each @features as |f|}}
      <li>{{f}}</li>
    {{/each}}
  </ul>
</template>;
