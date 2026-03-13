export interface QuestionOption {
  id: string;
  zh: string;
  en: string;
}

export interface Question {
  id: number;
  category: string;
  categoryEn: string;
  zh: string;
  en: string;
  options: QuestionOption[];
}

export const categories = [
  { id: "values", zh: "价值观与人生观", en: "Values & Life Philosophy", icon: "💎", count: 15 },
  { id: "lifestyle", zh: "生活方式与习惯", en: "Lifestyle & Habits", icon: "🌃", count: 10 },
  { id: "social", zh: "社会观点与态度", en: "Social Views & Attitudes", icon: "🌐", count: 10 },
  { id: "intimate", zh: "亲密关系与偏好", en: "Intimate Relationships & Preferences", icon: "💫", count: 31 },
];

export const questions: Question[] = [
  // Part 1: Values & Life Philosophy (1-15)
  {
    id: 1, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为人生中最重要的是什么？", en: "What do you consider most important in life?",
    options: [
      { id: "A", zh: "个人成就与事业成功", en: "Personal achievement and career success" },
      { id: "B", zh: "家庭和睦与亲情维系", en: "Family harmony and maintaining kinship" },
      { id: "C", zh: "精神富足与内心平静", en: "Spiritual richness and inner peace" },
      { id: "D", zh: "体验世界与享受生活", en: "Experiencing the world and enjoying life" },
      { id: "E", zh: "社会贡献与个人价值实现", en: "Social contribution and self-worth realization" },
    ],
  },
  {
    id: 2, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对婚姻的看法是？", en: "What is your view on marriage?",
    options: [
      { id: "A", zh: "爱情的最终归宿，神圣而不可侵犯", en: "The ultimate destination of love, sacred and inviolable" },
      { id: "B", zh: "两个人共同成长和承担责任的契约", en: "A contract for two people to grow together and share responsibilities" },
      { id: "C", zh: "一种生活方式的选择，可以有也可以没有", en: "A lifestyle choice, optional" },
      { id: "D", zh: "传宗接代、延续香火的必要环节", en: "A necessary step for continuing the family line" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow, don't force it" },
    ],
  },
  {
    id: 3, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为拥有孩子对一个完整的人生来说是？", en: "Do you believe having children is essential for a fulfilling life?",
    options: [
      { id: "A", zh: "绝对必要，是人生圆满的标志", en: "Absolutely necessary, a sign of a complete life" },
      { id: "B", zh: "比较重要，但不是唯一途径", en: "Quite important, but not the only way" },
      { id: "C", zh: "顺其自然，有无皆可", en: "Go with the flow, either way is fine" },
      { id: "D", zh: "不重要，更注重个人自由", en: "Not important, more focused on personal freedom" },
      { id: "E", zh: "坚决不考虑", en: "Definitely not considering it" },
    ],
  },
  {
    id: 4, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对伴侣的经济能力有何期待？", en: "What are your expectations for your partner's financial capability?",
    options: [
      { id: "A", zh: "门当户对，旗鼓相当", en: "Well-matched in social and economic status" },
      { id: "B", zh: "稳定向上，有共同的财富观", en: "Stable and upward-moving, with shared financial values" },
      { id: "C", zh: "能够自食其力，共同承担生活开销", en: "Able to support themselves, jointly bear living expenses" },
      { id: "D", zh: "不太在意，更看重人品和潜力", en: "Not too concerned, value character and potential more" },
      { id: "E", zh: "希望对方能提供更好的物质生活", en: "Hope the other person can provide a better material life" },
    ],
  },
  {
    id: 5, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "在一段关系中，个人成长和共同成长哪个更重要？", en: "In a relationship, which is more important: individual growth or mutual growth?",
    options: [
      { id: "A", zh: "个人成长是基础，共同成长是目标", en: "Individual growth is the foundation, mutual growth is the goal" },
      { id: "B", zh: "共同成长更重要，两个人一起进步", en: "Mutual growth is more important, progressing together" },
      { id: "C", zh: "个人成长优先，关系是锦上添花", en: "Individual growth comes first, relationship is a bonus" },
      { id: "D", zh: "两者同等重要，缺一不可", en: "Both are equally important, indispensable" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow, don't deliberately pursue" },
    ],
  },
  {
    id: 6, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对未来职业发展的规划是？", en: "What are your plans for future career development?",
    options: [
      { id: "A", zh: "追求事业巅峰，实现个人价值", en: "Pursue career peak, realize personal value" },
      { id: "B", zh: "稳定发展，兼顾工作与生活", en: "Stable development, balancing work and life" },
      { id: "C", zh: "自由职业，追求兴趣和弹性", en: "Freelance, pursuing interests and flexibility" },
      { id: "D", zh: "听从父母或家庭的建议", en: "Follow parents' or family's advice" },
      { id: "E", zh: "尚未明确，边走边看", en: "Not yet clear, taking it as it comes" },
    ],
  },
  {
    id: 7, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为孝顺父母在亲密关系中扮演什么角色？", en: "What role do you think filial piety plays in an intimate relationship?",
    options: [
      { id: "A", zh: "极其重要，是衡量一个人品德的关键", en: "Extremely important, a key measure of one's character" },
      { id: "B", zh: "比较重要，但应有自己的独立判断", en: "Quite important, but should have independent judgment" },
      { id: "C", zh: "尊重即可，不应过度干涉", en: "Respect is enough, shouldn't interfere excessively" },
      { id: "D", zh: "个人选择，与伴侣关系不大", en: "Personal choice, not much to do with the partner relationship" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow, don't force it" },
    ],
  },
  {
    id: 8, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对\u201C门当户对\u201D的看法是？", en: "What is your view on 'matching social status'?",
    options: [
      { id: "A", zh: "非常重要，是婚姻稳定的基础", en: "Very important, the foundation of a stable marriage" },
      { id: "B", zh: "有一定道理，但不是绝对", en: "Makes some sense, but not absolute" },
      { id: "C", zh: "不重要，爱情才是最重要的", en: "Not important, love is most important" },
      { id: "D", zh: "现代社会已经过时", en: "Outdated in modern society" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow, don't force it" },
    ],
  },
  {
    id: 9, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为伴侣应该在多大程度上挑战你的观点？", en: "To what extent should your partner challenge your views?",
    options: [
      { id: "A", zh: "积极挑战，促进我思考", en: "Actively challenge, promote my thinking" },
      { id: "B", zh: "适度挑战，保持独立思考", en: "Moderately challenge, maintain independent thinking" },
      { id: "C", zh: "尊重我的观点，避免冲突", en: "Respect my views, avoid conflict" },
      { id: "D", zh: "最好能与我保持一致", en: "Preferably consistent with me" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow, don't deliberately pursue" },
    ],
  },
  {
    id: 10, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对精神伴侣的理解是？", en: "What is your understanding of a soulmate?",
    options: [
      { id: "A", zh: "灵魂深处的共鸣，无需言语也能理解", en: "Deep resonance of the soul, understanding without words" },
      { id: "B", zh: "思想上的高度契合，能进行深入交流", en: "High intellectual compatibility, capable of deep communication" },
      { id: "C", zh: "共同的兴趣爱好，能一起享受生活", en: "Shared hobbies and interests, enjoying life together" },
      { id: "D", zh: "互相支持，共同面对生活挑战", en: "Mutual support, facing life's challenges together" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow, don't deliberately pursue" },
    ],
  },
  {
    id: 11, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为在一段关系中，信任的重要性是？", en: "What is the importance of trust in a relationship?",
    options: [
      { id: "A", zh: "绝对基础，没有信任就没有关系", en: "Absolute foundation, no relationship without trust" },
      { id: "B", zh: "非常重要，但需要时间建立", en: "Very important, but takes time to build" },
      { id: "C", zh: "只要有爱，信任可以慢慢培养", en: "As long as there is love, trust can be cultivated slowly" },
      { id: "D", zh: "相对重要，但不是唯一决定因素", en: "Relatively important, but not the sole determining factor" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow, don't deliberately pursue" },
    ],
  },
  {
    id: 12, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对伴侣的学历背景有何期待？", en: "What are your expectations for your partner's educational background?",
    options: [
      { id: "A", zh: "越高越好，最好是名校背景", en: "The higher the better, preferably from a prestigious university" },
      { id: "B", zh: "与我相当或略高于我", en: "Similar to or slightly higher than mine" },
      { id: "C", zh: "能够有共同语言和认知水平即可", en: "Just need to have common language and cognitive level" },
      { id: "D", zh: "不太在意，更看重能力和人品", en: "Not too concerned, value ability and character more" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow, don't force it" },
    ],
  },
  {
    id: 13, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为在一段关系中，沟通的重要性是？", en: "What is the importance of communication in a relationship?",
    options: [
      { id: "A", zh: "极其重要，是解决一切问题的关键", en: "Extremely important, key to solving all problems" },
      { id: "B", zh: "非常重要，但行动更重要", en: "Very important, but actions are more important" },
      { id: "C", zh: "适度沟通即可，不需要事无巨细", en: "Moderate communication is enough, no need for every detail" },
      { id: "D", zh: "顺其自然，不需要刻意沟通", en: "Go with the flow, no need for deliberate communication" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow, don't deliberately pursue" },
    ],
  },
  {
    id: 14, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你对伴侣的家庭背景有何期待？", en: "What are your expectations for your partner's family background?",
    options: [
      { id: "A", zh: "门当户对，家庭观念相似", en: "Well-matched, similar family values" },
      { id: "B", zh: "和睦友爱，父母开明", en: "Harmonious and loving, open-minded parents" },
      { id: "C", zh: "能够独立自主，不受家庭过度影响", en: "Independent, not overly influenced by family" },
      { id: "D", zh: "不太在意，更看重伴侣本人", en: "Not too concerned, value the partner themselves more" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow, don't force it" },
    ],
  },
  {
    id: 15, category: "values", categoryEn: "Values & Life Philosophy",
    zh: "你认为在一段关系中，个人空间的重要性是？", en: "What is the importance of personal space in a relationship?",
    options: [
      { id: "A", zh: "极其重要，是保持独立性的基础", en: "Extremely important, the foundation for maintaining independence" },
      { id: "B", zh: "非常重要，但需要平衡亲密关系", en: "Very important, but needs to balance intimacy" },
      { id: "C", zh: "适度即可，不应过度强调", en: "Moderate is enough, shouldn't overemphasize" },
      { id: "D", zh: "只要相爱，个人空间可以适当牺牲", en: "As long as there is love, personal space can be sacrificed" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow, don't deliberately pursue" },
    ],
  },
  // Part 2: Lifestyle & Habits (16-25)
  {
    id: 16, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的饮酒习惯接受程度如何？", en: "What is your acceptance level for your partner's drinking habits?",
    options: [
      { id: "A", zh: "完全不接受饮酒", en: "Completely unacceptable" },
      { id: "B", zh: "偶尔小酌可以接受", en: "Occasional light drinking is acceptable" },
      { id: "C", zh: "适度饮酒可以，但不能酗酒", en: "Moderate drinking is fine, but no heavy drinking" },
      { id: "D", zh: "只要不影响生活和健康即可", en: "As long as it doesn't affect life and health" },
      { id: "E", zh: "完全接受，甚至可以一起畅饮", en: "Completely acceptable, can even drink together" },
    ],
  },
  {
    id: 17, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的吸烟习惯接受程度如何？", en: "What is your acceptance level for your partner's smoking habits?",
    options: [
      { id: "A", zh: "完全不接受吸烟", en: "Completely unacceptable" },
      { id: "B", zh: "偶尔吸烟可以，但不能在我面前", en: "Occasional smoking is fine, but not in front of me" },
      { id: "C", zh: "只要不影响健康和环境即可", en: "As long as it doesn't affect health and environment" },
      { id: "D", zh: "完全接受，这是个人自由", en: "Completely acceptable, it's personal freedom" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow" },
    ],
  },
  {
    id: 18, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的作息习惯有何偏好？", en: "What are your preferences for your partner's daily routine?",
    options: [
      { id: "A", zh: "早睡早起，规律作息", en: "Early to bed, early to rise, regular routine" },
      { id: "B", zh: "保持一致，能一起行动", en: "Consistent with mine, can act together" },
      { id: "C", zh: "只要不影响我就好", en: "As long as it doesn't affect me" },
      { id: "D", zh: "尊重个人习惯，互不干涉", en: "Respect individual habits, no interference" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 19, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的消费观念有何期待？", en: "What are your expectations for your partner's spending habits?",
    options: [
      { id: "A", zh: "节俭持家，精打细算", en: "Frugal and thrifty" },
      { id: "B", zh: "理性消费，量入为出", en: "Rational consumption, living within means" },
      { id: "C", zh: "享受生活，适当消费", en: "Enjoy life, appropriate spending" },
      { id: "D", zh: "只要不负债，个人自由", en: "As long as there's no debt, personal freedom" },
      { id: "E", zh: "顺其自然，不强求", en: "Go with the flow" },
    ],
  },
  {
    id: 20, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的家务分工有何期待？", en: "What are your expectations for household chore division?",
    options: [
      { id: "A", zh: "男主外女主内，传统分工", en: "Traditional division of labor" },
      { id: "B", zh: "共同承担，按能力和时间分配", en: "Shared responsibility, by ability and time" },
      { id: "C", zh: "谁有空谁做，不计较", en: "Whoever has time does it" },
      { id: "D", zh: "可以请家政服务，减少家务负担", en: "Can hire domestic help" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 21, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的社交圈有何期待？", en: "What are your expectations for your partner's social circle?",
    options: [
      { id: "A", zh: "简单纯粹，以家庭为重", en: "Simple and pure, family-oriented" },
      { id: "B", zh: "积极向上，有共同的朋友圈", en: "Positive, with a shared social circle" },
      { id: "C", zh: "尊重个人选择，不干涉", en: "Respect personal choices, no interference" },
      { id: "D", zh: "只要不影响我就好", en: "As long as it doesn't affect me" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 22, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的旅行方式有何偏好？", en: "What are your preferences for your partner's travel style?",
    options: [
      { id: "A", zh: "计划周密，舒适享受", en: "Well-planned, comfortable and enjoyable" },
      { id: "B", zh: "随性自由，探索未知", en: "Spontaneous and free, exploring the unknown" },
      { id: "C", zh: "深度体验，融入当地文化", en: "Deep experience, integrating into local culture" },
      { id: "D", zh: "宅家休息，不爱出门", en: "Stay at home, don't like going out" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 23, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的健身习惯有何期待？", en: "What are your expectations for your partner's fitness habits?",
    options: [
      { id: "A", zh: "积极健身，保持健康体魄", en: "Actively exercise, maintain a healthy physique" },
      { id: "B", zh: "适度运动，保持良好状态", en: "Moderate exercise, maintain good condition" },
      { id: "C", zh: "只要不影响健康即可", en: "As long as it doesn't affect health" },
      { id: "D", zh: "不太在意，更看重内在", en: "Not too concerned, value inner qualities more" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 24, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的饮食习惯有何偏好？", en: "What are your preferences for your partner's eating habits?",
    options: [
      { id: "A", zh: "健康清淡，注重养生", en: "Healthy and light, focus on wellness" },
      { id: "B", zh: "荤素搭配，均衡营养", en: "Balanced diet, balanced nutrition" },
      { id: "C", zh: "喜欢尝试新奇美食，不挑食", en: "Like to try new foods, not picky" },
      { id: "D", zh: "只要不浪费，个人自由", en: "As long as there's no waste, personal freedom" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 25, category: "lifestyle", categoryEn: "Lifestyle & Habits",
    zh: "你对伴侣的宠物喜好有何期待？", en: "What are your expectations for your partner's pet preferences?",
    options: [
      { id: "A", zh: "喜欢宠物，最好能一起养", en: "Likes pets, preferably can raise them together" },
      { id: "B", zh: "不排斥宠物，但不想养", en: "Not against pets, but don't want to raise them" },
      { id: "C", zh: "不喜欢宠物，希望伴侣也不养", en: "Dislikes pets, hope partner doesn't raise them" },
      { id: "D", zh: "尊重个人选择，互不干涉", en: "Respect personal choices, no interference" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  // Part 3: Social Views & Attitudes (26-35)
  {
    id: 26, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对社会公平的看法是？", en: "What is your view on social justice?",
    options: [
      { id: "A", zh: "绝对公平，人人平等", en: "Absolute fairness, equality for all" },
      { id: "B", zh: "相对公平，兼顾效率", en: "Relative fairness, balancing efficiency" },
      { id: "C", zh: "弱肉强食，适者生存", en: "Survival of the fittest" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "不太关注这类话题", en: "Not too concerned about such topics" },
    ],
  },
  {
    id: 27, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对环境保护的看法是？", en: "What is your view on environmental protection?",
    options: [
      { id: "A", zh: "极其重要，是人类生存的基础", en: "Extremely important, the foundation of human survival" },
      { id: "B", zh: "比较重要，但经济发展优先", en: "Quite important, but economic development takes precedence" },
      { id: "C", zh: "个人力量有限，随大流即可", en: "Individual power is limited, just follow the crowd" },
      { id: "D", zh: "不太在意，更关注个人生活", en: "Not too concerned, more focused on personal life" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 28, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对传统文化的看法是？", en: "What is your view on traditional culture?",
    options: [
      { id: "A", zh: "应该传承和发扬，是民族的根", en: "Should be inherited and promoted" },
      { id: "B", zh: "取其精华，去其糟粕", en: "Retain the essence, discard the dross" },
      { id: "C", zh: "尊重即可，不应过度强调", en: "Respect is enough, shouldn't overemphasize" },
      { id: "D", zh: "现代社会已经过时，无需过多关注", en: "Outdated in modern society" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 29, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对社会热点事件的关注度是？", en: "What is your level of attention to social hot topics?",
    options: [
      { id: "A", zh: "积极关注，参与讨论", en: "Actively follow, participate in discussions" },
      { id: "B", zh: "适度关注，了解大概", en: "Moderately follow, understand the general idea" },
      { id: "C", zh: "偶尔关注，不深入了解", en: "Occasionally follow, not deeply understand" },
      { id: "D", zh: "不太关注，更关注个人生活", en: "Not too concerned, more focused on personal life" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 30, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对伴侣的政治立场有何期待？", en: "What are your expectations for your partner's political stance?",
    options: [
      { id: "A", zh: "与我高度一致，有共同的理念", en: "Highly consistent with mine" },
      { id: "B", zh: "尊重彼此，求同存异", en: "Respect each other, agree to differ" },
      { id: "C", zh: "只要不极端，都可以接受", en: "As long as it's not extreme, all are acceptable" },
      { id: "D", zh: "不太在意，政治与感情无关", en: "Not too concerned, politics is irrelevant to feelings" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 31, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对伴侣的宗教信仰有何期待？", en: "What are your expectations for your partner's religious beliefs?",
    options: [
      { id: "A", zh: "与我信仰相同", en: "Same faith as mine" },
      { id: "B", zh: "尊重彼此，互不干涉", en: "Respect each other, no interference" },
      { id: "C", zh: "只要不影响生活，都可以接受", en: "As long as it doesn't affect life" },
      { id: "D", zh: "不太在意，宗教是个人选择", en: "Not too concerned, religion is a personal choice" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 32, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对伴侣的民族文化背景有何期待？", en: "What are your expectations for your partner's cultural background?",
    options: [
      { id: "A", zh: "与我文化背景相同", en: "Same cultural background as mine" },
      { id: "B", zh: "尊重彼此，欣赏多元文化", en: "Respect each other, appreciate diverse cultures" },
      { id: "C", zh: "只要能和谐相处，都可以接受", en: "As long as we can get along harmoniously" },
      { id: "D", zh: "不太在意，更看重个人品质", en: "Not too concerned, value personal qualities more" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 33, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对伴侣的教育观念有何期待？", en: "What are your expectations for your partner's educational philosophy?",
    options: [
      { id: "A", zh: "望子成龙，注重精英教育", en: "Focus on elite education" },
      { id: "B", zh: "快乐成长，注重素质教育", en: "Happy growth, focus on quality education" },
      { id: "C", zh: "尊重孩子选择，顺其自然", en: "Respect children's choices" },
      { id: "D", zh: "不太在意，教育是学校的事情", en: "Not too concerned, education is the school's business" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 34, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对伴侣的财富观有何期待？", en: "What are your expectations for your partner's view on wealth?",
    options: [
      { id: "A", zh: "积极创造财富，追求财务自由", en: "Actively create wealth, pursue financial freedom" },
      { id: "B", zh: "理性管理财富，注重稳健增值", en: "Rationally manage wealth, focus on steady appreciation" },
      { id: "C", zh: "享受当下，财富为生活服务", en: "Enjoy the present, wealth serves life" },
      { id: "D", zh: "不太在意，财富是身外之物", en: "Not too concerned, wealth is external" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 35, category: "social", categoryEn: "Social Views & Attitudes",
    zh: "你对伴侣的社会责任感有何期待？", en: "What are your expectations for your partner's sense of social responsibility?",
    options: [
      { id: "A", zh: "积极参与公益，回馈社会", en: "Actively participate in public welfare" },
      { id: "B", zh: "关注社会问题，力所能及地帮助他人", en: "Concerned about social issues, help others" },
      { id: "C", zh: "做好本职工作，不给社会添麻烦", en: "Do one's job well" },
      { id: "D", zh: "不太在意", en: "Not too concerned" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  // Part 4: Intimate Relationships & Preferences (36-66)
  {
    id: 36, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为在一段关系中，浪漫的重要性是？", en: "What is the importance of romance in a relationship?",
    options: [
      { id: "A", zh: "极其重要，是爱情的保鲜剂", en: "Extremely important, the preservative of love" },
      { id: "B", zh: "比较重要，但不需要刻意追求", en: "Quite important, but no need to deliberately pursue" },
      { id: "C", zh: "适度即可，更注重实际", en: "Moderate is enough, more focused on practicality" },
      { id: "D", zh: "不太在意，浪漫是形式", en: "Not too concerned, romance is a formality" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 37, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的性观念有何期待？", en: "What are your expectations for your partner's views on intimacy?",
    options: [
      { id: "A", zh: "开放自由，享受亲密关系", en: "Open and free, enjoy intimacy" },
      { id: "B", zh: "尊重彼此，和谐共处", en: "Respect each other, harmonious coexistence" },
      { id: "C", zh: "适度即可，不应过度强调", en: "Moderate is enough" },
      { id: "D", zh: "比较保守，更注重精神交流", en: "Relatively conservative, more focused on spiritual connection" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 38, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为在一段关系中，坦诚的重要性是？", en: "What is the importance of honesty in a relationship?",
    options: [
      { id: "A", zh: "绝对基础，必须坦诚相待", en: "Absolute foundation, must be honest" },
      { id: "B", zh: "非常重要，但善意的谎言可以接受", en: "Very important, but white lies are acceptable" },
      { id: "C", zh: "适度坦诚即可", en: "Moderate honesty is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 39, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的吃醋行为接受程度如何？", en: "What is your acceptance level for your partner's jealousy?",
    options: [
      { id: "A", zh: "完全不接受，是不信任的表现", en: "Completely unacceptable, a sign of distrust" },
      { id: "B", zh: "偶尔吃醋可以理解，但不能过度", en: "Occasional jealousy is understandable" },
      { id: "C", zh: "适度吃醋是爱的表现", en: "Moderate jealousy is a sign of love" },
      { id: "D", zh: "完全接受，甚至有点享受", en: "Completely acceptable, even somewhat enjoy it" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 40, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为在一段关系中，惊喜的重要性是？", en: "What is the importance of surprises in a relationship?",
    options: [
      { id: "A", zh: "极其重要，能增加生活情趣", en: "Extremely important, adds fun to life" },
      { id: "B", zh: "比较重要，但不需要频繁", en: "Quite important, but not frequent" },
      { id: "C", zh: "适度即可，更注重平淡真实", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，惊喜是形式", en: "Not too concerned" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 41, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的异性朋友有何期待？", en: "What are your expectations for your partner's opposite-sex friends?",
    options: [
      { id: "A", zh: "完全不接受有异性朋友", en: "Completely unacceptable" },
      { id: "B", zh: "保持距离，避免单独相处", en: "Keep a distance, avoid being alone" },
      { id: "C", zh: "尊重彼此，但需要报备", en: "Respect each other, but need to report" },
      { id: "D", zh: "完全接受，这是个人自由", en: "Completely acceptable, it's personal freedom" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 42, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为共同爱好在关系中重要吗？", en: "Do you think shared hobbies are important in a relationship?",
    options: [
      { id: "A", zh: "极其重要，是维系感情的纽带", en: "Extremely important, a bond for feelings" },
      { id: "B", zh: "比较重要，但可以培养", en: "Quite important, but can be cultivated" },
      { id: "C", zh: "适度即可，有各自的兴趣空间", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，更注重性格契合", en: "Not too concerned, value personality compatibility" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 43, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的个人卫生习惯有何期待？", en: "What are your expectations for your partner's personal hygiene?",
    options: [
      { id: "A", zh: "极其注重，保持整洁", en: "Extremely attentive, maintain cleanliness" },
      { id: "B", zh: "良好即可，不需要洁癖", en: "Good enough, no need for germophobia" },
      { id: "C", zh: "只要不影响我就好", en: "As long as it doesn't affect me" },
      { id: "D", zh: "不太在意，个人自由", en: "Not too concerned, personal freedom" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 44, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为互相支持在关系中的重要性是？", en: "What is the importance of mutual support in a relationship?",
    options: [
      { id: "A", zh: "绝对基础，共同面对挑战的动力", en: "Absolute foundation" },
      { id: "B", zh: "非常重要，但也要保持独立", en: "Very important, but maintain independence" },
      { id: "C", zh: "适度即可，不应过度依赖", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 45, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的幽默感有何期待？", en: "What are your expectations for your partner's sense of humor?",
    options: [
      { id: "A", zh: "极其重要，能带来欢乐", en: "Extremely important, can bring joy" },
      { id: "B", zh: "比较重要，能缓解气氛", en: "Quite important, can lighten the atmosphere" },
      { id: "C", zh: "适度即可，不强求", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，更注重真诚", en: "Not too concerned, value sincerity more" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 46, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你解决冲突的方式是？", en: "What is your preferred way of resolving conflicts?",
    options: [
      { id: "A", zh: "积极沟通，寻求共识", en: "Actively communicate, seek consensus" },
      { id: "B", zh: "冷静思考，再进行沟通", en: "Calmly think, then communicate" },
      { id: "C", zh: "暂时回避，等情绪平复", en: "Temporarily avoid, wait for emotions to calm" },
      { id: "D", zh: "顺其自然，让时间解决", en: "Go with the flow, let time resolve" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 47, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的浪漫表达方式有何期待？", en: "What are your expectations for romantic expression?",
    options: [
      { id: "A", zh: "惊喜不断，仪式感强", en: "Constant surprises, strong sense of ritual" },
      { id: "B", zh: "温馨体贴，细水长流", en: "Warm and considerate, long-lasting" },
      { id: "C", zh: "实际行动，胜过甜言蜜语", en: "Practical actions over sweet words" },
      { id: "D", zh: "不太在意，更注重内心感受", en: "Not too concerned, value inner feelings" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 48, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为互相尊重的体现是？", en: "What is the manifestation of mutual respect?",
    options: [
      { id: "A", zh: "尊重彼此的独立性", en: "Respect each other's independence" },
      { id: "B", zh: "尊重彼此的差异，求同存异", en: "Respect differences, agree to differ" },
      { id: "C", zh: "尊重彼此的隐私", en: "Respect each other's privacy" },
      { id: "D", zh: "尊重彼此的家人和朋友", en: "Respect each other's family and friends" },
      { id: "E", zh: "以上都是", en: "All of the above" },
    ],
  },
  {
    id: 49, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的未来规划有何期待？", en: "What are your expectations for your partner's future plans?",
    options: [
      { id: "A", zh: "有清晰的目标，并为之努力", en: "Clear goals, and working hard for them" },
      { id: "B", zh: "积极向上，有自己的追求", en: "Positive and upward, with their own pursuits" },
      { id: "C", zh: "顺其自然，不强求", en: "Go with the flow" },
      { id: "D", zh: "与我保持一致，共同规划", en: "Consistent with mine, planning together" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 50, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为共同经历在关系中的重要性是？", en: "What is the importance of shared experiences?",
    options: [
      { id: "A", zh: "极其重要，是增进感情的催化剂", en: "Extremely important, a catalyst for feelings" },
      { id: "B", zh: "比较重要，但不需要刻意制造", en: "Quite important, but no need to deliberately create" },
      { id: "C", zh: "适度即可，有各自的生活", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，更注重当下感受", en: "Not too concerned, value present feelings" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 51, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的个人魅力有何期待？", en: "What are your expectations for your partner's personal charm?",
    options: [
      { id: "A", zh: "外表出众，气质非凡", en: "Outstanding appearance, extraordinary temperament" },
      { id: "B", zh: "谈吐优雅，风趣幽默", en: "Elegant conversation, witty and humorous" },
      { id: "C", zh: "内涵丰富，思想深刻", en: "Rich in connotation, profound in thought" },
      { id: "D", zh: "真诚善良，有亲和力", en: "Sincere and kind, approachable" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 52, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为互相欣赏在关系中的重要性是？", en: "What is the importance of mutual appreciation?",
    options: [
      { id: "A", zh: "极其重要，是维系感情的基石", en: "Extremely important, the cornerstone" },
      { id: "B", zh: "比较重要，能增加自信", en: "Quite important, can increase self-confidence" },
      { id: "C", zh: "适度即可，不应过度吹捧", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 53, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的独立性有何期待？", en: "What are your expectations for your partner's independence?",
    options: [
      { id: "A", zh: "极其独立，有自己的生活和空间", en: "Extremely independent" },
      { id: "B", zh: "比较独立，但也能互相依赖", en: "Quite independent, but can rely on each other" },
      { id: "C", zh: "适度独立，不应过度疏远", en: "Moderately independent" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 54, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为共同成长的体现是？", en: "What is the manifestation of mutual growth?",
    options: [
      { id: "A", zh: "互相学习，共同进步", en: "Learning from each other, progressing together" },
      { id: "B", zh: "互相鼓励，共同克服困难", en: "Encouraging each other, overcoming difficulties" },
      { id: "C", zh: "互相理解，共同面对挑战", en: "Understanding each other, facing challenges" },
      { id: "D", zh: "互相成就，共同实现梦想", en: "Achieving together, realizing dreams" },
      { id: "E", zh: "以上都是", en: "All of the above" },
    ],
  },
  {
    id: 55, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的责任感有何期待？", en: "What are your expectations for your partner's sense of responsibility?",
    options: [
      { id: "A", zh: "极其强烈，对家庭和未来负责", en: "Extremely strong, responsible for family and future" },
      { id: "B", zh: "比较强烈，能承担应有的责任", en: "Quite strong, able to bear due responsibility" },
      { id: "C", zh: "适度即可，不应过度束缚", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 56, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为安全感在关系中的重要性是？", en: "What is the importance of security in a relationship?",
    options: [
      { id: "A", zh: "绝对基础，是感情稳定的保障", en: "Absolute foundation" },
      { id: "B", zh: "非常重要，但需要自己给予", en: "Very important, but needs to be given by oneself" },
      { id: "C", zh: "适度即可，不应过度依赖", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 57, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的耐心程度有何期待？", en: "What are your expectations for your partner's patience?",
    options: [
      { id: "A", zh: "极其耐心，能包容我的缺点", en: "Extremely patient, can tolerate my shortcomings" },
      { id: "B", zh: "比较耐心，能理解我的情绪", en: "Quite patient, can understand my emotions" },
      { id: "C", zh: "适度即可，互相体谅", en: "Moderate is enough, mutual understanding" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 58, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为幽默感在关系中的重要性是？", en: "What is the importance of humor in a relationship?",
    options: [
      { id: "A", zh: "极其重要，能带来欢乐", en: "Extremely important, can bring joy" },
      { id: "B", zh: "比较重要，能缓解气氛", en: "Quite important, can lighten the atmosphere" },
      { id: "C", zh: "适度即可，不强求", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，更注重真诚", en: "Not too concerned, value sincerity" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 59, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的表达能力有何期待？", en: "What are your expectations for your partner's communication skills?",
    options: [
      { id: "A", zh: "善于表达，能清晰传递想法", en: "Good at expressing, can clearly convey thoughts" },
      { id: "B", zh: "愿意沟通，能倾听我的想法", en: "Willing to communicate, can listen" },
      { id: "C", zh: "适度即可，不需要口若悬河", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 60, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为共同兴趣爱好在关系中重要吗？", en: "Are shared hobbies important in a relationship?",
    options: [
      { id: "A", zh: "极其重要，是维系感情的纽带", en: "Extremely important" },
      { id: "B", zh: "比较重要，但可以培养", en: "Quite important, but can be cultivated" },
      { id: "C", zh: "适度即可，有各自的兴趣空间", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，更注重性格契合", en: "Not too concerned" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 61, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的独立思考能力有何期待？", en: "What are your expectations for independent thinking?",
    options: [
      { id: "A", zh: "极其重要，能有自己的见解", en: "Extremely important, can have their own insights" },
      { id: "B", zh: "比较重要，能进行理性分析", en: "Quite important, can conduct rational analysis" },
      { id: "C", zh: "适度即可，不应固执己见", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 62, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为互相包容在关系中的重要性是？", en: "What is the importance of mutual tolerance?",
    options: [
      { id: "A", zh: "绝对基础，是感情长久的保障", en: "Absolute foundation" },
      { id: "B", zh: "非常重要，能化解矛盾", en: "Very important, can resolve conflicts" },
      { id: "C", zh: "适度即可，不应过度迁就", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 63, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的行动力有何期待？", en: "What are your expectations for your partner's initiative?",
    options: [
      { id: "A", zh: "极其积极，能主动解决问题", en: "Extremely active, can proactively solve problems" },
      { id: "B", zh: "比较积极，能配合我的行动", en: "Quite active, can cooperate with my actions" },
      { id: "C", zh: "适度即可，不应过于冲动", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 64, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为共同的价值观在关系中重要吗？", en: "Are shared values important in a relationship?",
    options: [
      { id: "A", zh: "极其重要，是感情深化的基础", en: "Extremely important" },
      { id: "B", zh: "比较重要，能减少摩擦", en: "Quite important, can reduce friction" },
      { id: "C", zh: "适度即可，不强求一致", en: "Moderate is enough" },
      { id: "D", zh: "不太在意，更注重个人感受", en: "Not too concerned" },
      { id: "E", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
    ],
  },
  {
    id: 65, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你对伴侣的抗压能力有何期待？", en: "What are your expectations for stress resistance?",
    options: [
      { id: "A", zh: "极其强大，能独立应对挑战", en: "Extremely strong, can independently cope" },
      { id: "B", zh: "比较强大，能共同面对压力", en: "Quite strong, can face pressure together" },
      { id: "C", zh: "适度即可，互相扶持", en: "Moderate is enough, mutual support" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
  {
    id: 66, category: "intimate", categoryEn: "Intimate Relationships",
    zh: "你认为互相成全在关系中的重要性是？", en: "What is the importance of mutual fulfillment?",
    options: [
      { id: "A", zh: "极其重要，是最高境界", en: "Extremely important, the highest realm" },
      { id: "B", zh: "比较重要，能共同进步", en: "Quite important, can progress together" },
      { id: "C", zh: "适度即可，不应过度牺牲", en: "Moderate is enough" },
      { id: "D", zh: "顺其自然，不刻意追求", en: "Go with the flow" },
      { id: "E", zh: "视情况而定", en: "Depends on the situation" },
    ],
  },
];
