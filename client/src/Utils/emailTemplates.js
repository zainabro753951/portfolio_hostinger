// src/utils/emailTemplates.js

export const emailTemplates = {
  welcome: {
    id: "welcome",
    name: "Welcome Response",
    icon: "Handshake",
    description: "Warm welcome for new inquiries",
    category: "general",
    content: `Dear {{name}},

Welcome to our platform! Thank you for reaching out regarding "{{subject}}".

We appreciate your interest and are excited to assist you. Our team has received your message and will get back to you within 24 hours.

In the meantime, feel free to explore our resources or contact us if you have any urgent questions.

Best regards,
Customer Support Team`,
  },

  urgent: {
    id: "urgent",
    name: "Urgent Response",
    icon: "Zap",
    description: "For high-priority issues",
    category: "support",
    content: `Dear {{name}},

Thank you for contacting us. We have marked your inquiry regarding "{{subject}}" as **high priority**.

Our technical team is already looking into this matter and will provide a resolution within 4 hours.

We apologize for any inconvenience caused.

Best regards,
Technical Support Team`,
  },

  resolved: {
    id: "resolved",
    name: "Issue Resolved",
    icon: "CheckCircle",
    description: "Confirm issue resolution",
    category: "support",
    content: `Dear {{name}},

Great news! We have successfully resolved the issue you reported regarding "{{subject}}".

Please verify that everything is working as expected on your end. If you experience any further issues, don't hesitate to reach out.

We appreciate your patience and understanding.

Best regards,
Support Team`,
  },

  followup: {
    id: "followup",
    name: "Follow-up",
    icon: "Clock",
    description: "Gentle follow-up message",
    category: "sales",
    content: `Dear {{name}},

I hope this email finds you well. I wanted to follow up on my previous message regarding "{{subject}}".

Have you had a chance to review the information provided? Please let me know if you need any clarification or additional assistance.

Looking forward to hearing from you.

Best regards,
Customer Success Team`,
  },

  escalation: {
    id: "escalation",
    name: "Escalation Notice",
    icon: "AlertCircle",
    description: "When issue needs escalation",
    category: "support",
    content: `Dear {{name}},

Thank you for your patience. Your case regarding "{{subject}}" has been escalated to our senior management team.

We understand the importance of this matter and are treating it with the highest priority. You will receive an update within 2 hours.

**Reference ID:** #ESC-{{date}}

Best regards,
Senior Support Team`,
  },

  feedback: {
    id: "feedback",
    name: "Feedback Request",
    icon: "Star",
    description: "Ask for customer feedback",
    category: "general",
    content: `Dear {{name}},

We hope our assistance regarding "{{subject}}" met your expectations.

Your feedback is valuable to us. Would you mind taking a moment to rate your experience? It helps us improve our services.

[Feedback Link]

Thank you for choosing us!

Best regards,
Customer Experience Team`,
  },

  demo: {
    id: "demo",
    name: "Demo Request",
    icon: "Calendar",
    description: "Schedule a demo call",
    category: "sales",
    content: `Dear {{name}},

Thank you for your interest in our product! I'd be happy to schedule a personalized demo for you regarding "{{subject}}".

Here are some available time slots:
- Tomorrow at 10:00 AM
- Tomorrow at 2:00 PM
- {{date}} at 11:00 AM

Please let me know which works best for you, or suggest an alternative time.

Best regards,
Sales Team`,
  },

  pricing: {
    id: "pricing",
    name: "Pricing Inquiry",
    icon: "DollarSign",
    description: "Respond to pricing questions",
    category: "sales",
    content: `Dear {{name}},

Thank you for inquiring about our pricing for "{{subject}}".

I've attached our detailed pricing brochure for your review. Here's a quick overview:

**Starter Plan:** $29/month
**Professional Plan:** $99/month  
**Enterprise Plan:** Custom pricing

I'd be happy to discuss which plan would best fit your needs. Would you like to schedule a quick call?

Best regards,
Sales Team`,
  },

  outOfOffice: {
    id: "outOfOffice",
    name: "Out of Office",
    icon: "Coffee",
    description: "Auto-reply when away",
    category: "general",
    content: `Dear {{name}},

Thank you for your email regarding "{{subject}}".

I am currently out of the office and will return on {{date}}. During this period, I will have limited access to email.

For urgent matters, please contact our support team at support@company.com or call +1-800-123-4567.

I'll get back to you as soon as possible upon my return.

Best regards,
[Your Name]`,
  },

  customProposal: {
    id: "customProposal",
    name: "Custom Proposal",
    icon: "FileText",
    description: "Send custom solution proposal",
    category: "sales",
    content: `Dear {{name}},

Thank you for providing detailed requirements about "{{subject}}".

After reviewing your needs, I've prepared a custom proposal tailored specifically for your business:

**Scope of Work:**
- [Detailed point 1]
- [Detailed point 2]
- [Detailed point 3]

**Timeline:** 2-3 weeks
**Investment:** $[Amount]

I've attached the full proposal document. Let's schedule a call to discuss any questions you might have.

Best regards,
Business Development Team`,
  },
};

// Template categories for filtering
export const templateCategories = [
  { id: "all", name: "All Templates", icon: "LayoutGrid" },
  { id: "general", name: "General", icon: "MessageSquare" },
  { id: "support", name: "Customer Support", icon: "Headphones" },
  { id: "sales", name: "Sales & Marketing", icon: "TrendingUp" },
];

// Helper function to get template by ID
export const getTemplateById = (id) => {
  return emailTemplates[id] || null;
};

// Helper function to get templates by category
export const getTemplatesByCategory = (category) => {
  if (category === "all") return Object.values(emailTemplates);
  return Object.values(emailTemplates).filter((t) => t.category === category);
};

// Helper function to process template variables
export const processTemplate = (template, variables = {}) => {
  let processed = template.content;

  Object.entries(variables).forEach(([key, value]) => {
    processed = processed.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  // Remove any unreplaced variables
  processed = processed.replace(/{{[^}]+}}/g, "");

  return processed;
};

// Default variables generator
export const generateDefaultVariables = (message) => ({
  name: message?.fullName || "Customer",
  subject: message?.subject || "",
  date: new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  time: new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }),
  email: message?.email || "",
});
