export type ContentionIdea = {
  id: number
  title: string
  description: string
  category: string
  tags: string[]
  argumentsFor: string[]
  argumentsAgainst: string[]
}

export const contentionIdeas: ContentionIdea[] = [
  // --- Domestic ---
  {
    id: 1,
    title: "Universal Healthcare Implementation",
    description: "Comprehensive analysis of single-payer healthcare systems and their economic impacts.",
    category: "Domestic",
    tags: ["Healthcare", "Economics", "Policy"],
    argumentsFor: [
      "Reduces overall healthcare costs",
      "Provides universal coverage",
      "Eliminates medical bankruptcies",
    ],
    argumentsAgainst: [
      "High government expenditure",
      "Potential for longer wait times",
      "Reduced competition in healthcare",
    ],
  },
  {
    id: 2,
    title: "Price Gouging",
    description: "Caps emergency price increases during crises to protect consumers during natural disasters or pandemics.",
    category: "Domestic",
    tags: ["Consumer Protection", "Emergency", "Economics"],
    argumentsFor: [
      "Prevents exploitation of consumers during emergencies",
      "Helps maintain access to essential goods",
      "Reduces panic buying and hoarding"
    ],
    argumentsAgainst: [
      "May discourage suppliers from bringing in more goods",
      "Could lead to shortages if prices can't adjust",
      "Difficult to enforce fairly"
    ],
  },
  {
    id: 3,
    title: "Food Safety",
    description: "Enhances federal oversight to reduce contamination and strengthen public trust in the food supply.",
    category: "Domestic",
    tags: ["Health", "Regulation", "Agriculture"],
    argumentsFor: [
      "Reduces risk of foodborne illness outbreaks",
      "Improves consumer confidence in food supply",
      "Encourages higher industry standards"
    ],
    argumentsAgainst: [
      "Increases compliance costs for producers",
      "May slow down food distribution",
      "Potential for regulatory overreach"
    ],
  },
  {
    id: 4,
    title: "DC Statehood",
    description: "Grants the District of Columbia full congressional representation through statehood.",
    category: "Domestic",
    tags: ["Representation", "Voting Rights", "Federalism"],
    argumentsFor: [
      "Ensures equal representation for DC residents",
      "Addresses historic disenfranchisement",
      "Strengthens democracy"
    ],
    argumentsAgainst: [
      "May require constitutional amendment",
      "Could shift political balance in Congress",
      "Opposition from some states and federal interests"
    ],
  },
  {
    id: 5,
    title: "Fentanyl Crisis",
    description: "Establishes a nationwide safe injection site pilot program to reduce overdose deaths and connect users to treatment.",
    category: "Domestic",
    tags: ["Public Health", "Drugs", "Harm Reduction"],
    argumentsFor: [
      "Reduces overdose deaths by providing medical supervision",
      "Connects users to treatment and support services",
      "Decreases public drug use and discarded syringes"
    ],
    argumentsAgainst: [
      "May be seen as enabling drug use",
      "Potential community opposition to local sites",
      "Legal and federal funding challenges"
    ],
  },
  {
    id: 6,
    title: "Military Recruitment Shortfalls",
    description: "Implements incentives and revised standards to meet enlistment targets while maintaining military effectiveness.",
    category: "Domestic",
    tags: ["Defense", "Recruitment", "Workforce"],
    argumentsFor: [
      "Addresses national security needs",
      "Provides career opportunities for young people",
      "Incentives can attract higher-quality recruits"
    ],
    argumentsAgainst: [
      "Lowering standards may reduce military effectiveness",
      "Incentives could be costly or unfair",
      "Potential for increased attrition rates"
    ],
  },
  {
    id: 7,
    title: "Weight Loss Drugs",
    description: "Expands Medicare coverage to include new obesity drugs and emerging medical alternatives (e.g., vibrating pills).",
    category: "Domestic",
    tags: ["Healthcare", "Medicare", "Pharmaceuticals"],
    argumentsFor: [
      "Improves access to effective obesity treatments",
      "Reduces long-term healthcare costs from obesity-related diseases",
      "Encourages innovation in medical technology"
    ],
    argumentsAgainst: [
      "High cost of new drugs may strain Medicare budget",
      "Long-term safety and efficacy concerns",
      "Potential for overprescription or misuse"
    ],
  },
  {
    id: 8,
    title: "Teacher Shortage",
    description: "Increases educator pay and forgives student loans to address widespread K–12 teacher shortages.",
    category: "Domestic",
    tags: ["Education", "Labor", "Policy"],
    argumentsFor: [
      "Attracts and retains qualified teachers",
      "Improves educational outcomes for students",
      "Addresses inequities in high-need districts"
    ],
    argumentsAgainst: [
      "Significant cost to government budgets",
      "May not address non-monetary reasons for teacher attrition",
      "Potential for uneven implementation across states"
    ],
  },
  {
    id: 23,
    title: "Remittance Fees for Immigration Reform",
    description: "Impose fees on remittance transfers to fund immigration reform programs.",
    category: "Domestic",
    tags: ["Immigration", "Finance", "Policy"],
    argumentsFor: [
      "Generates dedicated funding for immigration reform initiatives",
      "Targets remittances as a significant financial flow",
      "May reduce reliance on general tax revenue"
    ],
    argumentsAgainst: [
      "Could disproportionately impact immigrant families",
      "May encourage use of informal transfer channels",
      "Potential diplomatic backlash from remittance-receiving countries"
    ],
  },
  {
    id: 24,
    title: "Abolishing Plea Bargaining",
    description: "End plea bargaining in criminal cases.",
    category: "Domestic",
    tags: ["Criminal Justice", "Courts", "Due Process"],
    argumentsFor: [
      "Ensures all cases are fully adjudicated in court",
      "Reduces risk of coerced or unjust pleas",
      "May increase public trust in the justice system"
    ],
    argumentsAgainst: [
      "Could overwhelm courts with trials",
      "May delay justice for victims and defendants",
      "Removes flexibility for prosecutors and defense"
    ],
  },
  {
    id: 25,
    title: "Abolishing the Use of Bail",
    description: "Eliminate bail in the court system.",
    category: "Domestic",
    tags: ["Criminal Justice", "Bail Reform", "Equity"],
    argumentsFor: [
      "Reduces pretrial detention for low-income defendants",
      "Addresses inequities in the bail system",
      "Focuses on risk rather than ability to pay"
    ],
    argumentsAgainst: [
      "May increase failure-to-appear rates",
      "Could pose public safety risks if not managed well",
      "Requires robust pretrial services infrastructure"
    ],
  },
  {
    id: 26,
    title: "Voting by Phone in Elections",
    description: "Allow voters to cast ballots by phone.",
    category: "Domestic",
    tags: ["Elections", "Technology", "Accessibility"],
    argumentsFor: [
      "Increases accessibility for disabled and remote voters",
      "Could boost voter turnout",
      "Modernizes the voting process"
    ],
    argumentsAgainst: [
      "Security and privacy concerns",
      "Potential for technical failures or hacking",
      "May undermine confidence in election integrity"
    ],
  },
  {
    id: 27,
    title: "Banning Deepfakes",
    description: "Prohibit creation and distribution of deepfake media.",
    category: "Domestic",
    tags: ["Technology", "Media", "Law"],
    argumentsFor: [
      "Protects individuals from malicious impersonation",
      "Reduces spread of misinformation",
      "Supports election integrity and public trust"
    ],
    argumentsAgainst: [
      "May limit creative and satirical expression",
      "Difficult to enforce and define deepfakes",
      "Potential First Amendment challenges"
    ],
  },
  {
    id: 28,
    title: "Banning Pharmaceutical TV Ads",
    description: "Stop pharmaceutical advertising on TV.",
    category: "Domestic",
    tags: ["Healthcare", "Advertising", "Regulation"],
    argumentsFor: [
      "Reduces consumer pressure on doctors for specific drugs",
      "Lowers healthcare costs by reducing marketing expenses",
      "Limits misleading or incomplete information to the public"
    ],
    argumentsAgainst: [
      "Limits public awareness of treatment options",
      "Potential First Amendment concerns",
      "Could reduce competition among drug companies"
    ],
  },
  {
    id: 29,
    title: "Banning Stock Trading by Congress Members",
    description: "Prevent Congress members from trading stocks.",
    category: "Domestic",
    tags: ["Ethics", "Government", "Finance"],
    argumentsFor: [
      "Reduces conflicts of interest in policymaking",
      "Increases public trust in government",
      "Prevents insider trading scandals"
    ],
    argumentsAgainst: [
      "Limits financial freedom for lawmakers",
      "Could discourage qualified individuals from serving",
      "Difficult to enforce and monitor"
    ],
  },
  {
    id: 30,
    title: "Four-Day School Week",
    description: "Institute a four-day school week nationwide.",
    category: "Domestic",
    tags: ["Education", "Labor", "Policy"],
    argumentsFor: [
      "Reduces costs for school districts",
      "May improve teacher and student well-being",
      "Can increase attendance rates"
    ],
    argumentsAgainst: [
      "Potential loss of instructional time",
      "Challenges for working parents",
      "May widen achievement gaps"
    ],
  },
  {
    id: 31,
    title: "National Peptide Database",
    description: "Create a national peptide research database.",
    category: "Domestic",
    tags: ["Science", "Research", "Healthcare"],
    argumentsFor: [
      "Accelerates biomedical research and innovation",
      "Improves collaboration among scientists",
      "Supports development of new treatments"
    ],
    argumentsAgainst: [
      "High cost to establish and maintain",
      "Privacy and data security concerns",
      "Potential for misuse of sensitive information"
    ],
  },
  {
    id: 32,
    title: "Defunding For-Profit Charter Schools",
    description: "Remove public funding from for-profit charter schools.",
    category: "Domestic",
    tags: ["Education", "Funding", "Policy"],
    argumentsFor: [
      "Ensures public funds support public education",
      "Reduces profit motives in education",
      "May improve accountability and transparency"
    ],
    argumentsAgainst: [
      "Limits school choice for families",
      "Could disrupt existing schools and students",
      "Potential for reduced innovation in education"
    ],
  },
  {
    id: 33,
    title: "Eliminating Squatter Laws",
    description: "Make it easier to remove squatters from properties.",
    category: "Domestic",
    tags: ["Property Rights", "Law", "Housing"],
    argumentsFor: [
      "Protects property owners from unlawful occupation",
      "Reduces legal costs and delays",
      "Discourages squatting as a strategy"
    ],
    argumentsAgainst: [
      "May harm vulnerable populations with nowhere to go",
      "Could lead to abuses by landlords",
      "Potential for increased homelessness"
    ],
  },
  {
    id: 34,
    title: "Sectoral Bargaining and Ending Minimum Wage",
    description: "Replace minimum wage with sectoral bargaining.",
    category: "Economic",
    tags: ["Labor", "Wages", "Unions"],
    argumentsFor: [
      "Allows for tailored wage agreements by industry",
      "Empowers unions and collective bargaining",
      "May improve working conditions overall"
    ],
    argumentsAgainst: [
      "Could create wage disparities between sectors",
      "Complex to negotiate and enforce",
      "Potential for lower wages in weakly organized sectors"
    ],
  },
  {
    id: 35,
    title: "Police Body Cameras",
    description: "Require police to wear body cameras.",
    category: "Domestic",
    tags: ["Law Enforcement", "Accountability", "Civil Rights"],
    argumentsFor: [
      "Increases transparency and accountability",
      "Provides evidence in investigations",
      "May reduce incidents of misconduct"
    ],
    argumentsAgainst: [
      "Privacy concerns for both police and public",
      "High cost of equipment and data storage",
      "Cameras may not capture full context"
    ],
  },
  {
    id: 36,
    title: "Big Pharmaceuticals Tax and Regulation",
    description: "Increase taxes and regulation on large pharma companies.",
    category: "Economic",
    tags: ["Healthcare", "Taxation", "Regulation"],
    argumentsFor: [
      "Raises revenue for public health programs",
      "Encourages fair pricing of medications",
      "Promotes corporate accountability"
    ],
    argumentsAgainst: [
      "May reduce investment in research and development",
      "Could increase drug prices for consumers",
      "Potential for regulatory capture"
    ],
  },
  {
    id: 37,
    title: "Foster Care Availability",
    description: "Increase foster care support and availability.",
    category: "Domestic",
    tags: ["Child Welfare", "Social Services", "Policy"],
    argumentsFor: [
      "Provides safe homes for vulnerable children",
      "Reduces strain on existing foster families",
      "Improves long-term outcomes for youth"
    ],
    argumentsAgainst: [
      "Requires significant funding and oversight",
      "Potential for inconsistent quality of care",
      "May not address root causes of family separation"
    ],
  },
  {
    id: 38,
    title: "Banning Facial Recognition Technology by Police",
    description: "Prohibit police use of facial recognition.",
    category: "Domestic",
    tags: ["Privacy", "Law Enforcement", "Technology"],
    argumentsFor: [
      "Protects civil liberties and privacy",
      "Reduces risk of wrongful identification",
      "Addresses bias in facial recognition algorithms"
    ],
    argumentsAgainst: [
      "May hinder legitimate investigations",
      "Could slow adoption of beneficial technology",
      "Difficult to enforce bans consistently"
    ],
  },
  {
    id: 39,
    title: "Voting Rights for Felons",
    description: "Restore voting rights to felons after sentence completion.",
    category: "Domestic",
    tags: ["Voting Rights", "Criminal Justice", "Reintegration"],
    argumentsFor: [
      "Supports reintegration into society",
      "Promotes civic engagement",
      "Addresses racial disparities in disenfranchisement"
    ],
    argumentsAgainst: [
      "Some believe certain crimes should permanently bar voting",
      "Potential for political controversy",
      "Administrative challenges in restoring rights"
    ],
  },
  {
    id: 40,
    title: "Mandatory Vaccinations",
    description: "Require vaccinations for public health.",
    category: "Domestic",
    tags: ["Public Health", "Vaccines", "Policy"],
    argumentsFor: [
      "Protects community health and herd immunity",
      "Prevents outbreaks of preventable diseases",
      "Reduces healthcare costs long-term"
    ],
    argumentsAgainst: [
      "Concerns about personal freedom and bodily autonomy",
      "Potential for backlash and noncompliance",
      "Rare but possible adverse reactions"
    ],
  },
  // --- Economic ---
  {
    id: 16,
    title: "NIL for Amateur Athletes",
    description: "Grants college athletes the right to profit from their Name, Image, and Likeness (NIL) while maintaining eligibility.",
    category: "Economic",
    tags: ["Sports", "Education", "Labor Rights"],
    argumentsFor: [
      "Promotes fairness for student-athletes",
      "Encourages entrepreneurship and branding",
      "Aligns with modern labor rights"
    ],
    argumentsAgainst: [
      "May create disparities between athletes",
      "Could commercialize college sports excessively",
      "Potential for recruiting abuses"
    ],
  },
  {
    id: 17,
    title: "Global Currency",
    description: "Considers U.S. development of a reserve digital currency to remain competitive in global finance.",
    category: "Economic",
    tags: ["Finance", "Digital Currency", "Global Markets"],
    argumentsFor: [
      "Maintains U.S. leadership in global finance",
      "Improves transaction efficiency",
      "Could reduce transaction costs"
    ],
    argumentsAgainst: [
      "Risks to financial stability",
      "Potential for privacy concerns",
      "May undermine traditional banks"
    ],
  },
  {
    id: 18,
    title: "Meat & Agricultural Subsidies",
    description: "Reforms subsidies to prioritize sustainable farming and plant-based agriculture over industrial livestock.",
    category: "Economic",
    tags: ["Agriculture", "Sustainability", "Subsidies"],
    argumentsFor: [
      "Encourages sustainable farming practices",
      "Reduces environmental impact of livestock",
      "Supports plant-based food innovation"
    ],
    argumentsAgainst: [
      "Potential job losses in livestock sector",
      "May increase food prices",
      "Resistance from traditional agriculture lobby"
    ],
  },
  {
    id: 19,
    title: "Autonomous Vehicles",
    description: "Invests in digital road infrastructure to fast-track deployment of fully autonomous (Level 4/5) vehicles.",
    category: "Economic",
    tags: ["Technology", "Transportation", "Infrastructure"],
    argumentsFor: [
      "Improves road safety and reduces accidents",
      "Boosts innovation and tech sector jobs",
      "Increases mobility for non-drivers"
    ],
    argumentsAgainst: [
      "High upfront infrastructure costs",
      "Potential job losses for drivers",
      "Cybersecurity and privacy risks"
    ],
  },
  {
    id: 20,
    title: "Affordable Housing",
    description: "Outlaws exclusionary single‑family zoning to increase housing density and reduce homelessness.",
    category: "Economic",
    tags: ["Housing", "Urban Policy", "Zoning"],
    argumentsFor: [
      "Increases housing supply and affordability",
      "Reduces homelessness and housing insecurity",
      "Promotes more diverse, walkable neighborhoods"
    ],
    argumentsAgainst: [
      "Community resistance to increased density",
      "Potential strain on local infrastructure",
      "May not guarantee affordability without other policies"
    ],
  },
  {
    id: 21,
    title: "Inflation Policy & Interest Rates",
    description: "Directs the Federal Reserve to target inflation using tiered interest rates that account for economic equity.",
    category: "Economic",
    tags: ["Monetary Policy", "Federal Reserve", "Equity"],
    argumentsFor: [
      "Allows for more nuanced economic management",
      "Can address inequities in economic recovery",
      "May stabilize prices more effectively"
    ],
    argumentsAgainst: [
      "Complexity may confuse markets",
      "Potential for unintended side effects",
      "Could reduce Fed independence"
    ],
  },
  {
    id: 22,
    title: "Single‑Family Zoning",
    description: "Outlaws zoning laws that ban multifamily housing — appeared in 2021 Nationals, 2022 LCQ, and 2024 LCQ.",
    category: "Economic",
    tags: ["Housing", "Urban Policy", "Zoning"],
    argumentsFor: [
      "Promotes housing diversity and affordability",
      "Reduces urban sprawl",
      "Supports environmental sustainability"
    ],
    argumentsAgainst: [
      "Local opposition to zoning changes",
      "Potential for gentrification",
      "May not address all causes of housing shortages"
    ],
  },
  // --- International ---
  {
    id: 9,
    title: "North Korea",
    description: "Reconsiders the U.S. approach to North Korea through targeted sanctions or diplomatic re-engagement.",
    category: "International",
    tags: ["Sanctions", "Diplomacy", "Security"],
    argumentsFor: [
      "Targeted sanctions can pressure regime change",
      "Diplomatic engagement may reduce nuclear risk",
      "Flexibility allows for tailored U.S. response"
    ],
    argumentsAgainst: [
      "Sanctions may harm civilians more than leaders",
      "Diplomacy could be seen as legitimizing the regime",
      "Limited leverage due to China's influence"
    ],
  },
  {
    id: 10,
    title: "Haiti",
    description: "Provides humanitarian assistance and stabilization aid to address civil unrest and economic collapse.",
    category: "International",
    tags: ["Humanitarian Aid", "Stabilization", "Development"],
    argumentsFor: [
      "Addresses urgent humanitarian needs",
      "Supports regional stability",
      "Can help rebuild critical infrastructure"
    ],
    argumentsAgainst: [
      "Risk of dependency on foreign aid",
      "Potential for mismanagement or corruption",
      "May require long-term U.S. commitment"
    ],
  },
  {
    id: 11,
    title: "Venezuela",
    description: "Addresses political crisis through a mix of sanctions, relief efforts, and diplomatic measures.",
    category: "International",
    tags: ["Sanctions", "Diplomacy", "Humanitarian"],
    argumentsFor: [
      "Sanctions can pressure government toward reform",
      "Relief efforts help suffering civilians",
      "Diplomacy may open path to peaceful transition"
    ],
    argumentsAgainst: [
      "Sanctions may worsen humanitarian crisis",
      "Diplomatic efforts may be slow or ineffective",
      "Risk of U.S. over-involvement"
    ],
  },
  {
    id: 12,
    title: "Japan Military Expansion",
    description: "Modifies the U.S.–Japan alliance to support Japan's expanding military role within constitutional limits.",
    category: "International",
    tags: ["Alliances", "Security", "Asia-Pacific"],
    argumentsFor: [
      "Strengthens regional security against threats",
      "Shares defense burden with allies",
      "Supports Japan's right to self-defense"
    ],
    argumentsAgainst: [
      "May provoke regional arms race",
      "Could strain relations with China",
      "Constitutional limits may be controversial in Japan"
    ],
  },
  {
    id: 13,
    title: "Aid to Ukraine",
    description: "Continues U.S. military and humanitarian aid with greater oversight and performance benchmarks.",
    category: "International",
    tags: ["Military Aid", "Oversight", "Europe"],
    argumentsFor: [
      "Supports Ukraine's defense against aggression",
      "Promotes democracy and rule of law",
      "Oversight ensures aid is used effectively"
    ],
    argumentsAgainst: [
      "High cost to U.S. taxpayers",
      "Risk of escalation with Russia",
      "Concerns about corruption and accountability"
    ],
  },
  {
    id: 14,
    title: "Methane Pollution Agreement",
    description: "Funds international methane reduction efforts in oil/gas sectors and supports global climate transparency.",
    category: "International",
    tags: ["Climate", "Energy", "Transparency"],
    argumentsFor: [
      "Reduces potent greenhouse gas emissions",
      "Promotes global cooperation on climate",
      "Supports innovation in energy sector"
    ],
    argumentsAgainst: [
      "Implementation costs for industry",
      "Enforcement challenges across borders",
      "Potential resistance from major emitters"
    ],
  },
  {
    id: 15,
    title: "Flood Insurance",
    description: "Expands or subsidizes federal insurance coverage in flood-prone regions to combat climate-driven disasters.",
    category: "Economic",
    tags: ["Insurance", "Climate", "Disaster Relief"],
    argumentsFor: [
      "Protects homeowners in high-risk areas",
      "Spreads risk and reduces financial ruin",
      "Encourages rebuilding after disasters"
    ],
    argumentsAgainst: [
      "May incentivize building in risky areas",
      "Costly for taxpayers",
      "Difficult to price premiums fairly"
    ],
  },
] 