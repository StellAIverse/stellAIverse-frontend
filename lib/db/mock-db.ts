import { TestCase, TestExecution } from "./types";

// Mock in-memory database
let testCases: TestCase[] = [];
let testExecutions: TestExecution[] = [];

export const db = {
  testCases: {
    findMany: async () => [...testCases],
    findUnique: async (id: string) => testCases.find((tc) => tc.id === id),
    create: async (data: Omit<TestCase, "id" | "createdAt" | "updatedAt">) => {
      const newTestCase: TestCase = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      testCases.push(newTestCase);
      return newTestCase;
    },
  },
  testExecutions: {
    findMany: async (filter?: { testCaseId?: string }) => {
      if (filter?.testCaseId) {
        return testExecutions.filter(
          (te) => te.testCaseId === filter.testCaseId,
        );
      }
      return [...testExecutions];
    },
    create: async (data: Omit<TestExecution, "id" | "startTime">) => {
      const newExecution: TestExecution = {
        ...data,
        id: Math.random().toString(36).substring(2, 9),
        startTime: new Date().toISOString(),
      };
      testExecutions.push(newExecution);
      return newExecution;
    },
    update: async (id: string, data: Partial<TestExecution>) => {
      const index = testExecutions.findIndex((te) => te.id === id);
      if (index !== -1) {
        testExecutions[index] = { ...testExecutions[index], ...data };
        return testExecutions[index];
      }
      return null;
    },
  },
};
