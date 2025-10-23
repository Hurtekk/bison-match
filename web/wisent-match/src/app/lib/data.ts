export type Bison = {
  id: string;
  name: string;
  age: number;
  sex: "male" | "female";
  behavior: string;
  region: string;
  furLength: string;
  healthCondition: string;
  image: string;
  flock?: string;
  quarantine?: boolean;
  genotype: string;
};

export type Advert = {
  id: string;
  type: "offer" | "request";
  title: string;
  description: string;
  breeder: string;
  region?: string;
  behavior?: string;
  postedAt: string;
};

export const regions = [
  "Białowieża",
  "Niepołomice",
  "Bieszczady",
  "Muczne",
  "Pszczyna",
  "Borki",
  "Smardzewice",
  "Wigry",
  "Drawno",
  "Knyszyn",
  "Borecka Puszcza",
  "Bałtów",
];

export const behaviors = [
  "calm",
  "passive",
  "playful",
  "aggressive",
  "very aggressive",
  "territorial",
  "curious",
  "lazy",
  "alert",
  "social",
  "dominant",
  "careful",
  "energetic",
  "loner",
  "cautious",
  "watchful",
];

export const healths = ["healthy", "injured"];

export const initialBisons: Bison[] = [
  {
    id: "1",
    name: "Pola",
    age: 14,
    sex: "female",
    behavior: "passive",
    region: "Smardzewice",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSsHh", // normal fur, passive, somewhat social, healthy
    image: "/assets/1.jpg",
  },
  {
    id: "2",
    name: "Polina",
    age: 8,
    sex: "female",
    behavior: "passive",
    region: "Borki",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfaaSsHH", // thick fur, passive, social tendency, excellent health
    image: "/assets/2.jpg",
  },
  {
    id: "3",
    name: "Polek",
    age: 12,
    sex: "male",
    behavior: "territorial",
    region: "Knyszyn",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffAaSsHh", // normal fur, territorial, alert, healthy
    image: "/assets/3.jpg",
  },
  {
    id: "4",
    name: "Polikarp",
    age: 15,
    sex: "male",
    behavior: "passive",
    region: "Borki",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FFaaSsHh", // thick fur, passive, social, healthy
    image: "/assets/4.jpg",
  },
  {
    id: "5",
    name: "Pomian",
    age: 13,
    sex: "male",
    behavior: "aggressive",
    region: "Drawno",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfAaSsHH", // thick fur, aggressive, social, excellent health
    image: "/assets/5.jpg",
  },
  {
    id: "6",
    name: "Pompejusz",
    age: 22,
    sex: "male",
    behavior: "aggressive",
    region: "Borecka Puszcza",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffAaSsHh", // normal fur, aggressive, alert, healthy
    image: "/assets/6.jpg",
  },
  {
    id: "7",
    name: "Polańka",
    age: 16,
    sex: "female",
    behavior: "passive",
    region: "Bieszczady",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FFaaSsHh", // thick fur, passive, social, healthy
    image: "/assets/7.jpg",
  },
  {
    id: "8",
    name: "Polidora",
    age: 22,
    sex: "female",
    behavior: "passive",
    region: "Wigry",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfaaSsHH", // thick fur, passive, social, excellent health
    image: "/assets/8.jpg",
  },
  {
    id: "9",
    name: "Porfir",
    age: 8,
    sex: "male",
    behavior: "territorial",
    region: "Muczne",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffAaSsHh", // normal fur, territorial, alert, healthy
    image: "/assets/9.jpg",
  },
  {
    id: "10",
    name: "Polesia",
    age: 15,
    sex: "female",
    behavior: "very aggressive",
    region: "Białowieża",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffAASsHh", // normal fur, very aggressive, alert, healthy
    image: "/assets/10.jpg",
  },
  {
    id: "11",
    name: "Polonia",
    age: 7,
    sex: "female",
    behavior: "passive",
    region: "Bieszczady",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FFaaSsHH", // thick fur, passive, social, excellent health
    image: "/assets/11.jpg",
  },
  {
    id: "12",
    name: "Pompeja",
    age: 14,
    sex: "female",
    behavior: "territorial",
    region: "Białowieża",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfAaSsHh", // thick fur, territorial, alert, healthy
    image: "/assets/12.jpg",
  },
  {
    id: "13",
    name: "Polan",
    age: 10,
    sex: "male",
    behavior: "passive",
    region: "Pszczyna",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSsHh", // normal fur, passive, social, healthy
    image: "/assets/13.jpg",
  },
  {
    id: "14",
    name: "Polinka",
    age: 24,
    sex: "female",
    behavior: "aggressive",
    region: "Muczne",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FFAaSsHh", // thick fur, aggressive, alert, healthy
    image: "/assets/18.jpg",
  },
  {
    id: "15",
    name: "Polykarp",
    age: 15,
    sex: "male",
    behavior: "territorial",
    region: "Bałtów",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffAaSsHh", // normal fur, territorial, alert, healthy
    image: "/assets/15.jpg",
  },
  {
    id: "16",
    name: "Polaś",
    age: 13,
    sex: "male",
    behavior: "calm",
    region: "Białowieża",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSsHH", // normal fur, calm, social, excellent health
    image: "/assets/16.jpg",
  },
  {
    id: "17",
    name: "Polana",
    age: 10,
    sex: "female",
    behavior: "alert",
    region: "Bieszczady",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSsHh", // normal fur, calm, alert, healthy
    image: "/assets/17.jpg",
  },
  {
    id: "18",
    name: "Poncjusz",
    age: 15,
    sex: "male",
    behavior: "energetic",
    region: "Knyszyn",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSSHH", // normal fur, calm, very social/energetic, excellent health
    image: "/assets/14.jpg",
  },
  {
    id: "19",
    name: "Polidora",
    age: 9,
    sex: "female",
    behavior: "calm",
    region: "Wigry",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSsHh", // normal fur, calm, social, healthy
    image: "/assets/19.jpg",
  },
  {
    id: "20",
    name: "Polmir",
    age: 11,
    sex: "male",
    behavior: "curious",
    region: "Drawno",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfaaSsHh", // thick fur, calm, curious, healthy
    image: "/assets/20.jpg",
  },
  {
    id: "21",
    name: "Polenus",
    age: 7,
    sex: "male",
    behavior: "lazy",
    region: "Borecka Puszcza",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FFaassHh", // thick fur, calm, loner/lazy, healthy
    image: "/assets/21.jpg",
  },
  {
    id: "22",
    name: "Polidar",
    age: 12,
    sex: "male",
    behavior: "dominant",
    region: "Białowieża",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfAaSsHH", // thick fur, dominant, alert, excellent health
    image: "/assets/22.jpg",
  },
  {
    id: "23",
    name: "Polena",
    age: 9,
    sex: "female",
    behavior: "calm",
    region: "Niepołomice",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSsHh", // normal fur, calm, social, healthy
    image: "/assets/23.jpg",
  },
  {
    id: "24",
    name: "Poloniusz",
    age: 14,
    sex: "male",
    behavior: "cautious",
    region: "Wigry",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfaaSsHh", // thick fur, calm, cautious/alert, healthy
    image: "/assets/24.jpg",
  },
  {
    id: "25",
    name: "Polybiusz",
    age: 10,
    sex: "female",
    behavior: "energetic",
    region: "Knyszyn",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FFaaSSHH", // thick fur, calm, very social/energetic, excellent health
    image: "/assets/28.jpg",
  },
  {
    id: "26",
    name: "Poloniusz",
    age: 14,
    sex: "male",
    behavior: "territorial",
    region: "Borecka Puszcza",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffAaSsHh", // normal fur, territorial, alert, healthy
    image: "/assets/26.jpg",
  },
  {
    id: "27",
    name: "Polidor",
    age: 7,
    sex: "male",
    behavior: "watchful",
    region: "Muczne",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfaaSsHH", // thick fur, calm, watchful/alert, excellent health
    image: "/assets/27.jpg",
  },
  {
    id: "28",
    name: "Poletta",
    age: 13,
    sex: "female",
    behavior: "social",
    region: "Drawno",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSSHh", // normal fur, calm, very social, healthy
    image: "/assets/25.jpg",
  },
  {
    id: "29",
    name: "Poliana",
    age: 6,
    sex: "female",
    behavior: "playful",
    region: "Białowieża",
    furLength: "normal",
    healthCondition: "healthy",
    genotype: "ffaaSSHH", // normal fur, calm, very social/playful, excellent health
    image: "/assets/29.jpg",
  },
  {
    id: "30",
    name: "Polonus",
    age: 11,
    sex: "male",
    behavior: "loner",
    region: "Wigry",
    furLength: "thick",
    healthCondition: "healthy",
    genotype: "FfaassHh", // thick fur, calm, loner, healthy
    image: "/assets/30.jpg",
  },
];

export const initialAdverts: Advert[] = [
  {
    id: "adv1",
    type: "offer",
    title: "High-quality hay for winter",
    description: "Freshly cut hay bales. Available in bulk for breeders.",
    breeder: "Green Pastures Farm",
    region: "Białowieża",
    postedAt: "2025-09-01",
  },
  {
    id: "adv2",
    type: "request",
    title: "calm female wisent",
    description:
      "Preferably 3–5 years old, good health, from Podlasie region.",
    breeder: "Jan Kowalski",
    region: "Borki",
    behavior: "calm",
    postedAt: "2025-09-08",
  },
  {
    id: "adv3",
    type: "offer",
    title: "Wisent feeding troughs",
    description: "Strong wooden troughs, suitable for outdoor herds.",
    breeder: "WildCare Supplies",
    postedAt: "2025-09-10",
  },
  {
    id: "adv4",
    type: "offer",
    title: "Young male bison for adoption",
    description:
      "2-year-old male bison, healthy and playful. Looking for a good home. Great temperament, easy to handle.",
    breeder: "Anna Nowak",
    region: "Niepołomice",
    behavior: "playful",
    postedAt: "2025-09-15",
  },
];