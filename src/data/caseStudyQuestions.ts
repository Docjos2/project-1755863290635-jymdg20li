import { Question } from '../types';

export const caseStudyQuestions: Question[] = [
  {
    id: 'case-001',
    type: 'case-study',
    difficulty: 'senior',
    industry: ['B2B Services'],
    question: `CASE STUDY: B2B SaaS Market Entry

You're the Marketing Director for TechFlow, a project management SaaS platform entering the Dutch market.

Current Situation:
- Strong presence in UK/Germany (15,000 customers)
- €5M ARR across existing markets
- Average deal size: €3,500/year
- 6-month sales cycle for enterprise, 2-week for SMB
- Product is fully localized (Dutch language, GDPR compliant)

Market Context:
- Competitors: Monday.com (strong), Asana (growing), local player Teamleader (15% market share)
- Target: 500+ employee companies in Netherlands
- Total addressable market: €50M

Your Challenge:
- €500K budget for first year
- Goal: 100 customers (€350K ARR) by end of year 1
- No local sales team yet (hiring in progress)
- Brand awareness in NL: <5%

What is your go-to-market strategy for the first 12 months?`,
    options: [
      'Focus 80% budget on paid search and LinkedIn ads targeting decision-makers, 20% on content marketing',
      'Partner with local implementation consultants and agencies, use them as distribution channel with partner marketing program',
      'Invest heavily in brand awareness through sponsorships and events to build presence before performance marketing',
      'Hybrid approach: Partner channel (40% budget), targeted digital campaigns (35%), thought leadership content (25%) with phased rollout'
    ],
    correctAnswer: 'Hybrid approach: Partner channel (40% budget), targeted digital campaigns (35%), thought leadership content (25%) with phased rollout',
    explanation: 'With low brand awareness, no local sales team, and a 6-month enterprise sales cycle, you need multiple engines. Option D: Months 1-3: Identify and onboard 5-8 implementation partners (consultants, agencies who serve your target customers). Create partner enablement materials. Start thought leadership (blog, LinkedIn, speaking). Months 4-6: Launch targeted campaigns to generate awareness and leads. Partners get co-marketing support. Begin nurture programs. Months 7-12: Scale what works. By this point, you should see which partner channel and digital tactics drive best results. Pure performance marketing (A) is expensive with low awareness. Partners-only (B) takes time to build. Brand-first (C) doesn\'t generate pipeline fast enough. The hybrid approach de-risks by building multiple channels.',
    detailedExplanation: 'Market entry requires: 1) Credibility (partners provide local credibility), 2) Distribution (partners have existing customer relationships), 3) Demand generation (digital + content), 4) Efficiency (€5K per customer target CAC is challenging with zero awareness). Budget allocation: €200K partners (onboarding, co-marketing, incentives), €175K digital (LinkedIn, search, retargeting), €125K content (localized content, speaking, webinars). Success metrics: 8 active partners, 500 MQLs, 100 SQLs, 100 customers, <€5K CAC.',
    timeLimit: 600,
    tags: ['market-entry', 'b2b-strategy', 'channel-strategy'],
    points: 30,
  },
  {
    id: 'case-002',
    type: 'case-study',
    difficulty: 'senior',
    industry: ['FMCG', 'Retail'],
    question: `CASE STUDY: Heritage Brand Revitalization

BrightSmile Toothpaste has been in Dutch market for 40 years.

Current State:
- Market share: 8% (was 15% five years ago)
- Brand awareness: 65% (aided), 25% (unaided)
- Consideration: 30% (down from 45%)
- Core customers: 55+ years old
- Perception: "Old-fashioned but trustworthy"
- Annual revenue: €12M (declining 8% YoY)
- Category growing at 3% annually

Competition:
- Colgate: 25% share, innovation-led
- Elmex: 18% share, dental professional endorsement
- Store brands: 30% combined, price-focused

Your Situation:
- New marketing director hired to stop the decline
- €2M annual marketing budget
- Product reformulation launching in 6 months (improved whitening, natural ingredients)
- Target: Stabilize share at 8%, then grow to 10% over 2 years

What is your brand revitalization strategy?`,
    options: [
      'Full rebrand with new name, packaging, and youth-focused influencer campaign',
      'Double down on heritage: "Trusted for 40 years" campaign targeting existing loyal customers',
      'Strategic refresh: Modernize packaging/messaging while keeping brand equity, target 35-50 year-olds (bridge demographic), lead with product innovation news',
      'Price promotion strategy to compete with store brands and regain volume'
    ],
    correctAnswer: 'Strategic refresh: Modernize packaging/messaging while keeping brand equity, target 35-50 year-olds (bridge demographic), lead with product innovation news',
    explanation: 'Option C balances evolution with preservation. Full rebrand (A) abandons 40 years of equity and alienates loyal customers - extreme risk. Heritage-only (B) accelerates decline as customer base ages out. Price wars (D) destroy margins and brand value. Strategic refresh: 1) Keep the BrightSmile name and trust equity, 2) Modernize visual identity and tone (less clinical, more lifestyle), 3) Target 35-50 "dental health conscious" segment (care about effectiveness, willing to pay more than store brand, not just chasing trends), 4) Lead with innovation news (reformulation gives permission to reconsider the brand), 5) Maintain presence with 55+ base while attracting younger buyers.',
    detailedExplanation: 'Budget allocation: €600K paid media (TV, digital, OOH) for reach in new demo, €400K in-store activation (shelf presence, sampling), €500K trade marketing (retailer relationships, prominence), €300K digital/content (education on natural ingredients, dental health), €200K PR/influencer (credibility, not trendy influencers but dental health/wellness voices). Metrics: Awareness in 35-50 demo, consideration lift, trial rate, repeat purchase, stabilize revenue decline. Product innovation is the catalyst - use it. Positioning: "Trusted expertise, modern science" - bridges heritage and innovation.',
    timeLimit: 600,
    tags: ['brand-revitalization', 'fmcg', 'repositioning'],
    points: 30,
  },
  {
    id: 'case-003',
    type: 'case-study',
    difficulty: 'mid',
    industry: ['Tech'],
    question: `CASE STUDY: Product Launch Under Pressure

You're launching a new feature for your B2B software platform in 6 weeks.

Background:
- Feature: AI-powered analytics dashboard
- Development: 18 months, €2M investment
- Company: 5,000 customers, mid-market focus
- Sales team: Eager to sell but hasn't been trained yet
- Competitive context: Two competitors launched similar features in past 3 months

Challenges:
- Your AI isn't quite as advanced as competitor A
- But your implementation is simpler and UI is better
- Pricing not finalized (debate between free add-on vs. €500/mo)
- Customer research shows mixed interest: 40% "very interested", 30% "somewhat", 30% "not interested"
- Your marketing budget: €150K for launch

CEO expects "big splash" and 500 adopters in first quarter.

What is your launch strategy?`,
    options: [
      'Delay launch until AI capabilities match competitors',
      'Big bang launch: Press release, email all customers, sales blitz, ads',
      'Phased rollout: Beta with top 50 customers (6 weeks), gather testimonials and refine, broader launch with case studies (month 2-3), then public campaign',
      'Soft launch to existing customers only, no external promotion'
    ],
    correctAnswer: 'Phased rollout: Beta with top 50 customers (6 weeks), gather testimonials and refine, broader launch with case studies (month 2-3), then public campaign',
    explanation: 'Option C de-risks the launch and builds credibility. Delaying (A) means more market loss. Big bang (B) without validation is risky - what if adoption is low or bugs surface? Soft launch (D) wastes the opportunity and won\'t hit targets. Phased approach: Weeks 1-6: Invite 50 strategic customers to beta (those who said "very interested"). Provide white-glove onboarding. Gather feedback, testimonials, usage data, case studies. Refine messaging based on what resonates. Train sales team using real customer stories. Weeks 7-10: Broader rollout to all customers with proven case studies. Now you have social proof and refined positioning. Weeks 11-12: External campaign with credibility. Position around your differentiation: "AI analytics that actually gets used - 10-minute setup vs. 10-week implementation."',
    detailedExplanation: 'Budget: €50K beta (onboarding support, incentives, content creation), €60K customer rollout (email campaigns, webinars, in-app messaging, sales enablement), €40K external (PR, digital ads, analyst relations). This approach: 1) Validates product-market fit, 2) Builds case studies for credibility, 3) Refines positioning through real feedback, 4) Reduces risk of public failure, 5) Gives sales team proof points. Success metrics: 50 beta adopters, 80% active usage, 3 strong case studies, 300 customers activated in first quarter (realistic), 200 more in Q2 to hit 500.',
    timeLimit: 480,
    tags: ['product-launch', 'b2b', 'gtm-strategy'],
    points: 25,
  },
  {
    id: 'case-004',
    type: 'case-study',
    difficulty: 'senior',
    industry: ['Retail'],
    question: `CASE STUDY: Omnichannel Retailer Challenge

FashionForward is a mid-sized clothing retailer in Netherlands:

Current State:
- 25 physical stores across major cities
- E-commerce: €8M annual (20% of revenue)
- Retail: €32M annual (80% of revenue)
- Total: €40M revenue
- Customer base: 200K loyalty program members
- Core demo: Women 25-45, fashion-conscious, mid-market price point

The Challenge:
- Retail traffic down 15% YoY
- E-commerce growing but at lower margins
- Customer data siloed (online and offline separate systems)
- Competition from online-only brands (ASOS, Zalando)
- Marketing budget: €2M annually

Research Insights:
- 60% of customers research online before buying in-store
- 35% browse in-store then buy online (often from competitors)
- Store staff not trained on omnichannel approach
- Website doesn't show store inventory
- No unified view of customer

Your goal: Create an integrated omnichannel strategy to drive total revenue growth of 15% over 18 months.

What is your strategic approach?`,
    options: [
      'Invest heavily in e-commerce marketing to shift more revenue online',
      'Focus on retail experience and reduce e-commerce investment',
      'Build integrated omnichannel customer experience: unified inventory, clienteling, buy-online-pickup-in-store, personalized marketing across channels',
      'Open more stores to increase physical presence'
    ],
    correctAnswer: 'Build integrated omnichannel customer experience: unified inventory, clienteling, buy-online-pickup-in-store, personalized marketing across channels',
    explanation: 'Option C recognizes that online and offline aren\'t competing - they\'re complementary. The customer doesn\'t think in channels. Phase 1 (Months 1-6): Technology foundation - Implement unified inventory system, enable buy-online-pickup-in-store (BOPIS), integrate customer data platform. Phase 2 (Months 7-12): Experience improvements - Train store staff on clienteling (using customer data), enable in-store staff to order out-of-stock items for delivery, launch mobile app with store mode (check inventory, virtual queue). Phase 3 (Months 13-18): Advanced personalization - Use unified customer data for personalized marketing, rewards program that works across channels, personalized recommendations online and in-store.',
    detailedExplanation: 'Budget allocation: €600K technology (CDP, unified inventory, BOPIS), €400K store training and enablement, €1M marketing (now focused on driving traffic to both channels with unified messaging). Success metrics: BOPIS adoption (target: 15% of online orders), cross-channel customer increase (target: 40% of customers shop both), average customer value increase (target: +25% for omnichannel customers vs single-channel), NPS improvement (target: +10 points). The insight: Customers who shop both online and offline spend 2-3x more than single-channel customers. Stop optimizing channels separately and optimize total customer value.',
    timeLimit: 600,
    tags: ['omnichannel', 'retail-strategy', 'customer-experience'],
    points: 35,
  },
  {
    id: 'case-005',
    type: 'case-study',
    difficulty: 'mid',
    industry: ['B2B Services'],
    question: `CASE STUDY: Sales and Marketing Misalignment

You're the new CMO at a €20M ARR B2B software company.

The Situation:
- Sales team: 20 reps, quota: €1M each
- Marketing team: 8 people, €2M budget
- Current lead volume: 300 MQLs/month
- MQL to SQL conversion: 15% (45 SQLs/month)
- SQL to close: 20% (9 deals/month, avg €28K)
- Company needs 25 deals/month to hit growth targets

The Problem:
- Sales complains: "Marketing sends junk leads"
- Marketing complains: "Sales doesn't follow up on leads"
- Data shows: 40% of MQLs never contacted, 30% contacted once, only 30% get proper follow-up
- But also: Lead quality is inconsistent - some segments convert well, others don't
- CEO is frustrated: "We're investing in marketing but not hitting numbers"

Your task: Diagnose the problem and create a 90-day plan to fix sales-marketing alignment and improve results.

What is your approach?`,
    options: [
      'Increase lead volume to 600 MQLs/month so sales has more to work with',
      'Implement lead scoring and SLA agreement, improve lead quality through better targeting, create sales enablement program',
      'Replace the sales team with reps who will work the leads',
      'Cut marketing budget and hire more sales reps'
    ],
    correctAnswer: 'Implement lead scoring and SLA agreement, improve lead quality through better targeting, create sales enablement program',
    explanation: 'Option B addresses root causes: alignment, quality, and process. 90-Day Plan: Days 1-30: Diagnosis and Alignment - Analyze which lead sources/segments convert (by industry, size, title). Meet with sales leaders and top reps: what makes a good lead? Create shared definition of MQL and SQL. Establish SLA: Marketing delivers X qualified leads, Sales contacts within Y hours. Implement lead scoring based on conversion data. Days 31-60: Quality Improvement - Refocus marketing on high-converting segments. Pause or reduce spending on poor-converting sources. Create lead nurturing program for "not quite ready" leads. Build sales enablement: battle cards, call scripts, objection handling. Days 61-90: Optimization - Weekly sales-marketing meetings reviewing: lead volume, quality, conversion rates, feedback. Refine scoring based on results. Report progress to CEO: showing improved conversion rates and pipeline growth.',
    detailedExplanation: 'The math problem: Need 25 deals/month. At 20% close rate, need 125 SQLs. At current 15% MQL→SQL, need 833 MQLs. But blindly increasing volume doesn\'t help if quality is poor and follow-up is broken. Better approach: Improve MQL→SQL to 25% (achievable with better quality and sales follow-up), need 500 MQLs for 125 SQLs. Focus on quality AND accountability. Success metrics: MQL→SQL conversion (target: 25%), Sales follow-up rate (target: 90% contacted within 24hrs), Pipeline generated (target: €3.5M/month), Sales-marketing satisfaction scores.',
    timeLimit: 540,
    tags: ['sales-marketing-alignment', 'demand-generation', 'process-improvement'],
    points: 28,
  },
];
