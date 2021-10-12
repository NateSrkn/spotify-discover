import { atom } from "jotai";

export type TermLengths = ["short_term", "medium_term", "long_term"];
export type TypesList = ["artists", "tracks"];
interface Options {
  termLength: TermLengths[number];
  type: TypesList[number];
}
export const options = atom<Options>({
  type: "artists",
  termLength: "short_term",
});
