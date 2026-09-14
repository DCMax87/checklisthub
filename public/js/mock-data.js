(function (global) {
  function hoursFromNow(hours) {
    return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  }

  function daysFromNow(days) {
    return hoursFromNow(days * 24);
  }

  const me = {
    id: "member-me",
    fullName: "Alex Rivera",
    username: "alex",
  };

  const members = [
    me,
    { id: "member-sam", fullName: "Sam Okonkwo", username: "sam" },
    { id: "member-jordan", fullName: "Jordan Lee", username: "jordan" },
    { id: "member-priya", fullName: "Priya Shah", username: "priya" },
    { id: "member-casey", fullName: "Casey Nguyen", username: "casey" },
    { id: "member-morgan", fullName: "Morgan Blake", username: "morgan" },
  ];

  const byId = {};
  members.forEach(function (m) {
    byId[m.id] = m;
  });

  /**
   * Three coherent projects sized for Gantt:
   * board = project, card = workstream, checklist = dated bar (first→last due).
   */
  const boards = [
    { id: "board-relaunch", name: "Campus Website Relaunch" },
    { id: "board-warehouse", name: "Warehouse Automation" },
    { id: "board-onboard", name: "New Starter Onboarding" },
  ];

  const labelCatalog = [
    { id: "lab-urgent", name: "Urgent", color: "red" },
    { id: "lab-design", name: "Design", color: "purple" },
    { id: "lab-build", name: "Build", color: "blue" },
    { id: "lab-content", name: "Content", color: "yellow" },
    { id: "lab-ops", name: "Ops", color: "green" },
    { id: "lab-risk", name: "Risk", color: "orange" },
  ];

  const listCatalog = [
    {
      id: "list-relaunch-discovery",
      name: "Discovery",
      boardId: boards[0].id,
      boardName: boards[0].name,
    },
    {
      id: "list-relaunch-build",
      name: "Build",
      boardId: boards[0].id,
      boardName: boards[0].name,
    },
    {
      id: "list-relaunch-launch",
      name: "Launch",
      boardId: boards[0].id,
      boardName: boards[0].name,
    },
    {
      id: "list-wh-plan",
      name: "Planning",
      boardId: boards[1].id,
      boardName: boards[1].name,
    },
    {
      id: "list-wh-pilot",
      name: "Pilot",
      boardId: boards[1].id,
      boardName: boards[1].name,
    },
    {
      id: "list-on-prep",
      name: "Prep",
      boardId: boards[2].id,
      boardName: boards[2].name,
    },
    {
      id: "list-on-week1",
      name: "Week 1",
      boardId: boards[2].id,
      boardName: boards[2].name,
    },
  ];

  var itemSeq = 0;

  function makeItem(opts) {
    itemSeq += 1;
    var member = byId[opts.memberId] || me;
    var board = opts.board;
    var list = opts.list;
    return {
      id: "ci-gantt-" + itemSeq,
      kind: "checkitem",
      name: opts.name,
      state: opts.state || "incomplete",
      due: opts.dueDays == null ? null : daysFromNow(opts.dueDays),
      dueReminder: opts.dueReminder || null,
      idMember: member.id,
      assigneeName: member.fullName,
      checklistId: opts.checklistId,
      checklistName: opts.checklistName,
      cardId: opts.cardId,
      cardName: opts.cardName,
      cardUrl: "https://trello.com",
      boardId: board.id,
      boardName: board.name,
      listId: list.id,
      listName: list.name,
      labels: (opts.labels || []).map(function (l) {
        return Object.assign({}, l);
      }),
      idMembers: opts.idMembers || [member.id],
      pos: opts.pos || itemSeq,
    };
  }

  function makeMembershipCard(opts) {
    var member = byId[opts.memberId] || me;
    var board = opts.board;
    return {
      kind: "card",
      id: "card-membership:" + opts.cardId,
      name: opts.name,
      state: opts.state || "incomplete",
      due: opts.dueDays == null ? null : daysFromNow(opts.dueDays),
      dueReminder: opts.dueReminder || null,
      dueComplete: opts.state === "complete",
      idMember: member.id,
      assigneeName: member.fullName,
      checklistId: null,
      checklistName: "Card membership · no checklist tasks for you",
      cardId: opts.cardId,
      cardName: opts.name,
      cardUrl: "https://trello.com",
      boardId: board.id,
      boardName: board.name,
      listId: opts.list ? opts.list.id : null,
      listName: opts.list ? opts.list.name : "",
      labels: (opts.labels || []).map(function (l) {
        return Object.assign({}, l);
      }),
      pos: 0,
      idMembers: opts.idMembers || [member.id, me.id],
    };
  }

  const items = [];
  const memberCards = [];

  // ── Project 1: Campus Website Relaunch ─────────────────────────────
  (function () {
    var board = boards[0];
    var discovery = listCatalog[0];
    var build = listCatalog[1];
    var launch = listCatalog[2];

    // Card: Information architecture
    items.push(
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-research",
        checklistName: "Research & tree test",
        name: "Stakeholder interviews (round 1)",
        dueDays: -12,
        state: "complete",
        memberId: me.id,
        labels: [labelCatalog[1]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-research",
        checklistName: "Research & tree test",
        name: "Draft sitemap v1",
        dueDays: -8,
        state: "complete",
        memberId: "member-jordan",
        labels: [labelCatalog[1]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-research",
        checklistName: "Research & tree test",
        name: "Tree test with 8 students",
        dueDays: -3,
        memberId: "member-casey",
        labels: [labelCatalog[1], labelCatalog[0]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-research",
        checklistName: "Research & tree test",
        name: "Sign off IA with Comms",
        dueDays: 1,
        dueReminder: 1440,
        memberId: me.id,
        labels: [labelCatalog[1]],
        pos: 4,
      }),
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-nav",
        checklistName: "Primary navigation",
        name: "Wireframe mega-menu",
        dueDays: 2,
        memberId: "member-jordan",
        labels: [labelCatalog[1]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-nav",
        checklistName: "Primary navigation",
        name: "Accessibility review of labels",
        dueDays: 5,
        memberId: "member-morgan",
        labels: [labelCatalog[1]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: discovery,
        cardId: "card-ia",
        cardName: "Information architecture",
        checklistId: "cl-ia-nav",
        checklistName: "Primary navigation",
        name: "Prototype click-path demo",
        dueDays: 8,
        memberId: "member-jordan",
        labels: [labelCatalog[1]],
        pos: 3,
      })
    );

    // Card: Design system
    items.push(
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-tokens",
        checklistName: "Tokens & components",
        name: "Colour & type tokens in Figma",
        dueDays: -5,
        state: "complete",
        memberId: "member-jordan",
        labels: [labelCatalog[1]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-tokens",
        checklistName: "Tokens & components",
        name: "Button / form / card components",
        dueDays: 0,
        memberId: "member-jordan",
        labels: [labelCatalog[1]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-tokens",
        checklistName: "Tokens & components",
        name: "Dark-mode pass",
        dueDays: 4,
        memberId: "member-casey",
        labels: [labelCatalog[1]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-tokens",
        checklistName: "Tokens & components",
        name: "Hand-off package to engineering",
        dueDays: 7,
        memberId: me.id,
        labels: [labelCatalog[1], labelCatalog[2]],
        pos: 4,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-storybook",
        checklistName: "Storybook build",
        name: "Scaffold Storybook on main",
        dueDays: 3,
        memberId: "member-sam",
        labels: [labelCatalog[2]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-storybook",
        checklistName: "Storybook build",
        name: "Document spacing scale",
        dueDays: 6,
        memberId: "member-sam",
        labels: [labelCatalog[2]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-ds",
        cardName: "Design system",
        checklistId: "cl-ds-storybook",
        checklistName: "Storybook build",
        name: "Publish Chromatic baseline",
        dueDays: 10,
        memberId: "member-priya",
        labels: [labelCatalog[2]],
        pos: 3,
      })
    );

    // Card: Content migration
    items.push(
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-audit",
        checklistName: "Page audit",
        name: "Inventory top 120 URLs",
        dueDays: -9,
        state: "complete",
        memberId: "member-morgan",
        labels: [labelCatalog[3]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-audit",
        checklistName: "Page audit",
        name: "Mark keep / merge / retire",
        dueDays: -2,
        memberId: "member-morgan",
        labels: [labelCatalog[3]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-audit",
        checklistName: "Page audit",
        name: "Redirect map draft",
        dueDays: 3,
        memberId: me.id,
        labels: [labelCatalog[3]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-write",
        checklistName: "Homepage & courses",
        name: "Homepage narrative workshop",
        dueDays: 5,
        memberId: "member-morgan",
        labels: [labelCatalog[3]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-write",
        checklistName: "Homepage & courses",
        name: "Rewrite course landing templates",
        dueDays: 11,
        memberId: "member-casey",
        labels: [labelCatalog[3]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-write",
        checklistName: "Homepage & courses",
        name: "Legal review of claims",
        dueDays: 14,
        memberId: me.id,
        labels: [labelCatalog[3], labelCatalog[5]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: build,
        cardId: "card-content",
        cardName: "Content migration",
        checklistId: "cl-content-write",
        checklistName: "Homepage & courses",
        name: "CMS import rehearsal",
        dueDays: 18,
        memberId: "member-sam",
        labels: [labelCatalog[3], labelCatalog[2]],
        pos: 4,
      })
    );

    // Card: Go-live
    items.push(
      makeItem({
        board: board,
        list: launch,
        cardId: "card-golive",
        cardName: "Go-live weekend",
        checklistId: "cl-golive-tech",
        checklistName: "Technical cutover",
        name: "Freeze content edits",
        dueDays: 20,
        memberId: "member-priya",
        labels: [labelCatalog[2], labelCatalog[0]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: launch,
        cardId: "card-golive",
        cardName: "Go-live weekend",
        checklistId: "cl-golive-tech",
        checklistName: "Technical cutover",
        name: "DNS swap rehearsal",
        dueDays: 22,
        memberId: "member-priya",
        labels: [labelCatalog[2]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: launch,
        cardId: "card-golive",
        cardName: "Go-live weekend",
        checklistId: "cl-golive-tech",
        checklistName: "Technical cutover",
        name: "Production cutover",
        dueDays: 24,
        memberId: "member-sam",
        labels: [labelCatalog[2], labelCatalog[0]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: launch,
        cardId: "card-golive",
        cardName: "Go-live weekend",
        checklistId: "cl-golive-comms",
        checklistName: "Launch communications",
        name: "Internal staff email",
        dueDays: 21,
        memberId: "member-morgan",
        labels: [labelCatalog[3]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: launch,
        cardId: "card-golive",
        cardName: "Go-live weekend",
        checklistId: "cl-golive-comms",
        checklistName: "Launch communications",
        name: "Social + homepage banner",
        dueDays: 24,
        memberId: "member-casey",
        labels: [labelCatalog[3]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: launch,
        cardId: "card-golive",
        cardName: "Go-live weekend",
        checklistId: "cl-golive-comms",
        checklistName: "Launch communications",
        name: "War-room standby rota",
        dueDays: 25,
        memberId: me.id,
        labels: [labelCatalog[4]],
        pos: 3,
      })
    );

    memberCards.push(
      makeMembershipCard({
        board: board,
        list: launch,
        cardId: "card-steering",
        name: "Relaunch steering group",
        dueDays: 16,
        memberId: me.id,
        idMembers: [me.id, "member-jordan", "member-morgan"],
        labels: [labelCatalog[5]],
      })
    );
  })();

  // ── Project 2: Warehouse Automation ────────────────────────────────
  (function () {
    var board = boards[1];
    var plan = listCatalog[3];
    var pilot = listCatalog[4];

    items.push(
      makeItem({
        board: board,
        list: plan,
        cardId: "card-rfq",
        cardName: "Vendor RFQ",
        checklistId: "cl-rfq-pack",
        checklistName: "RFQ pack",
        name: "Requirements workshop",
        dueDays: -10,
        state: "complete",
        memberId: me.id,
        labels: [labelCatalog[4]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: plan,
        cardId: "card-rfq",
        cardName: "Vendor RFQ",
        checklistId: "cl-rfq-pack",
        checklistName: "RFQ pack",
        name: "Draft scoring matrix",
        dueDays: -4,
        memberId: "member-priya",
        labels: [labelCatalog[4]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: plan,
        cardId: "card-rfq",
        cardName: "Vendor RFQ",
        checklistId: "cl-rfq-pack",
        checklistName: "RFQ pack",
        name: "Issue RFQ to shortlist",
        dueDays: 2,
        dueReminder: 2880,
        memberId: me.id,
        labels: [labelCatalog[4], labelCatalog[0]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: plan,
        cardId: "card-rfq",
        cardName: "Vendor RFQ",
        checklistId: "cl-rfq-eval",
        checklistName: "Evaluation",
        name: "Vendor demos (week)",
        dueDays: 6,
        memberId: "member-sam",
        labels: [labelCatalog[4]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: plan,
        cardId: "card-rfq",
        cardName: "Vendor RFQ",
        checklistId: "cl-rfq-eval",
        checklistName: "Evaluation",
        name: "Reference calls",
        dueDays: 9,
        memberId: "member-casey",
        labels: [labelCatalog[4]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: plan,
        cardId: "card-rfq",
        cardName: "Vendor RFQ",
        checklistId: "cl-rfq-eval",
        checklistName: "Evaluation",
        name: "Recommendation paper",
        dueDays: 12,
        memberId: me.id,
        labels: [labelCatalog[4], labelCatalog[5]],
        pos: 3,
      })
    );

    items.push(
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-site",
        checklistName: "Site works",
        name: "Clear bay 3 racking",
        dueDays: -1,
        memberId: "member-sam",
        labels: [labelCatalog[4]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-site",
        checklistName: "Site works",
        name: "Power & network drops",
        dueDays: 4,
        memberId: "member-priya",
        labels: [labelCatalog[4]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-site",
        checklistName: "Site works",
        name: "H&S sign-off",
        dueDays: 8,
        memberId: "member-morgan",
        labels: [labelCatalog[4], labelCatalog[5]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-site",
        checklistName: "Site works",
        name: "Vendor install window",
        dueDays: 15,
        memberId: "member-sam",
        labels: [labelCatalog[4]],
        pos: 4,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-train",
        checklistName: "Operator training",
        name: "Train shift leads",
        dueDays: 16,
        memberId: "member-casey",
        labels: [labelCatalog[4]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-train",
        checklistName: "Operator training",
        name: "Shadow shifts (3 days)",
        dueDays: 19,
        memberId: "member-casey",
        labels: [labelCatalog[4]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-pilot-bay",
        cardName: "Pilot bay fit-out",
        checklistId: "cl-bay-train",
        checklistName: "Operator training",
        name: "Pilot KPI review",
        dueDays: 26,
        memberId: me.id,
        labels: [labelCatalog[4]],
        pos: 3,
      })
    );

    items.push(
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-wms",
        cardName: "WMS integration",
        checklistId: "cl-wms-api",
        checklistName: "API & mapping",
        name: "SKU mapping spreadsheet",
        dueDays: 1,
        memberId: "member-priya",
        labels: [labelCatalog[2]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-wms",
        cardName: "WMS integration",
        checklistId: "cl-wms-api",
        checklistName: "API & mapping",
        name: "Sandbox sync test",
        dueDays: 7,
        memberId: "member-sam",
        labels: [labelCatalog[2]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-wms",
        cardName: "WMS integration",
        checklistId: "cl-wms-api",
        checklistName: "API & mapping",
        name: "Error-queue runbook",
        dueDays: 13,
        memberId: "member-priya",
        labels: [labelCatalog[2], labelCatalog[5]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: pilot,
        cardId: "card-wms",
        cardName: "WMS integration",
        checklistId: "cl-wms-api",
        checklistName: "API & mapping",
        name: "Production sync toggle",
        dueDays: 23,
        memberId: "member-sam",
        labels: [labelCatalog[2], labelCatalog[0]],
        pos: 4,
      })
    );

    memberCards.push(
      makeMembershipCard({
        board: board,
        list: plan,
        cardId: "card-wh-sponsor",
        name: "Automation sponsor sync",
        dueDays: 5,
        memberId: me.id,
        idMembers: [me.id, "member-sam", "member-priya"],
        labels: [labelCatalog[5]],
      })
    );
  })();

  // ── Project 3: New Starter Onboarding ──────────────────────────────
  (function () {
    var board = boards[2];
    var prep = listCatalog[5];
    var week1 = listCatalog[6];

    items.push(
      makeItem({
        board: board,
        list: prep,
        cardId: "card-offer",
        cardName: "Offer & pre-boarding",
        checklistId: "cl-offer-hr",
        checklistName: "HR pack",
        name: "Contract issued",
        dueDays: -14,
        state: "complete",
        memberId: "member-morgan",
        labels: [labelCatalog[4]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: prep,
        cardId: "card-offer",
        cardName: "Offer & pre-boarding",
        checklistId: "cl-offer-hr",
        checklistName: "HR pack",
        name: "Background check cleared",
        dueDays: -6,
        state: "complete",
        memberId: "member-morgan",
        labels: [labelCatalog[4]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: prep,
        cardId: "card-offer",
        cardName: "Offer & pre-boarding",
        checklistId: "cl-offer-hr",
        checklistName: "HR pack",
        name: "Welcome email sequence",
        dueDays: -1,
        memberId: "member-casey",
        labels: [labelCatalog[3]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: prep,
        cardId: "card-offer",
        cardName: "Offer & pre-boarding",
        checklistId: "cl-offer-kit",
        checklistName: "Kit & access",
        name: "Laptop imaged",
        dueDays: 0,
        memberId: "member-priya",
        labels: [labelCatalog[4]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: prep,
        cardId: "card-offer",
        cardName: "Offer & pre-boarding",
        checklistId: "cl-offer-kit",
        checklistName: "Kit & access",
        name: "Accounts & MFA",
        dueDays: 1,
        dueReminder: 60,
        memberId: "member-priya",
        labels: [labelCatalog[4]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: prep,
        cardId: "card-offer",
        cardName: "Offer & pre-boarding",
        checklistId: "cl-offer-kit",
        checklistName: "Kit & access",
        name: "Desk & badge ready",
        dueDays: 2,
        memberId: "member-sam",
        labels: [labelCatalog[4]],
        pos: 3,
      })
    );

    items.push(
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-meet",
        checklistName: "Meetings",
        name: "Buddy intro coffee",
        dueDays: 3,
        memberId: "member-jordan",
        labels: [labelCatalog[3]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-meet",
        checklistName: "Meetings",
        name: "Team overview",
        dueDays: 3,
        memberId: me.id,
        labels: [labelCatalog[3]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-meet",
        checklistName: "Meetings",
        name: "Skip-level with director",
        dueDays: 5,
        memberId: me.id,
        labels: [labelCatalog[3]],
        pos: 3,
      }),
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-learn",
        checklistName: "Learning path",
        name: "Security e-learning",
        dueDays: 4,
        memberId: "member-casey",
        labels: [labelCatalog[5]],
        pos: 1,
      }),
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-learn",
        checklistName: "Learning path",
        name: "Product walkthrough",
        dueDays: 6,
        memberId: "member-jordan",
        labels: [labelCatalog[2]],
        pos: 2,
      }),
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-learn",
        checklistName: "Learning path",
        name: "First PR paired",
        dueDays: 9,
        memberId: "member-sam",
        labels: [labelCatalog[2]],
        pos: 3,
      })
    );

    // Undated backlog item (omitted from Gantt bars)
    items.push(
      makeItem({
        board: board,
        list: week1,
        cardId: "card-week1",
        cardName: "First-week plan",
        checklistId: "cl-w1-learn",
        checklistName: "Learning path",
        name: "Optional stretch reading list",
        dueDays: null,
        memberId: "member-casey",
        labels: [labelCatalog[3]],
        pos: 4,
      })
    );

    memberCards.push(
      makeMembershipCard({
        board: board,
        list: week1,
        cardId: "card-buddy",
        name: "Buddy check-in (membership)",
        dueDays: 7,
        memberId: "member-jordan",
        idMembers: ["member-jordan", me.id],
        labels: [labelCatalog[3]],
      })
    );
  })();

  global.ChecklistHubMock = {
    buildDataset: function () {
      var dataset = {
        fetchedAt: Date.now(),
        me: me,
        boards: boards.slice(),
        scannedBoardIds: boards.map(function (b) {
          return b.id;
        }),
        members: members.slice(),
        labels: labelCatalog.slice(),
        lists: listCatalog.slice(),
        items: items.slice(),
        memberCards: memberCards.slice(),
      };
      if (
        global.ChecklistHubApi &&
        typeof global.ChecklistHubApi.withRemindersExpanded === "function"
      ) {
        return global.ChecklistHubApi.withRemindersExpanded(dataset);
      }
      return dataset;
    },

    getDataset: function () {
      return {
        me: me,
        boards: boards.slice(),
        members: members.slice(),
      };
    },

    getDemoTeams: function () {
      return [
        {
          id: "demo-team-relaunch",
          name: "Website relaunch",
          checklistId: "demo-team-relaunch",
          members: [me, members[2], members[4], members[5]],
          memberIds: [me.id, members[2].id, members[4].id, members[5].id],
          boardShortLinks: ["relaunchBoard"],
          demoBoardIds: [boards[0].id],
          boardIds: [boards[0].id],
        },
        {
          id: "demo-team-warehouse",
          name: "Warehouse automation",
          checklistId: "demo-team-warehouse",
          members: [me, members[1], members[3]],
          memberIds: [me.id, members[1].id, members[3].id],
          boardShortLinks: ["warehouseBoard"],
          demoBoardIds: [boards[1].id],
          boardIds: [boards[1].id],
        },
        {
          id: "demo-team-all-projects",
          name: "All demo projects",
          checklistId: "demo-team-all-projects",
          members: members.slice(),
          memberIds: members.map(function (m) {
            return m.id;
          }),
          boardShortLinks: ["relaunchBoard", "warehouseBoard", "onboardBoard"],
          demoBoardIds: boards.map(function (b) {
            return b.id;
          }),
          boardIds: boards.map(function (b) {
            return b.id;
          }),
        },
      ];
    },
  };
})(window);
