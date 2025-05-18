// Recent clients for dashboard display
export const RECENT_CLIENTS = [
  {
    id: "client-001",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+1 (555) 123-4567",
    status: "completed",
    lastEngagement: "2023-09-01",
    packageCount: 2,
  },
  {
    id: "client-002",
    name: "Michael Rodriguez",
    email: "michael.r@example.com",
    phone: "+1 (555) 987-6543",
    status: "awaiting",
    lastEngagement: "2023-09-05",
    packageCount: 1,
  },
  {
    id: "client-003",
    name: "Akira Tanaka",
    email: "akira.t@example.com",
    phone: "+1 (555) 456-7890",
    status: "signed",
    lastEngagement: "2023-08-28",
    packageCount: 3,
  },
  {
    id: "client-004",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    phone: "+1 (555) 234-5678",
    status: "completed",
    lastEngagement: "2023-08-15",
    packageCount: 2,
  },
  {
    id: "client-005",
    name: "David Kim",
    email: "david.k@example.com",
    phone: "+1 (555) 876-5432",
    status: "awaiting",
    lastEngagement: "2023-09-07",
    packageCount: 1,
  },
];

// All clients with detailed information
export const ALL_CLIENTS = [
  {
    id: "client-001",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    phone: "+1 (555) 123-4567",
    status: "completed",
    lastEngagement: "2023-09-01",
    packageCount: 2,
    packages: [
      {
        id: "pkg-001",
        name: "Client Agreement - Sarah Chen",
        status: "active",
        createdDate: "2023-09-01",
      },
      {
        id: "pkg-006",
        name: "Follow-up Consultation - Sarah Chen",
        status: "completed",
        createdDate: "2023-08-15",
      },
    ],

    notes: "Referred by Michael Rodriguez. Interested in ongoing services.",
  },
  {
    id: "client-002",
    name: "Michael Rodriguez",
    email: "michael.r@example.com",
    phone: "+1 (555) 987-6543",
    status: "awaiting",
    lastEngagement: "2023-09-05",
    packageCount: 1,
    packages: [
      {
        id: "pkg-007",
        name: "Initial Consultation - Michael Rodriguez",
        status: "draft",
        createdDate: "2023-09-05",
      },
    ],

    notes: "Prefers communication via email. Available evenings after 6 PM.",
  },
  {
    id: "client-003",
    name: "Akira Tanaka",
    email: "akira.t@example.com",
    phone: "+1 (555) 456-7890",
    status: "signed",
    lastEngagement: "2023-08-28",
    packageCount: 3,
    packages: [
      {
        id: "pkg-008",
        name: "Business Incorporation - Tanaka Enterprises",
        status: "completed",
        createdDate: "2023-07-10",
      },
      {
        id: "pkg-009",
        name: "Trademark Registration - Tanaka Enterprises",
        status: "active",
        createdDate: "2023-08-05",
      },
      {
        id: "pkg-010",
        name: "Employment Contracts - Tanaka Enterprises",
        status: "active",
        createdDate: "2023-08-28",
      },
    ],

    notes: "Long-term client. Planning to expand business next quarter.",
  },
  {
    id: "client-004",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    phone: "+1 (555) 234-5678",
    status: "completed",
    lastEngagement: "2023-08-15",
    packageCount: 2,
    packages: [
      {
        id: "pkg-011",
        name: "Estate Planning - Emma Johnson",
        status: "completed",
        createdDate: "2023-07-20",
      },
      {
        id: "pkg-012",
        name: "Will Preparation - Emma Johnson",
        status: "completed",
        createdDate: "2023-08-15",
      },
    ],

    notes: "Prefers phone calls over emails. Interested in trust services.",
  },
  {
    id: "client-005",
    name: "David Kim",
    email: "david.k@example.com",
    phone: "+1 (555) 876-5432",
    status: "awaiting",
    lastEngagement: "2023-09-07",
    packageCount: 1,
    packages: [
      {
        id: "pkg-013",
        name: "Startup Advisory - Kim Technologies",
        status: "draft",
        createdDate: "2023-09-07",
      },
    ],

    notes: "Tech startup founder. Looking for ongoing legal support.",
  },
  {
    id: "client-006",
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    phone: "+1 (555) 345-6789",
    status: "signed",
    lastEngagement: "2023-09-03",
    packageCount: 2,
    packages: [
      {
        id: "pkg-014",
        name: "Divorce Proceedings - Olivia Martinez",
        status: "active",
        createdDate: "2023-09-03",
      },
      {
        id: "pkg-015",
        name: "Child Custody Agreement - Olivia Martinez",
        status: "draft",
        createdDate: "2023-09-06",
      },
    ],

    notes: "Sensitive case. Requires urgent attention.",
  },
  {
    id: "client-007",
    name: "James Wilson",
    email: "james.w@example.com",
    phone: "+1 (555) 567-8901",
    status: "completed",
    lastEngagement: "2023-08-20",
    packageCount: 1,
    packages: [
      {
        id: "pkg-016",
        name: "Real Estate Purchase - Wilson Family",
        status: "completed",
        createdDate: "2023-08-20",
      },
    ],

    notes: "May need assistance with property management agreements soon.",
  },
  {
    id: "client-008",
    name: "Sophia Lee",
    email: "sophia.l@example.com",
    phone: "+1 (555) 678-9012",
    status: "awaiting",
    lastEngagement: "2023-09-08",
    packageCount: 1,
    packages: [
      {
        id: "pkg-017",
        name: "Immigration Consultation - Sophia Lee",
        status: "draft",
        createdDate: "2023-09-08",
      },
    ],

    notes: "Referred by Emma Johnson. Needs visa application assistance.",
  },
  {
    id: "client-009",
    name: "Acme Corporation",
    email: "legal@acmecorp.example",
    phone: "+1 (555) 789-0123",
    status: "signed",
    lastEngagement: "2023-08-25",
    packageCount: 2,
    packages: [
      {
        id: "pkg-002",
        name: "Consulting Services - Acme Corp",
        status: "draft",
        createdDate: "2023-09-05",
      },
      {
        id: "pkg-018",
        name: "Corporate Restructuring - Acme Corp",
        status: "active",
        createdDate: "2023-08-25",
      },
    ],

    notes: "Large corporate client. Multiple stakeholders involved.",
  },
  {
    id: "client-010",
    name: "Tech Startup Inc.",
    email: "contact@techstartup.example",
    phone: "+1 (555) 890-1234",
    status: "completed",
    lastEngagement: "2023-07-15",
    packageCount: 1,
    packages: [
      {
        id: "pkg-004",
        name: "Website Development - Tech Startup",
        status: "expired",
        createdDate: "2023-07-15",
      },
    ],

    notes: "Potential for renewal. Follow up in October.",
  },
];
