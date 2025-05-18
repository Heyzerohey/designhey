// Dashboard statistics with trend data
export const DASHBOARD_STATS = [
  {
    id: "active-clients",
    title: "Active Clients",
    value: "25",
    change: 15,
    trend: [
      { value: 18 },
      { value: 20 },
      { value: 19 },
      { value: 22 },
      { value: 25 },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    value: "45",
    change: -8,
    trend: [
      { value: 52 },
      { value: 48 },
      { value: 47 },
      { value: 45 },
      { value: 45 },
    ],
  },
  {
    id: "revenue",
    title: "Monthly Revenue",
    value: "$9,500",
    change: 22,
    trend: [
      { value: 7200 },
      { value: 7800 },
      { value: 8400 },
      { value: 9100 },
      { value: 9500 },
    ],
  },
  {
    id: "completion",
    title: "Completion Rate",
    value: "92%",
    change: 3,
    trend: [
      { value: 88 },
      { value: 89 },
      { value: 90 },
      { value: 91 },
      { value: 92 },
    ],
  },
];

// Recent cases with status information
export const RECENT_CASES = [
  {
    id: "case-001",
    title: "Smith v. Johnson",
    client: "John Smith",
    date: "2023-06-15",
    status: "active",
    type: "Litigation",
  },
  {
    id: "case-002",
    title: "Chen Estate Planning",
    client: "Sarah Chen",
    date: "2023-07-02",
    status: "pending",
    type: "Estate",
  },
  {
    id: "case-003",
    title: "Acme Corp Merger",
    client: "Acme Corporation",
    date: "2023-05-20",
    status: "completed",
    type: "Corporate",
  },
  {
    id: "case-004",
    title: "Rodriguez Divorce",
    client: "Maria Rodriguez",
    date: "2023-08-10",
    status: "on-hold",
    type: "Family",
  },
  {
    id: "case-005",
    title: "Tech Startup IP Filing",
    client: "NextGen Tech",
    date: "2023-07-28",
    status: "active",
    type: "Intellectual Property",
  },
];

// Upcoming events with details
export const UPCOMING_EVENTS = [
  {
    id: "event-001",
    title: "Smith v. Johnson Hearing",
    date: "2023-09-15",
    time: "10:00 AM",
    location: "County Courthouse, Room 304",
    type: "court",
    participants: ["John Smith", "Sarah Johnson", "Judge Williams"],
  },
  {
    id: "event-002",
    title: "Client Consultation - Chen Estate",
    date: "2023-09-12",
    time: "2:30 PM",
    location: "Office - Conference Room B",
    type: "consultation",
    participants: ["Sarah Chen", "Michael Wong"],
  },
  {
    id: "event-003",
    title: "Filing Deadline - Rodriguez Case",
    date: "2023-09-18",
    time: "5:00 PM",
    location: "Online Submission",
    type: "deadline",
  },
  {
    id: "event-004",
    title: "Team Strategy Meeting - Acme Corp",
    date: "2023-09-13",
    time: "9:00 AM",
    location: "Virtual - Zoom",
    type: "meeting",
    participants: [
      "David Kim",
      "Lisa Park",
      "Robert Johnson",
      "Emma Smith",
      "James Wilson",
    ],
  },
];

// Recent documents with metadata
export const RECENT_DOCUMENTS = [
  {
    id: "doc-001",
    name: "Legal Services Agreement - Smith.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2023-09-01",
    status: "signed",
  },
  {
    id: "doc-002",
    name: "Chen Estate Planning Draft.doc",
    type: "doc",
    size: "1.8 MB",
    uploadDate: "2023-09-05",
    status: "draft",
  },
  {
    id: "doc-003",
    name: "Rodriguez Case Evidence.jpg",
    type: "image",
    size: "3.2 MB",
    uploadDate: "2023-08-28",
    status: "final",
  },
  {
    id: "doc-004",
    name: "Acme Corp Merger Agreement.pdf",
    type: "pdf",
    size: "4.5 MB",
    uploadDate: "2023-08-15",
    status: "pending",
  },
  {
    id: "doc-005",
    name: "Tech Startup IP Application.pdf",
    type: "pdf",
    size: "2.1 MB",
    uploadDate: "2023-09-02",
    status: "submitted",
  },
];

// Recent activities timeline
export const RECENT_ACTIVITIES = [
  {
    id: "activity-001",
    type: "signature",
    title: "Agreement Signed",
    description: "Legal Services Agreement was signed by the client",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    user: {
      name: "Sarah Chen",
      avatar: "https://github.com/yusufhilmi.png",
    },
  },
  {
    id: "activity-002",
    type: "document",
    title: "Document Uploaded",
    description: "Estate planning documents were uploaded to the system",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    user: {
      name: "Michael Wong",
      avatar: "https://github.com/furkanksl.png",
    },
  },
  {
    id: "activity-003",
    type: "payment",
    title: "Payment Received",
    description: "Initial consultation fee of $500 was processed",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "activity-004",
    type: "message",
    title: "Message Sent",
    description: "Follow-up message regarding case details was sent",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    user: {
      name: "Sarah Chen",
      avatar: "https://github.com/yusufhilmi.png",
    },
  },
  {
    id: "activity-005",
    type: "event",
    title: "Meeting Scheduled",
    description: "Virtual consultation scheduled for next week",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    user: {
      name: "John Smith",
      avatar: "https://github.com/kdrnp.png",
    },
  },
  {
    id: "activity-006",
    type: "status",
    title: "Case Status Updated",
    description: "Rodriguez case status changed from 'pending' to 'active'",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    user: {
      name: "David Kim",
      avatar: "https://github.com/yahyabedirhan.png",
    },
  },
];
