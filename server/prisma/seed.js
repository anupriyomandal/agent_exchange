const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@agentexchange.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@agentexchange.com',
      password_hash: passwordHash,
      role: 'admin',
    },
  });
  console.log('Created admin user:', admin.email);

  const agents = [
    {
      name: 'SupportBot Pro',
      slug: 'supportbot-pro',
      short_description: '24/7 customer support with smart ticket routing and escalation',
      long_description: `## SupportBot Pro

SupportBot Pro is your always-on customer support solution. Powered by advanced AI, it handles common queries, routes complex issues to the right team, and escalates urgent matters automatically.

### Key Features

- **Smart Routing**: Automatically categorizes and routes tickets based on content and urgency
- **24/7 Availability**: Never miss a customer query, day or night
- **Multi-channel**: Available on Web, WhatsApp, and Telegram
- **Escalation Logic**: Knows when to hand off to a human agent
- **CRM Integration**: Syncs with your existing helpdesk tools

### How It Works

1. Customer sends a message on any supported channel
2. SupportBot Pro understands the intent and context
3. Common queries are resolved instantly with accurate answers
4. Complex or sensitive issues are routed to the right human agent
5. All interactions are logged for analytics and training

Perfect for e-commerce, SaaS, and service businesses that want to deliver exceptional support at scale.`,
      category: 'customer_support',
      channels: ['web', 'whatsapp', 'telegram'],
      channel_links: {
        web: 'https://supportbot.example.com',
        whatsapp: 'https://wa.me/1234567890',
        telegram: 'https://t.me/supportbotpro',
      },
      status: 'published',
      likes_count: 142,
      reviews: [
        { reviewer_name: 'Sarah M.', rating: 5, comment: 'Reduced our support load by 60%. Absolutely love it!' },
        { reviewer_name: 'James T.', rating: 4, comment: 'Great bot, handles most common questions well. Escalation logic could be smarter.' },
        { reviewer_name: 'Priya K.', rating: 5, comment: 'Our customers love getting instant replies at 3am. Game changer.' },
      ],
    },
    {
      name: 'LeadGen AI',
      slug: 'leadgen-ai',
      short_description: 'Qualifies inbound leads and books meetings on your calendar',
      long_description: `## LeadGen AI

Turn your website visitors into qualified leads automatically. LeadGen AI engages prospects in natural conversation, qualifies them based on your criteria, and books meetings directly on your sales team's calendar.

### Key Features

- **Lead Qualification**: Asks the right questions to determine fit and intent
- **Calendar Integration**: Books meetings via Calendly, Google Calendar, or HubSpot
- **CRM Sync**: Pushes qualified leads directly to Salesforce, HubSpot, or Pipedrive
- **Custom Qualification Criteria**: Define your ICP and the bot adapts accordingly
- **Follow-up Sequences**: Automated follow-ups for leads who didn't book

### Results You Can Expect

- 3x increase in lead-to-meeting conversion rate
- 40% reduction in SDR time spent on qualification
- 24/7 lead capture with no leads slipping through the cracks

Ideal for B2B SaaS companies, agencies, and any business with a defined sales process.`,
      category: 'sales',
      channels: ['web', 'whatsapp'],
      channel_links: {
        web: 'https://leadgenai.example.com',
        whatsapp: 'https://wa.me/0987654321',
      },
      status: 'published',
      likes_count: 98,
      reviews: [
        { reviewer_name: 'Michael R.', rating: 5, comment: 'Our SDRs now only talk to pre-qualified leads. Conversion rate is up 40%.' },
        { reviewer_name: 'Anita L.', rating: 4, comment: 'Really smart qualification flow. Took a bit to set up but worth it.' },
        { reviewer_name: 'Tom H.', rating: 5, comment: 'Books 10-15 meetings per week on autopilot. Incredible ROI.' },
      ],
    },
    {
      name: 'HR Helpdesk',
      slug: 'hr-helpdesk',
      short_description: 'Employee self-service for leave, payroll queries, and policy lookups',
      long_description: `## HR Helpdesk

Give your employees instant answers to their HR questions without burdening your HR team. HR Helpdesk handles leave requests, payroll queries, policy lookups, and more — available 24/7 on Telegram and Slack.

### Key Features

- **Leave Management**: Check balances, submit requests, get approvals
- **Payroll FAQs**: Answer common payslip and tax questions instantly
- **Policy Library**: Searchable knowledge base of all HR policies
- **Onboarding Support**: Guide new hires through their first 90 days
- **Escalation to HR**: Complex issues routed to the right HR person

### Supported Queries

- "How many leave days do I have left?"
- "When is the next payroll date?"
- "What's our work from home policy?"
- "How do I update my emergency contact?"
- "What benefits am I eligible for?"

Trusted by HR teams at companies with 50-5000 employees.`,
      category: 'hr',
      channels: ['telegram', 'slack'],
      channel_links: {
        telegram: 'https://t.me/hrhelpdesk',
        slack: 'https://slack.com/apps/hr-helpdesk',
      },
      status: 'published',
      likes_count: 76,
      reviews: [
        { reviewer_name: 'Divya S.', rating: 5, comment: 'Our HR team finally has time for strategic work. This bot handles 80% of routine queries.' },
        { reviewer_name: 'Chris B.', rating: 4, comment: 'Employees love it. The policy search is especially useful.' },
        { reviewer_name: 'Nadia F.', rating: 5, comment: 'Perfect for our distributed team across time zones.' },
      ],
    },
    {
      name: 'OrderTrack Bot',
      slug: 'ordertrack-bot',
      short_description: 'Real-time order status, delivery tracking, and return initiation',
      long_description: `## OrderTrack Bot

Stop answering "Where is my order?" emails. OrderTrack Bot gives your customers real-time order status, delivery tracking, and lets them initiate returns — all without human intervention.

### Key Features

- **Real-time Tracking**: Live updates from all major carriers (FedEx, UPS, DHL, USPS)
- **Order Lookup**: Customers find their order with just their email or order number
- **Return Initiation**: Guided return flow with label generation
- **Delivery Exceptions**: Proactive alerts for delays or failed deliveries
- **Order Modification**: Allow order edits within your policy window

### Integration Ready

Works with Shopify, WooCommerce, Magento, and custom order management systems via webhook or API.

Reduce WISMO (Where Is My Order) tickets by up to 75% and improve customer satisfaction scores.`,
      category: 'customer_support',
      channels: ['web', 'whatsapp', 'telegram'],
      channel_links: {
        web: 'https://ordertrack.example.com',
        whatsapp: 'https://wa.me/1122334455',
        telegram: 'https://t.me/ordertrackbot',
      },
      status: 'published',
      likes_count: 119,
      reviews: [
        { reviewer_name: 'Emma W.', rating: 5, comment: 'WISMO tickets down 70% in the first month. This is essential for e-commerce.' },
        { reviewer_name: 'Raj P.', rating: 4, comment: 'Works great with Shopify. Return flow is smooth.' },
        { reviewer_name: 'Lisa K.', rating: 5, comment: 'Our customers are so much happier. Self-service returns are a huge win.' },
      ],
    },
    {
      name: 'ContentCraft',
      slug: 'contentcraft',
      short_description: 'Marketing copy generator for social, email, and ad campaigns',
      long_description: `## ContentCraft

Create compelling marketing copy in seconds. ContentCraft generates high-quality content for social media, email campaigns, Google/Facebook ads, and more — all tailored to your brand voice.

### Key Features

- **Brand Voice Training**: Upload examples to teach the bot your brand style
- **Multi-format Output**: Social posts, email subject lines, ad copy, blog intros
- **A/B Variants**: Generate multiple versions for testing
- **Platform Optimization**: Content length and style optimized per platform
- **SEO Integration**: Keyword-aware content generation for blog posts

### Content Types Supported

- Instagram/LinkedIn/Twitter captions
- Email subject lines and preview text
- Google Ads headlines and descriptions
- Facebook/Instagram ad copy
- Product descriptions
- Blog post outlines and introductions

Save 10+ hours per week on content creation while maintaining quality and consistency.`,
      category: 'marketing',
      channels: ['web'],
      channel_links: {
        web: 'https://contentcraft.example.com',
      },
      status: 'published',
      likes_count: 87,
      reviews: [
        { reviewer_name: 'Zoe M.', rating: 5, comment: 'Our content team uses this daily. Quality is surprisingly good.' },
        { reviewer_name: 'Aaron D.', rating: 4, comment: 'Great for first drafts. Still needs human review but saves tons of time.' },
        { reviewer_name: 'Camille R.', rating: 5, comment: 'The brand voice training feature is what makes this special.' },
      ],
    },
    {
      name: 'OnboardBuddy',
      slug: 'onboardbuddy',
      short_description: 'Guides new hires through onboarding checklists and company policies',
      long_description: `## OnboardBuddy

Make every new hire feel welcome and prepared from day one. OnboardBuddy walks new employees through their onboarding checklist, answers policy questions, and connects them with the right people — reducing time-to-productivity by 30%.

### Key Features

- **Personalized Onboarding Plans**: Different flows for different roles/departments
- **Checklist Tracking**: Visual progress through required tasks
- **Policy Q&A**: Instant answers from your employee handbook
- **People Directory**: Find the right person for any question
- **IT Setup Guidance**: Step-by-step setup for tools and access
- **30/60/90 Day Check-ins**: Automated milestone conversations

### What New Hires Say

"I felt so prepared on my first day. OnboardBuddy answered every question I had before I even thought to ask."

Works natively in Slack and on Web, integrating with your HRIS and IT ticketing systems.`,
      category: 'hr',
      channels: ['slack', 'web'],
      channel_links: {
        slack: 'https://slack.com/apps/onboardbuddy',
        web: 'https://onboardbuddy.example.com',
      },
      status: 'published',
      likes_count: 64,
      reviews: [
        { reviewer_name: 'Mark T.', rating: 5, comment: 'New hire ramp time cut from 3 weeks to 10 days. Incredible.' },
        { reviewer_name: 'Sophia L.', rating: 5, comment: 'Our HR team loves it. New hires stop asking basic questions and actually get productive faster.' },
        { reviewer_name: 'Daniel C.', rating: 4, comment: 'Solid tool. Would love deeper HRIS integrations but the core works great.' },
      ],
    },
    {
      name: 'InvoiceBot',
      slug: 'invoicebot',
      short_description: 'Automates invoice generation, payment reminders, and receipt tracking',
      long_description: `## InvoiceBot

Stop chasing payments manually. InvoiceBot automates your entire invoicing workflow — from generating professional invoices to sending smart payment reminders and reconciling receipts.

### Key Features

- **Invoice Generation**: Create professional invoices from templates in seconds
- **Automated Reminders**: Smart payment reminders at 7, 3, and 1 day before due date
- **Overdue Follow-ups**: Escalating reminder sequences for overdue invoices
- **Receipt Matching**: Automatically match incoming payments to invoices
- **Multi-currency**: Support for 50+ currencies
- **Tax Calculation**: Built-in tax rate management by country/region

### Integrations

- QuickBooks, Xero, FreshBooks
- Stripe, PayPal, bank transfers
- WhatsApp and Web portals for client communication

Reduce average days-to-payment by 40% and eliminate manual reconciliation work.`,
      category: 'finance',
      channels: ['whatsapp', 'web'],
      channel_links: {
        whatsapp: 'https://wa.me/9988776655',
        web: 'https://invoicebot.example.com',
      },
      status: 'published',
      likes_count: 53,
      reviews: [
        { reviewer_name: 'Patricia N.', rating: 5, comment: 'Clients pay faster because the reminders are polite but persistent. Love it.' },
        { reviewer_name: 'Raj G.', rating: 4, comment: 'QuickBooks integration is seamless. Saves my bookkeeper hours every week.' },
        { reviewer_name: 'Helen S.', rating: 5, comment: 'Finally automated the most tedious part of running a small business.' },
      ],
    },
    {
      name: 'IT HelpDesk',
      slug: 'it-helpdesk',
      short_description: 'Handles password resets, VPN issues, and common IT troubleshooting',
      long_description: `## IT HelpDesk

Resolve 60% of IT issues without involving your IT team. IT HelpDesk handles the most common IT support requests automatically — password resets, VPN troubleshooting, software access, and more.

### Key Features

- **Password Resets**: Secure, verified self-service password resets
- **VPN Troubleshooting**: Step-by-step guides for common VPN issues
- **Software Access Requests**: Automated provisioning for approved tools
- **Hardware FAQs**: Troubleshoot common hardware and connectivity issues
- **Ticket Creation**: Creates and tracks tickets for issues that need IT team
- **Knowledge Base Search**: Instant answers from your IT documentation

### Supported Platforms

- Active Directory / Azure AD integration
- Okta, JumpCloud, Google Workspace
- ServiceNow, Jira Service Management, Zendesk IT
- Available on Slack and Telegram

Free your IT team from repetitive L1 tickets so they can focus on infrastructure, security, and strategic projects.`,
      category: 'internal_tools',
      channels: ['slack', 'telegram'],
      channel_links: {
        slack: 'https://slack.com/apps/it-helpdesk',
        telegram: 'https://t.me/ithelpdesk',
      },
      status: 'published',
      likes_count: 91,
      reviews: [
        { reviewer_name: 'Kevin L.', rating: 5, comment: 'IT ticket volume down 55%. Our team can finally focus on real projects.' },
        { reviewer_name: 'Alicia M.', rating: 4, comment: 'Password reset automation alone saved us hours per week. Everything else is a bonus.' },
        { reviewer_name: 'Sam R.', rating: 5, comment: 'Best IT investment we made this year. Employees get help immediately, 24/7.' },
      ],
    },
  ];

  for (const agentData of agents) {
    const { reviews, ...data } = agentData;
    const agent = await prisma.agent.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        created_by: admin.id,
      },
    });

    for (const review of reviews) {
      await prisma.review.create({
        data: {
          agent_id: agent.id,
          ...review,
        },
      });
    }

    console.log(`Created agent: ${agent.name}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
