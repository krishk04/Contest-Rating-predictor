const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Function to fetch user info from Codeforces API
const getUserInfo = async (handle) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Codeforces API:', error);
    return null;
  }
};

// Function to fetch problem info from Codeforces API
const getProblemInfo = async (contestId, index) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/problemset.problems`);
    const problems = response.data.result.problems;
    const problem = problems.find(p => p.contestId == contestId && p.index === index);
    return problem || null;
  } catch (error) {
    console.error('Error fetching data from Codeforces API:', error);
    return null;
  }
};

// Function to fetch problem statement from Codeforces API
const getProblemStatement = async (contestId, index) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/problemset.problems`);
    const problems = response.data.result.problems;
    const problem = problems.find(p => p.contestId == contestId && p.index === index);
    if (!problem) return null;

    const problemDescriptionUrl = `https://codeforces.com/contest/${contestId}/problem/${index}`;
    return { ...problem, descriptionUrl: problemDescriptionUrl };
  } catch (error) {
    console.error('Error fetching data from Codeforces API:', error);
    return null;
  }
};

// Function to fetch contest info from Codeforces API
const getContestInfo = async (contestId) => {
  try {
    const response = await axios.get(`https://codeforces.com/api/contest.standings?contestId=${contestId}&showUnofficial=false`);
    return response.data.result || null;
  } catch (error) {
    console.error('Error fetching contest data from Codeforces API:', error);
    return null;
  }
};

// API endpoint to get user info
app.get('/api/user/:handle', async (req, res) => {
  const handle = req.params.handle;
  const data = await getUserInfo(handle);
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// API endpoint to get problem info
app.get('/api/problem/:contestId/:index', async (req, res) => {
  const { contestId, index } = req.params;
  const data = await getProblemInfo(contestId, index);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Problem not found' });
  }
});

// API endpoint to get problem statement
app.get('/api/problem/description/:contestId/:index', async (req, res) => {
  const { contestId, index } = req.params;
  const data = await getProblemStatement(contestId, index);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Problem description not found' });
  }
});

// API endpoint to get contest info
app.get('/api/contest/:contestId', async (req, res) => {
  const { contestId } = req.params;
  const data = await getContestInfo(contestId);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Contest info not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
