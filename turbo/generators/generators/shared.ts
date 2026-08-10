import type { PlopTypes } from "@turbo/gen";

type TurboGeneratorConfig = Parameters<
  PlopTypes.NodePlopAPI["setGenerator"]
>[1];

/** A Turbo generator config paired with the name required by `setGenerator`. */
export type TurboGenerator = TurboGeneratorConfig & {
  readonly name: string;
};

interface GeneratorOptions {
  readonly description: string;
  readonly name: string;
  readonly targetDirectory: string;
}

/** Creates the common name/path prompts and template action used by all generators. */
export function defineGenerator({
  description,
  name,
  targetDirectory,
}: GeneratorOptions): TurboGenerator {
  return {
    name,
    description,
    prompts: [
      {
        type: "input",
        name: "name",
        message: `What is the ${name} name?`,
        validate: (value: string) =>
          value.trim().length > 0 || "A name is required.",
      },
      {
        type: "input",
        name: "path",
        message: "Where should it be created?",
        default: targetDirectory,
        validate: (value: string) =>
          value.trim().length > 0 || "A destination path is required.",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "{{path}}/{{kebabCase name}}",
        base: `templates/${name}`,
        templateFiles: `templates/${name}/**/*`,
      },
    ],
  };
}
