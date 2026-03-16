import { randomUUID } from "crypto";
import type {
  Lead,
  InsertLead,
  Communication,
  InsertCommunication,
  Screening,
  InsertScreening,
  Onboarding,
  InsertOnboarding,
  Property,
  InsertProperty,
  Room,
  InsertRoom,
  CommunityEvent,
  InsertEvent,
  DashboardStats,
  CommunicationStats,
  CommunityStats,
  FinancialData,
  RevenueByProperty,
  MonthlyFinancial,
  RevenueBreakdown,
  ExpenseBreakdown,
} from "@shared/schema";

export interface IStorage {
  // Leads
  getLeads(): Promise<Lead[]>;
  getLead(id: string): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;

  // Communications
  getCommunications(): Promise<Communication[]>;
  getCommunication(id: string): Promise<Communication | undefined>;
  createCommunication(comm: InsertCommunication): Promise<Communication>;
  getCommunicationStats(): Promise<CommunicationStats>;

  // Screenings
  getScreenings(): Promise<Screening[]>;
  getScreening(id: string): Promise<Screening | undefined>;
  createScreening(screening: InsertScreening): Promise<Screening>;
  updateScreening(id: string, screening: Partial<InsertScreening>): Promise<Screening | undefined>;

  // Onboardings
  getOnboardings(): Promise<Onboarding[]>;
  getOnboarding(id: string): Promise<Onboarding | undefined>;
  createOnboarding(onboarding: InsertOnboarding): Promise<Onboarding>;
  updateOnboarding(id: string, onboarding: Partial<InsertOnboarding>): Promise<Onboarding | undefined>;

  // Properties
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;

  // Rooms
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  getRoomsByProperty(propertyId: string): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;

  // Events
  getEvents(): Promise<CommunityEvent[]>;
  getEvent(id: string): Promise<CommunityEvent | undefined>;
  createEvent(event: InsertEvent): Promise<CommunityEvent>;

  // Stats
  getDashboardStats(): Promise<DashboardStats>;
  getCommunityStats(): Promise<CommunityStats>;
  getFinancialData(): Promise<FinancialData>;
  getRevenueByProperty(): Promise<RevenueByProperty[]>;
  getMonthlyFinancials(): Promise<MonthlyFinancial[]>;
  getRevenueBreakdown(): Promise<RevenueBreakdown[]>;
  getExpenseBreakdown(): Promise<ExpenseBreakdown[]>;
}

export class MemStorage implements IStorage {
  private leads: Map<string, Lead> = new Map();
  private communications: Map<string, Communication> = new Map();
  private screenings: Map<string, Screening> = new Map();
  private onboardings: Map<string, Onboarding> = new Map();
  private properties: Map<string, Property> = new Map();
  private rooms: Map<string, Room> = new Map();
  private events: Map<string, CommunityEvent> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed Properties
    const propertyData: Property[] = [
      {
        id: "prop-1",
        name: "Olive Rooms Downtown",
        location: "Market District",
        totalBeds: 24,
        occupiedBeds: 22,
        totalRooms: 12,
        occupiedRooms: 11,
        monthlyRevenue: 18400,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      },
      {
        id: "prop-2",
        name: "Olive Rooms West",
        location: "Arts Quarter",
        totalBeds: 18,
        occupiedBeds: 14,
        totalRooms: 9,
        occupiedRooms: 7,
        monthlyRevenue: 12600,
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      },
      {
        id: "prop-3",
        name: "Olive Rooms Harbor",
        location: "Waterfront",
        totalBeds: 30,
        occupiedBeds: 28,
        totalRooms: 15,
        occupiedRooms: 14,
        monthlyRevenue: 24800,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      },
      {
        id: "prop-4",
        name: "Olive Rooms University",
        location: "Campus Area",
        totalBeds: 20,
        occupiedBeds: 19,
        totalRooms: 10,
        occupiedRooms: 10,
        monthlyRevenue: 16200,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      },
    ];
    propertyData.forEach((p) => this.properties.set(p.id, p));

