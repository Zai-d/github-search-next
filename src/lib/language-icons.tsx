import type { ComponentType } from "react";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiRust,
  SiPhp,
  SiRuby,
  SiCplusplus,
  SiC,
  SiSwift,
  SiKotlin,
  SiScala,
  SiR,
  SiDart,
  SiElixir,
  SiHaskell,
  SiGnubash,
  SiHtml5,
  SiCss3,
  SiLua,
  SiPerl,
  SiZig,
  SiNim,
  SiSqlite,
} from "react-icons/si";
import { LuFileCode2 } from "react-icons/lu";
import { TbBrandCSharp, TbBrandPowershell } from "react-icons/tb";
import { RiJavaLine } from "react-icons/ri";
import { FaVuejs } from "react-icons/fa6";

type Icon = ComponentType<{ size?: number }>;

function norm(s: string) {
  return s
    .toLowerCase()
    .replace(/\+\+/g, "plusplus") // C++
    .replace(/#/g, "sharp") // C#
    .replace(/\s|[\.\-]/g, ""); // spaces/dots/dashes
}

const MAP: Record<string, Icon> = {
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  go: SiGo,
  rust: SiRust,
  java: RiJavaLine,
  php: SiPhp,
  ruby: SiRuby,
  csharp: TbBrandCSharp,
  cplusplus: SiCplusplus,
  c: SiC,
  swift: SiSwift,
  kotlin: SiKotlin,
  scala: SiScala,
  r: SiR,
  dart: SiDart,
  elixir: SiElixir,
  haskell: SiHaskell,
  bash: SiGnubash,
  shell: SiGnubash,
  sh: SiGnubash,
  zsh: SiGnubash,
  powershell: TbBrandPowershell,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss3,
  css3: SiCss3,
  lua: SiLua,
  perl: SiPerl,
  zig: SiZig,
  nim: SiNim,
  sql: SiSqlite,
  sqlite: SiSqlite,
  vue: FaVuejs,
};

export function getLanguageIcon(name: string): Icon {
  const key = norm(name);
  return MAP[key] ?? LuFileCode2;
}

export function LanguageIcon({
  name,
  size = 14,
}: {
  name: string;
  size?: number;
}) {
  const Icon = getLanguageIcon(name);
  return <Icon size={size} aria-hidden="true" />;
}
