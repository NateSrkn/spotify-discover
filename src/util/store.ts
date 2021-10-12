import { atom } from "jotai";
import { TermLengths, TypesList } from "../pages";

interface Options {
  termLength: TermLengths[number];
  type: TypesList[number];
}
export const options = atom<Options>({
  termLength: "short_term",
  type: "artists",
});