    // Seed Rooms
    const roomData: Room[] = [
      { id: "room-1", propertyId: "prop-1", name: "Room 101", type: "Single", beds: 1, isOccupied: true, monthlyRate: 800, hasSmartLock: true },
      { id: "room-2", propertyId: "prop-1", name: "Room 102", type: "Double", beds: 2, isOccupied: true, monthlyRate: 1200, hasSmartLock: true },
      { id: "room-3", propertyId: "prop-1", name: "Room 103", type: "Shared", beds: 4, isOccupied: true, monthlyRate: 600, hasSmartLock: false },
      { id: "room-4", propertyId: "prop-2", name: "Room 201", type: "Single", beds: 1, isOccupied: false, monthlyRate: 750, hasSmartLock: true },
      { id: "room-5", propertyId: "prop-2", name: "Room 202", type: "Double", beds: 2, isOccupied: true, monthlyRate: 1100, hasSmartLock: true },
      { id: "room-6", propertyId: "prop-3", name: "Room 301", type: "Single", beds: 1, isOccupied: true, monthlyRate: 900, hasSmartLock: true },
      { id: "room-7", propertyId: "prop-3", name: "Room 302", type: "Double", beds: 2, isOccupied: true, monthlyRate: 1400, hasSmartLock: true },
      { id: "room-8", propertyId: "prop-4", name: "Room 401", type: "Shared", beds: 4, isOccupied: true, monthlyRate: 550, hasSmartLock: false },
      { id: "room-9", propertyId: "prop-4", name: "Room 402", type: "Single", beds: 1, isOccupied: true, monthlyRate: 700, hasSmartLock: true },
    ];
    roomData.forEach((r) => this.rooms.set(r.id, r));

