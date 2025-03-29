import React from "react";

const InterviewExperienceDetail = () => {
  const experience = {
    title: "Amazon Interview Experience for SDE-1 (Off-Campus)",
    lastUpdated: "11 Oct, 2024",
    content: `
      <p>Amazon conducted an off-campus recruitment drive, giving students the opportunity to apply and participate in one of the world’s largest retail company’s hiring process.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Online Round (Oct 2021)</h3>
      <p>There were 4 questions, 2 coding questions along with their algorithm with space and time complexity. Both coding questions were on the easier side. After 1 week of this round, I got a mail from their recruitment team and I have cleared this round.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Round 1 (Nov 2021)</h3>
      <p>The interviewer started with a quick introduction and then asked me to explain one of my projects and asked some questions on that project. Then we moved to the coding question.</p>
      <ul class="list-disc list-inside mt-2">
        <li><a href="https://leetcode.com/problems/longest-valid-parentheses/" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">Longest Valid Parentheses</a></li>
        <li><a href="https://www.geeksforgeeks.org/find-the-row-with-maximum-number-1s/" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">Find the Row with Maximum Number of 1s</a></li>
      </ul>
      <p>He first asked me to explain the approach and then write the code. I did both questions then he asked me the space and time complexities. In the end, he asked if I have any questions for him.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Round 2 (Nov 2021)</h3>
      <p>In this round too the interviewer started with introductions then she asked me some behavioral questions like “what do you do when you disagree with someone?”. Then she asked me about hash functions and some OOPs concepts. Finally, she asked me if I want to ask something.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Round 3 (Jan 2022)</h3>
      <p>This round was taken by SDM. He directly jumped to coding questions. He only asked me one question.</p>
      <ul class="list-disc list-inside mt-2">
        <li><a href="https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">Step-by-Step Directions from a Binary Tree Node to Another</a></li>
      </ul>
      <p>He asked me to explain the approach and then space and time complexity. I did the question but was told the wrong time complexity.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Round 4 (March 2022)</h3>
      <p>This round was also taken by SDM. He quickly jumped on my work experience and asked what are difficulties you have faced in your present job, then he asked why I want to join Amazon. Then he moved on to the coding questions.</p>
      <ul class="list-disc list-inside mt-2">
        <li><a href="https://leetcode.com/problems/partition-to-k-equal-sum-subsets/" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">Partition to K Equal Sum Subsets</a></li>
      </ul>
      <p>He first told me to explain the approach, when I explained my approach then he told me to code. I could not do the question but my approach was somewhat similar to what was even in the GFG solution. Then like other interviewers, he asked me if I have any questions for him.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Verdict</h3>
      <p>After 3 days they called me to say you are selected.</p>

      <h3 class="text-xl font-bold text-purple-400 mt-6 mb-2">Tips</h3>
      <ul class="list-disc list-inside mt-2">
        <li>Practice coding questions from GFG and Leetcode.</li>
        <li>Have knowledge of projects and work experience you have mentioned in your resume.</li>
        <li>Practice behavioral questions, don’t take them lightly.</li>
        <li>Believe in yourself.</li>
      </ul>
    `,
  };

  return (
    <div className="w-4/5 mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">
        {experience.title}
      </h2>
      <p className="text-gray-400 mb-6">
        Last Updated: {experience.lastUpdated}
      </p>
      <div
        className="text-white"
        dangerouslySetInnerHTML={{ __html: experience.content }}
      />
    </div>
  );
};

export default InterviewExperienceDetail;