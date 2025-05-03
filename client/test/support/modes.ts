export enum TestMode {
  OnlineSw,
  OnlineNoSw,
  OfflineSw,
}

export const TestModes = [
  TestMode.OnlineSw,
  // TestMode.OnlineNoSw,
  // TestMode.OfflineSw,
];

export const testModeTitle: Record<TestMode, string> = {
  [TestMode.OnlineSw]: 'online, service worker',
  [TestMode.OnlineNoSw]: 'online, no service worker',
  [TestMode.OfflineSw]: 'offline, service worker',
};

type VisitOptions = {
  onBeforeLoad: (win: Window) => void;
};
export const testModeVisitOptions: Partial<Record<TestMode, VisitOptions>> = {
  [TestMode.OnlineNoSw]: {
    onBeforeLoad: () => {
      cy.disableSw();
    },
  },
};
