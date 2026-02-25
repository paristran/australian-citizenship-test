// Fun facts about Australia to show randomly during study
// All facts are from "Our Common Bond" or general Australian knowledge

export const funFacts = [
  {
    fact: "The kangaroo and emu are on the Coat of Arms because they cannot walk backwards, symbolising a nation moving forward.",
    category: "symbols"
  },
  {
    fact: "Australia's national colours are green and gold - the colours of the golden wattle, our national floral emblem.",
    category: "symbols"
  },
  {
    fact: "The Commonwealth Star has seven points - one for each of the six states and one for the territories.",
    category: "symbols"
  },
  {
    fact: "Advance Australia Fair became the national anthem in 1984.",
    category: "anthem"
  },
  {
    fact: "Waltzing Matilda was written by Banjo Paterson in 1895 and is often called Australia's unofficial national anthem.",
    category: "anthem"
  },
  {
    fact: "The Australian flag was first flown on 3 September 1901.",
    category: "flag"
  },
  {
    fact: "Australia Day, 26 January, marks the anniversary of the arrival of the First Fleet in 1788.",
    category: "holidays"
  },
  {
    fact: "ANZAC Day on 25 April commemorates the landing at Gallipoli in 1915.",
    category: "holidays"
  },
  {
    fact: "Remembrance Day on 11 November commemorates all Australians who died in wars and conflicts.",
    category: "holidays"
  },
  {
    fact: "The 1967 referendum saw 90.77% of Australians vote 'Yes' - the highest Yes vote ever in a federal referendum.",
    category: "history"
  },
  {
    fact: "Before European settlement, there were about 250 Aboriginal and Torres Strait Islander languages spoken.",
    category: "indigenous"
  },
  {
    fact: "The Aboriginal flag was designed by Harold Thomas in 1971.",
    category: "indigenous"
  },
  {
    fact: "The Mabo decision in 1992 recognised native title rights for Indigenous Australians.",
    category: "indigenous"
  },
  {
    fact: "The National Apology to the Stolen Generations was delivered in 2008 by Prime Minister Kevin Rudd.",
    category: "indigenous"
  },
  {
    fact: "Uluru is also known as Ayers Rock and is sacred to the Anangu people.",
    category: "geography"
  },
  {
    fact: "The Great Barrier Reef is the world's largest coral reef system, located off the coast of Queensland.",
    category: "geography"
  },
  {
    fact: "Mount Kosciuszko is Australia's highest mountain at 2,228 metres.",
    category: "geography"
  },
  {
    fact: "The Murray River is Australia's longest river at 2,508 kilometres.",
    category: "geography"
  },
  {
    fact: "Australia has 6 states and 2 mainland territories.",
    category: "government"
  },
  {
    fact: "The Australian Parliament has two houses: the House of Representatives and the Senate.",
    category: "government"
  },
  {
    fact: "There are 151 members in the House of Representatives.",
    category: "government"
  },
  {
    fact: "There are 76 senators - 12 from each state and 2 from each territory.",
    category: "government"
  },
  {
    fact: "Voting in federal elections is compulsory for Australian citizens aged 18 and over.",
    category: "democracy"
  },
  {
    fact: "The Australian Constitution was approved by the people through a vote and took effect on 1 January 1901.",
    category: "constitution"
  },
  {
    fact: "A referendum requires a 'double majority' to pass - majority of voters AND majority of states.",
    category: "constitution"
  },
  {
    fact: "Australia is a constitutional monarchy - His Majesty King Charles III is the Head of State.",
    category: "government"
  },
  {
    fact: "The Governor-General represents the King in Australia.",
    category: "government"
  },
  {
    fact: "The Prime Minister is the leader of the party with the majority in the House of Representatives.",
    category: "government"
  },
  {
    fact: "Three levels of government in Australia: federal, state/territory, and local.",
    category: "government"
  },
  {
    fact: "The High Court of Australia is the highest court and interprets the Constitution.",
    category: "law"
  }
]

export function getRandomFunFact(): { fact: string; category: string } {
  const randomIndex = Math.floor(Math.random() * funFacts.length)
  return funFacts[randomIndex]
}
