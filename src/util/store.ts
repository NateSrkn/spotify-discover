import { atom } from "jotai";
import { TermLengths, TypesList } from "../pages";
import { ExpandedArtist } from "./types/spotify";

interface Options {
  termLength: TermLengths[number];
  type: TypesList[number];
}
export const options = atom<Options>({
  termLength: "short_term",
  type: "artists",
});

export const selectedArtists = atom<ExpandedArtist[]>([]);

export const selectedArtist = atom<ExpandedArtist>({});
