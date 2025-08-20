import type { TOC } from '@ember/component/template-only';
import type { Issue } from '@hokulea/pahu';

export interface ErrorsSignature {
  Args: {
    errors: Issue[];
    id: string;
  };
}

const Errors: TOC<ErrorsSignature> = <template>
  <div id={{@id}} aria-live="assertive">
    <div>
      {{#each @errors as |e|}}
        {{#if e.message}}
          <p style="color: darkred">{{e.message}}</p>
        {{/if}}
      {{/each}}
    </div>
  </div>
</template>;

export default Errors;
