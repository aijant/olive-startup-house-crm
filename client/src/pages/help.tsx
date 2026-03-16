import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  Book,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

const faqItems = [
  {
    question: "How do I add a new lead to the pipeline?",
    answer: "Navigate to the Lead Pipeline page and click the 'Add New Lead' button. Fill in the lead's information including name, email, source, and budget. The lead will automatically be added to the 'New' status.",
  },
  {
    question: "How does the AI screening work?",
    answer: "Our AI screening tool conducts automated pre-screening interviews with prospects. It asks a series of questions and evaluates responses. Combined with background checks, it provides a comprehensive assessment of each candidate.",
  },
  {
    question: "Can I integrate my own smart lock system?",
    answer: "Yes! Go to Settings > Integrations > Smart Lock API and enter your provider's API credentials. We support most major smart lock brands including Yale, August, and Schlage.",
  },
  {
    question: "How do I schedule community events?",
    answer: "Go to the Community Hub page and click 'Create Event'. You can set the event type, date, time, location, and capacity. Members will be notified through connected messaging platforms.",
  },
  {
    question: "How is the financial reporting calculated?",
    answer: "Financial reports are generated automatically based on your property data, occupancy rates, and transaction history. Revenue is tracked by property, and expenses are categorized for easy P&L analysis.",
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export all your data from Settings > Data Management > Export. Data is exported in CSV format and includes leads, communications, screenings, and financial records.",
  },
];

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions and get support</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="pl-9"
              data-testid="input-search-help"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate cursor-pointer">
          <CardContent className="p-6 text-center">
            <Book className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-semibold mt-3">Documentation</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Browse our comprehensive guides
            </p>
            <Button variant="ghost" size="sm" className="mt-3" data-testid="button-view-docs">
              View Docs
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-semibold mt-3">Live Chat</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Chat with our support team
            </p>
            <Button variant="ghost" size="sm" className="mt-3" data-testid="button-start-chat">
              Start Chat
            </Button>
          </CardContent>
        </Card>
        <Card className="hover-elevate cursor-pointer">
          <CardContent className="p-6 text-center">
            <Mail className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-semibold mt-3">Email Support</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get help via email
            </p>
            <Button variant="ghost" size="sm" className="mt-3" data-testid="button-email-support">
              Send Email
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger 
                  className="text-left"
                  data-testid={`faq-trigger-${index}`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3 p-4 rounded-md bg-muted/50 flex-1">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-md bg-muted/50 flex-1">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@olive.house</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Our support team is available Monday - Friday, 9AM - 6PM PST
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
