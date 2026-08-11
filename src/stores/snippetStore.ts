import { create } from "zustand";

export interface Snippet {
  id: string;
  trigger: string;
  description: string;
  body: string;
  language?: string;
}

const defaultSnippets: Snippet[] = [
  { id: "for-loop", trigger: "for", description: "For 循环", body: "for (let i = 0; i < ${1:length}; i++) {\n  ${2}\n}", language: "typescript" },
  { id: "for-of", trigger: "forof", description: "For-Of 循环", body: "for (const ${1:item} of ${2:array}) {\n  ${3}\n}", language: "typescript" },
  { id: "while", trigger: "while", description: "While 循环", body: "while (${1:condition}) {\n  ${2}\n}", language: "typescript" },
  { id: "if", trigger: "if", description: "If 语句", body: "if (${1:condition}) {\n  ${2}\n}", language: "typescript" },
  { id: "ifelse", trigger: "ifelse", description: "If-Else 语句", body: "if (${1:condition}) {\n  ${2}\n} else {\n  ${3}\n}", language: "typescript" },
  { id: "func", trigger: "func", description: "函数", body: "function ${1:name}(${2:params}) {\n  ${3}\n}", language: "typescript" },
  { id: "arrow", trigger: "arrow", description: "箭头函数", body: "const ${1:name} = (${2:params}) => {\n  ${3}\n}", language: "typescript" },
  { id: "class", trigger: "class", description: "类", body: "class ${1:Name} {\n  ${2}\n}", language: "typescript" },
  { id: "try", trigger: "try", description: "Try-Catch", body: "try {\n  ${1}\n} catch (${2:err}) {\n  ${3}\n}", language: "typescript" },
  { id: "console", trigger: "cl", description: "Console.log", body: "console.log(${1})", language: "typescript" },
  { id: "import", trigger: "imp", description: "Import", body: "import ${1} from '${2}'", language: "typescript" },
  { id: "export", trigger: "exp", description: "Export", body: "export ${1}", language: "typescript" },
  { id: "py-for", trigger: "for", description: "Python For 循环", body: "for ${1:i} in range(${2:n}):\n    ${3}", language: "python" },
  { id: "py-def", trigger: "def", description: "Python 函数", body: "def ${1:name}(${2:params}):\n    ${3}", language: "python" },
  { id: "py-class", trigger: "class", description: "Python 类", body: "class ${1:Name}:\n    def __init__(self):\n        ${2}", language: "python" },
  { id: "py-if", trigger: "if", description: "Python If", body: "if ${1:condition}:\n    ${2}", language: "python" },
  { id: "rust-fn", trigger: "fn", description: "Rust 函数", body: "fn ${1:name}(${2}) -> ${3:ReturnType} {\n    ${4}\n}", language: "rust" },
  { id: "rust-struct", trigger: "struct", description: "Rust 结构体", body: "struct ${1:Name} {\n    ${2}\n}", language: "rust" },
  { id: "rust-impl", trigger: "impl", description: "Rust 实现", body: "impl ${1:Name} {\n    ${2}\n}", language: "rust" },
  { id: "html5", trigger: "html5", description: "HTML5 模板", body: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>${1:Title}</title>\n</head>\n<body>\n  ${2}\n</body>\n</html>", language: "html" },
  { id: "vue-template", trigger: "vue", description: "Vue 模板", body: "<template>\n  <div>\n    ${1}\n  </div>\n</template>\n\n<script setup lang=\"ts\">\n${2}\n</script>\n\n<style scoped>\n${3}\n</style>", language: "html" },
  { id: "json-obj", trigger: "json", description: "JSON 对象", body: "{\n  \"${1:key}\": \"${2:value}\"\n}", language: "json" },
];

interface SnippetStore {
  snippets: Snippet[];
  addSnippet: (snippet: Snippet) => void;
  removeSnippet: (id: string) => void;
  getSnippetsForLanguage: (language: string) => Snippet[];
  findSnippet: (trigger: string, language: string) => Snippet | undefined;
}

export const useSnippetStore = create<SnippetStore>((set, get) => ({
  snippets: defaultSnippets,
  addSnippet: (snippet) =>
    set((state) => ({ snippets: [...state.snippets, snippet] })),
  removeSnippet: (id) =>
    set((state) => ({ snippets: state.snippets.filter((s) => s.id !== id) })),
  getSnippetsForLanguage: (language) =>
    get().snippets.filter((s) => !s.language || s.language === language),
  findSnippet: (trigger, language) =>
    get().snippets.find((s) => s.trigger === trigger && (!s.language || s.language === language)),
}));
