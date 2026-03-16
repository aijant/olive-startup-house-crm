import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertCommunicationSchema, insertScreeningSchema, insertOnboardingSchema, insertPropertySchema, insertRoomSchema, insertEventSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Dashboard Stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  });

  // Leads
  app.get("/api/leads", async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.get("/api/leads/:id", async (req, res) => {
    const lead = await storage.getLead(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  });

  app.post("/api/leads", async (req, res) => {
    const result = insertLeadSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid lead data", errors: result.error.errors });
    }
    const lead = await storage.createLead(result.data);
    res.status(201).json(lead);
  });

  app.patch("/api/leads/:id", async (req, res) => {
    const lead = await storage.updateLead(req.params.id, req.body);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  });

  app.delete("/api/leads/:id", async (req, res) => {
    const deleted = await storage.deleteLead(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(204).send();
  });

  // Communications
  app.get("/api/communications", async (req, res) => {
    const communications = await storage.getCommunications();
    res.json(communications);
  });

  app.get("/api/communications/stats", async (req, res) => {
    const stats = await storage.getCommunicationStats();
    res.json(stats);
  });

  app.get("/api/communications/:id", async (req, res) => {
    const comm = await storage.getCommunication(req.params.id);
    if (!comm) {
      return res.status(404).json({ message: "Communication not found" });
    }
    res.json(comm);
  });

  app.post("/api/communications", async (req, res) => {
    const result = insertCommunicationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid communication data", errors: result.error.errors });
    }
    const comm = await storage.createCommunication(result.data);
    res.status(201).json(comm);
  });

  // Screenings
  app.get("/api/screenings", async (req, res) => {
    const screenings = await storage.getScreenings();
    res.json(screenings);
  });

  app.get("/api/screenings/:id", async (req, res) => {
    const screening = await storage.getScreening(req.params.id);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }
    res.json(screening);
  });

  app.post("/api/screenings", async (req, res) => {
    const result = insertScreeningSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid screening data", errors: result.error.errors });
    }
    const screening = await storage.createScreening(result.data);
    res.status(201).json(screening);
  });

  app.patch("/api/screenings/:id", async (req, res) => {
    const screening = await storage.updateScreening(req.params.id, req.body);
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" });
    }
    res.json(screening);
  });

  // Onboardings
  app.get("/api/onboardings", async (req, res) => {
    const onboardings = await storage.getOnboardings();
    res.json(onboardings);
  });

  app.get("/api/onboardings/:id", async (req, res) => {
    const onboarding = await storage.getOnboarding(req.params.id);
    if (!onboarding) {
      return res.status(404).json({ message: "Onboarding not found" });
    }
    res.json(onboarding);
  });

  app.post("/api/onboardings", async (req, res) => {
    const result = insertOnboardingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid onboarding data", errors: result.error.errors });
    }
    const onboarding = await storage.createOnboarding(result.data);
    res.status(201).json(onboarding);
  });

  app.patch("/api/onboardings/:id", async (req, res) => {
    const onboarding = await storage.updateOnboarding(req.params.id, req.body);
    if (!onboarding) {
      return res.status(404).json({ message: "Onboarding not found" });
    }
    res.json(onboarding);
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  app.get("/api/properties/:id", async (req, res) => {
    const property = await storage.getProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  });

  app.post("/api/properties", async (req, res) => {
    const result = insertPropertySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid property data", errors: result.error.errors });
    }
    const property = await storage.createProperty(result.data);
    res.status(201).json(property);
  });

  // Rooms
  app.get("/api/rooms", async (req, res) => {
    const rooms = await storage.getRooms();
    res.json(rooms);
  });

  app.get("/api/rooms/:id", async (req, res) => {
    const room = await storage.getRoom(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  });

  app.get("/api/properties/:propertyId/rooms", async (req, res) => {
    const rooms = await storage.getRoomsByProperty(req.params.propertyId);
    res.json(rooms);
  });

  app.post("/api/rooms", async (req, res) => {
    const result = insertRoomSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid room data", errors: result.error.errors });
    }
    const room = await storage.createRoom(result.data);
    res.status(201).json(room);
  });

  // Events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  });

  app.post("/api/events", async (req, res) => {
    const result = insertEventSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid event data", errors: result.error.errors });
    }
    const event = await storage.createEvent(result.data);
    res.status(201).json(event);
  });

  // Community Stats
  app.get("/api/community/stats", async (req, res) => {
    const stats = await storage.getCommunityStats();
    res.json(stats);
  });

  // Financial Data
  app.get("/api/financials", async (req, res) => {
    const data = await storage.getFinancialData();
    res.json(data);
  });

  app.get("/api/financials/by-property", async (req, res) => {
    const data = await storage.getRevenueByProperty();
    res.json(data);
  });

  app.get("/api/financials/monthly", async (req, res) => {
    const data = await storage.getMonthlyFinancials();
    res.json(data);
  });

  app.get("/api/financials/revenue-breakdown", async (req, res) => {
    const data = await storage.getRevenueBreakdown();
    res.json(data);
  });

  app.get("/api/financials/expense-breakdown", async (req, res) => {
    const data = await storage.getExpenseBreakdown();
    res.json(data);
  });

  return httpServer;
}
