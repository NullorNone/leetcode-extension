/*
 * Filename: https://github.com/ccagml/vscode-leetcode-problem-rating/src/model/Model.ts
 * Path: https://github.com/ccagml/vscode-leetcode-problem-rating
 * Created Date: Thursday, October 27th 2022, 7:43:29 pm
 * Author: ccagml
 *
 * Copyright (c) 2022 ccagml . All rights reserved.
 */

import { ViewColumn, QuickPickItem, MessageItem } from "vscode";

export interface IQuickItemEx<T> extends QuickPickItem {
  value: T;
}

export enum UserStatus {
  SignedIn = 1,
  SignedOut = 2,
}

export const loginArgsMapping: Map<string, string> = new Map([
  ["LeetCode", "-l"],
  ["Cookie", "-c"],
  ["GitHub", "-g"],
  ["LinkedIn", "-i"],
]);

export const languages: string[] = [
  "bash",
  "c",
  "cpp",
  "csharp",
  "golang",
  "java",
  "javascript",
  "kotlin",
  "mysql",
  "php",
  "python",
  "python3",
  "ruby",
  "rust",
  "scala",
  "swift",
  "typescript",
];

export const langExt: Map<string, string> = new Map([
  ["bash", "sh"],
  ["c", "c"],
  ["cpp", "cpp"],
  ["csharp", "cs"],
  ["golang", "go"],
  ["java", "java"],
  ["javascript", "js"],
  ["kotlin", "kt"],
  ["mysql", "sql"],
  ["php", "php"],
  ["python", "py"],
  ["python3", "py"],
  ["ruby", "rb"],
  ["rust", "rs"],
  ["scala", "scala"],
  ["swift", "swift"],
  ["typescript", "ts"],
]);

export enum ProblemState {
  AC = 1,
  NotAC = 2,
  Unknown = 3,
}

export enum Endpoint {
  LeetCode = "leetcode",
  LeetCodeCN = "leetcode-cn",
}

export enum RootNodeSort {
  ZERO = 0,
  Day = 1,
  All = 2,
  Difficulty = 3,
  Tag = 4,
  Company = 5,
  Favorite = 6,
  Choice = 7,
  Score = 8,
  ScoreRange = 9,
  Context = 9,
}

export interface IProblem {
  isFavorite: boolean;
  locked: boolean;
  state: ProblemState;
  id: string; // 题目编号 fid
  qid: string;
  name: string;
  difficulty: string;
  passRate: string;
  companies: string[];
  tags: string[];
  scoreData: IScoreData | undefined; // 分数的结构
  isSearchResult: boolean;
  input: string;
  rootNodeSortId: RootNodeSort;
  todayData: ITodayData | undefined;
}

export interface ITodayData {
  date: string; // 日期
  userStatus: string; // 状态   'NOT_START' 'FINISH'
}

export interface IScoreData {
  Rating: number; // 分数
  score: string; // rank分
  ID: number; // 题目ID
  ContestID_en: string; // 周赛名称
  ProblemIndex: string; // 周赛第几题
  ContestSlug: string; // 周赛名称
}

export const defaultProblem: IProblem = {
  isFavorite: false,
  locked: false,
  state: ProblemState.Unknown,
  id: "",
  qid: "",
  name: "",
  difficulty: "",
  passRate: "",
  companies: [] as string[],
  tags: [] as string[],
  scoreData: undefined,
  isSearchResult: false,
  input: "",
  rootNodeSortId: RootNodeSort.ZERO,
  todayData: undefined,
};

export enum Category {
  All = "All",
  Difficulty = "Difficulty",
  Tag = "Tag",
  Company = "Company",
  Favorite = "Favorite",
  Score = "Score",
  Choice = "Choice",
}

export const supportedPlugins: string[] = [
  // "company",
  "solution.discuss",
  "leetcode.cn",
];

export enum DescriptionConfiguration {
  InWebView = "In Webview",
  InFileComment = "In File Comment",
  Both = "Both",
  None = "None",
}

export const leetcodeHasInited: string = "leetcode.hasInited";

export enum SortingStrategy {
  None = "None",
  AcceptanceRateAsc = "Acceptance Rate (Ascending)",
  AcceptanceRateDesc = "Acceptance Rate (Descending)",
  FrequencyAsc = "Frequency (Ascending)",
  FrequencyDesc = "Frequency (Descending)",
  ScoreAsc = "Score (Ascending)",
  ScoreDesc = "Score (Descending)",
  IDDesc = "ID (Descending)",
}

export const SORT_ORDER: SortingStrategy[] = [
  SortingStrategy.None,
  SortingStrategy.AcceptanceRateAsc,
  SortingStrategy.AcceptanceRateDesc,
  SortingStrategy.ScoreAsc,
  SortingStrategy.ScoreDesc,
  SortingStrategy.IDDesc,
];

export enum SearchSetType {
  ScoreRange = "ScoreRange",
  Context = "Context",
  Day = "Day",
}

export enum SearchSetTypeName {
  ScoreRange = "分数范围:",
  Context = "周赛期数:",
  Day = "每日一题",
}

export interface ISearchSet {
  value: string;
  type: SearchSetType;
  time: number; // 时间戳
  todayData: ITodayData | undefined;
}

export const SearchNode: ISearchSet = {
  value: "",
  type: SearchSetType.ScoreRange,
  time: 0,
  todayData: undefined,
};

export interface userContestRanKingBase {
  attendedContestsCount: number; // 参与次数
  rating: number; // 分数
  globalRanking: number; // 全球名次
  localRanking: number; // 本地名次
  globalTotalParticipants: number; //全球所有
  localTotalParticipants: number; // 本地所有
  topPercentage: number; // 位次百分比
}

export const userContestRankingObj: userContestRanKingBase = {
  attendedContestsCount: 0,
  rating: 1500,
  globalRanking: 0,
  localRanking: 0,
  globalTotalParticipants: 0,
  localTotalParticipants: 0,
  topPercentage: 0,
};

export interface ISubmitEvent {
  fid: string;
  qid: string;
  id: string;
  sub_type: string; // test  submit
  accepted: boolean;
}

export interface IWebViewOption {
  title: string;
  viewColumn: ViewColumn;
  preserveFocus?: boolean;
}

export enum OpenOption {
  justOpenFile = "仅打开问题文件",
  openInCurrentWindow = "在当前VsCode窗口打开",
  openInNewWindow = "在新的VsCode窗口打开",
  addToWorkspace = "添加到工作空间",
}

export enum DialogType {
  info = "info",
  warning = "warning",
  error = "error",
}

export const MessageItemObj: MessageItem = {
  title: "",
  isCloseAffordance: false,
};

export const DialogOptions = {
  open: Object.assign({}, MessageItemObj, { title: "Open" }),
  yes: Object.assign({}, MessageItemObj, { title: "Yes" }),
  no: Object.assign({}, MessageItemObj, {
    title: "No",
    isCloseAffordance: true,
  }),
  never: Object.assign({}, MessageItemObj, { title: "Never" }),
  singUp: Object.assign({}, MessageItemObj, { title: "Sign up" }),
};