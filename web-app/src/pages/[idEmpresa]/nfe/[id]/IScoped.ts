import type INFeRoot from "../INFeRoot";

export interface IScoped {
  id: string;
  updateScoped: (root: INFeRoot) => void;
}