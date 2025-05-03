import fs from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";

const BIBLE_XML_PATH = path.resolve(__dirname, "../../data/kjvbible.xml");

export interface Bible {
  bible: {
    book: Book[];
    [key: string]: any;
  };
}

export interface Book {
  num: string;
  chapter: Chapter[];
  [key: string]: any;
}

export interface Chapter {
  num: string;
  verse: Verse[];
  [key: string]: any;
}

export interface Verse {
  num: string;
  "#text"?: string;
  [key: string]: any;
}

function loadBibleXML(): Bible {
  const xmlData = fs.readFileSync(BIBLE_XML_PATH, "utf-8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    textNodeName: "#text",
    isArray: (name, jpath, isLeafNode, isAttribute) => {
      // Always treat book, chapter, and verse as arrays
      return ["book", "chapter", "verse"].includes(name);
    },
  });
  return parser.parse(xmlData) as Bible;
}

const bibleData = loadBibleXML();

export function getBooks() {
  return bibleData.bible.book.map((b) => b.num);
}

export function getChapters(bookNum: string) {
  const book = bibleData.bible.book.find((b) => b.num === bookNum);
  if (!book) return [];
  return book.chapter.map((c) => c.num);
}

export function getVerses(bookNum: string, chapterNum: string) {
  const book = bibleData.bible.book.find((b) => b.num === bookNum);
  if (!book) return [];
  const chapter = book.chapter.find((c) => c.num === chapterNum);
  if (!chapter) return [];
  return chapter.verse.map((v) => ({ num: v.num, text: v["#text"] || "" }));
}

export function getVerseText(
  bookNum: string,
  chapterNum: string,
  verseNum: string
) {
  const book = bibleData.bible.book.find((b) => b.num === bookNum);
  if (!book) return "";
  const chapter = book.chapter.find((c) => c.num === chapterNum);
  if (!chapter) return "";
  const verse = chapter.verse.find((v) => v.num === verseNum);
  return verse ? verse["#text"] || "" : "";
}
