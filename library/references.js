// This is an example of what gpt-4o would return when a user wants to extract data from a PowerPoint
export const gptData = {
  "Introduction to Applied Statistics in Science": {
    summary:
      "The presentation introduces the course MATH/STAT 319, focusing on applied statistics in science. The initial slide indicates the course covers hypotheses and test procedures, taught by Mauricio Nascimento.",
    question:
      "What are the two key components covered in the course MATH/STAT 319 according to the initial slide?",
    answer: "The course covers hypotheses and test procedures.",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
  "Problem Context and Example": {
    summary:
      "A practical problem is presented where 10% of computer circuit boards produced by a manufacturer are defective. An engineer proposes a change in production to reduce the defective rate. A sample of 200 circuits is taken with the new process to determine if the change is effective.",
    question:
      "In an example problem, what is the initial defect rate of computer circuit boards before any changes to the production process?",
    answer: "The initial defect rate is 10%.",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
  "Introduction to Hypothesis Testing": {
    summary:
      "Hypothesis testing is a fundamental concept wherein decisions are made based on sample data. It involves formulating a null hypothesis (H0) that represents no change or effect and an alternative hypothesis (Ha) that represents the change or effect we want to prove.",
    question:
      "What do the null hypothesis (H0) and alternative hypothesis (Ha) represent in hypothesis testing?",
    answer:
      "The null hypothesis (H0) represents no change or effect, while the alternative hypothesis (Ha) represents the change or effect that one wants to prove.",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
  "Formulating Hypotheses in the Example": {
    summary:
      "For the given problem, hypotheses are formulated. H0 states there is no difference in the proportion of defective boards before and after the change (p = 0.1). Ha states there is a decrease in the proportion of defective boards after the change (p < 0.1).",
    question:
      "For the given problem concerning defective circuit boards, what do the null (H0) and alternative (Ha) hypotheses state?",
    answer:
      "H0 states that there is no difference in the proportion of defective boards before and after the change (p = 0.1). Ha states that there is a decrease in the proportion of defective boards after the change (p < 0.1).",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
  "Test Procedures": {
    summary:
      "With hypotheses defined, a test procedure is required to select between them. This involves calculating a test statistic from the sample data and determining a rejection region. If the test statistic falls within the rejection region, H0 is rejected.",
    question:
      "What determines whether the null hypothesis (H0) is rejected in a test procedure?",
    answer:
      "A test statistic is calculated from the sample data and compared to a rejection region. If the test statistic falls within the rejection region, the null hypothesis (H0) is rejected.",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
  "Errors in Hypothesis Testing": {
    summary:
      "Even after concluding the test, the risk of errors exists. A Type I error occurs when H0 is incorrectly rejected, while a Type II error occurs when H0 is incorrectly not rejected. We can't be absolutely sure of correctness because the test depends on sample data.",
    question: "What are Type I and Type II errors in hypothesis testing?",
    answer:
      "A Type I error occurs when the null hypothesis (H0) is incorrectly rejected, while a Type II error occurs when H0 is incorrectly not rejected.",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
  "Quantifying Error Probabilities": {
    summary:
      "The probability of each type of error can be calculated. Type I error probability is denoted by alpha (α), and Type II error probability is denoted by beta (β). Adjusting the rejection region affects these probabilities inversely.",
    question:
      "How are the probabilities of Type I and Type II errors denoted, and how are they affected by the rejection region?",
    answer:
      "The probability of a Type I error is denoted by alpha (α), and the probability of a Type II error is denoted by beta (β). Adjusting the rejection region affects these probabilities inversely.",
    youtubeLink: "https://www.youtube.com/watch?v=LO6Qd9hYd8M",
  },
};
