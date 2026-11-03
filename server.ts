import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. Resume Review & Pakistan Job Match Endpoint
app.post('/api/ai/resume-review', async (req, res) => {
  try {
    const { resumeText, jobTitle, targetCompany, jobRequirements } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide valid resume details.' });
    }

    if (aiClient) {
      const prompt = `You are a premier senior career coach and tech recruiter specializing in the Pakistani job market (Karachi, Lahore, Islamabad, remote, and BPS government/corporate sectors).
Review this candidate resume against the following job:
Target Role: ${jobTitle || 'General Software / Corporate Professional in Pakistan'}
Target Company: ${targetCompany || 'Top Pakistani Organization'}
Requirements: ${jobRequirements ? JSON.stringify(jobRequirements) : 'Standard Pakistani market expectations'}

Candidate Resume / Profile:
${resumeText.slice(0, 3000)}

Please return a valid JSON response with EXACTLY the following structure (do NOT enclose in code fences or markdown, just raw JSON):
{
  "matchScore": 84,
  "matchTier": "Strong Match" | "Moderate Match" | "Needs Upskilling",
  "summary": "2-3 sentences summarizing readiness for this specific Pakistani role",
  "strengths": ["string", "string", "string"],
  "missingKeywords": ["string", "string", "string"],
  "pakistanMarketTips": ["Advice on salary negotiation in PKR", "Advice on local tech/corporate culture", "Advice on portfolio or certifications"],
  "suggestedSalaryRangePKR": "PKR 250,000 - 350,000 / month"
}`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '{}';
        const parsed = JSON.parse(rawText.replace(/```json|```/g, '').trim());
        return res.json(parsed);
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to intelligent heuristic parser:', geminiError);
      }
    }

    // Graceful Pakistani market fallback
    const lower = resumeText.toLowerCase();
    const skills = ['react', 'node', 'typescript', 'python', 'sql', 'docker', 'aws', 'figma', 'mba', 'sales', 'engineering'];
    const matched = skills.filter(s => lower.includes(s));
    const score = Math.min(95, Math.max(60, 50 + matched.length * 7));

    return res.json({
      matchScore: score,
      matchTier: score >= 80 ? 'Strong Match' : score >= 65 ? 'Moderate Match' : 'Needs Upskilling',
      summary: `Your profile displays solid relevant background for ${jobTitle || 'this position'}. With targeted enhancements to align with Pakistani corporate and tech requirements, you can stand out among candidates.`,
      strengths: [
        `Hands-on familiarity with ${matched.slice(0, 3).join(', ') || 'core domain skills'}`,
        'Demonstrated practical problem solving and initiative',
        'Directly applicable experience for the Pakistani hiring landscape'
      ],
      missingKeywords: [
        'Production CI/CD & Cloud deployment (AWS/GCP)',
        'HEC recognized degree verification & certifications',
        'Measurable impact metrics (e.g. % performance improvement)'
      ],
      pakistanMarketTips: [
        'Highlight experience handling unstable connectivity / remote infrastructure if applying for WFH roles',
        'State your notice period explicitly (standard in Pakistan is 30 to 60 days)',
        'Include your city domicile (Karachi, Lahore, Islamabad) and whether you require relocation'
      ],
      suggestedSalaryRangePKR: 'PKR 200,000 - 350,000 / month'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 2. Bilingual Career Counselor (Urdu & English)
app.post('/api/ai/career-coach', async (req, res) => {
  try {
    const { question, language = 'en' } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (aiClient) {
      const prompt = `You are "Roshan Mustaqbil" (روشن مستقبل), an empathetic, expert Pakistani career counselor. You guide job seekers in Karachi, Lahore, Islamabad, Peshawar, Quetta, and across Pakistan.
You know about:
- CSS (Central Superior Services) and provincial civil services (PPSC, SPSC, KPPSC, FPSC)
- IT and software engineering market salaries in Pakistan (in PKR and remote USD via Deel/Payoneer)
- Corporate MTO programs (Engro, Unilever, Meezan Bank, Systems Ltd, Nestle, Jazz)
- FBR tax optimization for salaried professionals and IT freelancers (0.25% export tax rate)
- Switching from conventional jobs to high-paying remote tech jobs.

User Question: "${question}"
Language requested: ${language === 'ur' ? 'Urdu (Nastaliq friendly clean Urdu prose)' : 'English (with natural Pakistani cultural context, polite and actionable)'}

Please provide a structured, encouraging, deeply knowledgeable response with 3 practical bullet points and a concluding recommendation.`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        return res.json({ answer: response.text });
      } catch (geminiError) {
        console.warn('Gemini API call failed for career-coach:', geminiError);
      }
    }

    // High quality fallback
    const fallbackAnswer = language === 'ur'
      ? `پاکستان کے موجودہ جاب مارکیٹ میں کامیابی کے لیے درج ذیل اہم اقدامات تجویز کیے جاتے ہیں:

1. **مارکیٹ کی طلب کے مطابق مہارت:** آئی ٹی سیکٹر میں کلاؤڈ کمپیوٹنگ، اے آئی، اور فل اسٹیک ویب ڈویلپمنٹ سب سے زیادہ معاوضہ دینے والے شعبے ہیں، جبکہ کارپوریٹ سیکٹر میں مینجمنٹ ٹرینی (MTO) پروگرامز بہترین آغاز ہیں۔
2. **ریموٹ ورک اور بین الاقوامی کلائنٹس:** اگر آپ انگلش اور جدید ٹولز میں مہارت حاصل کر لیتے ہیں تو Deel یا Upwork کے ذریعے ڈالر آمدن کا حصول آسان ہو جاتا ہے، جس پر پاکستان میں ٹیکس رعایت بھی موجود ہے۔
3. **نیٹ ورکنگ اور LinkedIn:** پاکستان کی بڑی کمپنیوں (Systems Ltd, Meezan, Jazz, Engro) کے ایچ آر اور ٹیک لیڈز سے براہِ راست رابطہ استوار کریں۔

مستقل مزاجی اور عملی پراجیکٹس آپ کو دوسرے امیدواروں سے نمایاں کر سکتے ہیں۔`
      : `Here is practical advice tailored to the Pakistani job market:

1. **Target High-Growth Hubs & Remote USD**: Software houses in Lahore (Gulberg/DHA), Karachi (Clifton/Shahrah-e-Faisal), and Islamabad (Blue Area) offer top PKR packages (PKR 250k - 600k+), while remote international contracts provide USD hedge.
2. **BPS Government vs. Private Sector**: If you seek pension stability and healthcare, track FPSC/PPSC advertisements closely. For rapid financial growth and meritocracy, top tech and fintech firms (Meezan, Systems, Motive) outpace conventional salaries.
3. **Salary Negotiation**: In Pakistan, always clarify whether gross salary includes Provident Fund, fuel allowances, and medical insurance (IPD/OPD) coverage before signing the offer letter.

Focus on building a proof-of-work portfolio and maintain active engagement on LinkedIn with local recruiters.`;

    return res.json({ answer: fallbackAnswer });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// 3. Interview Prep Simulator
app.post('/api/ai/interview-prep', async (req, res) => {
  try {
    const { jobTitle, sector, company } = req.body;
    
    if (aiClient) {
      const prompt = `Generate 4 realistic, targeted interview questions and ideal answer guidelines for a Pakistani applicant applying for:
Role: ${jobTitle || 'Professional'}
Company: ${company || 'Pakistani Employer'}
Sector: ${sector || 'Corporate'}

Include 1 Pakistani workplace specific question (such as handling load shedding / WFH backup power, managing notice periods in Pakistan, or navigating matrix cross-functional teams in local banks/tech firms).

Return JSON array of questions with format:
[
  {
    "question": "string",
    "category": "Technical" | "Behavioral" | "Market-Specific",
    "whatInterviewerWants": "string",
    "recommendedPoints": ["point 1", "point 2"]
  }
]`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const raw = response.text || '[]';
        return res.json(JSON.parse(raw.replace(/```json|```/g, '').trim()));
      } catch (geminiError) {
        console.warn('Gemini interview prep error:', geminiError);
      }
    }

    return res.json([
      {
        question: `How do you architect scalable applications for unstable mobile connectivity and slow internet conditions prevalent across Pakistan?`,
        category: 'Technical',
        whatInterviewerWants: 'Knowledge of offline caching, optimistic UI updates, and efficient payload compression.',
        recommendedPoints: [
          'Discuss local storage, service worker caching, and IndexedDB',
          'Explain GraphQL or slim REST payloads with pagination to minimize 3G/4G bandwidth usage'
        ]
      },
      {
        question: `Why are you interested in joining ${company || 'our company'} in Pakistan rather than pursuing full-time freelancing or relocating abroad?`,
        category: 'Behavioral',
        whatInterviewerWants: 'Commitment to long-term value creation, team mentorship, and organizational stability.',
        recommendedPoints: [
          'Express dedication to building high-impact products locally with national scale',
          'Highlight preference for collaborative engineering cultures and structured team growth'
        ]
      },
      {
        question: `How is your home setup equipped for load-shedding or power disruptions during critical deployments?`,
        category: 'Market-Specific',
        whatInterviewerWants: 'Professional reliability and disaster recovery preparedness in Pakistan.',
        recommendedPoints: [
          'Mention your dual power backup (UPS/Solar inverter with dedicated battery bank)',
          'Mention backup cellular 4G/5G mobile hotspot device alongside primary fiber connection'
        ]
      },
      {
        question: `What is your expected salary in PKR, and how do you factor in current FBR income tax deductions?`,
        category: 'Behavioral',
        whatInterviewerWants: 'Financial clarity, market benchmarking, and understanding of net in-hand earnings.',
        recommendedPoints: [
          'Quote a well-researched gross range based on market benchmarks for your experience level',
          'Clarify expectation regarding non-taxable allowances (fuel, medical, provident fund matching)'
        ]
      }
    ]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Configure Vite middleware in development or serve static in production
const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Pakistan Job Finder server running at http://0.0.0.0:${port}`);
});
