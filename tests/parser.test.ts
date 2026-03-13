import { describe, it, expect } from "vitest";
import { parseFile } from "../src/parser/index";

describe("Parser — TypeScript", () => {
  it("detects language correctly", () => {
    const result = parseFile("sample.ts", "");
    expect(result.language).toBe("typescript");
  });

  it("parses a function", () => {
    const code = `export function hello(name: string): string {
  return "Hello " + name;
}`;
    const result = parseFile("sample.ts", code);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe("function");
    expect(result.elements[0].name).toBe("hello");
  });

  it("parses a class", () => {
    const code = `export class UserService {
  getUser() {}
}`;
    const result = parseFile("sample.ts", code);
    expect(result.elements[0].type).toBe("class");
    expect(result.elements[0].name).toBe("UserService");
  });

  it("parses an interface", () => {
    const code = `export interface User {
  id: number;
  name: string;
}`;
    const result = parseFile("sample.ts", code);
    expect(result.elements[0].type).toBe("interface");
    expect(result.elements[0].name).toBe("User");
  });

  it("returns empty elements for empty file", () => {
    const result = parseFile("sample.ts", "");
    expect(result.elements).toHaveLength(0);
  });
});

describe("Parser — JavaScript", () => {
  it("detects language correctly", () => {
    const result = parseFile("sample.js", "");
    expect(result.language).toBe("javascript");
  });

  it("parses an arrow function", () => {
    const code = `const add = (a, b) => {
  return a + b;
}`;
    const result = parseFile("sample.js", code);
    expect(result.elements[0].type).toBe("function");
    expect(result.elements[0].name).toBe("add");
  });
});

describe("Parser — PHP", () => {
  it("detects language correctly", () => {
    const result = parseFile("sample.php", "");
    expect(result.language).toBe("php");
  });

  it("parses a function", () => {
    const code = `public function getUser($id) {
  return $this->users[$id];
}`;
    const result = parseFile("sample.php", code);
    expect(result.elements[0].type).toBe("function");
    expect(result.elements[0].name).toBe("getUser");
  });

  it("parses a Laravel route", () => {
    const code = `Route::get('/users', [UserController::class, 'index']);`;
    const result = parseFile("sample.php", code);
    expect(result.elements[0].type).toBe("route");
    expect(result.elements[0].name).toBe("GET /users");
  });
});

describe("Parser — Python", () => {
  it("detects language correctly", () => {
    const result = parseFile("sample.py", "");
    expect(result.language).toBe("python");
  });

  it("parses a function", () => {
    const code = `def calculate(x, y):
    return x + y`;
    const result = parseFile("sample.py", code);
    expect(result.elements[0].type).toBe("function");
    expect(result.elements[0].name).toBe("calculate");
  });

  it("parses an async function", () => {
    const code = `async def fetch_data(url: str) -> dict:
    return {}`;
    const result = parseFile("sample.py", code);
    expect(result.elements[0].type).toBe("function");
    expect(result.elements[0].name).toBe("fetch_data");
  });
});

describe("Parser — Dart", () => {
  it("detects language correctly", () => {
    const result = parseFile("sample.dart", "");
    expect(result.language).toBe("dart");
  });

  it("parses a class", () => {
    const code = `class UserWidget extends StatelessWidget {
  build(BuildContext context) {
    return Container();
  }
}`;
    const result = parseFile("sample.dart", code);
    expect(result.elements[0].type).toBe("class");
    expect(result.elements[0].name).toBe("UserWidget");
  });
});

describe("Parser — Unknown language", () => {
  it("returns unknown for unsupported extensions", () => {
    const result = parseFile("sample.rb", "puts 'hello'");
    expect(result.language).toBe("unknown");
    expect(result.elements).toHaveLength(0);
  });
});