    // Seed Leads
    const leadData: Lead[] = [
      {
        id: "lead-1",
        name: "Emma Rodriguez",
        email: "emma.r@email.com",
        phone: "+1 555-0101",
        source: "Instagram",
        status: "New",
        budget: 1200,
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "lead-2",
        name: "James Chen",
        email: "james.chen@email.com",
        phone: "+1 555-0102",
        source: "Website",
        status: "Contacted",
        budget: 1500,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "lead-3",
        name: "Maria Santos",
        email: "maria.s@email.com",
        phone: "+1 555-0103",
        source: "Booking.com",
        status: "Qualified",
        budget: 2100,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "lead-4",
        name: "Alex Thompson",
        email: "alex.t@email.com",
        phone: "+1 555-0104",
        source: "Referral",
        status: "New",
        budget: 900,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "lead-5",
        name: "Sophie Lin",
        email: "sophie.lin@email.com",
        phone: "+1 555-0105",
        source: "Airbnb",
        status: "Contacted",
        budget: 1800,
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "lead-6",
        name: "Michael Brown",
        email: "michael.b@email.com",
        source: "WOM",
        status: "Qualified",
        budget: 1350,
        createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "lead-7",
        name: "Sarah Wilson",
        email: "sarah.w@email.com",
        source: "Instagram",
        status: "New",
        budget: 1100,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
    ];
    leadData.forEach((l) => this.leads.set(l.id, l));

    // Seed Communications
    const commData: Communication[] = [
      {
        id: "comm-1",
        leadId: "lead-1",
        leadName: "Jessica Turner",
        leadAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
        type: "Text/SMS",
        status: "Docs Requested",
        message: "Sent ID verification request",
        nextAction: "Awaiting documents",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },
      {
        id: "comm-2",
        leadId: "lead-2",
        leadName: "Marcus Johnson",
        leadAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        type: "In-Person",
        status: "In Progress",
        message: "In-person tour scheduled",
        nextAction: "Tour today at 3 PM",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comm-3",
        leadId: "lead-3",
        leadName: "Aisha Patel",
        leadAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
        type: "Video Tour",
        status: "Link Sent",
        message: "Virtual tour link shared",
        nextAction: "Follow up after viewing",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comm-4",
        leadId: "lead-4",
        leadName: "Carlos Rodriguez",
        leadAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
        type: "Phone Call",
        status: "Form Filled",
        message: "Application completed",
        nextAction: "Schedule interview",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comm-5",
        leadId: "lead-5",
        leadName: "Nina Yamamoto",
        leadAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
        type: "Email",
        status: "Pending",
        message: "Initial inquiry received",
        nextAction: "Send welcome package",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "comm-6",
        leadId: "lead-6",
        leadName: "Thomas Anderson",
        leadAvatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop",
        type: "Text/SMS",
        status: "Completed",
        message: "All documents verified",
        nextAction: "Move to onboarding",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    commData.forEach((c) => this.communications.set(c.id, c));

    // Seed Screenings
    const screeningData: Screening[] = [
      {
        id: "screen-1",
        leadId: "lead-1",
        leadName: "Michael Johnson",
        leadAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        status: "In Progress",
        progress: 65,
        backgroundCheckComplete: false,
        aiInterviewComplete: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "screen-2",
        leadId: "lead-2",
        leadName: "Lisa Anderson",
        leadAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        status: "Approved",
        progress: 100,
        backgroundCheckComplete: true,
        aiInterviewComplete: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "screen-3",
        leadId: "lead-3",
        leadName: "David Kim",
        leadAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        status: "In Progress",
        progress: 40,
        backgroundCheckComplete: false,
        aiInterviewComplete: false,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "screen-4",
        leadId: "lead-4",
        leadName: "Rachel Green",
        leadAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        status: "Flagged",
        progress: 85,
        backgroundCheckComplete: true,
        aiInterviewComplete: true,
        notes: "Additional verification needed",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "screen-5",
        leadId: "lead-5",
        leadName: "Tom Wilson",
        status: "Approved",
        progress: 100,
        backgroundCheckComplete: true,
        aiInterviewComplete: true,
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "screen-6",
        leadId: "lead-6",
        leadName: "Emily Davis",
        status: "Rejected",
        progress: 100,
        backgroundCheckComplete: true,
        aiInterviewComplete: true,
        notes: "Does not meet requirements",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      },
    ];
    screeningData.forEach((s) => this.screenings.set(s.id, s));

    // Seed Onboardings
    const onboardingData: Onboarding[] = [
      {
        id: "onboard-1",
        leadId: "lead-1",
        memberName: "Oliver Martinez",
        memberAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        status: "Orientation",
        moveInDate: "2026-02-01",
        monthlyRent: 1200,
        orientationComplete: false,
        invoicePaid: false,
        propertyId: "prop-1",
        roomId: "room-1",
      },
      {
        id: "onboard-2",
        leadId: "lead-2",
        memberName: "Emma Wilson",
        memberAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        status: "Invoice Sent",
        moveInDate: "2026-02-03",
        monthlyRent: 1500,
        orientationComplete: true,
        invoicePaid: false,
        propertyId: "prop-2",
      },
      {
        id: "onboard-3",
        leadId: "lead-3",
        memberName: "Noah Brown",
        status: "Docs Pending",
        moveInDate: "2026-02-05",
        monthlyRent: 1350,
        orientationComplete: false,
        invoicePaid: false,
        propertyId: "prop-3",
      },
      {
        id: "onboard-4",
        leadId: "lead-4",
        memberName: "Ava Davis",
        memberAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
        status: "Complete",
        moveInDate: "2026-01-28",
        monthlyRent: 1200,
        orientationComplete: true,
        invoicePaid: true,
        propertyId: "prop-1",
        roomId: "room-2",
      },
      {
        id: "onboard-5",
        leadId: "lead-5",
        memberName: "Liam Taylor",
        status: "Orientation",
        moveInDate: "2026-02-08",
        monthlyRent: 1100,
        orientationComplete: false,
        invoicePaid: false,
        propertyId: "prop-4",
      },
      {
        id: "onboard-6",
        leadId: "lead-6",
        memberName: "Sophia Lee",
        status: "Invoice Sent",
        moveInDate: "2026-02-10",
        monthlyRent: 1400,
        orientationComplete: true,
        invoicePaid: false,
        propertyId: "prop-2",
      },
    ];
    onboardingData.forEach((o) => this.onboardings.set(o.id, o));

    // Seed Events
    const eventData: CommunityEvent[] = [
      {
        id: "event-1",
        title: "Coworking Coffee & Connect",
        type: "networking",
        date: "2026-01-28",
        time: "9:00 AM",
        location: "Downtown Common Area",
        capacity: 25,
        attendees: 18,
        propertyId: "prop-1",
      },
      {
        id: "event-2",
        title: "Yoga & Wellness Session",
        type: "wellness",
        date: "2026-01-30",
        time: "6:00 PM",
        location: "Harbor Rooftop",
        capacity: 20,
        attendees: 12,
        propertyId: "prop-3",
      },
      {
        id: "event-3",
        title: "Freelancer Skills Workshop",
        type: "workshop",
        date: "2026-02-02",
        time: "2:00 PM",
        location: "West Community Room",
        capacity: 30,
        attendees: 22,
        propertyId: "prop-2",
      },
      {
        id: "event-4",
        title: "Friday Social Night",
        type: "social",
        date: "2026-02-05",
        time: "7:00 PM",
        location: "University Lounge",
        capacity: 50,
        attendees: 35,
        propertyId: "prop-4",
      },
    ];
    eventData.forEach((e) => this.events.set(e.id, e));
  }

  // Leads
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const newLead: Lead = {
      ...lead,
      id,
      createdAt: new Date().toISOString(),
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async updateLead(id: string, lead: Partial<InsertLead>): Promise<Lead | undefined> {
    const existing = this.leads.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...lead };
    this.leads.set(id, updated);
    return updated;
  }

  async deleteLead(id: string): Promise<boolean> {
    return this.leads.delete(id);
  }

  // Communications
  async getCommunications(): Promise<Communication[]> {
    return Array.from(this.communications.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getCommunication(id: string): Promise<Communication | undefined> {
    return this.communications.get(id);
  }

  async createCommunication(comm: InsertCommunication): Promise<Communication> {
    const id = randomUUID();
    const newComm: Communication = {
      ...comm,
      id,
      timestamp: new Date().toISOString(),
    };
    this.communications.set(id, newComm);
    return newComm;
  }

  async getCommunicationStats(): Promise<CommunicationStats> {
    const comms = Array.from(this.communications.values());
    return {
      textMessages: comms.filter((c) => c.type === "Text/SMS").length + 85,
      phoneCalls: comms.filter((c) => c.type === "Phone Call").length + 43,
      videoTours: comms.filter((c) => c.type === "Video Tour").length + 30,
      inPersonTours: comms.filter((c) => c.type === "In-Person").length + 26,
      emails: comms.filter((c) => c.type === "Email").length + 154,
      totalActivity: comms.length + 344,
      docsPending: comms.filter((c) => c.status === "Docs Requested").length + 16,
      linksSent: comms.filter((c) => c.status === "Link Sent").length + 22,
      formsFilled: comms.filter((c) => c.status === "Form Filled").length + 30,
      toursScheduled: 16,
    };
  }

  // Screenings
  async getScreenings(): Promise<Screening[]> {
    return Array.from(this.screenings.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getScreening(id: string): Promise<Screening | undefined> {
    return this.screenings.get(id);
  }

  async createScreening(screening: InsertScreening): Promise<Screening> {
    const id = randomUUID();
    const newScreening: Screening = {
      ...screening,
      id,
      timestamp: new Date().toISOString(),
    };
    this.screenings.set(id, newScreening);
    return newScreening;
  }

  async updateScreening(id: string, screening: Partial<InsertScreening>): Promise<Screening | undefined> {
    const existing = this.screenings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...screening };
    this.screenings.set(id, updated);
    return updated;
  }

  // Onboardings
  async getOnboardings(): Promise<Onboarding[]> {
    return Array.from(this.onboardings.values()).sort(
      (a, b) => new Date(a.moveInDate).getTime() - new Date(b.moveInDate).getTime()
    );
  }

  async getOnboarding(id: string): Promise<Onboarding | undefined> {
    return this.onboardings.get(id);
  }

  async createOnboarding(onboarding: InsertOnboarding): Promise<Onboarding> {
    const id = randomUUID();
    const newOnboarding: Onboarding = {
      ...onboarding,
      id,
    };
    this.onboardings.set(id, newOnboarding);
    return newOnboarding;
  }

  async updateOnboarding(id: string, onboarding: Partial<InsertOnboarding>): Promise<Onboarding | undefined> {
    const existing = this.onboardings.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...onboarding };
    this.onboardings.set(id, updated);
    return updated;
  }

  // Properties
  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = randomUUID();
    const newProperty: Property = {
      ...property,
      id,
    };
    this.properties.set(id, newProperty);
    return newProperty;
  }

  // Rooms
  async getRooms(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async getRoomsByProperty(propertyId: string): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter((r) => r.propertyId === propertyId);
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const newRoom: Room = {
      ...room,
      id,
    };
    this.rooms.set(id, newRoom);
    return newRoom;
  }

  // Events
  async getEvents(): Promise<CommunityEvent[]> {
    return Array.from(this.events.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getEvent(id: string): Promise<CommunityEvent | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<CommunityEvent> {
    const id = randomUUID();
    const newEvent: CommunityEvent = {
      ...event,
      id,
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  // Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const leads = Array.from(this.leads.values());
    const screenings = Array.from(this.screenings.values());
    const onboardings = Array.from(this.onboardings.values());
    const properties = Array.from(this.properties.values());
    const events = Array.from(this.events.values());

    const totalBeds = properties.reduce((sum, p) => sum + p.totalBeds, 0);
    const occupiedBeds = properties.reduce((sum, p) => sum + p.occupiedBeds, 0);

    return {
      totalLeads: leads.length + 198,
      leadsChange: 12.5,
      activeScreenings: screenings.filter((s) => s.status === "In Progress").length + 16,
      screeningsChange: 8.3,
      pendingOnboarding: onboardings.filter((o) => o.status !== "Complete").length + 7,
      onboardingChange: 5.2,
      currentOccupancy: Math.round((occupiedBeds / totalBeds) * 100),
      occupancyChange: 3.1,
      communityEvents: events.length + 1,
      eventsChange: 25,
      toolUsageToday: 156,
      toolUsageChange: 15.7,
    };
  }

  async getCommunityStats(): Promise<CommunityStats> {
    return {
      activeMembers: 187,
      membersChange: 8.2,
      whatsappEngagement: 94,
      engagementChange: 5.3,
      telegramGroups: 12,
      groupsChange: 20,
      monthlyEvents: 24,
      eventsChange: 12.5,
    };
  }

  async getFinancialData(): Promise<FinancialData> {
    return {
      totalRevenue: 183700,
      revenueChange: 4.8,
      netProfit: 85500,
      profitChange: 6.2,
      profitMargin: 46.5,
      marginChange: 0.6,
      avgOccupancy: 91,
    };
  }

  async getRevenueByProperty(): Promise<RevenueByProperty[]> {
    return [
      { propertyId: "prop-1", propertyName: "Downtown Hub", location: "Downtown District", revenue: 48500, change: 8.3, occupiedRooms: 22, totalRooms: 24 },
      { propertyId: "prop-3", propertyName: "Harbor View", location: "Harbor District", revenue: 52300, change: 12.1, occupiedRooms: 27, totalRooms: 28 },
      { propertyId: "prop-4", propertyName: "University Residence", location: "University Area", revenue: 38700, change: 3.2, occupiedRooms: 18, totalRooms: 20 },
      { propertyId: "prop-2", propertyName: "West Side Commons", location: "West Side", revenue: 44200, change: 5.7, occupiedRooms: 20, totalRooms: 22 },
    ];
  }

  async getMonthlyFinancials(): Promise<MonthlyFinancial[]> {
    return [
      { month: "Jan", year: 2026, revenue: 184000, expenses: 98000, profit: 86000, margin: 46.5, isCurrent: true },
      { month: "Dec", year: 2025, revenue: 175000, expenses: 95000, profit: 81000, margin: 45.9, isCurrent: false },
      { month: "Nov", year: 2025, revenue: 169000, expenses: 92000, profit: 77000, margin: 45.5, isCurrent: false },
      { month: "Oct", year: 2025, revenue: 171000, expenses: 94000, profit: 78000, margin: 45.4, isCurrent: false },
      { month: "Sep", year: 2025, revenue: 165000, expenses: 91000, profit: 74000, margin: 44.9, isCurrent: false },
      { month: "Aug", year: 2025, revenue: 170000, expenses: 93000, profit: 77000, margin: 45.3, isCurrent: false },
    ];
  }

  async getRevenueBreakdown(): Promise<RevenueBreakdown[]> {
    return [
      { category: "Room Rentals", amount: 156400, percentage: 85.1, change: 7.2 },
      { category: "Co-working Memberships", amount: 18200, percentage: 9.9, change: 15.3 },
      { category: "Event Hosting", amount: 5800, percentage: 3.2, change: 22.8 },
      { category: "Other Services", amount: 3300, percentage: 1.8, change: -5.4 },
    ];
  }

  async getExpenseBreakdown(): Promise<ExpenseBreakdown[]> {
    return [
      { category: "Property Operations", amount: 42100, percentage: 42.9, change: 3.2 },
      { category: "Staff & Payroll", amount: 28500, percentage: 29.0, change: 5.1 },
      { category: "Marketing & Sales", amount: 12800, percentage: 13.0, change: 18.5 },
      { category: "Technology & Tools", amount: 8200, percentage: 8.4, change: 12.3 },
      { category: "Administrative", amount: 6600, percentage: 6.7, change: -2.1 },
    ];
  }
}

export const storage = new MemStorage();
